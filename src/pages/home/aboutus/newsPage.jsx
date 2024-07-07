// TODO

import ContentCatalogComponent from "src/views/custom-components/sections/conentCatalogComponent";
import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";

import { useState } from "react";
import { useQuery } from "react-query";
import { buildNewsUrl, getAllNews, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";

const sectionContent = {
  title: "News",
  body: `Here you can check Demos we created based on WrapKit. Its quite
           easy to Create your own dream website &amp; dashboard in No-time`,
};

function NewsPage() {
  const [newsList, setMewsList] = useState([]);
  const { isError, data, isLoading } = useQuery(["getNews"], async () => {
    const allNews = await getAllNews({ pageNumber: 1, pageSize: 10 });
    const listNews = [];
    allNews.data.news.map((news) => {
      listNews.push({
        header: news.title,
        date: new Date(news.createdAt),
        link: buildNewsUrl(news.id),
        details: news.description,
        thumbnails: getImageBaseUrl(news.image),
      });
    });
    console.log(listNews[0].link);
    setMewsList(listNews);
    return allNews;
  });
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <SectionHolderComponent
        title={sectionContent.title}
        body={sectionContent.body}
      />
      <ContentCatalogComponent newsArray={newsList} />
    </QueryResult>
  );
}

export default NewsPage;
