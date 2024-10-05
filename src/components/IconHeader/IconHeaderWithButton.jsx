import React from "react";
import useAOS from "src/pages/user/aos";

const IconHeaderWithButton = ({
  title,
  Icon,
  buttonText,
  ButtonIcon,
  onButtonClick,
}) => {
  useAOS({
    duration: 1200,
    once: false,
  });
  return (
    <div className="sm:flex sm:items-center mb-2">
      <div className="sm:flex-auto flex items-center">
        {/* <Icon className="text-2xl mr-2" /> */}
        <h1 className="text-base font-semibold leading-6 text-gray-900 font-mono">
          {title}
        </h1>
      </div>

      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          className="flex flex-row gap-2 rounded-md bg-cyan-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          onClick={onButtonClick}
        >
          <ButtonIcon className="text-2xl mr-2" data-aos="fade-left" />{" "}
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default IconHeaderWithButton;
