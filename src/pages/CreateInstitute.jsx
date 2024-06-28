import React, { useState } from 'react';
import { createAddress, createInstitute } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateInstitutionPage() {

    const [addressError, setAddressError] = useState('');
    const [instituteError, setInstituteError] = useState('');
    const [instituteAddressId, setInstituteAddressId] = useState(null);
    const [disableInstitutionSection, setDisableInstitutionSection] = useState(true);

    const [instituteTypes, setInstituteTypes] = useState(['University','College','TVET']);
    
    const [addressFields, setAddressFields] = useState({
        country: '',
        region: '',
        city: '',
        houseNumber: ''
    });

    const [instituteFields, setInstituteFields] = useState({
        instituteName: '',
        instituteStartingYear: '',
        instituteDescription: '',
        website: '',
        type: '',
        accreditations: '',
        number_of_students: '',
        number_of_alumni: '',
        president_name: '',
        email: '',
        phone: '',
        twitter: '',
        linkedin: '',
        telegram: '',
        facebook: ''
    });

    const clearAddressFields = () => {
        setAddressFields({
            country: '',
            region: '',
            city: '',
            houseNumber: ''
        });
    };

    const clearInstituteFields = () => {
        setInstituteFields({
            instituteName: '',
            instituteStartingYear: '',
            instituteDescription: '',
            email: '',
            phone: '',
            twitter: '',
            linkedin: '',
            telegram: '',
            facebook: ''
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

        try {
            const result = await createAddress(addressFields);
            toast.success('Address saved successfully!');
            setDisableInstitutionSection(false);
            setInstituteAddressId(result.data.id);
            setAddressError();
            console.log('Create address result:', result.data);
        } catch (error) {
            toast.success('Error creating address!');
            console.error('Error creating address', error);
            setAddressError(error);
            setDisableInstitutionSection(true);
        }
    };

    const handleInstituteSubmit = async (e) => {
        e.preventDefault();
        if (!instituteFields.instituteName || !instituteFields.instituteStartingYear || !instituteFields.instituteDescription) {
            setInstituteError('Please fill in all required fields!');
            return;
        }
        if (!instituteAddressId) {
            setInstituteError('Please Fill And Save Address First!');
            return;
        }
        if (!instituteFields.instituteName) {
            throw new Error('Institute name is a required field.');
        }
        if (!instituteFields.instituteStartingYear) {
            throw new Error('Institute starting year is a required field.');
        }
        if (!instituteFields.instituteDescription) {
            throw new Error('Institute description is a required field.');
        }

        if (!instituteAddressId) {
            throw new Error('Please Fill And Save Address First.');
        }

        const instituteContactInfo = {
            telegram: "telegram:" + instituteFields.telegram,
            twitter: "twitter:" + instituteFields.twitter,
            facebook: "facebook:" + instituteFields.facebook
        };


        const contactInfo = Object.values(instituteContactInfo)
            .filter(value => value && value !== '')
            .join(', ');


        console.log(instituteFields)
        const institute = {
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
            address_id: instituteAddressId,
            starting_year: instituteFields.instituteStartingYear,
            contact_info: contactInfo
        };

        try {
            const result = await createInstitute(institute);
            toast.success('Institute saved successfully!');
            setInstituteAddressId();
            setInstituteError();
            handleInstituteClear();
            handleAddressClear();
            console.log('Create institute result:', result.data);
        } catch (error) {
            toast.success('Error creating institute!');
            console.error('Error creating institute!', error);
            setInstituteError(error);

        }
    };



    return (
        <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Address Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Please provide updated and accurate address information of the institute</p>
                </div>

                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
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
                                        value={addressFields.houseNumber}
                                        onChange={(e) => setAddressFields({ ...addressFields, houseNumber: e.target.value })}
                                        className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        {addressError && <p className="text-red-600 font-mono">{addressError}</p>}
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-100" onClick={handleAddressClear}>
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

            <div>
                <ToastContainer />
            </div>
        </div>
    );
}
