import { useState } from "react";

import AdminsPage from "src/pages/admin/admins/Admins";
import CreateAdmin from "src/pages/admin/admins/createAdmin";

import DepartmentPage from "src/pages/admin/departments/Departments";
import InstitutionsPage from "src/pages/admin/institutions/Institutions";
import JobsPage from "src/pages/admin/jobs/JobsPage";
import NewsPage from "src/pages/admin/news/AdminNewsPage";
import CreateNews from "src/pages/admin/news/CreateNews";
import createUserPage from "src/pages/admin/users/CreateUser";
import EditAdmin from "src/pages/admin/admins/EditAdmin";
import CreateInstitutionPage from "src/pages/admin/institutions/CreateInstitute";
import CreateDepartment from "src/pages/admin/departments/CreateDepartment";
import EditDepartment from "src/pages/admin/departments/EditDepartment";
import CreateEvents from "src/pages/admin/events/CreateEvents";
import EditEvents from "src/pages/admin/events/EditEvents";
import EventsPage from "src/pages/admin/events/EventsPage";
import EditInstitute from "src/pages/admin/institutions/EditInstitute";
import CreateJob from "src/pages/admin/jobs/CreateJob";
import CreateJobHistory from "src/pages/admin/jobs/CreateJobHistory";
import EditJobHistory from "src/pages/admin/jobs/EditJobHistory";
import EditJob from "src/pages/admin/jobs/EditJobs";
import JobHistoryPage from "src/pages/admin/jobs/JobHistoryPage";
import EditNews from "src/pages/admin/news/EditNews";
import CreateStaff from "src/pages/admin/staff/CreateStaff";
import EditStaff from "src/pages/admin/staff/EditStaff";
import StaffPage from "src/pages/admin/staff/StaffPage";
import EditUser from "src/pages/admin/users/EditUser";
import Users from "src/pages/admin/users/Users";
import PermissionPage from "src/pages/PermissionPage";
import RolePage from "src/pages/Role";
import CreateWebContent from "./admin/webcontent/aboutus/AboutUsPage";
import CreateSlideShowPage from "./admin/webcontent/slideshow/CreateSlideShowPage";
import CreateGallaryPage from "./admin/webcontent/gallary/CreateGallaryPage";
import AlumniPage from "./admin/alumni/AlumniPage";
import DocumentVerificationPage from "./admin/documentVerification/DocumentVerificationPage";
import ComposeEmail from "./admin/emails/compose";
import SettingsPage from "./admin/settings/settings";
import CreateOurStoryForm from "./admin/webcontent/CreateOurStoryPage";
import PodcastPage from "./admin/podcast/ListPodcat";
import CreatePodcastComp from "./admin/podcast/podcast";
import AdminTestimonialPage from "./admin/webcontent/testimonial/ListTestimonial";
import CreateTestimonialComp from "./admin/webcontent/testimonial/CreateTestimonialPage";
import AdminListAboutUsPage from "./admin/webcontent/aboutus/ListAboutusPage";
import AdminListGalleryPage from "./admin/webcontent/gallary/ListGallaryPage";
import AdminListSlideShowPage from "./admin/webcontent/slideshow/ListSlideShowPage";
import AdminListMissionPage from "./admin/webcontent/mission/ListMisssionsPage";
import CreateMissionContent from "./admin/webcontent/mission/CreateMissionPage";
import AdminListVisionPage from "./admin/webcontent/vission/ListVisionsPage";
import CreateVisionContent from "./admin/webcontent/vission/CreatevisionPage";

const componentsMap = {
  Dashboard: AdminsPage,
  Settings: SettingsPage,
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
  Email: ComposeEmail,
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
  Alumni: AlumniPage,
  "Document Verification": DocumentVerificationPage,
  "Create About us": CreateWebContent,
  "Create Slide Show": CreateSlideShowPage,
  "Create Gallery Show": CreateGallaryPage,
  "Create Our Story Page": CreateOurStoryForm,
  Podcast: PodcastPage,
  "Create Podcast": CreatePodcastComp,
  "Manage Testimony": AdminTestimonialPage,
  "Manage About us": AdminListAboutUsPage,
  "Manage Gallery": AdminListGalleryPage,
  "Manage SlideShow": AdminListSlideShowPage,
  "Create Testimony": CreateTestimonialComp,
  "Manage Mission": AdminListMissionPage,
  "Create Mission": CreateMissionContent,
  "Manage Vision": AdminListVisionPage,
  "Create Vision": CreateVisionContent,
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
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [args, setArgs] = useState(null);
  const [
    selectedDocumentVerificationRequest,
    setSelectedDocumentVerificationRequest,
  ] = useState(null);
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
      onCreateAlumniClick={() => onPageSet("Create Alumni")}
      onCreateDocumentVerificationClick={() =>
        onPageSet("Create Document Verification")
      }
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
      onEditAlumniClick={(alumni) => {
        setSelectedAlumni(alumni);
        onPageSet("Edit Alumni");
      }}
      onEditDocumentVerififcationClick={(document) => {
        setSelectedDocumentVerificationRequest(document);
        onPageSet("Edit Document Verification");
      }}
      onCreatePodcastClick={() => onPageSet("Create Podcast")}
      onEditPodcastClick={(item) => {
        console.log({ item });
        setArgs(item);
        onPageSet("Create Podcast");
      }}
      onCreateTestimonyClick={() => onPageSet("Create Testimony")}
      onEditTestimonyClick={(item) => {
        console.log({ item });
        setArgs(item);
        onPageSet("Create Testimony");
      }}
      onCreateAboutUsPage={() => onPageSet("Create About us")}
      onCreateGalleryPage={() => onPageSet("Create Gallery Show")}
      onCreateSlideShowPage={() => onPageSet("Create Slide Show")}
      onCreateMissionPage={() => onPageSet("Create Mission")}
      onCreateVisionPage={() => {
        onPageSet("Create Vision");
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
      alumni={selectedAlumni}
      document={selectedDocumentVerificationRequest}
      item={args}
    />
  );
}
