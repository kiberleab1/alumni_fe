import { useState } from "react";

import AdminsPage from "./Admins";
import CreateAdmin from "./createAdmin";

import RolePage from "./Role";
import InstitutionsPage from "./Institutions";
import DepartmentPage from "./Departments";
import CreateInstitutionPage from "./CreateInstitute";
import EditInstitute from "./EditInstitute";
import EditAdmin from "./EditAdmin";
import Users from "./Users";
import createUserPage from "./CreateUser";
import EditUser from "./EditUser";
import CreateDepartment from "./CreateDepartment";
import EditDepartment from "./EditDepartment";
import EventsPage from "./EventsPage";
import NewsPage from "./AdminNewsPage";
import CreateNews from "./CreateNews";
import EditNews from "./EditNews";
import CreateEvents from "./CreateEvents";
import EditEvents from "./EditEvents";
import PermissionPage from "./PermissionPage";
import JobsPage from "./JobsPage";
import CreateJob from "./CreateJob";
import EditJob from "./EditJobs";
import StaffPage from "./StaffPage";
import CreateStaff from "./CreateStaff";
import EditStaff from "./EditStaff";
import JobHistoryPage from "./JobHistoryPage";
import CreateJobHistory from "./CreateJobHistory";
import EditJobHistory from "./EditJobHistory";

const componentsMap = {
  Dashboard: CreateAdmin,
  Admins: AdminsPage,
  "Create Admin": CreateAdmin,
  "Edit Admin": EditAdmin,
  Institutions: InstitutionsPage,
  "Create Institute": CreateInstitutionPage,
  "Edit Institute": EditInstitute,
  Users: Users,
  "Create User": createUserPage,
  "Edit User": EditUser,
  Roles: RolePage,
  Events: EventsPage,
  "Create Event": CreateEvents,
  "Edit Event": EditEvents,
  News: NewsPage,
  "Create News": CreateNews,
  "Edit News": EditNews,
  Email: RolePage,
  Departments: DepartmentPage,
  "Create Department": CreateDepartment,
  "Edit Department": EditDepartment,
  Permission: PermissionPage,
  Jobs: JobsPage,
  "Create Job": CreateJob,
  "Edit Job": EditJob,
  Staff: StaffPage,
  "Create Staff": CreateStaff,
  "Edit Staff": EditStaff,
  "Jobs History": JobHistoryPage,
  "Create JobHistory": CreateJobHistory,
  "Edit JobHistory": EditJobHistory,
};

export default function ComponentRender({ page, onPageSet }) {
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selecteduser, setSelectedUser] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  // const [selectedAlumni, setSelectedAlumni] = useState(null);
  // const [
  //   selectedDocumentVerificationRequest,
  //   setSelectedDocumentVerificationRequest,
  // ] = useState(null);
  const ComponentToRender =
    componentsMap[page] || (() => <div>Page not found</div>);

  return (
    <ComponentToRender
      onAddAdminClick={() => onPageSet("Create Admin")}
      onCreateInstituteClick={() => onPageSet("Create Institute")}
      onCreateUserClick={() => onPageSet("Create User")}
      onCreateDepartmentClick={() => onPageSet("Create Department")}
      onCreateNewsClick={() => onPageSet("Create News")}
      onCreateEventClick={() => onPageSet("Create Event")}
      onCreateJobClick={() => onPageSet("Create Job")}
      onCreateStaffClick={() => onPageSet("Create Staff")}
      onCreateJobHistoryClick={() => onPageSet("Create JobHistory")}
      onInstituteEditClick={(institute) => {
        setSelectedInstitute(institute);
        onPageSet("Edit Institute");
      }}
      onAdminEditClick={(admin) => {
        setSelectedAdmin(admin);
        onPageSet("Edit Admin");
      }}
      onUserEditClick={(user) => {
        setSelectedUser(user);
        onPageSet("Edit User");
      }}
      onDepartmentEditClick={(department) => {
        setSelectedDepartment(department);
        onPageSet("Edit Department");
      }}
      onNewsEditClick={(news) => {
        setSelectedNews(news);
        onPageSet("Edit News");
      }}
      onEditEventClick={(event) => {
        setSelectedEvent(event);
        onPageSet("Edit Event");
      }}
      onEditJobClick={(job) => {
        setSelectedJob(job);
        onPageSet("Edit Job");
      }}
      onEditStaffClick={(staff) => {
        setSelectedStaff(staff);
        onPageSet("Edit Staff");
      }}
      onEditJobHistoryClick={(jobHistory) => {
        setSelectedJobHistory(jobHistory);
        onPageSet("Edit JobHistory");
      }}
      institute={selectedInstitute}
      admin={selectedAdmin}
      user={selecteduser}
      department={selectedDepartment}
      news={selectedNews}
      event={selectedEvent}
      job={selectedJob}
      staff={selectedStaff}
      jobHistory={selectedJobHistory}
    />
  );
}
