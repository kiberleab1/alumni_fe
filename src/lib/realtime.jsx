import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { API_ORIGIN, getChatUnreadCount, getConnectionCounts, getNotifications } from "src/api";
import { getUserToken } from "src/helpers/globalStorage";

/**
 * One authenticated socket.io connection for the whole signed-in app.
 *
 * Exposes:
 *   status          "connecting" | "online" | "offline"
 *   me              current user (from localStorage)
 *   unreadChats     total unread direct messages (sidebar badge)
 *   unreadNotifs    unread notifications (bell badge)
 *   pendingRequests incoming connection requests (sidebar badge)
 *   isOnline(id)    presence of a peer
 *   emit(ev, data)  -> Promise<ack.data>   (rejects with the server error)
 *   useSocketEvent  subscribe to a server event inside a component
 */
const RealtimeContext = createContext(null);

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || API_ORIGIN;

export function RealtimeProvider({ children }) {
  const queryClient = useQueryClient();
  const stored = getUserToken();
  const token = stored?.token;
  const me = stored?.user || null;

  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [unreadChats, setUnreadChats] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [presence, setPresence] = useState({});

  const refreshCounts = useCallback(async () => {
    try {
      const [chats, notifs, conns] = await Promise.all([
        getChatUnreadCount(),
        getNotifications({ pageSize: 1 }),
        getConnectionCounts(),
      ]);
      setUnreadChats(chats);
      setUnreadNotifs(notifs.unread_count);
      setPendingRequests(conns.incoming);
    } catch {
      /* the axios interceptor handles expired sessions */
    }
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionDelayMax: 10000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("online");
      refreshCounts(); // catch up on anything missed while offline
    });
    socket.on("disconnect", () => setStatus("offline"));
    socket.on("connect_error", (err) => {
      setStatus("offline");
      if (["SESSION_REVOKED", "TOKEN_EXPIRED", "TOKEN_INVALID"].includes(err?.data?.code)) {
        socket.disconnect();
      }
    });

    socket.on("message:new", (msg) => {
      if (String(msg.to_user_id) === String(me?.id)) setUnreadChats((n) => n + 1);
      queryClient.invalidateQueries("conversations");
    });
    socket.on("message:read", (evt) => {
      // my own read (from any tab) lowers my badge; recompute from server
      if (String(evt.reader_id) === String(me?.id)) getChatUnreadCount().then(setUnreadChats).catch(() => {});
    });
    socket.on("presence", ({ user_id, online }) => setPresence((p) => ({ ...p, [user_id]: online })));
    socket.on("notification:new", (n) => {
      setUnreadNotifs((c) => c + 1);
      queryClient.invalidateQueries("notifications");
      if (n.type?.startsWith("event_")) {
        // seat promotion, time/venue change, cancellation, reminder
        queryClient.invalidateQueries(["eventAttendance", n.entity_id]);
        queryClient.invalidateQueries(["event", n.entity_id]);
        queryClient.invalidateQueries("myEvents");
      }
      toast.info(n.content, { toastId: n.id, autoClose: 4000 });
    });
    // an admin published a new theme: re-fetch it (applies without reload)
    socket.on("theme:updated", () => queryClient.invalidateQueries("theme"));
    socket.on("connection:update", () => {
      queryClient.invalidateQueries("connections");
      queryClient.invalidateQueries("connectionCounts");
      queryClient.invalidateQueries("conversations");
      getConnectionCounts()
        .then((c) => setPendingRequests(c.incoming))
        .catch(() => {});
    });

    refreshCounts();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, me?.id, queryClient, refreshCounts]);

  const emit = useCallback(
    (event, payload) =>
      new Promise((resolve, reject) => {
        const s = socketRef.current;
        if (!s || !s.connected) return reject(Object.assign(new Error("offline"), { code: "OFFLINE" }));
        s.timeout(8000).emit(event, payload, (err, ack) => {
          if (err) return reject(Object.assign(new Error("Timed out"), { code: "TIMEOUT" }));
          if (ack?.ok) return resolve(ack.data);
          reject(Object.assign(new Error(ack?.error?.message || "Failed"), { code: ack?.error?.code }));
        });
      }),
    []
  );

  // fire-and-forget (no ack expected), e.g. typing indicators
  const fire = useCallback((event, payload) => {
    socketRef.current?.connected && socketRef.current.emit(event, payload);
  }, []);

  const value = useMemo(
    () => ({
      status,
      me,
      socketRef,
      emit,
      fire,
      unreadChats,
      setUnreadChats,
      unreadNotifs,
      setUnreadNotifs,
      pendingRequests,
      refreshCounts,
      presence,
      setPresence,
      isOnline: (id) => !!presence[id],
    }),
    [status, me, emit, fire, unreadChats, unreadNotifs, pendingRequests, refreshCounts, presence]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime must be used inside <RealtimeProvider>");
  return ctx;
}

/** Subscribe to a socket event for the lifetime of the component. */
export function useSocketEvent(event, handler) {
  const { socketRef, status } = useRealtime();
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return undefined;
    const fn = (payload) => saved.current(payload);
    s.on(event, fn);
    return () => s.off(event, fn);
  }, [event, socketRef, status]);
}
