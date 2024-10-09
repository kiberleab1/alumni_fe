import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAddressById, updateAddress, updateInstitute } from "src/api";
import { ToastContainer, toast } from "react-toastify";
import {
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  LinkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { IoReturnDownBack } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function EditInstitute({ institute }) {
  const [currentChild, setCurrentChild] = useState(0);
  const [addressError, setAddressError] = useState(null);
  const [instituteError, setInstituteError] = useState(null);
  const [instituteTypes, setInstituteTypes] = useState([
    "University",
    "College",
    "TVET",
  ]);

  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    houseNumber: "",
  });
  const [instituteFields, setInstituteFields] = useState({
    instituteName: "",
    instituteStartingYear: "",
    instituteDescription: "",
    website: "",
    type: "",
    accreditations: "",
    number_of_students: "",
    number_of_alumni: "",
    president_name: "",
    email: "",
    phone: "",
    twitter: "",
    linkedin: "",
    telegram: "",
    facebook: "",
  });
  const [disableInstitutionSection, setDisableInstitutionSection] =
    useState(false);

  const addressId = institute.address_id;
  const { isError, data, error, isFetching } = useQuery(
    "getAddressById",
    async () => {
      return await getAddressById(addressId);
    }
  );

  const dataArray = institute.contact_info.split(", ");
  let contactInformation = {};
  dataArray.forEach((item) => {
    const [key, value] = item.split(":");
    contactInformation[key.trim()] = value.trim();
  });

  const dateObject = new Date(institute.starting_year);

  const year = dateObject.getUTCFullYear();
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getUTCDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    if (!isFetching && !isError && data) {
      const addressData = data.data;
      setAddressFields((prevState) => ({
        ...prevState,
        country: addressData.country || "",
        region: addressData.region || "",
        city: addressData.city || "",
        house_number: addressData.house_number || "",
      }));

      setInstituteFields((prevState) => ({
        ...prevState,
        instituteName: institute.name || "",
        instituteStartingYear: formattedDate || "",
        instituteDescription: institute.description || "",
        email: institute.email || "",
        website: institute.website || "",
        type: institute.type || "",
        accreditations: institute.accreditations || "",
        number_of_students: institute.number_of_students || "",
        number_of_alumni: institute.number_of_alumni || "",
        president_name: institute.president_name || "",
        phone: institute.phone_number || "",
        twitter: contactInformation.twitter || "",
        linkedin: contactInformation.linkedin || "",
        telegram: contactInformation.telegram || "",
        facebook: contactInformation.facebook || "",
      }));
    }
  }, [isFetching, isError, data]);

  const handleAddressClear = () => {
    setAddressFields({
      country: "",
      region: "",
      city: "",
      houseNumber: "",
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (
      !addressFields.country ||
      !addressFields.region ||
      !addressFields.city
    ) {
      setAddressError("Please fill in all required fields.");
      return;
    }
    if (!addressFields.country) {
      throw new Error("Country is a required field.");
    }
    if (!addressFields.region) {
      throw new Error("Region is a required field.");
    }
    if (!addressFields.city) {
      throw new Error("City is a required field.");
    }

    addressFields.id = institute.address_id;
    console.log(addressFields);
    try {
      const result = await updateAddress(addressFields);
      toast.success("Address updated successfully!");
      setAddressError();
      setCurrentChild(1);
      setFormStep(1);
      console.log("Update address result:", result.data);
    } catch (error) {
      toast.success("Error updating address!");
      console.error("Error updating address", error);
      setAddressError(error);
    }
  };

  const handleInstituteClear = () => {
    setInstituteFields({
      instituteName: "",
      instituteStartingYear: "",
      instituteDescription: "",
      email: "",
      phone: "",
      twitter: "",
      linkedin: "",
      telegram: "",
      facebook: "",
    });
  };

  const handleInstituteSubmit = async (e) => {
    e.preventDefault();

    const instituteContactInfo = {
      email: "email:" + instituteFields.email,
      phone: "phone:" + instituteFields.phone,
      telegram: "telegram:" + instituteFields.telegram,
      twitter: "twitter:" + instituteFields.twitter,
      facebook: "facebook:" + instituteFields.facebook,
    };

    const contactInfo = Object.values(instituteContactInfo)
      .filter((value) => value && value !== "")
      .join(", ");

    instituteFields.contact_info = contactInfo;

    const instituteData = {
      name: instituteFields.instituteName,
      phone_number: instituteFields.phone,
      email: instituteFields.email,
      website: instituteFields.website,
      type: instituteFields.type,
      accreditations: instituteFields.accreditations,
      number_of_students: instituteFields.number_of_students,
      number_of_alumni: instituteFields.number_of_alumni,
      president_name: instituteFields.president_name,
      description: instituteFields.instituteDescription,
      starting_year: instituteFields.instituteStartingYear,
      id: institute.id,
      contact_info: contactInfo,
    };
    console.log(instituteData);
    try {
      const result = await updateInstitute(instituteData);
      toast.success("Institute updated successfully!");
      setInstituteError();
      setCurrentChild(0);
      console.log("Update Institute result:", result.data);
    } catch (error) {
      toast.success("Error updating Institute!");
      console.error("Error updating Institute", error);
      setInstituteError(error);
    }
  };

  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  const [formStep, setFormStep] = useState(5);
  const handleNext = () => {
    setFormStep(2);
  };
  console.log(formStep);
  console.log(currentChild);

  const handleBack = () => {
    setFormStep(1);
  };
  return (
    <div className="relative flex items-center justify-center w-full min-h-screen">
      <div
        className={` transition-all  duration-1000 ease-in-out flex items-center justify-center m-auto ${
          currentChild === 0
            ? "transform translate-x-0 opacity-100 z-50  w-full"
            : "transform translate-x-full opacity-0 hidden z-0"
        }`}
      >
        <div className="w-[100%] 2xl:w-[60%]">
          <form className="bg-white sm:w-full sm:p-6 shadow-sm sm:rounded-xl font-serif border">
            <h1 className="text-2xl text-center text-gray-800 font-serif mb-2">
              Address Information
            </h1>
            <div className="px-4 py-6 sm:p-8 flex items-center justify-center">
              <div className="grid max-w-2xl  gap-x-6 gap-y-8 ">
                <div className="sm:col-span-3 w-80 mt-2">
                  <div className="mt-">
                    {" "}
                    <label
                      htmlFor="country"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      placeholder="Where do you live (country)?"
                      required
                      value={addressFields.country}
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          country: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    />
                  </div>
                </div>
                <div className="sm:col-span-3 w-80">
                  <div className="mt-2">
                    <label
                      htmlFor="region"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      Region
                    </label>

                    <input
                      type="text"
                      name="region"
                      id="region"
                      placeholder="Which state/region?"
                      required
                      value={addressFields.region}
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          region: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="city"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      placeholder="What city?"
                      required
                      value={addressFields.city}
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          city: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="house-number"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    House Number
                  </label>
                  <input
                    type="text"
                    name="house-number"
                    id="house-number"
                    placeholder="What's your house number?"
                    value={addressFields.houseNumber}
                    onChange={(e) =>
                      setAddressFields({
                        ...addressFields,
                        houseNumber: e.target.value,
                      })
                    }
                    className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                  />
                </div>
                <div className="sm:col-span-6 ">
                  {addressError && (
                    <p className="text-red-600 font-mono">{addressError}</p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                      onClick={handleAddressClear}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-serif"
                      onClick={handleAddressSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div
        className={`relative w-full transition-all duration-1000 ease-in-out  flex  justify-center  ${
          currentChild === 1
            ? "transform translate-y-0 opacity-100 z-50"
            : "transform translate-y-full opacity-0 z-0 hidden"
        }`}
      >
        <div className="w-[90%] xl:w-[60%]  ">
          {" "}
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <h1 className="text-2xl font- text-center text-gray-800 font-serif mb-4">
              Institute Information
            </h1>
            <div className="px-4 py-6 sm:p-">
              <div className="grid max-w-full grid-cols-1 gap-x-6 xl:gap-x-8 gap-y-4 xl:gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="institute-name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="institute-name"
                      id="institute-name"
                      required
                      value={instituteFields.instituteName}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          instituteName: e.target.value,
                        })
                      }
                      autoComplete="institute_name"
                      placeholder="Institute Name"
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="institute-name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={instituteFields.email}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          email: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="institute-name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Sub url
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sub_url"
                      id="sub_url"
                      value={instituteFields.sub_url}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          sub_url: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="institute-name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      value={instituteFields.phone}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          phone: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="institute-name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute website
                  </label>
                  <div className="mt-2">
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={instituteFields.website}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          website: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="website Link"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="institute-name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Type
                  </label>
                  <div className="mt-2">
                    <select
                      value={instituteFields.type}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          type: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    >
                      {instituteTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>{" "}
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="president_name"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute President Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="president_name"
                      id="president_name"
                      value={instituteFields.president_name}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          president_name: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="President Name"
                    />
                  </div>
                </div>{" "}
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="number_of_students"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Number Of Students
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="number_of_students"
                      id="number_of_students"
                      value={instituteFields.number_of_students}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          number_of_students: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Number Of Students"
                    />
                  </div>
                </div>{" "}
                <div className="sm:col-span-2 mb-1">
                  <label
                    htmlFor="number_of_alumni"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Number Of Alumni
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="number_of_alumni"
                      id="number_of_alumni"
                      value={instituteFields.number_of_alumni}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          number_of_alumni: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Number Of Alumni"
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="institute-accreditations"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Accreditations
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="institute-accreditations"
                      name="institute-accreditations"
                      rows={2}
                      required
                      value={instituteFields.accreditations}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          accreditations: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="institute-description"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="institute-description"
                      name="institute-description"
                      rows={2}
                      required
                      value={instituteFields.instituteDescription}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          instituteDescription: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="institute-contact-info"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Contact Info
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <input
                      type="url"
                      name="twitter"
                      id="twitter"
                      value={instituteFields.twitter}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          twitter: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Twitter Link"
                    />
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={instituteFields.linkedin}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          linkedin: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="LinkedIn Link"
                    />
                    <input
                      type="url"
                      name="telegram"
                      id="telegram"
                      value={instituteFields.telegram}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          telegram: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Telegram Link"
                    />
                    <input
                      type="url"
                      name="facebook"
                      id="facebook"
                      value={instituteFields.facebook}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          facebook: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      placeholder="Facebook Link"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              {instituteError && (
                <p className="text-red-600 font-mono">{instituteError}</p>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                  onClick={handleInstituteClear}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                  onClick={handleInstituteSubmit}
                  disabled={disableInstitutionSection}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* </div> */}

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
