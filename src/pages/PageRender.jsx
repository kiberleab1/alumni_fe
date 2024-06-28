import React, { useEffect, useState } from 'react';

import Admins from './Admins';
import CreateAdmin from './createAdmin';

import RolePage from './Role';
import InstitutionsPage from './Institutions';
import DepartmentPage from './Departments';
import CreateInstitutionPage from './CreateInstitute';
import EditInstitute from './EditInstitute';
import EditAdmin from './EditAdmin';
import Users from './Users';
import createUserPage from './CreateUser';
import EditUser from './EditUser';
import CreateDepartment from './CreateDepartment';
import EditDepartment from './EditDepartment';
import EventsPage from './EventsPage';
import NewsPage from './NewsPage';
import CreateNews from './CreateNews';
import EditNews from './EditNews';
import CreateEvents from './CreateEvents';
import EditEvents from './EditEvents';

const componentsMap = {
    Dashboard: CreateAdmin,
    Admins: Admins,
    'Create Admin': CreateAdmin,
    'Edit Admin': EditAdmin,
    Institutions: InstitutionsPage,
    'Create Institute': CreateInstitutionPage,
    'Edit Institute': EditInstitute,
    Users: Users,
    'Create User': createUserPage,
    'Edit User': EditUser,
    Roles: RolePage,
    Events: EventsPage,
    'Create Event': CreateEvents,
    'Edit Event': EditEvents,
    News: NewsPage,
    'Create News': CreateNews,
    'Edit News': EditNews,
    Email: RolePage,
    Departments: DepartmentPage,
    "Create Department": CreateDepartment,
    "Edit Department": EditDepartment,
};

export default function ComponentRender({ page, onPageSet }) {
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selecteduser, setSelectedUser] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedNews, setSelectedNews] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const ComponentToRender = componentsMap[page] || (() => <div>Page not found</div>);
    return <ComponentToRender
        onAddAdminClick={() => onPageSet('Create Admin')}
        onCreateInstituteClick={() => onPageSet('Create Institute')}
        onCreateUserClick={() => onPageSet('Create User')}
        onCreateDepartmentClick={() => onPageSet('Create Department')}
        onCreateNewsClick={() => onPageSet('Create News')}
        onCreateEventClick={() => onPageSet('Create Event')}
        onInstituteEditClick={(institute) => { setSelectedInstitute(institute); onPageSet('Edit Institute'); }}
        onAdminEditClick={(admin) => { setSelectedAdmin(admin); onPageSet('Edit Admin'); }}
        onUserEditClick={(user) => { setSelectedUser(user); onPageSet('Edit User'); }}
        onDepartmentEditClick={(department) => { setSelectedDepartment(department); onPageSet('Edit Department'); }}
        onNewsEditClick={(news) => {setSelectedNews(news); onPageSet('Edit News');}}
        onEditEventClick={(event) => {setSelectedEvent(event); onPageSet('Edit Event');}}
        institute={selectedInstitute}
        admin={selectedAdmin}
        user={selecteduser}
        department={selectedDepartment}
        news={selectedNews}
        event={selectedEvent}
    />;
}
