import {
  HomeIcon,
  UsersIcon,
  BuildingLibraryIcon,
  TagIcon,
  AcademicCapIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisVerticalIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  NewspaperIcon,
  InboxArrowDownIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import CreateAdminPage from "src/pages/admin/admins/createAdmin";

const role_maps = {
  super_admin: [
    {
      name: "Dashboard",
      href: "#",
      icon: HomeIcon,
      current: false,
      comp: CreateAdminPage,
    },
    { name: "Admins", href: "#", icon: UsersIcon, current: true },
    {
      name: "Institutions",
      href: "#",
      icon: BuildingLibraryIcon,
      current: false,
    },
    { name: "Departments", href: "#", icon: TagIcon, current: false },
    { name: "Users", href: "#", icon: AcademicCapIcon, current: false },
    {
      name: "Roles",
      href: "#",
      icon: EllipsisHorizontalCircleIcon,
      current: false,
    },
    {
      name: "Permission",
      href: "#",
      icon: EllipsisVerticalIcon,
      current: false,
    },
    { name: "Jobs", href: "#", icon: BriefcaseIcon, current: false },
    { name: "Staff", href: "#", icon: UsersIcon, current: false },
    { name: "Jobs History", href: "#", icon: BriefcaseIcon, current: false },
    { name: "Alumni", href: "#", icon: AcademicCapIcon, current: false },
    {
      name: "Document Verification",
      href: "#",
      icon: ClipboardDocumentCheckIcon,
      current: false,
    },
    { name: "Events", href: "#", icon: CalendarIcon, current: false },
    { name: "News", href: "#", icon: NewspaperIcon, current: false },
    { name: "Email", href: "#", icon: InboxArrowDownIcon, current: false },
    { name: "WebContent", href: "#", icon: StarIcon, current: false },
  ],
  admin: [
    {
      name: "Dashboard",
      href: "#",
      icon: HomeIcon,
      current: false,
      comp: CreateAdminPage,
    },
    { name: "Admins", href: "#", icon: UsersIcon, current: true },
    {
      name: "Institutions",
      href: "#",
      icon: BuildingLibraryIcon,
      current: false,
    },
    { name: "Departments", href: "#", icon: TagIcon, current: false },
    { name: "Users", href: "#", icon: AcademicCapIcon, current: false },
    {
      name: "Roles",
      href: "#",
      icon: EllipsisHorizontalCircleIcon,
      current: false,
    },
    {
      name: "Permission",
      href: "#",
      icon: EllipsisVerticalIcon,
      current: false,
    },
    { name: "Jobs", href: "#", icon: BriefcaseIcon, current: false },
    { name: "Staff", href: "#", icon: UsersIcon, current: false },
    { name: "Jobs History", href: "#", icon: BriefcaseIcon, current: false },
    { name: "Alumni", href: "#", icon: AcademicCapIcon, current: false },
    {
      name: "Document Verification",
      href: "#",
      icon: ClipboardDocumentCheckIcon,
      current: false,
    },
    { name: "Events", href: "#", icon: CalendarIcon, current: false },
    { name: "News", href: "#", icon: NewspaperIcon, current: false },
    { name: "Email", href: "#", icon: InboxArrowDownIcon, current: false },
    { name: "WebContent", href: "#", icon: StarIcon, current: false },
  ],
  aumni: [
    {
      name: "Dashboard",
      href: "#",
      icon: HomeIcon,
      current: false,
      comp: CreateAdminPage,
    },
    { name: "Admins", href: "#", icon: UsersIcon, current: true },
    {
      name: "Institutions",
      href: "#",
      icon: BuildingLibraryIcon,
      current: false,
    },
    { name: "Departments", href: "#", icon: TagIcon, current: false },
    { name: "Users", href: "#", icon: AcademicCapIcon, current: false },
    {
      name: "Roles",
      href: "#",
      icon: EllipsisHorizontalCircleIcon,
      current: false,
    },
    {
      name: "Permission",
      href: "#",
      icon: EllipsisVerticalIcon,
      current: false,
    },
    { name: "Jobs", href: "#", icon: BriefcaseIcon, current: false },
    { name: "Staff", href: "#", icon: UsersIcon, current: false },
    { name: "Jobs History", href: "#", icon: BriefcaseIcon, current: false },
    { name: "Alumni", href: "#", icon: AcademicCapIcon, current: false },
    {
      name: "Document Verification",
      href: "#",
      icon: ClipboardDocumentCheckIcon,
      current: false,
    },
    { name: "Events", href: "#", icon: CalendarIcon, current: false },
    { name: "News", href: "#", icon: NewspaperIcon, current: false },
    { name: "Email", href: "#", icon: InboxArrowDownIcon, current: false },
    { name: "WebContent", href: "#", icon: StarIcon, current: false },
  ],
  Guest: [],
};

export function possibleNavigationMenus(role_name) {
  return role_maps[role_name];
}