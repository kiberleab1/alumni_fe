import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  GlobeEuropeAfricaIcon,
  MegaphoneIcon,
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

/**
 * Sidebar sections. `name` is the page id used by PageRender; `cap` is the
 * capability an institute admin needs (the super admin decides these per
 * institute); `superOnly` items are hidden from institute admins.
 */
const GROUPS = [
  {
    items: [
      { name: "Dashboard", icon: HomeIcon },
      { name: "Platform Overview", label: "Platform overview", icon: GlobeEuropeAfricaIcon, superOnly: true },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Members", icon: UsersIcon, cap: "members.manage" },
      { name: "Alumni", icon: AcademicCapIcon },
      { name: "Staff", icon: IdentificationIcon, cap: "organization.manage" },
      { name: "Admins", icon: UserGroupIcon, cap: "members.manage" },
    ],
  },
  {
    label: "Organization",
    items: [
      { name: "Institutions", icon: BuildingLibraryIcon, superOnly: true },
      { name: "Departments", icon: TagIcon, cap: "organization.manage" },
      { name: "Institute Settings", label: "Institute settings", icon: AdjustmentsHorizontalIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "News", icon: NewspaperIcon, cap: "content.publish" },
      { name: "Events", icon: CalendarDaysIcon, cap: "events.manage" },
      { name: "Jobs", icon: BriefcaseIcon, cap: "jobs.manage" },
      { name: "Jobs History", label: "Job history", icon: ClockIcon },
      { name: "Podcast", label: "Podcasts", icon: MicrophoneIcon, cap: "website.edit" },
      { name: "WebContent", label: "Website content", icon: GlobeAltIcon, cap: "website.edit" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { name: "Announcements", icon: MegaphoneIcon, cap: "announcements.send" },
      { name: "Email", icon: EnvelopeIcon, cap: "email.send" },
      { name: "Document Verification", label: "Documents", icon: ClipboardDocumentCheckIcon, cap: "documents.review" },
      { name: "Message Reports", label: "Message reports", icon: FlagIcon, cap: "moderation" },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Reports", icon: ChartBarIcon, cap: "analytics.view" },
      { name: "Audit Log", label: "Audit log", icon: ClipboardDocumentListIcon, cap: "audit.view" },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Roles", icon: ShieldCheckIcon, superOnly: true },
      { name: "Permission", label: "Permissions", icon: KeyIcon, superOnly: true },
      { name: "Branding", icon: SwatchIcon, cap: "branding.edit" },
    ],
  },
];

const HIDDEN = {
  super_admin: [],
  admin: [],
  aumni: ["Message Reports", "Branding"],
};

/**
 * Grouped sidebar for a role, or null when the role has no admin area.
 * `caps` (from /admin/config) hides what this institute's admins may not do;
 * while it loads, everything the role allows is shown.
 */
export function possibleNavigationMenus(role_name, caps) {
  const hidden = HIDDEN[role_name];
  if (!hidden) return null;
  const isSuper = role_name === "super_admin";
  const allowed = (i) => !hidden.includes(i.name) && (isSuper || (!i.superOnly && (!i.cap || !caps || caps.includes(i.cap))));
  return GROUPS.map((g) => ({ ...g, items: g.items.filter(allowed) })).filter((g) => g.items.length);
}

/** Which sidebar entry a create/edit page belongs to. */
export const PAGE_PARENT = {
  "Create Admin": "Admins",
  "Edit Admin": "Admins",
  "Create User": "Members",
  "Edit User": "Members",
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
