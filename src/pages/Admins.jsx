import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Table from '../components/Table/Table';

const people = [
    {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: 'Admin',
        email: 'jane.cooper@example.com',
        image: 'https://bit.ly/33HnjK0',
    },
    {
        name: 'John Doe',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: 'Tester',
        email: 'john.doe@example.com',
        image: 'https://bit.ly/3I9nL2D',
    },
    {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    },
    {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    }, {
        name: 'Veronica Lodge',
        title: 'Regional Paradigm Technician',
        institute: 'Optimization',
        role: ' Software Engineer',
        email: 'veronica.lodge@example.com',
        image: 'https://bit.ly/3vaOTe1',
    },
    // More people...
];

const headers = ['name','email','institute','title','role','status'];

const statusOptions = ['active', 'deactivated', 'pending'];

function getRandomStatus() {
    return statusOptions[Math.floor(Math.random() * statusOptions.length)];
}

const updatedPeople = people.map(person => ({
    ...person,
    status: getRandomStatus()
}));

export default function Admins() {
    return (
        <div className="flex flex-col">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">ADMINISTRATORS</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the Admins in the system including their name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add Admin
                    </button>
                </div>
            </div>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <Table data={updatedPeople} headers={headers} />
            </div>
        </div>

    );
}
