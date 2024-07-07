import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  getAddressById,
  updateAddress,
  updateStaff,
  getInstitutes,
  getDepartments,
} from "src/api";
import { ToastContainer, toast } from "react-toastify";
import {
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  LinkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function EditStaff({ staff }) {
  const [addressError, setAddressError] = useState(null);
  const [instituteError, setInstituteError] = useState(null);
  const [instituteTypes, setInstituteTypes] = useState([
    "University",
    "College",
    "TVET",
  ]);
  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [disableInstitutionSection, setDisableInstitutionSection] =
    useState(false);

  const addressId = staff.address_id;
  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    house_number: "",
  });

  const [staffFields, setStaffFields] = useState({
    full_name: "",
    description: "",
    institute_id: "",
    department_id: "",
    title: "",
    email: "",
    phone_number: "",
    twitter: "",
    linkedin: "",
    telegram: "",
    facebook: "",
  });

  const { isError, data, error, isFetching } = useQuery(
    ["getInstitutesDepartmentAddress"],
    async () => {
      try {
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

          staffFields.institute_id = instituteData.data.institute[0].id;
          setInstitutions(instituteNames);
        }

        const departmentData = await getDepartments({
          pageNumber: 1,
          pageSize: 10,
        });
        if (departmentData) {
          const departmentName = Object.values(
            departmentData.data.department
          ).map((department) => ({
            name: department.name,
            id: department.id,
          }));

          staffFields.department_id = departmentData.data.department[0].id;
          setDepartments(departmentName);
        }

        const addressData = await getAddressById(addressId);
        console.log(addressData);
        if (addressData) {
          setAddresses(addressData.data);
        }

        return { instituteData, departmentData, addressData };
      } catch (error) {
        console.error(error);
      }
    }
  );

  const dataArray = staff.contact_info.split(", ");
  let contactInformation = {};
  dataArray.forEach((item) => {
    const [key, value] = item.split(":");
    contactInformation[key.trim()] = value.trim();
  });

  useEffect(() => {
    if (!isFetching && !isError && data) {
      const { addressData } = data;

      setAddressFields((prevState) => ({
        ...prevState,
        country: addressData?.data?.country || "",
        region: addressData?.data?.region || "",
        city: addressData?.data?.city || "",
        house_number: addressData?.data?.house_number || "",
      }));

      setStaffFields((prevState) => ({
        ...prevState,
        full_name: staff.full_name ? staff.full_name : "",
        description: staff.description ? staff.description : "",
        institute_id: staff.institute_id ? staff.institute_id : "",
        department_id: staff.department_id ? staff.department_id : "",
        title: staff.title ? staff.title : "",
        email: staff.email ? staff.email : "",
        phone_number: staff.phone_number ? staff.phone_number : "",
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
      house_number: "",
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

    addressFields.id = staff.address_id;
    console.log(addressFields);
    try {
      const result = await updateAddress(addressFields);
      toast.success("Address updated successfully!");
      setAddressError();
      console.log("Update address result:", result.data);
    } catch (error) {
      toast.success("Error updating address!");
      console.error("Error updating address", error);
      setAddressError(error);
    }
  };

  const handleInstituteClear = () => {
    setStaffFields({
      full_name: "",
      title: "",
      description: "",
      email: "",
      phone_number: "",
      twitter: "",
      linkedin: "",
      telegram: "",
      facebook: "",
    });
  };

  const handleStaffUpdateClick = async (e) => {
    e.preventDefault();

    const instituteContactInfo = {
      telegram: "telegram:" + staffFields.telegram,
      twitter: "twitter:" + staffFields.twitter,
      facebook: "facebook:" + staffFields.facebook,
    };

    const contactInfo = Object.values(instituteContactInfo)
      .filter((value) => value && value !== "")
      .join(", ");

    staffFields.contact_info = contactInfo;

    const staffData = {
      id: staff.id,
      full_name: staffFields.full_name,
      phone_number: staffFields.phone_number,
      email: staffFields.email,
      title: staffFields.title,
      description: staffFields.description,
      address_id: staff.address_id,
      institute_id: staffFields.institute_id,
      department_id: staffFields.department_id,
      contact_info: contactInfo,
    };
    console.log(staffData);
    try {
      const result = await updateStaff(staffData);
      toast.success("Staff updated successfully!");
      setInstituteError();
      console.log("Update Staff result:", result.data);
    } catch (error) {
      toast.success("Error updating Staff!");
      console.error("Error updating Staff", error);
      setInstituteError(error);
    }
  };

  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
        <div className="px-4 sm:px-0 flex-1">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Address Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please provide updated and accurate address information of the
              staff
            </p>
          </div>
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl mt-4">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
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
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          country: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
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
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          region: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
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
                      onChange={(e) =>
                        setAddressFields({
                          ...addressFields,
                          city: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="house-number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    House Number
                  </label>
                  <div className="mt-2">
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
            </div>
            <div className="flex items-center justify-start gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              {addressError && (
                <p className="text-red-600 font-mono">{addressError}</p>
              )}
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-100"
                onClick={handleAddressClear}
              >
                Cancele
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAddressSubmit}
              >
                Update
              </button>
            </div>
          </form>
        </div>

        <div className="px-4 sm:px-0 flex-1">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Staff Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please make sure every input is correct and accurately describes
              the staff.
            </p>
          </div>
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="staff-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="staff-name"
                      id="staff-name"
                      required
                      value={staffFields.full_name}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          full_name: e.target.value,
                        })
                      }
                      autoComplete="institute_name"
                      placeholder="Staff Name"
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="staff-email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={staffFields.email}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          email: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="staff-phone_number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      autoComplete="tel"
                      value={staffFields.phone_number}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          phone_number: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={staffFields.title}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          title: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Title"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="institute_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department
                  </label>
                  <div className="mt-2">
                    <select
                      value={staffFields.institute_id}
                      onChange={(e) =>
                        setDepartmentFields({
                          ...staffFields,
                          institute_id: e.target.value,
                        })
                      }
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                    >
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="institute_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Institute
                  </label>
                  <div className="mt-2">
                    <select
                      value={staffFields.institute_id}
                      onChange={(e) =>
                        setDepartmentFields({
                          ...staffFields,
                          institute_id: e.target.value,
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
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="staff-description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Staff Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="staff-description"
                      name="staff-description"
                      rows="3"
                      required
                      value={staffFields.description}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          description: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="staff-contact-info"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Staff Contact Info
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <input
                      type="url"
                      name="twitter"
                      id="twitter"
                      value={staffFields.twitter}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          twitter: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Twitter Link"
                    />
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={staffFields.linkedin}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          linkedin: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="LinkedIn Link"
                    />
                    <input
                      type="url"
                      name="telegram"
                      id="telegram"
                      value={staffFields.telegram}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          telegram: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Telegram Link"
                    />
                    <input
                      type="url"
                      name="facebook"
                      id="facebook"
                      value={staffFields.facebook}
                      onChange={(e) =>
                        setStaffFields({
                          ...staffFields,
                          facebook: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
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
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-100"
                onClick={handleInstituteClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={disableInstitutionSection}
                onClick={handleStaffUpdateClick}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
