import React from "react";

const H1Heading = ({ title }) => {
  return (
    <h1 className="text-3xl lg:text-4xl  text-green-900 dark:text-white font-simplifica ">
      {title}
      <div className="bg-green-800 h-[4px] w-[35%] mt-2 text-center m-auto"></div>
    </h1>
  );
};

export default H1Heading;
