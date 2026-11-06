import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getConnectionCounts } from "src/api";
import { chatPath } from "src/lib/nav";
import { PageHeader, Tabs } from "src/components/ui";
import AlumniPage from "src/pages/user/alumni/AlumniPage";
import ConnectionNetwork from "src/pages/user/chatConnections/alumniNetwork";

/**
 * People = the alumni directory and your network in one place
 * (design board 3). ?tab=directory | accepted | incoming | outgoing | discover
 */
export default function PeoplePage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = params.get("tab") || "directory";
  const { data: counts } = useQuery("connectionCounts", getConnectionCounts, { staleTime: 10_000 });
  const openChat = ({ peer }) => navigate(chatPath(peer.id), { state: { peer } });
  const section = tab === "directory" ? "directory" : "network";
  // stable object: the network page resets its tab whenever navParams changes
  const navParams = useMemo(() => ({ tab }), [tab]);

  return (
    <div className="ui-scope mx-auto max-w-6xl">
      <PageHeader title="People" subtitle="Find classmates, grow your network and keep in touch." />
      <Tabs
        className="mb-5"
        value={section}
        onChange={(v) => setParams(v === "directory" ? {} : { tab: "accepted" })}
        tabs={[
          { value: "directory", label: "Directory" },
          { value: "network", label: "My network", count: counts?.incoming },
        ]}
      />
      {section === "directory" ? (
        <AlumniPage onSelectChatClick={openChat} onCreateAlumniClick={() => navigate("/user/profile/create")} />
      ) : (
        <ConnectionNetwork onSelectChatClick={openChat} navParams={navParams} />
      )}
    </div>
  );
}
