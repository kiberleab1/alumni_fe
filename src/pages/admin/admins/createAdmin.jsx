import { useState } from "react";
import {
  createAddress,
  createAInstituteAdmin,
  getInstitutes,
  getRoles,
} from "src/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "react-query";
import QueryResult from "src/components/utils/queryResults";
import { FaArrowDown } from "react-icons/fa";

export default function CreateAdminPage() {
  const [currentChild, setCurrentChild] = useState(0);
  const [addressError, setAddressError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [placeOfBirthError, setPlaceOfBirthError] = useState("");
  const [, setDisableAdminSection] = useState(true);
  const [adminAddressId, setAdminAddressId] = useState();
  const [adminPlaceOfBirthId, setAdminPlaceOfBirthId] = useState();
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [adminFields, setAdminFields] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    role: "",
    institute: "",
    password: "",
  });

  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    houseNumber: "",
  });

  const [placeOfBirthFields, setPlaceOfBirthFields] = useState({
    country: "",
    region: "",
    city: "",
    houseNumber: "",
  });
  const handleNext = () => {
    setCurrentChild((prev) => (prev < 2 ? prev + 1 : 0)); // Loop through the three children
  };

  const { isError, data, isLoading } = useQuery(
    ["getRoles", "getInstitutes"],
    async () => {
      try {
        const roleData = await getRoles({ pageNumber: 0, pageSize: 20 });
        console.log(roleData);
        if (roleData) {
          const roles = Object.values(roleData.data.role).map((role) => ({
            roleName: role.role_name,
            roleId: role.id,
          }));
          setRoles(roles);
        }

        const instituteData = await getInstitutes({
          pageNumber: 1,
          pageSize: 10,
        });
        console.log(instituteData);
        if (instituteData) {
          const instituteNames = Object.values(
            instituteData.data.institute
          ).map((institute) => ({
            name: institute.name,
            id: institute.id,
          }));

          adminFields.institute = instituteData.data?.institute[0]?.id;
          setInstitutions(instituteNames);
        }
        return instituteData;
      } catch (error) {
        console.error(error);
      }
    }
  );

  const clearAdminFields = () => {
    setAdminFields({
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      gender: "",
      dateOfBirth: "",
      role: "",
      institute: "",
    });
  };

  const clearAddressFields = () => {
    setAddressFields({
      country: "",
      region: "",
      city: "",
      houseNumber: "",
    });
  };

  const clearPlaceOfBirthFields = () => {
    setPlaceOfBirthFields({
      country: "",
      region: "",
      city: "",
      houseNumber: "",
    });
  };

  const handleAddressClear = () => {
    clearAddressFields();
  };

  const handlePlaceOfBirthClear = () => {
    clearPlaceOfBirthFields();
  };

  const handleAdminClear = () => {
    clearAdminFields();
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
      setDisableAdminSection(false);
      setAdminAddressId(result.data.id);
      setAddressError("");
      setCurrentChild(1);
      console.log("Create address result:", result.data);
    } catch (error) {
      toast.success("Error creating address!");
      console.error("Error creating address", error);
      setAddressError(error);
      setDisableAdminSection(true);
    }
  };

  const handlePlaceOfBirthSubmit = async (e) => {
    e.preventDefault();
    if (
      !placeOfBirthFields.country ||
      !placeOfBirthFields.region ||
      !placeOfBirthFields.city
    ) {
      setPlaceOfBirthError("Please fill in all required fields.");
      return;
    }
    if (!placeOfBirthFields.country) {
      throw new Error("Country is a required field.");
    }
    if (!placeOfBirthFields.region) {
      throw new Error("Region is a required field.");
    }
    if (!placeOfBirthFields.city) {
      throw new Error("City is a required field.");
    }

    try {
      const result = await createAddress(placeOfBirthFields);
      toast.success("Address saved successfully!");
      setDisableAdminSection(false);
      setAdminPlaceOfBirthId(result.data.id);
      setPlaceOfBirthError("");
      setCurrentChild(2);
      console.log("Create address result:", result.data);
    } catch (error) {
      toast.success("Error creating address!");
      console.error("Error creating address", error);
      setPlaceOfBirthError(error);
      setDisableAdminSection(true);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "password",
      "gender",
      "dateOfBirth",
      "role",
      "institute",
    ];
    const missingFields = requiredFields.filter((field) => !adminFields[field]);
    if (missingFields.length > 0) {
      setAdminError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      toast.error("Please fill in all required fields");
      console.log(missingFields);
      console.log(adminFields);
      return;
    }
    try {
      console.log(adminFields);
      const adminData = {
        email: adminFields.email,
        first_name: adminFields.firstName,
        middle_name: adminFields.middleName,
        last_name: adminFields.lastName,
        phone_number: adminFields.phoneNumber,
        password: adminFields.password,
        gender: adminFields.password,
        date_of_birth: adminFields.dateOfBirth,
        role_id: adminFields.role,
        address_id: adminAddressId,
        birth_place_id: adminPlaceOfBirthId,
        institute_id: adminFields.institute,
      };
      console.log(adminData);
      await createAInstituteAdmin(adminData);
      toast.success("Admin saved successfully!");
      setCurrentChild(0);
      setAdminError("");
      clearAdminFields();
    } catch (error) {
      toast.error("Error saving admin!");
      setAdminError("Error saving admin!");
      console.error("Error saving admin", error);
    }
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="relative flex items-center justify-center w-full min-h-screen">
        {/* First Form */}
        <div
          className={` transition-all  duration-1000 ease-in-out flex items-center justify-center m-auto ${
            currentChild === 0
              ? "transform translate-x-0 opacity-100 z-50  w-full"
              : "transform translate-x-full opacity-0 hidden z-0"
          }`}
        >
          <div className="w-[100%] xl:w-[50%]">
            <form className="bg-white sm:w-full sm:p-6 shadow-sm sm:rounded-xl font-serif border">
              <h1 className="text-2xl text-center text-gray-800 font-serif mb-2">
                Address Information
              </h1>
              <div className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                  <div>
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
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="mb-4">
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
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="city"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    City
                  </label>
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
                    className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="w-full">
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
                    className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mt-3 w-full">
                  {addressError && (
                    <p className="text-red-600 font-mono">{addressError}</p>
                  )}

                  <div className="flex gap-x-4">
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                      onClick={handleAddressClear}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                      onClick={handleAddressSubmit}
                    >
                      Save <FaArrowDown className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Second Form */}
        <div
          className={`absolute w-full transition-all duration-1000 ease-in-out  flex  justify-center  ${
            currentChild === 1
              ? "transform translate-y-0 opacity-100 z-50"
              : "transform translate-y-full opacity-0 z-0 hidden"
          }`}
        >
          {/* <div className="bg-yellow-200 p-4 rounded-md">Second Child</div> */}
          <div className="w-[90%] xl:w-[60%] bg-black ">
            <form className="bg-white sm:w-full sm:p-6 shadow-sm sm:rounded-xl font-serif border">
              <h1 className="text-2xl text-center text-gray-800 font-serif mb-2">
                Admin Place Of Birth Information
              </h1>
              <div className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                  <div>
                    <label
                      htmlFor="country"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      placeholder="Where were you born?"
                      value={placeOfBirthFields.country}
                      onChange={(e) =>
                        setPlaceOfBirthFields({
                          ...placeOfBirthFields,
                          country: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="region"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      Region
                    </label>
                    <input
                      type="text"
                      id="region"
                      placeholder="In which region were you born?"
                      value={placeOfBirthFields.region}
                      onChange={(e) =>
                        setPlaceOfBirthFields({
                          ...placeOfBirthFields,
                          region: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      placeholder="Which city were you born in?"
                      value={placeOfBirthFields.city}
                      onChange={(e) =>
                        setPlaceOfBirthFields({
                          ...placeOfBirthFields,
                          city: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="houseNumber"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      House Number
                    </label>
                    <input
                      type="text"
                      id="houseNumber"
                      placeholder="What is your house number?"
                      value={placeOfBirthFields.houseNumber}
                      onChange={(e) =>
                        setPlaceOfBirthFields({
                          ...placeOfBirthFields,
                          houseNumber: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                {placeOfBirthError && (
                  <p className="text-red-600 font-mono">{placeOfBirthError}</p>
                )}
                <div className="flex space-x-4">
                  {" "}
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                    onClick={handlePlaceOfBirthClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                    onClick={handlePlaceOfBirthSubmit}
                  >
                    Save <FaArrowDown className="ml-2" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Third Form */}
        <div
          className={`absolute flex items-center justify-center m-auto w-96 sm:w-full transition-all duration-1000 ease-in-out${
            currentChild === 2
              ? "transform translate-x-0 opacity-100 z-50"
              : "transform translate-x-full opacity-0 hidden z-0"
          }`}
        >
          <div className="px-2  bg- w-[80%]">
            <form className="bg-white  shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl font-serif mx-auto max-h-screen overflow-y-auto">
              <h1 className="text-2xl text-center text-gray-800 font-serif md:mb-4">
                Admin Information
              </h1>
              <div className="px-4 md:py-6 sm:px-8">
                <div className="grid grid-cols-1 md:gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                  {Object.keys(adminFields).map((field, index) => (
                    <div key={index}>
                      <label
                        htmlFor={field}
                        className="block mb-2 text-gray-600 text-start"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>

                      {field === "dateOfBirth" && (
                        <input
                          id={field}
                          type="date"
                          value={adminFields[field]}
                          onChange={(e) =>
                            setAdminFields({
                              ...adminFields,
                              [field]: e.target.value,
                            })
                          }
                          className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                          placeholder="Select your birthdate"
                        />
                      )}

                      {field === "role" && (
                        <select
                          id={field}
                          value={adminFields[field]}
                          onChange={(e) =>
                            setAdminFields({
                              ...adminFields,
                              [field]: e.target.value,
                            })
                          }
                          className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        >
                          <option value="" disabled>
                            Select your role
                          </option>
                          {roles.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                              {role.roleName}
                            </option>
                          ))}
                        </select>
                      )}

                      {field === "institute" && (
                        <select
                          id={field}
                          value={adminFields[field]}
                          onChange={(e) =>
                            setAdminFields({
                              ...adminFields,
                              [field]: e.target.value,
                            })
                          }
                          className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        >
                          <option value="" disabled>
                            Select your institute
                          </option>
                          {institutions.map((institute) => (
                            <option key={institute.id} value={institute.id}>
                              {institute.name}
                            </option>
                          ))}
                        </select>
                      )}

                      {field !== "dateOfBirth" &&
                        field !== "role" &&
                        field !== "institute" && (
                          <input
                            id={field}
                            type={field === "password" ? "password" : "text"}
                            value={adminFields[field]}
                            onChange={(e) =>
                              setAdminFields({
                                ...adminFields,
                                [field]: e.target.value,
                              })
                            }
                            className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            placeholder={`Enter your ${
                              field.charAt(0).toUpperCase() + field.slice(1)
                            }`}
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                {adminError && (
                  <p className="text-red-600 font-mono">{adminError}</p>
                )}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                    onClick={handleAdminClear}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                    onClick={handleAdminSubmit}
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
          {" "}
          <ToastContainer />{" "}
        </div>
      </div>
    </QueryResult>
  );
}
