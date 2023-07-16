import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { AiOutlineSchedule } from 'react-icons/ai';
import { HiOutlineUsers, HiOutlineHome } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import MenuButton from '../UI/MenuButton';
const Layout = ({ children, user, setCurrentSection, currentSection }) => {
  const router = useRouter();
  const { pathname } = router;
  function getRouteName(pathname) {
    const baseRoute = pathname.split('/dashboard')[1]; // Extract the part after '/dashboard'
    if (baseRoute === '') {
      return 'dashboard';
    } else if (baseRoute.startsWith('/schedule')) {
      return 'schedule';
    } else if (baseRoute.startsWith('/clients')) {
      return 'clients';
    } else if (baseRoute === '/profile') {
      return 'profile';
    } else if (baseRoute === '/settings') {
      return 'settings';
    } else {
      return null; // Route not matched
    }
  }
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
    setTheme(user.theme);
  }, [user.theme]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const currentPage = getRouteName(pathname);
  return (
    <div className="w-screen h-screen flex relative bg-primary-bg">
      {/* side Nav */}
      <div className="w-[80px] h-full flex flex-col justify-between items-center  border-r border-primary shadow-sm shadow-primary-shdow">
        <div className="w-[80px] h-[56px] flex justify-center items-center cursor-pointer">
          <Link href="/">
            <img
              className="block w-[52px] h-fit mt-10 "
              src="/logos/logo.png"
              alt="Your Company"
            />
          </Link>
        </div>
        <div className="h-full w-full flex-center-col gap-4">
          <MenuButton
            to="dashboard"
            button="dashboard"
            currentPage={currentPage}
          />
          <MenuButton
            to="dashboard/schedule"
            button="schedule"
            currentPage={currentPage}
          />
          <MenuButton
            to="dashboard/clients"
            button="clients"
            currentPage={currentPage}
          />
        </div>
        <div className="mb-4">
          <MenuButton
            to="dashboard/settings"
            button="settings"
            currentPage={currentPage}
          />
        </div>
      </div>
      <div className="w-[calc(100%-80px)] h-full flex flex-col justify-start items-start bg-primary-bg">
        {/* top nav */}
        <Disclosure
          as="nav"
          className={`w-full flex ${
            currentPage === 'dashboard' || currentPage == 'clients'
              ? 'justify-end'
              : 'justify-between'
          } items-center h-[70px] `}
        >
          {currentPage === 'settings' && (
            <div className="h-full flex justify-center items-center gap-4 ml-8">
              <div
                className={classNames(
                  currentSection == 'appSettings'
                    ? 'bg-primary-active hover:bg-secondary-hover'
                    : 'bg-secondary-bg hover:bg-primary-hover',
                  'flex justify-center items-center h-[50px] rounded-md cursor-pointer shadow-sm shadow-primary-shadow'
                )}
                onClick={() => setCurrentSection('appSettings')}
              >
                <h1 className={`text-lg font-medium px-4 `}>App Settings</h1>
              </div>
              <div
                className={classNames(
                  currentSection == 'workingDay'
                    ? 'bg-primary-active hover:bg-secondary-hover'
                    : 'bg-secondary-bg hover:bg-primary-hover',
                  'flex justify-center items-center h-[50px] rounded-md cursor-pointer shadow-sm shadow-primary-shadow'
                )}
                onClick={() => setCurrentSection('workingDay')}
              >
                <h1 className={`text-lg font-medium px-4 `}>Working Hours</h1>
              </div>
              <div
                className={classNames(
                  currentSection == 'vacancies'
                    ? 'bg-primary-active hover:bg-secondary-hover'
                    : 'bg-secondary-bg hover:bg-primary-hover',
                  'flex justify-center items-center h-[50px] rounded-md cursor-pointer shadow-sm shadow-primary-shadow'
                )}
                onClick={() => setCurrentSection('vacancies')}
              >
                <h1 className={`text-lg font-medium px-4 `}>Vacancies</h1>
              </div>
            </div>
          )}
          {currentPage === 'schedule' && (
            <div className="h-full flex justify-center items-center gap-4 ml-8">
              <div
                className={classNames(
                  currentSection == 'calendar'
                    ? 'bg-primary-active hover:bg-secondary-hover'
                    : 'bg-secondary-bg hover:bg-primary-hover',
                  'flex justify-center items-center h-[50px] rounded-md cursor-pointer shadow-sm shadow-primary-shadow'
                )}
                onClick={() => setCurrentSection('calendar')}
              >
                <h1 className={`text-lg font-medium px-4 `}>Calendar</h1>
              </div>
              <div
                className={classNames(
                  currentSection == 'list'
                    ? 'bg-primary-active hover:bg-secondary-hover'
                    : 'bg-secondary-bg hover:bg-primary-hover',
                  'flex justify-center items-center h-[50px] rounded-md cursor-pointer shadow-sm shadow-primary-shadow'
                )}
                onClick={() => setCurrentSection('list')}
              >
                <h1 className={`text-lg font-medium px-4 `}>Schedule List</h1>
              </div>
              <div
                className={classNames(
                  currentSection == 'manual'
                    ? 'bg-primary-active hover:bg-secondary-hover'
                    : 'bg-secondary-bg hover:bg-primary-hover',
                  'flex justify-center items-center h-[50px] rounded-md cursor-pointer shadow-sm shadow-primary-shadow'
                )}
                onClick={() => setCurrentSection('manual')}
              >
                <h1 className={`text-lg font-medium px-4 `}>Manual</h1>
              </div>
            </div>
          )}
          <div className="px-2 sm:px-6">
            <div className="relative flex h-14 items-center justify-end">
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full p-1 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-border focus:ring-offset-2 focus:ring-offset-secondary-border"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button
                      className="flex rounded-full bg-secondary-bg text-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                     "
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.image}
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
                     z-10 mt-2 w-32 origin-top-right flex flex-col justify-center
                      items-start rounded-md bg-secondary-bg py-1 shadow-lg ring-1
                       ring-black ring-opacity-5 focus:outline-none"
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active ? 'bg-hover-primary cursor-pointer' : '',
                              'block px-4 py-2 text-sm text-primary  w-full'
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
                              active ? 'bg-hover-primary cursor-pointer' : '',
                              'block px-4 py-2 text-sm text-primary  w-full'
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
                              active ? 'bg-hover-primary cursor-pointer' : '',
                              'block px-4 py-2 text-sm text-primary  w-full'
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
        </Disclosure>
        {/* content */}
        <div className="w-full h-[calc(100%-70px)] ">{children}</div>
      </div>
    </div>
  );
};
export default Layout;
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
