import React, { useState } from 'react';
import { createAddress, createAInstituteAdmin, createInstitute, getInstitutes, getRoleByName, getRoles } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';

export default function createUserPage() {

    const [addressError, setAddressError] = useState('');
    const [userError, setUserError] = useState('');
    const [placeOfBirthError, setPlaceOfBirthError] = useState('');
    const [disableUserSection, setDisableUserSection] = useState(true);
    const [userAddressId, setUserAddressId] = useState();
    const [userPlaceOfBirthId, setUserPlaceOfBirthId] = useState();
    const [roles, setRoles] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [userFields, setUserFields] = useState({
        email: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        gender: '',
        dateOfBirth: '',
        role: '',
        institute: ''
    });

    const [addressFields, setAddressFields] = useState({
        country: '',
        region: '',
        city: '',
        houseNumber: ''
    });

    const [placeOfBirthFields, setPlaceOfBirthFields] = useState({
        country: '',
        region: '',
        city: '',
        houseNumber: ''
    });

    const { isError, data, error, isFetching } = useQuery(
        ['getRoleByName', 'getInstitutes'],
        async () => {
            try {
                const roleData = await getRoleByName({ name: 'user' });
                if (roleData) {
                    const roles = {
                        roleName: roleData.data.role_name,
                        roleId: roleData.data.id
                    }
                    userFields.role = roleData.data.id;
                    setRoles(roles);
                }

                const instituteData = await getInstitutes({ pageNumber: 1, pageSize: 10 });
                if (instituteData) {
                    const instituteNames = Object.values(instituteData.data.institute).map(
                        institute => ({
                            name: institute.name,
                            id: institute.id,
                        }));
                    userFields.institute = instituteData.data.institute[0].id;
                    setInstitutions(instituteNames);
                }
            } catch (error) {
                console.error(error);
            }
        }
    );


    const clearUserFields = () => {
        setUserFields({
            firstName: '',
            middleName: '',
            lastName: '',
            phoneNumber: '',
            password: '',
            gender: '',
            dateOfBirth: '',
            role: '',
            institute: ''
        });
    };

    const clearAddressFields = () => {
        setAddressFields({
            country: '',
            region: '',
            city: '',
            houseNumber: ''
        });
    };

    const clearPlaceOfBirthFields = () => {
        setPlaceOfBirthFields({
            country: '',
            region: '',
            city: '',
            houseNumber: ''
        });
    };

    const handleAddressClear = () => {
        clearAddressFields();
    };

    const handlePlaceOfBirthClear = () => {
        clearPlaceOfBirthFields();
    }

    const handleUserClear = () => {
        clearUserFields();
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
            setDisableUserSection(false);
            setUserAddressId(result.data.id);
            setAddressError();
            console.log('Create address result:', result.data);
        } catch (error) {
            toast.success('Error creating address!');
            console.error('Error creating address', error);
            setAddressError(error);
            setDisableUserSection(true);
        }
    };

    const handlePlaceOfBirthSubmit = async (e) => {
        e.preventDefault();
        if (!placeOfBirthFields.country || !placeOfBirthFields.region || !placeOfBirthFields.city) {
            setPlaceOfBirthError('Please fill in all required fields.');
            return;
        }
        if (!placeOfBirthFields.country) {
            throw new Error('Country is a required field.');
        }
        if (!placeOfBirthFields.region) {
            throw new Error('Region is a required field.');
        }
        if (!placeOfBirthFields.city) {
            throw new Error('City is a required field.');
        }

        try {
            const result = await createAddress(placeOfBirthFields);
            toast.success('Address saved successfully!');
            setDisableUserSection(false);
            setUserPlaceOfBirthId(result.data.id);
            setPlaceOfBirthError();
            console.log('Create address result:', result.data);
        } catch (error) {
            toast.success('Error creating address!');
            console.error('Error creating address', error);
            setPlaceOfBirthError(error);
            setDisableUserSection(true);
        }
    };





    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'password', 'gender', 'dateOfBirth', 'role', 'institute'];
        const missingFields = requiredFields.filter(field => !userFields[field]);
        if (missingFields.length > 0) {
            setUserError(`Please fill in all required fields: ${missingFields.join(', ')}`);
            toast.error("Please fill in all required fields");
            console.log(missingFields)
            return;
        }
        try {
            console.log(userFields)
            const adminData = {
                email: userFields.email,
                first_name: userFields.firstName,
                middle_name: userFields.middleName,
                last_name: userFields.lastName,
                phone_number: userFields.phoneNumber,
                password: userFields.password,
                gender: userFields.password,
                date_of_birth: userFields.dateOfBirth,
                role_id: userFields.role,
                address_id: userAddressId,
                birth_place_id: userPlaceOfBirthId,
                institute_id: userFields.institute
            };
            console.log(adminData)
            const result = await createAInstituteAdmin(adminData);
            toast.success('User saved successfully!');
            setUserError();
            clearUserFields();
        } catch (error) {
            toast.error('Error saving user!');
            setUserError('Error saving user!');
            console.error('Error saving user', error);
        }
    };



    return (
        <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 font-mono">Address Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 font-mono">Please provide updated and accurate address information of the User</p>
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
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-100 font-mono" onClick={handleAddressClear}>
                            Clear
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                            onClick={handleAddressSubmit}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 font-mono">User Place Of Birth Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 font-mono">Please provide updated and accurate place of birth information of the User</p>
                </div>

                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                            {Object.keys(placeOfBirthFields).map((field, index) => (
                                <div key={index}>
                                    <label htmlFor={field} className="block text-sm font-medium leading-5 text-gray-900">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        id={field}
                                        type={field === 'password' ? 'password' : 'text'}
                                        value={placeOfBirthFields[field]}
                                        onChange={(e) => setPlaceOfBirthFields({ ...placeOfBirthFields, [field]: e.target.value })}
                                        className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        {placeOfBirthError && <p className="text-red-600 font-mono">{placeOfBirthError}</p>}
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-100 font-mono" onClick={handlePlaceOfBirthClear}>
                            Clear
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                            onClick={handlePlaceOfBirthSubmit}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
                <div className="px-4 sm:px-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900 font-mono">User Information</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 font-mono">Please make sure every input is correct and accurately describes the User.</p>
                </div>
                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                            {Object.keys(userFields).map((field, index) => (
                                <div key={index}>
                                    <label htmlFor={field} className="block text-sm font-medium leading-5 text-gray-900">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    {field === 'dateOfBirth' && (
                                        <input
                                            id={field}
                                            type="date"
                                            value={userFields[field]}
                                            onChange={(e) => setUserFields({ ...userFields, [field]: e.target.value })}
                                            className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                        />
                                    )}
                                    {field === 'role' && (
                                        <select
                                            id={field}
                                            value='user'
                                            onChange={(e) => setUserFields({ ...userFields, [field]: e.target.value })}
                                            className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                        >

                                            <option key={roles.roleId} value={roles.roleId}>
                                                {roles.roleName}
                                            </option>

                                        </select>
                                    )}
                                    {field === 'institute' && (
                                        <select
                                            id={field}
                                            value={userFields[field]}
                                            onChange={(e) => setUserFields({ ...userFields, [field]: e.target.value })}
                                            className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                        >
                                            {institutions.map((institute) => (
                                                <option key={institute.id} value={institute.id}>
                                                    {institute.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {(field !== 'dateOfBirth' && field !== 'role' && field !== 'institute') && (
                                        <input
                                            id={field}
                                            type={field === 'password' ? 'password' : 'text'}
                                            value={userFields[field]}
                                            onChange={(e) => setUserFields({ ...userFields, [field]: e.target.value })}
                                            className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        {userError && <p className="text-red-600 font-mono">{userError}</p>}

                        <button type="button" className="text-sm font-semibold leading-6 text-gray-100 font-mono" onClick={handleUserClear}>
                            Clear
                        </button>
                        <button type="button" className="font-mono rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleUserSubmit} >
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
