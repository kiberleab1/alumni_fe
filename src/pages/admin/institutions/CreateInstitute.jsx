import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAddress, createInstitute } from "src/api";

export default function CreateInstitutionPage() {
  const [currentChild, setCurrentChild] = useState(0);
  const [addressError, setAddressError] = useState("");
  const [instituteError, setInstituteError] = useState("");
  const [instituteAddressId, setInstituteAddressId] = useState(null);
  const [disableInstitutionSection, setDisableInstitutionSection] =
    useState(true);

  const [instituteTypes] = useState(["University", "College", "TVET"]);

  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    houseNumber: "",
  });

  const [instituteFields, setInstituteFields] = useState({
    instituteName: "",
    sub_url: "",
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

  const clearAddressFields = () => {
    setAddressFields({
      country: "",
      region: "",
      city: "",
      houseNumber: "",
    });
  };

  const clearInstituteFields = () => {
    setInstituteFields({
      instituteName: "",
      instituteStartingYear: "",
      instituteDescription: "",
      website: "",
      type: "",
      sub_url: "",
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
  };

  const handleAddressClear = () => {
    clearAddressFields();
  };

  const handleInstituteClear = () => {
    clearInstituteFields();
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

    try {
      const result = await createAddress(addressFields);
      toast.success("Address saved successfully!");
      setDisableInstitutionSection(false);
      setInstituteAddressId(result.data.id);
      setCurrentChild(1);
      setAddressError("");
      console.log("Create address result:", result.data);
    } catch (error) {
      toast.success("Error creating address!");
      console.error("Error creating address", error);
      setAddressError(error);
      setDisableInstitutionSection(true);
    }
  };

  const handleInstituteSubmit = async (e) => {
    e.preventDefault();
    if (
      !instituteFields.instituteName ||
      !instituteFields.instituteStartingYear ||
      !instituteFields.instituteDescription
    ) {
      setInstituteError("Please fill in all required fields!");
      return;
    }
    if (!instituteAddressId) {
      setInstituteError("Please Fill And Save Address First!");
      return;
    }
    if (!instituteFields.instituteName) {
      throw new Error("Institute name is a required field.");
    }
    if (!instituteFields.instituteStartingYear) {
      throw new Error("Institute starting year is a required field.");
    }
    if (!instituteFields.instituteDescription) {
      throw new Error("Institute description is a required field.");
    }

    if (!instituteAddressId) {
      throw new Error("Please Fill And Save Address First.");
    }

    const instituteContactInfo = {
      telegram: "telegram:" + instituteFields.telegram,
      twitter: "twitter:" + instituteFields.twitter,
      facebook: "facebook:" + instituteFields.facebook,
    };

    const contactInfo = Object.values(instituteContactInfo)
      .filter((value) => value && value !== "")
      .join(", ");

    console.log(instituteFields);
    const institute = {
      name: instituteFields.instituteName,
      sub_url: instituteFields.sub_url,
      phone_number: instituteFields.phone,
      email: instituteFields.email,
      website: instituteFields.website,
      type: instituteFields.type,
      accreditations: instituteFields.accreditations,
      number_of_students: instituteFields.number_of_students,
      number_of_alumni: instituteFields.number_of_alumni,
      president_name: instituteFields.president_name,
      description: instituteFields.instituteDescription,
      address_id: instituteAddressId,
      starting_year: instituteFields.instituteStartingYear,
      contact_info: contactInfo,
    };

    try {
      const result = await createInstitute(institute);
      toast.success("Institute saved successfully!");
      setInstituteAddressId();
      setInstituteError("");
      handleInstituteClear();
      setCurrentChild(0);
      handleAddressClear();
      console.log("Create institute result:", result.data);
    } catch (error) {
      toast.success("Error creating institute!");
      console.error("Error creating institute!", error);
      setInstituteError(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen">
      {/* <div className="relative w-[70vw] h-[90vh] flex items-center justify-center  "> */}
      {/* First Form */}
      <div
        className={` transition-all  duration-1000 ease-in-out flex items-center justify-center m-auto ${
          currentChild === 0
            ? "transform translate-x-0 opacity-100 z-50  w-full"
            : "transform translate-x-full opacity-0 hidden z-0"
        }`}
      >
        <div className="w-[100%] lg:w-[50%]">
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
          <form className="bg-white sm:w-full sm:p-6 shadow-sm sm:rounded-xl font-serif border">
            <h1 className="text-2xl text-center text-gray-800 font-serif mb-2">
              Institute Information
            </h1>
            <div className="px-4 py- sm:p-">
              <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6">
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
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
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
                    htmlFor="institute-starting-year"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Institute Starting Year
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="institute-starting-year"
                      id="institute-starting-year"
                      required
                      value={instituteFields.instituteStartingYear}
                      onChange={(e) =>
                        setInstituteFields({
                          ...instituteFields,
                          instituteStartingYear: e.target.value,
                        })
                      }
                      onClick={() => {
                        document
                          .getElementById("institute-starting-year")
                          // @ts-ignore
                          .showPicker();
                      }}
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
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
                </div>
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
                </div>
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
                </div>
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
                {" "}
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
                  disabled={disableInstitutionSection}
                  onClick={handleInstituteSubmit}
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
