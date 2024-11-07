import React, { useEffect, useState } from "react";
import {
  createAddress,
  createAInstituteAdmin,
  createInstitute,
  getAddressById,
  getInstitutes,
  getRoles,
  updateAddress,
  updateAdmin,
} from "src/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "react-query";

export default function EditAdmin({ admin }) {
  console.log(admin);
  const [addressError, setAddressError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [placeOfBirthError, setPlaceOfBirthError] = useState("");
  const [disableAdminSection, setDisableAdminSection] = useState(true);
  const [adminAddressId, setAdminAddressId] = useState();
  const [adminPlaceOfBirthId, setAdminPlaceOfBirthId] = useState();
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [addressData, setAddressData] = useState(null);
  const [birthAddressData, setBirthAddressData] = useState(null);

  const [adminFields, setAdminFields] = useState({
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

  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    house_number: "",
  });

  const [placeOfBirthFields, setPlaceOfBirthFields] = useState({
    country: "",
    region: "",
    city: "",
    house_number: "",
  });

  const { isError, data, error, isFetching } = useQuery(
    ["getAddressById", "getRoles", "getInstitutes"],
    async () => {
      try {
        const addressId = admin.address_id;
        const birthAddressId = admin.birth_place_id;

        console.log(addressId);
        console.log(birthAddressId);
        const addressData = await getAddressById(addressId);
        setAddressData(addressData);

        const birthAddressData = await getAddressById(birthAddressId);
        setBirthAddressData(birthAddressData);

        const roleData = await getRoles({ pageNumber: 0, pageSize: 20 });
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
          setInstitutions(instituteNames);
        }
      } catch (error) {
        console.error(error);
      }
    }
  );

  useEffect(() => {
    if (!isFetching && !isError && addressData && birthAddressData) {
      const addressDataDetail = addressData.data;
      const birthAddressDataDetail = birthAddressData.data;
      console.log(addressDataDetail);
      console.log(birthAddressDataDetail);
      setAddressFields((prevState) => ({
        ...prevState,
        country: addressDataDetail.country || "",
        region: addressDataDetail.region || "",
        city: addressDataDetail.city || "",
        house_number: addressDataDetail.house_number || "",
      }));

      setPlaceOfBirthFields((prevState) => ({
        ...prevState,
        country: birthAddressDataDetail.country || "",
        region: birthAddressDataDetail.region || "",
        city: birthAddressDataDetail.city || "",
        house_number: birthAddressDataDetail.house_number || "",
      }));

      const dateObject = new Date(admin.date_of_birth);

      const year = dateObject.getUTCFullYear();
      const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getUTCDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setAdminFields((prevState) => ({
        ...prevState,
        email: admin.email || "",
        firstName: admin.first_name || "",
        middleName: admin.middle_name || "",
        lastName: admin.last_name || "",
        phoneNumber: admin.phone_number || "",
        password: admin.password || "",
        gender: admin.gender || "",
        dateOfBirth: formattedDate || "",
        role: admin.role_id || "",
        institute: admin.institute_id || "",
      }));
    }
  }, [isFetching, isError, data, addressData, birthAddressData]);

  const clearAdminFields = () => {
    const dateObject = new Date(admin.date_of_birth);

    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setAdminFields((prevState) => ({
      ...prevState,
      email: admin.email || "",
      firstName: admin.first_name || "",
      middleName: admin.middle_name || "",
      lastName: admin.last_name || "",
      phoneNumber: admin.phone_number || "",
      password: admin.password || "",
      gender: admin.gender || "",
      dateOfBirth: formattedDate || "",
      role: admin.role_id || "",
      institute: admin.institute || "",
    }));
  };

  const clearAddressFields = () => {
    const addressDataDetail = addressData.data;
    setAddressFields((prevState) => ({
      ...prevState,
      country: addressDataDetail.country || "",
      region: addressDataDetail.region || "",
      city: addressDataDetail.city || "",
      house_number: addressDataDetail.house_number || "",
    }));
  };

  const clearPlaceOfBirthFields = () => {
    const birthAddressDataDetail = birthAddressData.data;

    setPlaceOfBirthFields((prevState) => ({
      ...prevState,
      country: birthAddressDataDetail.country || "",
      region: birthAddressDataDetail.region || "",
      city: birthAddressDataDetail.city || "",
      house_number: birthAddressDataDetail.house_number || "",
    }));
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

    addressFields.id = admin.address_id;
    console.log(addressFields);
    try {
      const result = await updateAddress(addressFields);
      toast.success("Address updated successfully!");
      setCurrentChild(1);
      setAddressError();
      console.log("Update address result:", result.data);
    } catch (error) {
      toast.success("Error updating address!");
      console.error("Error updating address", error);
      setAddressError(error);
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

    placeOfBirthFields.id = admin.birth_place_id;
    console.log(placeOfBirthFields);
    try {
      const result = await updateAddress(placeOfBirthFields);
      toast.success("Address updated successfully!");
      setCurrentChild(2);
      setAddressError();
      console.log("Update address result:", result.data);
    } catch (error) {
      toast.success("Error updating address!");
      console.error("Error updating address", error);
      setAddressError(error);
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
        gender: adminFields.gender,
        date_of_birth: adminFields.dateOfBirth,
        role_id: adminFields.role,
        address_id: admin.address_id,
        birth_place_id: admin.birth_place_id,
        id: admin.id,
        institute_id: adminFields.institute,
      };
      console.log(adminData);
      const result = await updateAdmin(adminData);
      toast.success("Admin saved successfully!");
      setCurrentChild(0);
      setAdminError();
    } catch (error) {
      toast.error("Error saving admin!");
      setAdminError("Error saving admin!");
      console.error("Error saving admin", error);
    }
  };
  const [currentChild, setCurrentChild] = useState(2);
  return (
    <div className="relative flex items-center justify-center m-auto  w-[100%] min-h-screen ">
      <div className="relative w-full xl:w-[70vw] h-full flex items-center justify-center    ">
        {/* First Form */}
        <div
          className={`relative transition-all  duration-1000 ease-in-out flex items-center justify-center m-auto ${
            currentChild === 0
              ? "transform translate-x-0 opacity-100 z-50  w-full"
              : "transform translate-x-full opacity-0 hidden z-0"
          }`}
        >
          <div className="w-[100%] 2xl:w-[60%]">
            <form className="bg-white  p-4 px-3 sm:w-full  sm:p-6 shadow-sm rounded-xl font-serif border">
              <h1 className="text-2xl text-center text-gray-800 font-serif mb-2">
                Address Information
              </h1>
              <div className="px-4 py-6 sm:p-8 flex items-center justify-center">
                <div className="grid max-w-2xl  gap-x-6 gap-y-2 xl:gap-y-2 ">
                  <div className="sm:col-span-3 w-80 mb-2">
                    <div className="mt-2">
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
                  <div className="sm:col-span-3 w-80 mb-2">
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
                        required
                        value={addressFields.region}
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
                  <div className="sm:col-span-6 mb-2">
                    <label
                      htmlFor="city"
                      className="block mb-2 text-gray-600 text-start"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      {" "}
                      <input
                        type="text"
                        name="city"
                        id="city"
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
                  <div className="sm:col-span-6 mb-2">
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
                      value={addressFields.house_number}
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          house_number: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                    />
                  </div>{" "}
                  <div className="sm:col-span-6 ">
                    {addressError && (
                      <p className="text-red-600 font-mono">{addressError}</p>
                    )}
                    <div className="flex space-x-4 mt-2">
                      {" "}
                      <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                        onClick={handleAddressClear}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-serif"
                        onClick={handleAddressSubmit}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </form>
          </div>
        </div>

        <div
          className={`relative  w-full   transition-all duration-1000 ease-in-out h-[90vh] flex items-center justify-center  ${
            currentChild === 1
              ? "transform translate-y-0 opacity-100 z-50"
              : "transform translate-y-full hidden opacity-0 z-0"
          }`}
        >
          {/* Admin Place Of Birth Information Form Component */}
          <div className="w-[100%] xl:w-[60%] ">
            <form className="bg-white sm:w-full sm:p-6 shadow-sm rounded-xl font-serif border">
              <h1 className="text-2xl mt-4 text-center text-gray-800 font-serif mb-2">
                Admin Place Of Birth Information
              </h1>
              <div className="px-4 xl:py-6 p-4 sm:p-8">
                <div className="grid grid-cols-1  xl:gap-y-6 gap-y-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                  <div className="mb-2">
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
                      required
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
                  <div className="mb-2">
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
                      required
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
                  <div className="mb-2">
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
                      required
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
                  <div className="mb-4">
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
                      value={placeOfBirthFields.house_number}
                      onChange={(e) =>
                        setPlaceOfBirthFields({
                          ...placeOfBirthFields,
                          house_number: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  "
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
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
                    Reset
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                    onClick={handlePlaceOfBirthSubmit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Admin Information Form Component */}
        <div
          className={`absolute flex items-center justify-center m-auto w-96 sm:w-full transition-all duration-1000 ease-in-out${
            currentChild === 2
              ? "transform translate-x-0 opacity-100 z-50"
              : "transform translate-x-full opacity-0 hidden z-0"
          }`}
        >
          <div className="w-[90%] xl:w-[60%]  ">
            <form className="bg-white border py-4 px-2 lg:px-4 shadow-sm ring-1 ring-gray-900/5 rounded-xl font-serif mx-auto ">
              <h1 className="text-2xl text-center text-gray-800 font-serif md:mb-4 mt-3">
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
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row  items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                {adminError && (
                  <p className="text-red-600 font-mono line-clamp-2">
                    {adminError}
                  </p>
                )}
                <div className="flex space-x-4 mt-3">
                  {" "}
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                    onClick={handleAdminClear}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                    onClick={handleAdminSubmit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
