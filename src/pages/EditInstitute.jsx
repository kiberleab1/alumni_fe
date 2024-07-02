import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAddressById, updateAddress, updateInstitute } from "../api";
import { ToastContainer, toast } from 'react-toastify';
import { ChatBubbleLeftIcon, EnvelopeIcon, LinkIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function EditInstitute({ institute }) {
    const [addressError, setAddressError] = useState(null);
    const [instituteError, setInstituteError] = useState(null);
    const [instituteTypes, setInstituteTypes] = useState(['University', 'College', 'TVET']);

    const [addressFields, setAddressFields] = useState({
        country: "",
        region: "",
        city: "",
        houseNumber: ""
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
        facebook: ""
    });
    const [disableInstitutionSection, setDisableInstitutionSection] = useState(false);

    const addressId = institute.address_id;
    const { isError, data, error, isFetching } = useQuery(
        'getAddressById',
        async () => {
            return await getAddressById(addressId);
        }
    );

    const dataArray = institute.contact_info.split(", ");
    let contactInformation = {};
    dataArray.forEach(item => {
        const [key, value] = item.split(":");
        contactInformation[key.trim()] = value.trim();
    });

    const dateObject = new Date(institute.starting_year);

    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;


    useEffect(() => {
        if (!isFetching && !isError && data) {
            const addressData = data.data;
            setAddressFields(prevState => ({
                ...prevState,
                country: addressData.country || "",
                region: addressData.region || "",
                city: addressData.city || "",
                house_number: addressData.house_number || ""
            }));

            setInstituteFields(prevState => ({
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
                facebook: contactInformation.facebook || ""
            }));
        }
    }, [isFetching, isError, data]);

    const handleAddressClear = () => {
        setAddressFields({
            country: "",
            region: "",
            city: "",
            houseNumber: ""
        });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        if (!addressFields.country || !addressFields.region || !addressFields.city) {
            setAddressError('Please fill in all required fields.');
            return;
        }
        if (!addressFields.country) {
            throw new Error('Country is a required field.');
        }
        if (!addressFields.region) {
            throw new Error('Region is a required field.');
        }
        if (!addressFields.city) {
            throw new Error('City is a required field.');
        }

        addressFields.id = institute.address_id;
        console.log(addressFields)
        try {
            const result = await updateAddress(addressFields);
            toast.success('Address updated successfully!');
            setAddressError();
            console.log('Update address result:', result.data);
        } catch (error) {
            toast.success('Error updating address!');
            console.error('Error updating address', error);
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
            facebook: ""
        });
    };

    const handleInstituteSubmit = async (e) => {
        e.preventDefault();

        const instituteContactInfo = {
            email: "email:" + instituteFields.email,
            phone: "phone:" + instituteFields.phone,
            telegram: "telegram:" + instituteFields.telegram,
            twitter: "twitter:" + instituteFields.twitter,
            facebook: "facebook:" + instituteFields.facebook
        };


        const contactInfo = Object.values(instituteContactInfo)
            .filter(value => value && value !== '')
            .join(', ');

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
        console.log(instituteData)
        try {
            const result = await updateInstitute(instituteData);
            toast.success('Institute updated successfully!');
            setInstituteError();
            console.log('Update Institute result:', result.data);
        } catch (error) {
            toast.success('Error updating Institute!');
            console.error('Error updating Institute', error);
            setInstituteError(error);
        }
    }

    if (isFetching) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
                <div className="px-4 sm:px-0 flex-1">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Address Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Please provide updated and accurate address information of the institute</p>
                    </div>
                    <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl mt-4">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        Country
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="country"
                                            id="country"
                                            required
                                            value={addressFields.country}
                                            onChange={(e) => setAddressFields({ ...addressFields, country: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                        Region
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="region"
                                            id="region"
                                            required
                                            value={addressFields.region}
                                            onChange={(e) => setAddressFields({ ...addressFields, region: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                        City
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            required
                                            value={addressFields.city}
                                            onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label htmlFor="house-number" className="block text-sm font-medium leading-6 text-gray-900">
                                        House Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="house-number"
                                            id="house-number"
                                            value={addressFields.house_number}
                                            onChange={(e) => setAddressFields({ ...addressFields, house_number: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-start gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            {addressError && <p className="text-red-600 font-mono">{addressError}</p>}
                            <button type="button" className="text-sm font-semibold leading-6 text-gray-100" onClick={handleAddressClear}>
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
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Institute Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Please make sure every input is correct and accurately describes the institute.</p>
                    </div>
                    <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="institute-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="institute-name"
                                            id="institute-name"
                                            required
                                            value={instituteFields.instituteName}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, instituteName: e.target.value })}
                                            autoComplete="institute_name"
                                            placeholder="Institute Name"
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="institute-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            autoComplete="email"
                                            value={instituteFields.email}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, email: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="institute-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Phone Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            autoComplete="tel"
                                            value={instituteFields.phone}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, phone: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="institute-starting-year" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Starting Year
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            name="institute-starting-year"
                                            id="institute-starting-year"
                                            required
                                            value={instituteFields.instituteStartingYear}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, instituteStartingYear: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="institute-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute website
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="url"
                                            name="website"
                                            id="website"
                                            value={instituteFields.website}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, website: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="website Link"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="institute-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Type
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            value={instituteFields.type}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, type: e.target.value })}
                                            className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                        >
                                            {instituteTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="president_name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute President Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="president_name"
                                            id="president_name"
                                            value={instituteFields.president_name}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, president_name: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="President Name"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="number_of_students" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Number Of Students
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="number_of_students"
                                            id="number_of_students"
                                            value={instituteFields.number_of_students}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, number_of_students: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Number Of Students"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="number_of_alumni" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Number Of Alumni
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            name="number_of_alumni"
                                            id="number_of_alumni"
                                            value={instituteFields.number_of_alumni}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, number_of_alumni: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Number Of Alumni"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label htmlFor="institute-accreditations" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Accreditations
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="institute-accreditations"
                                            name="institute-accreditations"
                                            rows="3"
                                            required
                                            value={instituteFields.accreditations}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, accreditations: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label htmlFor="institute-description" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="institute-description"
                                            name="institute-description"
                                            rows="3"
                                            required
                                            value={instituteFields.instituteDescription}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, instituteDescription: e.target.value })}
                                            className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label htmlFor="institute-contact-info" className="block text-sm font-medium leading-6 text-gray-900">
                                        Institute Contact Info
                                    </label>
                                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        <input
                                            type="url"
                                            name="twitter"
                                            id="twitter"
                                            value={instituteFields.twitter}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, twitter: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Twitter Link"
                                        />
                                        <input
                                            type="url"
                                            name="linkedin"
                                            id="linkedin"
                                            value={instituteFields.linkedin}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, linkedin: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="LinkedIn Link"
                                        />
                                        <input
                                            type="url"
                                            name="telegram"
                                            id="telegram"
                                            value={instituteFields.telegram}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, telegram: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Telegram Link"
                                        />
                                        <input
                                            type="url"
                                            name="facebook"
                                            id="facebook"
                                            value={instituteFields.facebook}
                                            onChange={(e) => setInstituteFields({ ...instituteFields, facebook: e.target.value })}
                                            className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                            placeholder="Facebook Link"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                            {instituteError && <p className="text-red-600 font-mono">{instituteError}</p>}
                            <button type="button" className="text-sm font-semibold leading-6 text-gray-100" onClick={handleInstituteClear}>
                                Clear
                            </button>
                            <button
                                type="button"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={disableInstitutionSection}
                                onClick={handleInstituteSubmit}
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
