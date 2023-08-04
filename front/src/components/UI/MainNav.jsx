import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Link from 'next/link';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useState } from 'react';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const MainNav = ({ children, isLoggedIn, user }) => {
  const router = useRouter();
  const handleLogout = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        router.reload(window.location.pathname);
      });
  };
  const { setTheme } = useTheme();
  useEffect(() => {
    if (isLoggedIn) {
      setTheme(user.theme);
    }
  }, [isLoggedIn, setTheme, user.theme]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="w-screen  flex justify-center items-center shadow-md ">
        <div className="h-full max-w-[1200px] w-[1200px] flex justify-between items-center  gap-4 font-semibold text-lg">
          <ul className="flex items-center">
            <li>
              <Link href="/">
                <img
                  alt="logo"
                  src="./logos/logo.png"
                  width={40}
                  className="mx-6 cursor-pointer"
                />
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link href="/dashboard" className="w-full h-full">
                  <button className="p-4 cursor-pointer">Dashboard</button>
                </Link>
              </li>
            )}
            <li>
              <Link href="/">
                <button className="p-4 cursor-pointer">Home</button>
              </Link>
            </li>
            <li>
              <Link href="/product">
                <button className="p-4 cursor-pointer">Product</button>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <button className="p-4 cursor-pointer">About</button>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <button className="p-4 cursor-pointer">Contact</button>
              </Link>
            </li>
          </ul>
          {!isLoggedIn ? (
            <div className="flex justify-center items-center gap-4">
              <div className="lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-200 text-sm text-gray-900 font-bold  rounded-xl transition duration-200 cursor-pointer">
                <Link href="/login">Login</Link>
              </div>
              <div className="inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200 cursor-pointer">
                <Link href="/register">Register</Link>
              </div>
            </div>
          ) : (
            <div className="">
              <div className="relative flex h-14 items-center justify-end">
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="rounded-full p-1 text-gray-400 hover:text-black dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-400"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user?.image}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        className="absolute right-2
                     z-10 mt-2 w-32 origin-top-right flex flex-col justify-center items-start rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full cursor-pointer'
                              )}
                            >
                              <Link href="/dashboard/profile">Profile</Link>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active ? 'bg-gray-100 cursor-pointer' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full'
                              )}
                            >
                              <Link href="/dashboard/settings">Settings</Link>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100 cursor-pointer' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full'
                              )}
                            >
                              Sign out
                            </div>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};
export default MainNav;
