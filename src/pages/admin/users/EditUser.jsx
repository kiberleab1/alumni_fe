import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAddressById,
  getInstitutes,
  getRoleByName,
  updateAddress,
  updateAdmin,
} from "src/api";

export default function EditUser({ user }) {
  console.log(user);
  const [addressError, setAddressError] = useState("");
  const [userError, setUserError] = useState("");
  const [placeOfBirthError, setPlaceOfBirthError] = useState("");
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [addressData, setAddressData] = useState(null);
  const [birthAddressData, setBirthAddressData] = useState(null);

  const [userFields, setUserFields] = useState({
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

  const { isError, data, isFetching } = useQuery(
    ["getAddressById", "getRoleByName", "getInstitutes"],
    async () => {
      try {
        const addressId = user.address_id;
        const birthAddressId = user.birth_place_id;

        console.log(addressId);
        console.log(birthAddressId);
        const addressData = await getAddressById(addressId);
        setAddressData(addressData);

        const birthAddressData = await getAddressById(birthAddressId);
        setBirthAddressData(birthAddressData);

        const roleData = await getRoleByName({ name: "alumni" });
        if (roleData) {
          const roles = {
            roleName: roleData.data.role_name,
            roleId: roleData.data.id,
          };
          userFields.role = roleData.data.id;
          // @ts-ignore
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

      const dateObject = new Date(user.date_of_birth);

      const year = dateObject.getUTCFullYear();
      const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getUTCDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setUserFields((prevState) => ({
        ...prevState,
        email: user.email || "",
        firstName: user.first_name || "",
        middleName: user.middle_name || "",
        lastName: user.last_name || "",
        phoneNumber: user.phone_number || "",
        password: user.password || "",
        gender: user.gender || "",
        dateOfBirth: formattedDate || "",
        role: user.role_id || "",
        institute: user.institute_id || "",
      }));
    }
  }, [isFetching, isError, data, addressData, birthAddressData]);

  const clearUserFields = () => {
    const dateObject = new Date(user.date_of_birth);

    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setUserFields((prevState) => ({
      ...prevState,
      email: user.email || "",
      firstName: user.first_name || "",
      middleName: user.middle_name || "",
      lastName: user.last_name || "",
      phoneNumber: user.phone_number || "",
      password: user.password || "",
      gender: user.gender || "",
      dateOfBirth: formattedDate || "",
      role: user.role_id || "",
      institute: user.institute || "",
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

  const handleUserClear = () => {
    clearUserFields();
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

    // @ts-ignore
    addressFields.id = user.address_id;
    console.log(addressFields);
    try {
      const result = await updateAddress(addressFields);
      toast.success("Address updated successfully!");
      // @ts-ignore
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

    // @ts-ignore
    placeOfBirthFields.id = user.birth_place_id;
    console.log(placeOfBirthFields);
    try {
      const result = await updateAddress(placeOfBirthFields);
      toast.success("Address updated successfully!");
      // @ts-ignore
      setAddressError();
      console.log("Update address result:", result.data);
    } catch (error) {
      toast.success("Error updating address!");
      console.error("Error updating address", error);
      setAddressError(error);
    }
  };

  const handleUserSubmit = async (e) => {
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
    const missingFields = requiredFields.filter((field) => !userFields[field]);
    if (missingFields.length > 0) {
      setUserError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      console.log(userFields);
      const userData = {
        email: userFields.email,
        first_name: userFields.firstName,
        middle_name: userFields.middleName,
        last_name: userFields.lastName,
        phone_number: userFields.phoneNumber,
        password: userFields.password,
        gender: userFields.gender,
        date_of_birth: userFields.dateOfBirth,
        role_id: userFields.role,
        address_id: user.address_id,
        birth_place_id: user.birth_place_id,
        id: user.id,
        institute_id: userFields.institute,
      };
      console.log(userData);
      // @ts-ignore
      await updateAdmin(userData);
      toast.success("User saved successfully!");
      // @ts-ignore
      setUserError();
    } catch (error) {
      toast.error("Error saving user!");
      setUserError("Error saving user!");
      console.error("Error saving user", error);
    }
  };

  return (
    <div className="flex flex-wrap">
      {/* Address Information Form Component */}
      <div className="w-full md:w-1/4 ml-4 mr-5">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900 font-mono">
            Address Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 font-mono">
            Please provide updated and accurate address information of the User
          </p>
        </div>
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="max-w-2xl">
              <div className="mb-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={addressFields.city}
                  onChange={(e) =>
                    setAddressFields({ ...addressFields, city: e.target.value })
                  }
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="house-number"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {addressError && (
              <p className="text-red-600 font-mono">{addressError}</p>
            )}
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100 font-mono"
              onClick={handleAddressClear}
            >
              Reset
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
              onClick={handleAddressSubmit}
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* User Place Of Birth Information Form Component */}
      <div className="w-full md:w-1/4 mr-10">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900 font-mono">
            User Place Of Birth Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 font-mono">
            Please provide updated and accurate place of birth information of
            the user
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="max-w-2xl">
              <div className="mb-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="house-number"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {placeOfBirthError && (
              <p className="text-red-600 font-mono">{placeOfBirthError}</p>
            )}
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100 font-mono"
              onClick={handlePlaceOfBirthClear}
            >
              Reset
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
              onClick={handlePlaceOfBirthSubmit}
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* User Information Form Component */}
      <div className="w-full md:w-2/5">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900 font-mono">
            User Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 font-mono">
            Please make sure every input is correct and accurately describes the
            user.
          </p>
        </div>
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
              {Object.keys(userFields).map((field, index) => (
                <div key={index}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium leading-5 text-gray-900"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "dateOfBirth" && (
                    <input
                      id={field}
                      type="date"
                      value={userFields[field]}
                      onChange={(e) =>
                        setUserFields({
                          ...userFields,
                          [field]: e.target.value,
                        })
                      }
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                    />
                  )}
                  {field === "role" && (
                    <select
                      id={field}
                      value={userFields[field]}
                      onChange={(e) =>
                        setUserFields({
                          ...userFields,
                          [field]: e.target.value,
                        })
                      }
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                    >
                      {roles.map((role) => {
                        return (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {field === "institute" && (
                    <select
                      id={field}
                      value={userFields[field]}
                      onChange={(e) =>
                        setUserFields({
                          ...userFields,
                          [field]: e.target.value,
                        })
                      }
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
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
                        value={userFields[field]}
                        onChange={(e) =>
                          setUserFields({
                            ...userFields,
                            [field]: e.target.value,
                          })
                        }
                        className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                      />
                    )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {userError && <p className="text-red-600 font-mono">{userError}</p>}

            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100 font-mono"
              onClick={handleUserClear}
            >
              Reset
            </button>
            <button
              type="button"
              className="font-mono rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleUserSubmit}
            >
              Update
            </button>
          </div>
        </form>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
