// NewsCard.js
import React from 'react';
import { formatDate, truncateDescription } from 'src/utils/utils';

const NewsCard = ({ news }) => {
  console.log(news);
  const truncatedDesc = truncateDescription(news.description, 500);
  const descWithLink = `${truncatedDesc} <a href="#" class="text-green-500 hover:underline">more detail</a>`;

  return (
    <div className="w-full h-full p-6 mb-6 border border-gray-300 rounded-lg shadow-sm relative">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-12 h-12">
          <img
            className="w-full h-full rounded-full"
            src="https://via.placeholder.com/150"
            alt={`${news.title}'s avatar`}
          />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-bold text-start">{news.title}</h3>
          <p className="text-sm text-gray-600 text-start">{news.ownerInstituteId}</p>
          <p className="text-sm text-gray-600 text-start">{formatDate(news.createdAt)}</p>
        </div>
      </div>
      <div
        className="text-gray-700 text-left"
        dangerouslySetInnerHTML={{ __html: descWithLink }}
      />
    </div>
  );
};

export default NewsCard;
