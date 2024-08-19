import { useState } from "react";

import NewsPage from "src/pages/user/news/AdminNewsPage";
import EventsPage from "src/pages/user/events/EventsPage";
import CreateJobHistory from "src/pages/user/jobs/CreateJobHistory";
import EditJobHistory from "src/pages/user/jobs/EditJobHistory";
import JobHistoryPage from "src/pages/user/jobs/JobHistoryPage";
import EditUser from "src/pages/user/users/EditUser";
import Users from "src/pages/user/users/Users";
import RolePage from "src/pages/Role";
import AlumniPage from "src/pages/user/alumni/AlumniPage";
import DocumentVerificationPage from "src/pages//admin/documentVerification/DocumentVerificationPage";
import JobsPage from "src/pages/user/jobs/JobsPage";
import AlumniProfile from "./user/AlumniProfile";
import CreateAlumni from "src/pages/user/alumni/CreateAlumni";

const componentsMap = {
  Profile: AlumniProfile,
  Users: Users,
  "Edit User": EditUser,
  Events: EventsPage,
  News: NewsPage,
  Email: RolePage,
  Jobs: JobsPage,
  "Jobs History": JobHistoryPage,
  "Create JobHistory": CreateJobHistory,
  "Edit JobHistory": EditJobHistory,
  Alumni: AlumniPage,
  "Create Alumni": CreateAlumni,
  "Document Verification": DocumentVerificationPage,
};

export default function ComponentRender({ page, onPageSet }) {
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [
    selectedDocumentVerificationRequest,
    setSelectedDocumentVerificationRequest,
  ] = useState(null);
  const ComponentToRender =
    componentsMap[page] || (() => <div>Page not found</div>);

  return (
    <ComponentToRender
      onCreateJobHistoryClick={() => onPageSet("Create JobHistory")}
      onCreateAlumniClick={() => onPageSet("Create Alumni")}
      onCreateDocumentVerificationClick={() =>
        onPageSet("Create Document Verification")
      }
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
      jobHistory={selectedJobHistory}
      alumni={selectedAlumni}
      document={selectedDocumentVerificationRequest}
      onCreatePodcastClick={() => onPageSet("Create Alumni")}
      onEditPodcastClick={() => {}}
    />
  );
}
