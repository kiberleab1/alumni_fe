import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  EnvelopeIcon,
  FlagIcon,
  GlobeAltIcon,
  HomeIcon,
  IdentificationIcon,
  KeyIcon,
  MicrophoneIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  SwatchIcon,
  TagIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

/** Sidebar sections. `name` is the page id used by PageRender. */
const GROUPS = [
  { items: [{ name: "Dashboard", icon: HomeIcon }] },
  {
    label: "People",
    items: [
      { name: "Alumni", icon: AcademicCapIcon },
      { name: "Users", icon: UsersIcon },
      { name: "Staff", icon: IdentificationIcon },
      { name: "Admins", icon: UserGroupIcon },
    ],
  },
  {
    label: "Organization",
    items: [
      { name: "Institutions", icon: BuildingLibraryIcon },
      { name: "Departments", icon: TagIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "News", icon: NewspaperIcon },
      { name: "Events", icon: CalendarDaysIcon },
      { name: "Jobs", icon: BriefcaseIcon },
      { name: "Jobs History", label: "Job history", icon: ClockIcon },
      { name: "Podcast", label: "Podcasts", icon: MicrophoneIcon },
      { name: "WebContent", label: "Website content", icon: GlobeAltIcon },
    ],
  },
  {
    label: "Requests",
    items: [
      { name: "Document Verification", label: "Documents", icon: ClipboardDocumentCheckIcon },
      { name: "Message Reports", label: "Message reports", icon: FlagIcon },
      { name: "Email", icon: EnvelopeIcon },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Roles", icon: ShieldCheckIcon },
      { name: "Permission", label: "Permissions", icon: KeyIcon },
      { name: "Branding", icon: SwatchIcon },
    ],
  },
];

const HIDDEN = {
  super_admin: [],
  admin: [],
  aumni: ["Message Reports", "Branding"],
};

/** Grouped sidebar for a role, or null when the role has no admin area. */
export function possibleNavigationMenus(role_name) {
  const hidden = HIDDEN[role_name];
  if (!hidden) return null;
  return GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => !hidden.includes(i.name)) })).filter((g) => g.items.length);
}

/** Which sidebar entry a create/edit page belongs to. */
export const PAGE_PARENT = {
  "Create Admin": "Admins",
  "Edit Admin": "Admins",
  "Create User": "Users",
  "Edit User": "Users",
  "Create Institute": "Institutions",
  "Edit Institute": "Institutions",
  "Create Department": "Departments",
  "Edit Department": "Departments",
  "Create Staff": "Staff",
  "Edit Staff": "Staff",
  "Create Event": "Events",
  "Edit Event": "Events",
  "Create News": "News",
  "Edit News": "News",
  "Create Job": "Jobs",
  "Edit Job": "Jobs",
  "Create JobHistory": "Jobs History",
  "Edit JobHistory": "Jobs History",
  "Create Podcast": "Podcast",
  "Edit Podcast": "Podcast",
};

export function pageLabel(name) {
  for (const g of GROUPS) for (const i of g.items) if (i.name === name) return i.label || i.name;
  return name;
}
