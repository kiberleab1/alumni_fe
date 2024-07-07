import React, { useState } from "react";
import {
  createAddress,
  getDepartments,
  getInstitutes,
  createStaff,
} from "src/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "react-query";

export default function CreateStaff() {
  const [addressError, setAddressError] = useState("");
  const [staffError, seetStaffError] = useState("");
  const [staffAddressId, setStaffAddressId] = useState(null);
  const [disableStaffSection, setDisableStaffSection] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    houseNumber: "",
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
    ["getInstitutes", "getDepartments"],
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
      } catch (error) {
        console.error(error);
      }
    }
  );

  const clearAddressFields = () => {
    setAddressFields({
      country: "",
      region: "",
      city: "",
      houseNumber: "",
    });
  };

  const clearInstituteFields = () => {
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
      setDisableStaffSection(false);
      setStaffAddressId(result.data.id);
      setAddressError();
      console.log("Create address result:", result.data);
    } catch (error) {
      toast.success("Error creating address!");
      console.error("Error creating address", error);
      setAddressError(error);
      setDisableStaffSection(true);
    }
  };

  const handleInstituteSubmit = async (e) => {
    e.preventDefault();
    if (
      !staffFields.full_name ||
      !staffFields.title ||
      !staffFields.description
    ) {
      seetStaffError("Please fill in all required fields!");
      return;
    }
    if (!staffAddressId) {
      seetStaffError("Please Fill And Save Address First!");
      return;
    }
    if (!staffFields.full_name) {
      throw new Error("Staff name is a required field.");
    }
    if (!staffFields.title) {
      throw new Error("Staff title is a required field.");
    }
    if (!staffFields.description) {
      throw new Error("Staff description is a required field.");
    }

    if (!staffAddressId) {
      throw new Error("Please Fill And Save Address First.");
    }

    const instituteContactInfo = {
      telegram: "telegram:" + staffFields.telegram,
      twitter: "twitter:" + staffFields.twitter,
      facebook: "facebook:" + staffFields.facebook,
    };

    const contactInfo = Object.values(instituteContactInfo)
      .filter((value) => value && value !== "")
      .join(", ");

    console.log(staffFields);
    const staff = {
      full_name: staffFields.full_name,
      phone_number: staffFields.phone_number,
      email: staffFields.email,
      title: staffFields.title,
      description: staffFields.description,
      address_id: staffAddressId,
      institute_id: staffFields.institute_id,
      department_id: staffFields.department_id,
      contact_info: contactInfo,
    };

    try {
      const result = await createStaff(staff);
      toast.success("Staff saved successfully!");
      setStaffAddressId();
      seetStaffError();
      handleInstituteClear();
      handleAddressClear();
      console.log("Create staff result:", result.data);
    } catch (error) {
      toast.success("Error creating staff!");
      console.error("Error creating staff!", error);
      seetStaffError(error);
    }
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Address Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide updated and accurate address information of the staff
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
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
                    value={addressFields.houseNumber}
                    onChange={(e) =>
                      setAddressFields({
                        ...addressFields,
                        houseNumber: e.target.value,
                      })
                    }
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {addressError && (
              <p className="text-red-600 font-mono">{addressError}</p>
            )}
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100"
              onClick={handleAddressClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleAddressSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Staff Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please make sure every input is correct and accurately describes the
            staff.
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
                      setStaffFields({ ...staffFields, email: e.target.value })
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
                      setStaffFields({ ...staffFields, title: e.target.value })
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
            {staffError && (
              <p className="text-red-600 font-mono">{staffError}</p>
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
              disabled={disableStaffSection}
              onClick={handleInstituteSubmit}
            >
              Save
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
