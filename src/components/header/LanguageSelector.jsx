import { useState } from "react";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { useTranslation } from "react-i18next";

const countries = [
  { language: "en", flag: getUnicodeFlagIcon("US") },
  { language: "am", flag: getUnicodeFlagIcon("ET") },
  // Add more countries as needed
];

const LanguageSelectorDropDown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return countries.find((lang) => {
      return i18n.language === lang.language;
    });
  });

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectCountry = (country) => {
    console.log({ country });
    i18n.changeLanguage(country.language);
    setSelectedCountry(country);
    setIsOpen(false);
  };

  return (
    <div className="relative justify-center justify-items-center items-center">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-lg bg-gray-200 text-gray-800 focus:outline-none"
      >
        <p className="w-4 h-5 mr-2">{selectedCountry.flag}</p>
        {selectedCountry.language.toUpperCase()}
        <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
          {countries.map((country) => (
            <button
              key={country.language}
              onClick={() => selectCountry(country)}
              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
            >
              <p className="w-4 h-4 mr-">{country.flag}</p>
              {/* {country.language.toUpperCase()} */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelectorDropDown;
