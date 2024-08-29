// import React, { useState, useEffect } from 'react';
// import { Disclosure, Transition, Menu } from '@headlessui/react';
// import { BellIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
// import classNames from 'classnames';
// import { useNavigate } from 'react-router-dom';

// import userImage from '../../../assets/Admin.jpg'; 

// import apiClient from '../token/config'; 

// const navigation = [
//     { name: 'Home', href: '/admin/listusers' },
//     { name: 'Riads', href: '/admin/listriads' },
//     { name: 'Rooms', href: '/admin/listrooms' }
// ];

// const userNavigation = [
//     { name: 'Profile', href: '/admin/profile' },
//     { name: 'Settings', href: '#' },
//     { name: 'Sign out', href: '' },
// ];

// function Navbar() {
//     const [user, setUser] = useState({ name: '', email: '', imageUrl: userImage });
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserInfo = async () => {
//             try {
//                 const response = await apiClient.get('/user_info');
//                 setUser({
//                     name: response.data.username || 'Unknown',
//                     email: response.data.email, 
//                     firstName: response.data.firstname,
//                     imageUrl: userImage 
//                 });
                
//             } catch (error) {
//                 console.error('Failed to fetch user info:', error);
//             }
//         };

//         fetchUserInfo();
//     }, []);

//     const handleLogout = async () => {
//         try {
//             await apiClient.post('/logout');
//             localStorage.removeItem('token_admin');
//             navigate('/Admin/login'); 

//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     };

//     return (
//         <Disclosure as="nav" className="bg-indigo-600">
//             {({ open }) => (
//                 <>
//                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                         <div className="flex h-16 items-center justify-between">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <img
//                                         className="h-8 w-8"
//                                         src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
//                                         alt="Your Company"
//                                     />
//                                 </div>
//                                 <div className="hidden md:block">
//                                     <div className="ml-10 flex items-baseline space-x-4">
//                                         {navigation.map((item) => (
//                                             <a
//                                                 key={item.name}
//                                                 href={item.href}
//                                                 className={classNames(
//                                                     'text-white hover:bg-indigo-500 hover:bg-opacity-75',
//                                                     'rounded-md px-3 py-2 text-sm font-medium'
//                                                 )}
//                                                 aria-current={item.current ? 'page' : undefined}
//                                             >
//                                                 {item.name}
//                                             </a>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="hidden md:block">
//                                 <div className="ml-4 flex items-center md:ml-6">
//                                     <button
//                                         type="button"
//                                         className="relative rounded-full bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
//                                     >
//                                         <span className="absolute -inset-1.5" />
//                                         <span className="sr-only">View notifications</span>
//                                         <BellIcon className="h-6 w-6" aria-hidden="true" />
//                                     </button>

//                                     {/* Profile dropdown */}
//                                     <Menu as="div" className="relative ml-3">
//                                         <div>
//                                             <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
//                                                 <span className="absolute -inset-1.5" />
//                                                 <span className="sr-only">Open user menu</span>
//                                                 <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
//                                             </Menu.Button>
//                                         </div>
//                                         <Transition
//                                             enter="transition ease-out duration-100"
//                                             enterFrom="transform opacity-0 scale-95"
//                                             enterTo="transform opacity-100 scale-100"
//                                             leave="transition ease-in duration-75"
//                                             leaveFrom="transform opacity-100 scale-100"
//                                             leaveTo="transform opacity-0 scale-95"
//                                         >
//                                             <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                                                 {userNavigation.map((item) => (
//                                                     <Menu.Item key={item.name}>
//                                                         {({ active }) => (
//                                                             <a
//                                                                 href={item.name === 'Sign out' ? '#' : item.href}
//                                                                 onClick={item.name === 'Sign out' ? handleLogout : undefined}
//                                                                 className={classNames(
//                                                                     active ? 'bg-gray-100' : '',
//                                                                     'block px-4 py-2 text-sm text-gray-700'
//                                                                 )}
//                                                             >
//                                                                 {item.name}
//                                                             </a>
//                                                         )}
//                                                     </Menu.Item>
//                                                 ))}
//                                             </Menu.Items>
//                                         </Transition>
//                                     </Menu>
//                                 </div>
//                             </div>
//                             <div className="-mr-2 flex md:hidden">
//                                 {/* Mobile menu button */}
//                                 <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
//                                     <span className="absolute -inset-0.5" />
//                                     <span className="sr-only">Open main menu</span>
//                                     {open ? (
//                                         <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                                     ) : (
//                                         <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                                     )}
//                                 </Disclosure.Button>
//                             </div>
//                         </div>
//                     </div>

//                     <Disclosure.Panel className="md:hidden">
//                         <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
//                             {navigation.map((item) => (
//                                 <Disclosure.Button
//                                     key={item.name}
//                                     as="a"
//                                     href={item.href}
//                                     className={classNames(
//                                         'text-white hover:bg-indigo-500 hover:bg-opacity-75',
//                                         'block rounded-md px-3 py-2 text-base font-medium'
//                                     )}
//                                     aria-current={item.current ? 'page' : undefined}
//                                 >
//                                     {item.name}
//                                 </Disclosure.Button>
//                             ))}
//                         </div>
//                         <div className="border-t border-indigo-700 pb-3 pt-4">
//                             <div className="flex items-center px-5">
//                                 <div className="flex-shrink-0">
//                                     <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
//                                 </div>
//                                 <div className="ml-3">
//                                     <div className="text-base font-medium text-white">{user.name}</div>
//                                     <div className="text-sm font-medium text-indigo-300">{user.email}</div>
//                                 </div>
//                                 <button
//                                     type="button"
//                                     className="relative ml-auto flex-shrink-0 rounded-full border-2 border-transparent bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
//                                 >
//                                     <span className="absolute -inset-1.5" />
//                                     <span className="sr-only">View notifications</span>
//                                     <BellIcon className="h-6 w-6" aria-hidden="true" />
//                                 </button>
//                             </div>
//                             <div className="mt-3 space-y-1 px-2">
//                                 {userNavigation.map((item) => (
//                                     <Disclosure.Button
//                                         key={item.name}
//                                         as="a"
//                                         href={item.name === 'Sign out' ? '#' : item.href}
//                                         onClick={item.name === 'Sign out' ? handleLogout : undefined}
//                                         className={classNames(
//                                             'text-white hover:bg-indigo-500 hover:bg-opacity-75',
//                                             'block rounded-md px-3 py-2 text-base font-medium'
//                                         )}
//                                     >
//                                         {item.name}
//                                     </Disclosure.Button>
//                                 ))}
//                             </div>
//                         </div>
//                     </Disclosure.Panel>
//                 </>
//             )}
//         </Disclosure>
//     );
// }

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { Disclosure, Menu, Transition,MenuButton,MenuItems,MenuItem,DisclosureButton,DisclosurePanel } from '@headlessui/react';
import { BellIcon, XMarkIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import userImage from '../../../assets/programmer_2419329.png';
import apiClient from '../token/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import riadIcon from '../../../assets/riad_icone.png';

const navigation = [
    { name: 'Home', href: '/admin/listusers' },
    { name: 'Riads', href: '/admin/listriads' },
    { name: 'Rooms', href: '/admin/listrooms' },
];

const userNavigation = [
    { name: 'Profile', href: '/admin/profile' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
];

function Navbar() {
    const [user, setUser] = useState({ name: '', email: '', imageUrl: userImage });
    const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get('/user_info');
                setUser({
                    name: response.data.username || 'Unknown',
                    email: response.data.email, 
                    imageUrl: userImage
                });
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            await apiClient.post('/logout');
            localStorage.removeItem('token_admin');
            navigate('/Admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Disclosure as="nav" className="bg-indigo-600 fixed top-0 left-0 right-0 z-50">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-8 w-8"
                                        src={riadIcon}
                                        alt="Riad Icon"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <Menu as="div" className="relative">
                                            <div
                                                onMouseEnter={() => setHomeDropdownOpen(true)}
                                                onMouseLeave={() => setHomeDropdownOpen(false)}
                                            >
                                                <button
                                                    onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
                                                    className="flex items-center text-white hover:bg-indigo-500 hover:bg-opacity-75 rounded-md px-3 py-2 text-sm font-medium"
                                                >
                                                    Account
                                                    <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                                                </button>
                                                <Transition
                                                    show={homeDropdownOpen}
                                                    as="div"
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <div className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <Link
                                                            to="/admin/listadmins"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Admin
                                                        </Link>
                                                        <Link
                                                            to="/admin/listusers"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Client
                                                        </Link>
                                                        <Link
                                                            to="/admin/listusersarchived"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Client Archived
                                                        </Link>
                                                    </div>
                                                </Transition>
                                            </div>
                                        </Menu>
                                        {navigation.map((item) => (
                                            item.name !== 'Home' && (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className="text-white hover:bg-indigo-500 hover:bg-opacity-75 rounded-md px-3 py-2 text-sm font-medium"
                                                >
                                                    {item.name}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <button
                                        type="button"
                                        className="rounded-full bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                    >
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <MenuButton className="flex rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt={user.name} />
                                            </MenuButton>
                                        </div>
                                        <Transition
                                            as="div"
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {userNavigation.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        {({ active }) => (
                                                            <a
                                                                href={item.name === 'Sign out' ? '#' : item.href}
                                                                onClick={item.name === 'Sign out' ? handleLogout : undefined}
                                                                className={classNames(
                                                                    active ? 'bg-gray-100' : '',
                                                                    'block px-4 py-2 text-sm text-gray-700'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </a>
                                                        )}
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            <Menu as="div" className="relative">
                                <MenuButton className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75">
                                    Account
                                </MenuButton>
                                <Transition
                                    as="div"
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <div className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Link
                                            to="/admin/listadmins"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Admin
                                        </Link>
                                        <Link
                                            to="/admin/listusers"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Client
                                        </Link>
                                        <Link
                                            to="/admin/listusersarchived"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Client Archived
                                        </Link>
                                    </div>
                                </Transition>
                            </Menu>
                            {navigation.map((item) => (
                                item.name !== 'Home' && (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}

export default Navbar;

