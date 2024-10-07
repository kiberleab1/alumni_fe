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
    password: "",
    gender: "",
    dateOfBirth: "",
    role: "",
    institute: "",
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
      <div className="flex flex-col justify-center bg-red-300 items-center ">
        {/* <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3 "> */}
        <div className="">
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 font-serif ">
            <h1 className="text-2xl font- text-center text-gray-800 font-serif">
              Address Information
            </h1>{" "}
            <div className="px-4 py-6 sm:p-8 flex items-center justify-center m-auto">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Country
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      required
                      value={addressFields.country}
                      placeholder="Where do you live (country)?"
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
                <div className="sm:col-span-3">
                  <label
                    htmlFor="region"
                    className="block mb-2 text-gray-600 text-start"
                  >
                    Region
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      required
                      value={addressFields.region}
                      placeholder="Which state/region?"
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          region: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
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
                      required
                      value={addressFields.city}
                      placeholder="What city?"
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
                  <div className="mt-2">
                    <input
                      type="text"
                      name="house-number"
                      id="house-number"
                      value={addressFields.houseNumber}
                      placeholder="What's your house number?"
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          houseNumber: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>
                </div>{" "}
                <div className="sm:col-span-6 ">
                  {addressError && <p className="">{addressError}</p>}

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
                      className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                      onClick={handleAddressSubmit}
                    >
                      Save <FaArrowDown className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="">
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <h1 className="text-2xl font- text-center text-gray-800 font-serif">
              Admin Place Of Birth Information
            </h1>
            <div className="px-4 py-6 sm:p-8 flex items-center justify-center m-auto">
              {/* <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8"> */}
              <div>
                <div className="flex flex-row gap-2">
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

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            {" "}
            <h2 className="text-2xl font- text-center text-gray-800 font-serif">
              Admin Information
            </h2>
            <div className="px-4 py-6 sm:p-8">
              {/* <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8"> */}
              <div>
                {Object.keys(adminFields).map((field, index) => (
                  <div key={index} className="">
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
                        className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
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
                        className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
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
                        className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
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
                          className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
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
                {" "}
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

        <div>
          <ToastContainer />
        </div>
      </div>
    </QueryResult>
  );
}
