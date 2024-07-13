import { useState } from "react";
import { useQuery } from "react-query";
import { buildEventsUrl, getAllEvents, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import ContentCatalogComponent from "src/views/custom-components/sections/conentCatalogComponent";
import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";
const section = {
  title: "Our upcoming events",
  body: "Join us in our upcoming events",
};
function LandingEventsPage() {
  const [newsList, setMewsList] = useState([]);
  const { isError, data, isLoading } = useQuery(["events"], async () => {
    const allNews = await getAllEvents({ pageNumber: 1, pageSize: 10 });
    console.log(allNews);
    const listNews = [];
    allNews.data.events.map((news) => {
      listNews.push({
        header: news.title,
        date: new Date(news.createdAt),
        link: buildEventsUrl(news.id),
        details: news.description,
        thumbnails: getImageBaseUrl(news.image),
        avenue: news.venue,
      });
    });

    console.log(listNews[0].link);
    setMewsList(listNews);
    return allNews;
  });
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <SectionHolderComponent title={section.title} body={section.body} />
      <ContentCatalogComponent newsArray={newsList} />
    </QueryResult>
  );
}
export default LandingEventsPage;
