import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  BellSlashIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  InboxIcon,
  NoSymbolIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  apiErrorMessage,
  getConversations,
  getImageBaseUrl,
  getMessages,
  markChatRead,
  reactToMessage,
  reportMessage,
  respondChatRequest,
  sendChatMessageHttp,
  updateConversation,
  uploadChatFiles,
} from "src/api";
import { Link } from "react-router-dom";
import { MapPinIcon as PinSolid } from "@heroicons/react/24/solid";
import { profilePath } from "src/lib/nav";
import { useRealtime, useSocketEvent } from "src/lib/realtime";
import { useBlockUser } from "src/pages/user/settings/SettingsPage";
import {
  Avatar,
  CountBadge,
  Button,
  EmptyState,
  Modal,
  SkeletonRow,
  Spinner,
  apiError,
  clockTime,
  cx,
  dayLabel,
  fileSize,
  timeAgo,
} from "src/components/ui";

const MAX_TEXT = 4000;
const MAX_FILE_MB = 15;
const PAGE = 30;
export const REACTIONS = ["👍", "❤️", "😂", "🎉", "😮", "🙏"];
const REPORT_REASONS = [
  ["spam", "Spam or advertising"],
  ["harassment", "Harassment or bullying"],
  ["inappropriate", "Inappropriate content"],
  ["scam", "Scam or fraud"],
  ["other", "Something else"],
];
const uid = () => `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const isImage = (a) => (a.mime ? a.mime.startsWith("image/") : /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(a.key || a.name));

/** Resolve the peer from whatever the caller handed us (network card, directory modal, legacy connection). */
function peerFromProp(chat) {
  if (!chat) return null;
  if (chat.peer) return chat.peer;
  if (chat.user?.id) return chat.user;
  const id = chat.alumni?.user_id || chat.user_id;
  return id ? { id: String(id), name: chat.user?.name || "Member", photo: chat.alumni?.user_photo } : null;
}

export default function ChatUi({ chat }) {
  const { me, emit, fire, status, isOnline, presence, setUnreadChats } = useRealtime();
  const myId = String(me?.id || "");
  const queryClient = useQueryClient();

  const [activePeer, setActivePeer] = useState(() => peerFromProp(chat));
  const [search, setSearch] = useState("");
  const [box, setBox] = useState("inbox"); // inbox | requests
  const [typingFrom, setTypingFrom] = useState({}); // peerId -> timestamp

  const { data: convData, isLoading: convLoading } = useQuery("conversations", getConversations, {
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
  const conversations = useMemo(() => convData?.items || [], [convData]);

  // open the conversation requested by another page (e.g. "Message" button)
  useEffect(() => {
    const p = peerFromProp(chat);
    if (p) setActivePeer(p);
  }, [chat]);

  // keep the active peer's card fresh once the conversation list loads
  useEffect(() => {
    if (!activePeer) return;
    const c = conversations.find((x) => x.peer.id === activePeer.id);
    if (c && (c.peer.name !== activePeer.name || c.peer.photo !== activePeer.photo)) setActivePeer(c.peer);
  }, [conversations]); // eslint-disable-line react-hooks/exhaustive-deps

  useSocketEvent("typing", ({ from, is_typing }) => {
    setTypingFrom((t) => {
      const next = { ...t };
      if (is_typing) next[from] = Date.now();
      else delete next[from];
      return next;
    });
  });
  // expire stale typing flags (lost "stop typing" events)
  useEffect(() => {
    const t = setInterval(() => {
      setTypingFrom((cur) => {
        const now = Date.now();
        const next = Object.fromEntries(Object.entries(cur).filter(([, ts]) => now - ts < 6000));
        return Object.keys(next).length === Object.keys(cur).length ? cur : next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const online = useCallback(
    (peer) => (peer?.id in presence ? isOnline(peer.id) : !!peer?.online),
    [presence, isOnline]
  );

  const requestsCount = convData?.requests_count || 0;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const inBox = conversations.filter((c) => (box === "requests" ? c.request === "incoming" : c.request !== "incoming"));
    if (!q) return inBox;
    return inBox.filter((c) =>
      [c.peer.name, c.peer.email, c.peer.department_name].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [conversations, search, box]);
  useEffect(() => {
    if (box === "requests" && !requestsCount) setBox("inbox");
  }, [box, requestsCount]);

  const activeConv = conversations.find((c) => c.peer.id === activePeer?.id);

  const onThreadRead = useCallback(
    (peerId) => {
      queryClient.setQueryData("conversations", (old) => {
        if (!old) return old;
        const conv = old.items.find((c) => c.peer.id === peerId);
        if (conv?.unread) setUnreadChats((n) => Math.max(0, n - conv.unread));
        return { ...old, items: old.items.map((c) => (c.peer.id === peerId ? { ...c, unread: 0 } : c)) };
      });
    },
    [queryClient, setUnreadChats]
  );

  return (
    <div className="ui-scope h-[calc(100vh-6.5rem)] min-h-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-full">
        {/* ------------------------------------------------ conversation list */}
        <aside
          className={cx(
            "flex w-full flex-col border-r border-slate-200 md:w-80 lg:w-96",
            activePeer ? "hidden md:flex" : "flex"
          )}
        >
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
              <ConnectionPill status={status} />
            </div>
            <label className="relative mt-3 block">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people"
                className="w-full rounded-lg border-0 bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-brand"
              />
            </label>
            {(requestsCount > 0 || box === "requests") && (
              <div className="mt-3 flex gap-1 rounded-lg bg-slate-100 p-1 text-sm" role="tablist" aria-label="Conversations">
                {[
                  ["inbox", "Inbox", 0],
                  ["requests", "Requests", requestsCount],
                ].map(([v, label, n]) => (
                  <button
                    key={v}
                    role="tab"
                    aria-selected={box === v}
                    onClick={() => setBox(v)}
                    className={cx("flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium", box === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                  >
                    {label}
                    {n > 0 && <CountBadge count={n} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {box === "requests" && (
            <p className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
              Messages from alumni you&apos;re not connected with. They won&apos;t know you&apos;ve seen them until you reply or accept.
            </p>
          )}

          <ul className="flex-1 overflow-y-auto">
            {convLoading && [0, 1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}
            {!convLoading && filtered.length === 0 && (
              <EmptyState
                icon={ChatBubbleLeftRightIcon}
                title={search ? "No matches" : box === "requests" ? "No message requests" : "No conversations yet"}
                description={
                  search ? "Try a different name." : "Connect with fellow alumni and they'll show up here, ready to chat."
                }
              />
            )}
            {filtered.map((c) => {
              const typing = !!typingFrom[c.peer.id];
              const lm = c.last_message;
              const mine = lm && lm.from_user_id === myId;
              return (
                <li key={c.peer.id}>
                  <button
                    onClick={() => setActivePeer(c.peer)}
                    className={cx(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                      activePeer?.id === c.peer.id ? "bg-brand-soft" : "hover:bg-slate-50"
                    )}
                  >
                    <Avatar name={c.peer.name} photo={c.peer.photo} online={online(c.peer)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={cx("flex min-w-0 items-center gap-1 truncate text-sm", c.unread && !c.muted ? "font-semibold text-slate-900" : "font-medium text-slate-800")}>
                          <span className="truncate">{c.peer.name}</span>
                          {c.pinned && <PinSolid className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-label="Pinned" />}
                          {c.muted && <BellSlashIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-label="Muted" />}
                        </p>
                        <span className="shrink-0 text-xs text-slate-400">{timeAgo(c.last_activity)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={cx("truncate text-sm", c.unread ? "text-slate-800" : "text-slate-500")}>
                          {typing ? (
                            <span className="italic text-link">typing…</span>
                          ) : lm ? (
                            <>
                              {mine && "You: "}
                              {previewText(lm)}
                            </>
                          ) : (
                            <span className="text-slate-400">Say hello 👋</span>
                          )}
                        </p>
                        {c.request === "outgoing" ? (
                          <span className="shrink-0 text-[11px] font-medium text-amber-700">Pending</span>
                        ) : c.muted ? (
                          c.unread > 0 && <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300" aria-label={`${c.unread} unread (muted)`} />
                        ) : (
                          <CountBadge count={c.unread} />
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ---------------------------------------------------------- thread */}
        <section className={cx("min-w-0 flex-1 flex-col", activePeer ? "flex" : "hidden md:flex")}>
          {activePeer ? (
            <Thread
              key={activePeer.id}
              peer={activePeer}
              myId={myId}
              me={me}
              emit={emit}
              fire={fire}
              socketOnline={status === "online"}
              peerOnline={online(activePeer)}
              peerTyping={!!typingFrom[activePeer.id]}
              conv={activeConv}
              canSend={activeConv ? activeConv.can_send ?? (activeConv.connected || ["admin", "super_admin"].includes(me?.role_name)) : true}
              onBack={() => setActivePeer(null)}
              onRead={onThreadRead}
            />
          ) : (
            <EmptyState
              icon={ChatBubbleLeftRightIcon}
              title="Your messages"
              description="Pick a conversation on the left to start chatting."
            />
          )}
        </section>
      </div>
    </div>
  );
}

function previewText(m) {
  if (m.is_deleted) return "Message deleted";
  if (m.text) return m.text;
  const n = m.attachments?.length || 0;
  if (!n) return "";
  return n === 1 ? (isImage(m.attachments[0]) ? "📷 Photo" : `📎 ${m.attachments[0].name}`) : `📎 ${n} attachments`;
}

function ConnectionPill({ status }) {
  if (status === "online") return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
      {status === "connecting" ? "Connecting…" : "Reconnecting…"}
    </span>
  );
}

/* ======================================================================== */

function Thread({ peer, conv, myId, me, emit, fire, socketOnline, peerOnline, peerTyping, canSend, onBack, onRead }) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [reporting, setReporting] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const scrollRef = useRef(null);
  const stickToBottom = useRef(true);
  const prevHeight = useRef(null);

  const upsert = useCallback((msg) => {
    setMessages((list) => {
      const i = list.findIndex((m) => m.id === msg.id || (msg.client_id && m.client_id === msg.client_id));
      if (i === -1) return [...list, msg];
      const copy = list.slice();
      copy[i] = { ...copy[i], ...msg, _status: undefined };
      return copy;
    });
  }, []);

  const isIncomingRequest = conv?.request === "incoming";
  const markRead = useCallback(() => {
    if (document.visibilityState !== "visible" || isIncomingRequest) return;
    emit("message:read", { peer_id: peer.id })
      .catch(() => markChatRead(peer.id))
      .then(() => onRead(peer.id))
      .catch(() => {});
  }, [emit, peer.id, onRead, isIncomingRequest]);

  // initial page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMessages({ peerId: peer.id, limit: PAGE })
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
        setHasMore(res.has_more);
        stickToBottom.current = true;
        markRead();
      })
      .catch((err) => !cancelled && toast.error(apiErrorMessage(err, "Couldn't load messages")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [peer.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // when the tab becomes visible again, mark what arrived meanwhile as read
  useEffect(() => {
    const fn = () => document.visibilityState === "visible" && markRead();
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, [markRead]);

  const loadOlder = useCallback(async () => {
    if (!hasMore || loadingOlder || !messages.length) return;
    setLoadingOlder(true);
    prevHeight.current = scrollRef.current?.scrollHeight || null;
    try {
      const res = await getMessages({ peerId: peer.id, before: messages[0].created_at, limit: PAGE });
      setMessages((list) => [...res.messages, ...list]);
      setHasMore(res.has_more);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoadingOlder(false);
    }
  }, [hasMore, loadingOlder, messages, peer.id]);

  // keep scroll anchored: bottom for new messages, same spot after loading older
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (prevHeight.current != null) {
      el.scrollTop = el.scrollHeight - prevHeight.current;
      prevHeight.current = null;
    } else if (stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, peerTyping]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (el.scrollTop < 80) loadOlder();
  };

  // live events for this thread
  useSocketEvent("message:new", (msg) => {
    const inThread =
      (msg.from_user_id === peer.id && msg.to_user_id === myId) ||
      (msg.from_user_id === myId && msg.to_user_id === peer.id);
    if (!inThread) return;
    upsert(msg);
    if (msg.from_user_id === peer.id) markRead();
  });
  useSocketEvent("message:read", ({ reader_id, read_at }) => {
    if (reader_id !== peer.id) return;
    setMessages((list) => list.map((m) => (m.from_user_id === myId && !m.read_at ? { ...m, read_at } : m)));
  });
  useSocketEvent("message:deleted", ({ id }) => {
    setMessages((list) =>
      list.map((m) =>
        m.id === id
          ? { ...m, is_deleted: true, text: null, attachments: [], reactions: {} }
          : m.reply_to?.id === id
          ? { ...m, reply_to: { ...m.reply_to, text: null, is_deleted: true } }
          : m
      )
    );
  });
  useSocketEvent("message:reaction", ({ id, reactions }) => {
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, reactions } : m)));
  });

  const react = useCallback(
    async (m, emoji) => {
      // optimistic: one reaction per person, same one again removes it
      const prev = m.reactions || {};
      const had = (prev[emoji] || []).includes(myId);
      const next = Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, v.filter((u) => u !== myId)]).filter(([, v]) => v.length));
      if (!had) next[emoji] = [...(next[emoji] || []), myId];
      setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, reactions: next } : x)));
      try {
        const res = await reactToMessage({ id: m.id, emoji });
        setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, reactions: res.reactions } : x)));
      } catch (err) {
        setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, reactions: prev } : x)));
        toast.error(apiError(err));
      }
    },
    [myId]
  );

  const jumpTo = (id) => {
    const el = scrollRef.current?.querySelector(`[data-msg-id="${id}"]`);
    if (!el) return toast.info("That message is further up. Scroll to load older messages.");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-brand", "rounded-2xl");
    setTimeout(() => el.classList.remove("ring-2", "ring-brand", "rounded-2xl"), 1500);
  };

  const respond = async (action) => {
    try {
      await respondChatRequest({ peerId: peer.id, action });
      toast.success(action === "accept" ? `You can now message ${peer.name.split(" ")[0]}` : "Request declined. They won't be told.");
      queryClient.invalidateQueries("conversations");
      if (action === "decline") onBack?.();
      else markRead();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const setConvFlag = async (patch) => {
    try {
      const res = await updateConversation({ peerId: peer.id, ...patch });
      queryClient.setQueryData("conversations", (old) =>
        old ? { ...old, items: old.items.map((c) => (c.peer.id === peer.id ? { ...c, pinned: res.pinned, muted: res.muted } : c)) } : old
      );
      queryClient.invalidateQueries("conversations");
      toast.success(patch.pinned !== undefined ? (res.pinned ? "Pinned to the top" : "Unpinned") : res.muted ? "Muted. You won't get badges for this chat." : "Unmuted");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  /* ----------------------------------------------------------- sending */
  const sendText = useCallback(
    async (text, existingClientId, quoted = null) => {
      const client_id = existingClientId || uid();
      const reply_to = quoted?.id;
      stickToBottom.current = true;
      upsert({
        id: client_id,
        client_id,
        from_user_id: myId,
        to_user_id: peer.id,
        text,
        attachments: [],
        reactions: {},
        reply_to: quoted ? { id: quoted.id, from_user_id: quoted.from_user_id, text: quoted.text } : null,
        created_at: new Date().toISOString(),
        _status: "sending",
      });
      try {
        const saved = socketOnline
          ? await emit("message:send", { to: peer.id, text, client_id, reply_to })
          : await sendChatMessageHttp({ to: peer.id, text, client_id, reply_to });
        upsert(saved);
        if (conv?.request === "incoming" || !conv) queryClient.invalidateQueries("conversations");
      } catch (err) {
        // socket hiccup -> one HTTP retry before giving up
        if (err.code === "OFFLINE" || err.code === "TIMEOUT") {
          try {
            upsert(await sendChatMessageHttp({ to: peer.id, text, client_id, reply_to }));
            return;
          } catch (httpErr) {
            err = httpErr;
          }
        }
        setMessages((list) =>
          list.map((m) => (m.client_id === client_id ? { ...m, _status: "failed", _error: apiErrorMessage(err, err.message) } : m))
        );
      }
    },
    [emit, myId, peer.id, socketOnline, upsert, conv, queryClient]
  );

  const sendFiles = useCallback(
    async (files, text, quoted = null) => {
      const client_id = uid();
      stickToBottom.current = true;
      upsert({
        id: client_id,
        client_id,
        from_user_id: myId,
        to_user_id: peer.id,
        text: text || null,
        attachments: files.map((f) => ({ name: f.name, mime: f.type, size: f.size, _local: URL.createObjectURL(f) })),
        created_at: new Date().toISOString(),
        _status: "sending",
        _progress: 0,
      });
      try {
        const saved = await uploadChatFiles({
          to: peer.id,
          files,
          text,
          client_id,
          reply_to: quoted?.id,
          onProgress: (p) =>
            setMessages((list) => list.map((m) => (m.client_id === client_id ? { ...m, _progress: p } : m))),
        });
        upsert(saved);
      } catch (err) {
        setMessages((list) =>
          list.map((m) => (m.client_id === client_id ? { ...m, _status: "failed", _error: apiErrorMessage(err) } : m))
        );
      }
    },
    [myId, peer.id, upsert]
  );

  const retry = (m) => {
    setMessages((list) => list.filter((x) => x.client_id !== m.client_id));
    if (m.text && !m.attachments?.length) sendText(m.text, m.client_id);
    else toast.info("Please re-attach the files and send again.");
  };

  const unsend = async (m) => {
    try {
      await emit("message:delete", { id: m.id });
    } catch (err) {
      toast.error(apiErrorMessage(err, err.message));
    }
  };

  /* ---------------------------------------------------------- rendering */
  const lastSeenMine = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from_user_id === myId && messages[i].read_at) return messages[i].id;
    }
    return null;
  }, [messages, myId]);

  const rows = useMemo(() => {
    const out = [];
    let lastDay = null;
    messages.forEach((m, i) => {
      const day = new Date(m.created_at).toDateString();
      if (day !== lastDay) {
        out.push({ type: "day", key: `d-${day}`, label: dayLabel(m.created_at) });
        lastDay = day;
      }
      const next = messages[i + 1];
      const prev = messages[i - 1];
      const near = (a, b) => a && b && a.from_user_id === b.from_user_id && Math.abs(new Date(a.created_at) - new Date(b.created_at)) < 5 * 60_000 && new Date(a.created_at).toDateString() === new Date(b.created_at).toDateString();
      out.push({ type: "msg", key: m.id, m, first: !near(prev, m), last: !near(m, next) });
    });
    return out;
  }, [messages]);

  const subtitle = peerTyping
    ? "typing…"
    : peerOnline
    ? "Online"
    : [peer.department_name, peer.graduation_year && `Class of ${peer.graduation_year}`].filter(Boolean).join(" · ") || "Offline";

  const block = useBlockUser(() => onBack?.());
  return (
    <>
      <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <button onClick={onBack} className="-ml-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Back">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <Link to={profilePath(peer.id)} className="shrink-0" aria-label={`${peer.name}'s profile`}>
          <Avatar name={peer.name} photo={peer.photo} online={peerOnline} />
        </Link>
        <div className="min-w-0">
          <Link to={profilePath(peer.id)} className="block truncate font-semibold text-slate-900 hover:underline">
            {peer.name}
          </Link>
          <p className={cx("truncate text-xs", peerTyping ? "text-link" : peerOnline ? "text-emerald-600" : "text-slate-500")}>
            {subtitle}
          </p>
        </div>
        <ThreadMenu
          peer={peer}
          conv={conv}
          onPin={() => setConvFlag({ pinned: !conv?.pinned })}
          onMute={() => setConvFlag({ muted: !conv?.muted })}
          onBlock={() => window.confirm(`Block ${peer.name}? They won't be able to message or connect with you, and they aren't told.`) && block.mutate(peer.id)}
        />
      </header>

      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto bg-slate-50 px-3 py-4 sm:px-6">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <>
            {loadingOlder && (
              <div className="flex justify-center py-2 text-slate-400">
                <Spinner />
              </div>
            )}
            {!hasMore && messages.length > 0 && (
              <p className="pb-4 text-center text-xs text-slate-400">This is the beginning of your conversation with {peer.name}.</p>
            )}
            {messages.length === 0 && (
              <EmptyState
                icon={ChatBubbleLeftRightIcon}
                title={`Start a conversation with ${peer.name.split(" ")[0]}`}
                description="Messages are private between the two of you."
              />
            )}
            {rows.map((r) =>
              r.type === "day" ? (
                <div key={r.key} className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-medium text-slate-500">{r.label}</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              ) : (
                <Bubble
                  key={r.key}
                  m={r.m}
                  mine={r.m.from_user_id === myId}
                  first={r.first}
                  last={r.last}
                  peer={peer}
                  me={me}
                  seen={r.m.id === lastSeenMine}
                  onRetry={retry}
                  onDelete={unsend}
                  onOpenImage={setLightbox}
                  onReply={isIncomingRequest ? null : (msg) => setReplyTo(msg)}
                  onReact={isIncomingRequest ? null : react}
                  onReport={(msg) => setReporting(msg)}
                  onJump={jumpTo}
                  myId={myId}
                />
              )
            )}
            {peerTyping && (
              <div className="mt-2 flex items-end gap-2">
                <Avatar name={peer.name} photo={peer.photo} size="xs" />
                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <span className="flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isIncomingRequest ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4">
          <p className="text-sm text-slate-700">
            <strong>{peer.name}</strong> isn&apos;t in your network yet and would like to message you.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => respond("accept")}>Accept</Button>
            <Button variant="secondary" onClick={() => respond("decline")}>
              Decline
            </Button>
            <Link to={profilePath(peer.id)} className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-link hover:underline">
              View profile
            </Link>
          </div>
        </div>
      ) : conv?.request === "outgoing" ? (
        <div className="border-t border-slate-200 bg-amber-50 px-4 py-4 text-center text-sm text-amber-800">
          Message request sent. You can send more once {peer.name.split(" ")[0]} accepts.
        </div>
      ) : canSend ? (
        <>
          {!conv && !["admin", "super_admin"].includes(me?.role_name) && (
            <p className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
              If you&apos;re not connected, your first message is sent as a request. You can send one message until {peer.name.split(" ")[0]} accepts.
            </p>
          )}
          <Composer
            peerId={peer.id}
            fire={fire}
            replyTo={replyTo}
            replyName={replyTo ? (replyTo.from_user_id === myId ? "yourself" : peer.name.split(" ")[0]) : null}
            onCancelReply={() => setReplyTo(null)}
            onSendText={(text) => {
              sendText(text, null, replyTo);
              setReplyTo(null);
            }}
            onSendFiles={(files, text) => {
              sendFiles(files, text, replyTo);
              setReplyTo(null);
            }}
          />
        </>
      ) : (
        <div className="border-t border-slate-200 bg-white px-4 py-4 text-center text-sm text-slate-500">
          You&apos;re no longer connected with {peer.name}. Reconnect to send messages.
        </div>
      )}
      <ReportModal message={reporting} peer={peer} onClose={() => setReporting(null)} onBlocked={() => onBack?.()} />

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <XMarkIcon className="h-6 w-6" />
          </button>
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

function Bubble({ m, mine, first, last, peer, seen, onRetry, onDelete, onOpenImage, onReply, onReact, onReport, onJump, myId }) {
  const [menu, setMenu] = useState(false);
  const failed = m._status === "failed";
  const sending = m._status === "sending";
  const images = (m.attachments || []).filter(isImage);
  const files = (m.attachments || []).filter((a) => !isImage(a));
  const urlOf = (a) => a._local || getImageBaseUrl(a.key);

  return (
    <div data-msg-id={m.id} className={cx("group flex items-end gap-2 transition", mine ? "justify-end" : "justify-start", first ? "mt-3" : "mt-0.5")}>
      {!mine && (last ? <Avatar name={peer.name} photo={peer.photo} size="xs" /> : <span className="w-7 shrink-0" />)}

      <div className={cx("flex max-w-[80%] flex-col sm:max-w-[65%]", mine ? "items-end" : "items-start")}>
        <div className="relative flex items-center gap-1">
          {mine && !m.is_deleted && !sending && !failed && (
            <MessageMenu
              open={menu}
              setOpen={setMenu}
              text={m.text}
              onDelete={() => onDelete(m)}
              onReply={onReply && (() => onReply(m))}
              onReact={onReact && ((e) => onReact(m, e))}
              align="right"
            />
          )}
          <div
            className={cx(
              "overflow-hidden rounded-2xl text-sm shadow-sm",
              m.is_deleted
                ? "bg-transparent px-3.5 py-2 italic text-slate-400 ring-1 ring-slate-200"
                : mine
                ? cx("bg-brand text-brand-ink", last && "rounded-br-md", failed && "bg-rose-500")
                : cx("bg-white text-slate-800 ring-1 ring-slate-200", last && "rounded-bl-md"),
              sending && "opacity-70"
            )}
          >
            {m.is_deleted ? (
              "This message was deleted"
            ) : (
              <>
                {m.reply_to && (
                  <button
                    type="button"
                    onClick={() => onJump?.(m.reply_to.id)}
                    className={cx(
                      "mx-1.5 mt-1.5 block max-w-full rounded-lg border-l-4 px-2.5 py-1.5 text-left text-xs",
                      mine ? "border-white/60 bg-white/15" : "border-brand bg-slate-100"
                    )}
                  >
                    <span className="block font-semibold opacity-90">{m.reply_to.from_user_id === myId ? "You" : peer.name.split(" ")[0]}</span>
                    <span className="line-clamp-2 opacity-80">{m.reply_to.is_deleted ? "Message deleted" : m.reply_to.text || "Attachment"}</span>
                  </button>
                )}
                {images.length > 0 && (
                  <div className={cx("grid gap-0.5", images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                    {images.map((a, i) => (
                      <button key={i} onClick={() => !a._local && onOpenImage(urlOf(a))} className="block">
                        <img src={urlOf(a)} alt={a.name} className="max-h-64 w-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
                {files.map((a, i) => (
                  <a
                    key={i}
                    href={a._local ? undefined : urlOf(a)}
                    target="_blank"
                    rel="noreferrer"
                    download={a.name}
                    className={cx(
                      "m-1.5 flex items-center gap-3 rounded-xl px-3 py-2",
                      mine ? "bg-white/15 hover:bg-white/25" : "bg-slate-100 hover:bg-slate-200"
                    )}
                  >
                    <DocumentIcon className="h-8 w-8 shrink-0 opacity-80" />
                    <span className="min-w-0">
                      <span className="block max-w-[12rem] truncate font-medium">{a.name}</span>
                      <span className="text-xs opacity-75">{fileSize(a.size)}</span>
                    </span>
                    {!a._local && <ArrowDownTrayIcon className="h-4 w-4 shrink-0 opacity-75" />}
                  </a>
                ))}
                {m.text && <p className="whitespace-pre-wrap break-words px-3.5 py-2 leading-relaxed">{linkify(m.text, mine)}</p>}
                {sending && m._progress !== undefined && (
                  <div className="h-1 bg-white/30">
                    <div className="h-1 bg-white transition-all" style={{ width: `${m._progress}%` }} />
                  </div>
                )}
              </>
            )}
          </div>
          {!mine && !m.is_deleted && (
            <MessageMenu
              open={menu}
              setOpen={setMenu}
              text={m.text}
              onReply={onReply && (() => onReply(m))}
              onReact={onReact && ((e) => onReact(m, e))}
              onReport={() => onReport(m)}
              align="left"
            />
          )}
        </div>
        {!m.is_deleted && m.reactions && Object.keys(m.reactions).length > 0 && (
          <div className={cx("-mt-1 flex flex-wrap gap-1", mine ? "justify-end pr-1" : "pl-1")}>
            {Object.entries(m.reactions).map(([emoji, users]) => {
              const reacted = users.includes(myId);
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact?.(m, emoji)}
                  disabled={!onReact}
                  aria-pressed={reacted}
                  aria-label={`${emoji} ${users.length}${reacted ? ", including you" : ""}`}
                  className={cx(
                    "inline-flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-xs shadow-sm ring-1",
                    reacted ? "ring-brand" : "ring-slate-200"
                  )}
                >
                  <span>{emoji}</span>
                  {users.length > 1 && <span className="text-slate-600">{users.length}</span>}
                </button>
              );
            })}
          </div>
        )}

        {(last || failed || seen) && (
          <div className="mt-1 flex items-center gap-1 px-1 text-[11px] text-slate-400">
            {failed ? (
              <button onClick={() => onRetry(m)} className="flex items-center gap-1 font-medium text-rose-600 hover:underline" title={m._error}>
                <ExclamationCircleIcon className="h-3.5 w-3.5" /> Not sent · Retry
              </button>
            ) : (
              <>
                <span>{sending ? "Sending…" : clockTime(m.created_at)}</span>
                {mine && !sending && !m.is_deleted && (
                  <span className={cx("flex", m.read_at ? "text-link" : "text-slate-400")} title={m.read_at ? "Seen" : "Sent"}>
                    <CheckIcon className="h-3.5 w-3.5" />
                    {m.read_at && <CheckIcon className="-ml-2 h-3.5 w-3.5" />}
                  </span>
                )}
                {seen && <span className="text-link">Seen</span>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageMenu({ open, setOpen, text, onDelete, onReply, onReact, onReport, align }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open, setOpen]);
  if (!text && !onDelete && !onReply && !onReact && !onReport) return null;
  const item = "flex w-full items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50";
  const run = (fn) => () => {
    setOpen(false);
    fn();
  };
  return (
    <div ref={ref} className="relative flex items-center">
      {onReply && (
        <button
          onClick={onReply}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Reply"
          title="Reply"
        >
          <ArrowUturnLeftIcon className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Message options"
        aria-expanded={open}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className={cx(
            "absolute bottom-full z-20 mb-1 w-48 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-slate-200",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {onReact && (
            <div className="flex justify-between border-b border-slate-100 px-2 pb-1.5 pt-1" aria-label="React">
              {REACTIONS.map((e) => (
                <button key={e} onClick={run(() => onReact(e))} className="rounded-full p-1 text-lg leading-none transition hover:scale-125 hover:bg-slate-100" aria-label={`React ${e}`}>
                  {e}
                </button>
              ))}
            </div>
          )}
          {onReply && (
            <button role="menuitem" className={item} onClick={run(onReply)}>
              <ArrowUturnLeftIcon className="h-4 w-4" /> Reply
            </button>
          )}
          {text && (
            <button
              role="menuitem"
              className={item}
              onClick={run(() => {
                navigator.clipboard?.writeText(text);
                toast.success("Copied", { autoClose: 1200 });
              })}
            >
              <ClipboardDocumentIcon className="h-4 w-4" /> Copy
            </button>
          )}
          {onReport && (
            <button role="menuitem" className={cx(item, "text-rose-600 hover:bg-rose-50")} onClick={run(onReport)}>
              <FlagIcon className="h-4 w-4" /> Report
            </button>
          )}
          {onDelete && (
            <button role="menuitem" className={cx(item, "text-rose-600 hover:bg-rose-50")} onClick={run(onDelete)}>
              <TrashIcon className="h-4 w-4" /> Unsend
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** conversation options in the thread header */
function ThreadMenu({ peer, conv, onPin, onMute, onBlock }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  const item = "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50";
  const run = (fn) => () => {
    setOpen(false);
    fn();
  };
  return (
    <div ref={ref} className="relative ml-auto">
      <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Conversation options" aria-expanded={open}>
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200">
          <Link role="menuitem" to={profilePath(peer.id)} className={item}>
            <UserCircleIcon className="h-4 w-4" /> View profile
          </Link>
          {conv && conv.request !== "incoming" && (
            <>
              <button role="menuitem" className={item} onClick={run(onPin)}>
                <InboxIcon className="h-4 w-4" /> {conv.pinned ? "Unpin conversation" : "Pin to top"}
              </button>
              <button role="menuitem" className={item} onClick={run(onMute)}>
                <BellSlashIcon className="h-4 w-4" /> {conv.muted ? "Unmute" : "Mute notifications"}
              </button>
            </>
          )}
          <button role="menuitem" className={cx(item, "text-rose-600 hover:bg-rose-50")} onClick={run(onBlock)}>
            <NoSymbolIcon className="h-4 w-4" /> Block {peer.name.split(" ")[0]}
          </button>
        </div>
      )}
    </div>
  );
}

function ReportModal({ message, peer, onClose, onBlocked }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [block, setBlock] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (message) {
      setReason("");
      setDetails("");
      setBlock(false);
    }
  }, [message]);
  const submit = async () => {
    setSaving(true);
    try {
      await reportMessage({ id: message.id, reason, details, block });
      toast.success(block ? `Reported and blocked ${peer.name.split(" ")[0]}` : "Thanks. Your institute's admins will review it.");
      onClose();
      if (block) {
        queryClient.invalidateQueries("conversations");
        onBlocked?.();
      }
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      open={!!message}
      onClose={onClose}
      title="Report message"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" disabled={!reason} loading={saving} onClick={submit}>
            Report
          </Button>
        </>
      }
    >
      {message?.text && <blockquote className="mb-4 line-clamp-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{message.text}</blockquote>}
      <fieldset>
        <legend className="text-sm font-medium text-slate-900">What&apos;s wrong with this message?</legend>
        <div className="mt-2 space-y-1">
          {REPORT_REASONS.map(([v, label]) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <input type="radio" name="report-reason" value={v} checked={reason === v} onChange={() => setReason(v)} className="h-4 w-4 text-brand focus:ring-brand" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="report-details" className="mt-3 block text-sm font-medium text-slate-900">
        Anything else? <span className="font-normal text-slate-500">(optional)</span>
      </label>
      <textarea id="report-details" rows={2} maxLength={1000} value={details} onChange={(e) => setDetails(e.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-brand focus:ring-brand" />
      <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={block} onChange={(e) => setBlock(e.target.checked)} className="h-4 w-4 rounded text-brand focus:ring-brand" />
        Also block {peer.name.split(" ")[0]}
      </label>
      <p className="mt-3 text-xs text-slate-500">{peer.name.split(" ")[0]} won&apos;t know who reported them. Admins see a copy of the message.</p>
    </Modal>
  );
}

const URL_RE = /(https?:\/\/[^\s]+)/g;
function linkify(text, mine) {
  return text.split(URL_RE).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer noopener" className={cx("underline", mine ? "text-white" : "text-link")}>
        {part}
      </a>
    ) : (
      part
    )
  );
}

/* ---------------------------------------------------------------- composer */
function Composer({ peerId, fire, onSendText, onSendFiles, replyTo, replyName, onCancelReply }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const typingRef = useRef({ sent: 0, timer: null });

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [text]);

  useEffect(() => () => clearTimeout(typingRef.current.timer), []);
  useEffect(() => {
    if (replyTo) taRef.current?.focus();
  }, [replyTo]);

  const stopTyping = useCallback(() => {
    clearTimeout(typingRef.current.timer);
    if (typingRef.current.sent) {
      fire("typing", { to: peerId, is_typing: false });
      typingRef.current.sent = 0;
    }
  }, [fire, peerId]);

  const onType = (value) => {
    setText(value.slice(0, MAX_TEXT));
    const now = Date.now();
    if (now - typingRef.current.sent > 2500) {
      fire("typing", { to: peerId, is_typing: true });
      typingRef.current.sent = now;
    }
    clearTimeout(typingRef.current.timer);
    typingRef.current.timer = setTimeout(stopTyping, 3000);
  };

  const addFiles = (list) => {
    const incoming = Array.from(list || []);
    const tooBig = incoming.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig.length) toast.warn(`${tooBig.map((f) => f.name).join(", ")} exceed${tooBig.length === 1 ? "s" : ""} ${MAX_FILE_MB} MB`);
    setFiles((cur) => [...cur, ...incoming.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024)].slice(0, 10));
  };

  const submit = () => {
    const body = text.trim();
    if (!body && !files.length) return;
    if (files.length) onSendFiles(files, body);
    else onSendText(body);
    setText("");
    setFiles([]);
    stopTyping();
    taRef.current?.focus();
  };

  return (
    <div
      className="border-t border-slate-200 bg-white p-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
      }}
    >
      {replyTo && (
        <div className="mb-2 flex items-start gap-2 rounded-lg border-l-4 border-brand bg-slate-50 px-3 py-2">
          <ArrowUturnLeftIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div className="min-w-0 flex-1 text-xs">
            <p className="font-semibold text-slate-700">Replying to {replyName}</p>
            <p className="truncate text-slate-500">{replyTo.text || "Attachment"}</p>
          </div>
          <button onClick={onCancelReply} className="rounded p-0.5 text-slate-400 hover:text-slate-700" aria-label="Cancel reply">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      {files.length > 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {files.map((f, i) => (
            <div key={i} className="relative shrink-0">
              {f.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(f)} alt={f.name} className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200" />
              ) : (
                <div className="flex h-16 w-36 items-center gap-2 rounded-lg bg-slate-100 px-2 text-xs text-slate-700">
                  <DocumentIcon className="h-6 w-6 shrink-0 text-slate-500" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{f.name}</span>
                    <span className="text-slate-500">{fileSize(f.size)}</span>
                  </span>
                </div>
              )}
              <button
                onClick={() => setFiles((cur) => cur.filter((_, j) => j !== i))}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-800 p-0.5 text-white hover:bg-slate-900"
                aria-label={`Remove ${f.name}`}
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Attach files"
          title="Attach photos or files"
        >
          <PaperClipIcon className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex-1 rounded-2xl bg-slate-100 px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand">
          <textarea
            ref={taRef}
            rows={1}
            value={text}
            onChange={(e) => onType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && replyTo) onCancelReply?.();
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            onPaste={(e) => {
              const pasted = Array.from(e.clipboardData?.files || []);
              if (pasted.length) addFiles(pasted);
            }}
            placeholder="Write a message…"
            className="block max-h-40 w-full resize-none border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
          />
          {text.length > MAX_TEXT - 300 && (
            <p className="mt-1 text-right text-[11px] text-slate-400">
              {text.length}/{MAX_TEXT}
            </p>
          )}
        </div>
        <button
          onClick={submit}
          disabled={!text.trim() && !files.length}
          className="rounded-full bg-brand p-2.5 text-white shadow-sm transition hover:bg-brand-hover disabled:bg-slate-200 disabled:text-slate-400"
          aria-label="Send"
        >
          {files.length ? <PhotoIcon className="h-5 w-5" /> : <PaperAirplaneIcon className="h-5 w-5" />}
        </button>
      </div>
      <p className="mt-1.5 hidden px-12 text-[11px] text-slate-400 sm:block">Enter to send · Shift + Enter for a new line · drop files to attach</p>
    </div>
  );
}
