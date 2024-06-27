import  { useState } from 'react';
import { createAddress, signup } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation,  } from 'react-query';

export default function CreateAdminPage() {
  const [addressError, setAddressError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [placeOfBirthError, setPlaceOfBirthError] = useState('');
  const [, setDisableAdminSection] = useState(true);
  const [, setAdminAddressId] = useState();
  const [adminPlaceOfBirthId, setAdminPlaceOfBirthId] = useState();
  const [roles, ] = useState([]);
  const [institutions, ] = useState([]);
  const [adminFields, setAdminFields] = useState({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    role: '',
    institute: '',
  });

  const [addressFields, setAddressFields] = useState({
    country: '',
    region: '',
    city: '',
    houseNumber: '',
  });

  const [placeOfBirthFields, setPlaceOfBirthFields] = useState({
    country: '',
    region: '',
    city: '',
    houseNumber: '',
  });

  // const { isError, data, error, isFetching } = useQuery(
  //   ['getRoles', 'getInstitutes'],
  //   async () => {
  //     try {
  //       const roleData = await getRoles({ pageNumber: 0, pageSize: 10 });
  //       console.log(roleData);
  //       if (roleData) {
  //         const roles = Object.values(roleData.data.role).map((role) => ({
  //           roleName: role.role_name,
  //           roleId: role.id,
  //         }));
  //         setRoles(roles);
  //       }

  //       const instituteData = await getInstitutes({
  //         pageNumber: 0,
  //         pageSize: 10,
  //       });
  //       console.log(instituteData);
  //       if (instituteData) {
  //         const instituteNames = Object.values(
  //           instituteData.data.institute
  //         ).map((institute) => ({
  //           name: institute.name,
  //           id: institute.id,
  //         }));
  //         setInstitutions(instituteNames);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // );

  const clearAdminFields = () => {
    setAdminFields({
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      gender: '',
      dateOfBirth: '',
      role: '',
      institute: '',
    });
  };

  const clearAddressFields = () => {
    setAddressFields({
      country: '',
      region: '',
      city: '',
      houseNumber: '',
    });
  };

  const clearPlaceOfBirthFields = () => {
    setPlaceOfBirthFields({
      country: '',
      region: '',
      city: '',
      houseNumber: '',
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
      setDisableAdminSection(false);
      setAdminAddressId(result.data.id);
      setAddressError();
      console.log('Create address result:', result.data);
    } catch (error) {
      toast.success('Error creating address!');
      console.error('Error creating address', error);
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
      setDisableAdminSection(false);
      setAdminPlaceOfBirthId(result.data.id);
      setPlaceOfBirthError();
      console.log('Create address result:', result.data);
    } catch (error) {
      toast.success('Error creating address!');
      console.error('Error creating address', error);
      setPlaceOfBirthError(error);
      setDisableAdminSection(true);
    }
  };
  const signUpMutate = useMutation('createUser', signup, {
    onSuccess: () => {
      toast.success('Admin saved successfully!');
      clearAdminFields();
      clearAddressFields();
      clearPlaceOfBirthFields();
      setDisableAdminSection(true);
    },
  });

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      'email',
      'firstName',
      'lastName',
      'phoneNumber',
      'password',
      'gender',
      'dateOfBirth',
      'role',
      'institute',
    ];
    const missingFields = requiredFields.filter((field) => !adminFields[field]);
    if (missingFields.length > 0) {
      setAdminError(
        `Please fill in all required fields: ${missingFields.join(', ')}`
      );
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      signUpMutate.mutate({
        email: adminFields.email,
        first_name: adminFields.firstName,
        middle_name: adminFields.middleName,
        last_name: adminFields.lastName,
        phone_number: adminFields.phoneNumber,
        password: adminFields.password,
        gender: adminFields.gender,
        date_of_birth: adminFields.dateOfBirth,
        birth_place_id: adminPlaceOfBirthId,
        role_id: adminFields.role,
        institute_id: adminFields.institute,
        address_id: adminPlaceOfBirthId,
      });
      // toast.success('Admin saved successfully!');
      // setAdminError();
      // clearAdminFields();
    } catch (error) {
      toast.error('Error saving admin!');
      setAdminError('Error saving admin!');
      console.error('Error saving admin', error);
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
            Please provide updated and accurate address information of the Admin
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
            Admin Place Of Birth Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide updated and accurate place of birth information of
            the admin
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
              {Object.keys(placeOfBirthFields).map((field, index) => (
                <div key={index}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium leading-5 text-gray-900"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    type={
                      field === 'password'
                        ? 'password'
                        : field === 'email'
                        ? 'email'
                        : 'text'
                    }
                    value={placeOfBirthFields[field]}
                    onChange={(e) =>
                      setPlaceOfBirthFields({
                        ...placeOfBirthFields,
                        [field]: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {placeOfBirthError && (
              <p className="text-red-600 font-mono">{placeOfBirthError}</p>
            )}
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100"
              onClick={handlePlaceOfBirthClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handlePlaceOfBirthSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Admin Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please make sure every input is correct and accurately describes the
            admin.
          </p>
        </div>
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
              {Object.keys(adminFields).map((field, index) => (
                <div key={index}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium leading-5 text-gray-900"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === 'dateOfBirth' && (
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
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                    />
                  )}
                  {field === 'role' && (
                    <select
                      id={field}
                      value={adminFields[field]}
                      onChange={(e) =>
                        setAdminFields({
                          ...adminFields,
                          [field]: e.target.value,
                        })
                      }
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                    >
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  )}
                  {field === 'institute' && (
                    <select
                      id={field}
                      value={adminFields[field]}
                      onChange={(e) =>
                        setAdminFields({
                          ...adminFields,
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
                  {field !== 'dateOfBirth' &&
                    field !== 'role' &&
                    field !== 'institute' && (
                      <input
                        id={field}
                        type={field === 'password' ? 'password' : 'text'}
                        value={adminFields[field]}
                        onChange={(e) =>
                          setAdminFields({
                            ...adminFields,
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
            {adminError && (
              <p className="text-red-600 font-mono">{adminError}</p>
            )}

            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100"
              onClick={handleAdminClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleAdminSubmit}
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
