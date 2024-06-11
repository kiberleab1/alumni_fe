import React, { useEffect, useState } from 'react';

import Admins from './Admins';
import CreateAdmin from './createAdmin';

import RolePage from './Role';
import InstitutionsPage from './Institutions';
import DepartmentPage from './Departments';
import CreateInstitutionPage from './CreateInstitute';
import EditInstitute from './EditInstitute';
import EditAdmin from './EditAdmin';

const componentsMap = {
    Dashboard: CreateAdmin,
    Admins: Admins,
    'Create Admin': CreateAdmin,
    'Edit Admin': EditAdmin,
    Institutions: InstitutionsPage,
    'Create Institute': CreateInstitutionPage,
    'Edit Institute': EditInstitute,
    Users: RolePage,
    Events: RolePage,
    News: RolePage,
    Email: RolePage,
    Departments: DepartmentPage,
};

export default function ComponentRender({ page, onPageSet }) {
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const ComponentToRender = componentsMap[page] || (() => <div>Page not found</div>);
    return <ComponentToRender
        onAddAdminClick={() => onPageSet('Create Admin')}
        onCreateInstituteClick={() => onPageSet('Create Institute')}
        onInstituteEditClick={(institute) => { setSelectedInstitute(institute); onPageSet('Edit Institute'); }}
        onAdminEditClick={(admin) => { setSelectedAdmin(admin); onPageSet('Edit Admin'); }}
        institute={selectedInstitute}
        admin={selectedAdmin}
    />;
}
