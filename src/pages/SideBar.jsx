import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    ArrowLongLeftIcon,
    Bars3Icon,
    BuildingLibraryIcon,
    CalendarIcon,
    Cog6ToothIcon,
    HomeIcon,
    InboxArrowDownIcon,
    NewspaperIcon,
    TagIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import RolePage from './Role'
import Admins from './Admins'

const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: false },
    { name: 'Admins', href: '#', icon: UsersIcon, current: true },
    { name: 'Institutions', href: '#', icon: BuildingLibraryIcon, current: false },
    { name: 'Departments', href: '#', icon: TagIcon, current: false },
    { name: 'Events', href: '#', icon: CalendarIcon, current: false },
    { name: 'News', href: '#', icon: NewspaperIcon, current: false },
    { name: 'Email', href: '#', icon: InboxArrowDownIcon, current: false },
]

const pages = [

    { name: 'Admins', href: '/admin', current: true },
]


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SideBar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarOpenMain, setSidebarOpenMain] = useState(true);

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                                        <div className="flex h-16 shrink-0 items-center">
                                            <span className='text-2xl text-gray-50 font-bold font-mono'>X Alumni</span>
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a href={item.href} className={classNames( item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800','group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold')}>
                                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                    {item.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li className="mt-auto">
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        <li>
                                                            <a href="#" className={classNames('text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold')} >
                                                                <ArrowLongLeftIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                Logout
                                                            </a>
                                                        </li>

                                                        <li>
                                                            <a href="#" className={classNames('text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold')} >
                                                                <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                Settings
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                <div className={`${sidebarOpenMain ? 'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col' : 'hidden'}`}>
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <span className='text-2xl text-gray-50 font-bold font-mono mr-4'>X Alumni</span>
                            <button type="button" className="ml-auto" onClick={() => setSidebarOpenMain(false)}>
                                <span className="sr-only">Close sidebar</span>
                                <ArrowLongLeftIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a href={item.href} className={classNames(  item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' )}>
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="mt-auto">
                                    <ul role="list" className="-mx-2 space-y-1">
                                        <li>
                                            <a href="#" className={classNames('text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold')} >
                                                <ArrowLongLeftIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    Logout
                                            </a>
                                        </li>

                                        <li>
                                            <a href="#" className={classNames('text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold')} >
                                                <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    Settings
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>

                    </div>
                </div>

                <div className={`${sidebarOpenMain ? 'lg:pl-72' : 'lg:pl-85'}`}>
                    <div className="flex ml-4 mt-4">
                        {!sidebarOpenMain ? (
                            <div>
                                <button type="button" className="mr-4 p-2.5 text-gray-100" onClick={() => setSidebarOpenMain(true)}>
                                    <span className="sr-only">Open sidebar</span>
                                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                </button>
                                <span className='text-2xl text-black font-bold font-mono mr-4'>X Alumni</span>
                            </div>
                        ) :
                            (<div className='flex'>
                                <button type="button" className="m-4 text-gray-100 lg:hidden" onClick={() => setSidebarOpen(true)}>
                                    <span className="sr-only">Open sidebar</span>
                                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                </button>
                                <nav className="flex ml-4" aria-label="Breadcrumb">
                                    <ol role="list" className="flex items-center space-x-4">
                                        <li>
                                            <div>
                                                <a href="#" className="text-gray-900 hover:text-gray-500">
                                                    <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                                    <span className="sr-only">Home</span>
                                                </a>
                                            </div>
                                        </li>
                                        {pages.map((page) => (
                                            <li key={page.name}>
                                                <div className="flex items-center">
                                                    <svg
                                                        className="h-5 w-5 flex-shrink-0 text-gray-300"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                                    </svg>
                                                    <a
                                                        href={page.href}
                                                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                                        aria-current={page.current ? 'page' : undefined}
                                                    >
                                                        {page.name}
                                                    </a>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            </div>)
                        }

                    </div>

                    {/* TODO make page rendering dynamin */}
                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8"><Admins /></div>
                    </main>
                </div>
            </div>
        </>
    )
}
