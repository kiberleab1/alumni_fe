import { useEffect, useState } from "react";
import { PAGE_PARENT } from "src/helpers/role_maaping";

import { Dashboard } from "./admin/Dashboard";
import { AlumniPage, StaffForm, StaffPage, UserForm, UsersPage } from "./admin/resources/People";
import { DepartmentForm, DepartmentsPage, InstituteForm, InstitutionsPage } from "./admin/resources/Organization";
import { EventForm, EventsPage, JobHistoryForm, JobHistoryPage, JobsPage, NewsPage, PodcastForm, PodcastsPage } from "./admin/resources/Content";
import { PermissionsPage, RolesPage } from "./admin/resources/Access";
import WebContentPage from "./admin/resources/WebContent";
import CreateJob from "./admin/jobs/CreateJob";
import EditJob from "./admin/jobs/EditJobs";
import CreateNews from "./admin/news/CreateNews";
import EditNews from "./admin/news/EditNews";
import DocumentVerificationPage from "./admin/documentVerification/DocumentVerificationPage";
import MessageReportsPage from "./admin/reports/MessageReportsPage";
import ComposeEmail from "./admin/emails/compose";
import SettingsPage from "./admin/settings/settings";
import BrandingPage from "./admin/branding/BrandingPage";
import MembersPage from "./admin/platform/Members";
import InstituteSettingsPage from "./admin/platform/InstituteSettings";
import ReportsPage from "./admin/platform/Reports";
import AnnouncementsPage from "./admin/platform/Announcements";
import AuditLogPage from "./admin/platform/AuditLog";
import PlatformOverview from "./admin/platform/Overview";
import TeamPage from "./admin/platform/Team";

const componentsMap = {
  Dashboard,
  "Platform Overview": PlatformOverview,
  Members: MembersPage,
  "Institute Settings": InstituteSettingsPage,
  Reports: ReportsPage,
  Announcements: AnnouncementsPage,
  "Audit Log": AuditLogPage,
  Settings: SettingsPage,
  Branding: BrandingPage,
  Admins: TeamPage,
  Users: UsersPage,
  "Create User": UserForm,
  "Edit User": UserForm,
  Staff: StaffPage,
  "Create Staff": StaffForm,
  "Edit Staff": StaffForm,
  Alumni: AlumniPage,
  Institutions: InstitutionsPage,
  "Create Institute": InstituteForm,
  "Edit Institute": InstituteForm,
  Departments: DepartmentsPage,
  "Create Department": DepartmentForm,
  "Edit Department": DepartmentForm,
  Events: EventsPage,
  "Create Event": EventForm,
  "Edit Event": EventForm,
  News: NewsPage,
  "Create News": CreateNews,
  "Edit News": EditNews,
  Jobs: JobsPage,
  "Create Job": CreateJob,
  "Edit Job": EditJob,
  "Jobs History": JobHistoryPage,
  "Create JobHistory": JobHistoryForm,
  "Edit JobHistory": JobHistoryForm,
  Podcast: PodcastsPage,
  "Create Podcast": PodcastForm,
  "Edit Podcast": PodcastForm,
  WebContent: WebContentPage,
  Roles: RolesPage,
  Permission: PermissionsPage,
  Email: ComposeEmail,
  "Document Verification": DocumentVerificationPage,
  "Message Reports": MessageReportsPage,
};

export const isAdminPage = (name) => Boolean(componentsMap[name]);

export default function ComponentRender({ page, onPageSet }) {
  const [record, setRecord] = useState(null);
  const go = (next, item = null) => {
    setRecord(item);
    onPageSet(next);
  };
  // an edit page needs its record, which a browser reload loses
  const orphan = page.startsWith("Edit ") && !record;
  useEffect(() => {
    if (orphan) onPageSet(PAGE_PARENT[page] || "Dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orphan]);
  if (orphan) return null;

  const Page = componentsMap[page] || Dashboard;
  // keyed so moving between create and edit starts from a fresh form
  return <Page key={`${page}:${record?.id || ""}`} go={go} goTo={go} record={record} job={record} news={record} />;
}
