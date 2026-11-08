/** Small public-site helpers: old content links and the not-found page. */
import { Navigate, useSearchParams } from "react-router-dom";
import { MapIcon } from "@heroicons/react/24/outline";
import { ButtonLink, Container, Empty, P } from "./kit";

/** /landing/content?type=news|events&id=… (old share links and emails) */
export function LegacyContentRedirect() {
  const [q] = useSearchParams();
  const id = q.get("id");
  const type = q.get("type");
  if (id && type === "news") return <Navigate to={P.article(id)} replace />;
  if (id && (type === "events" || type === "event")) return <Navigate to={P.event(id)} replace />;
  return <Navigate to={P.home} replace />;
}

export function PublicNotFound() {
  return (
    <Container className="py-24">
      <Empty icon={MapIcon} title="We couldn't find that page" text="The link may be old or mistyped. Try one of these instead.">
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink to={P.home}>Go to the home page</ButtonLink>
          <ButtonLink to={P.events} variant="secondary">
            Upcoming events
          </ButtonLink>
        </div>
      </Empty>
    </Container>
  );
}
