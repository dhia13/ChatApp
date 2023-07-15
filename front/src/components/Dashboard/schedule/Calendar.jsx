import { Menu } from "@headlessui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, "EEEE dd/MM/yyyy");
  return formattedDate;
}
const CalendarBar = () => {
  const [date, setDate] = useState(new Date());
  const [formatedDate, setFormatedDate] = useState("");
  useEffect(() => setDate(new Date()), []);
  const [searshWord, setSearshWord] = useState("");
  const [searshBy, setSearshBy] = useState("Date");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    setFormatedDate(formatDate(date));
  }, [date]);
  return (
    <main
      className="w-[calc(100%-60px)] h-full
       shadow-sm overflow-auto flex gap-4 justify-start items-center flex-col"
    >
      <nav className="w-full h-[50px] flex justify-start items-start rounded-md bg-secondary-bg mt-4">
        <ul className="w-full h-full flex justify-start items-center gap-4 ml-8 relative">
          <div className="flex items-center">
            <Menu
              as="div"
              className="relative"
              onClose={() => setIsMenuOpen(false)}
            >
              <div>
                <Menu.Button
                  className="flex rounded-full text-base"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <li className="cursor-pointer">{`Date : ${formatedDate}`}</li>
                </Menu.Button>
              </div>
              {isMenuOpen && (
                // <Transition
                //   as={Fragment}
                //   show={isMenuOpen}
                //   enter="transition ease-out duration-100"
                //   enterFrom="transform opacity-0 scale-95"
                //   enterTo="transform opacity-100 scale-100"
                //   leave="transition ease-in duration-75"
                //   leaveFrom="transform opacity-100 scale-100"
                //   leaveTo="transform opacity-0 scale-95"
                // >
                <Menu.Items className="absolute left-0 z-10 mt-2 origin-top-left flex flex-col justify-center items-start rounded-md bg-primary-bg py-1 shadow-lg ring-1 ring-primary-border ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {() => (
                      <Calendar
                        onChange={(selectedDate) => {
                          setDate(selectedDate);
                          setIsMenuOpen(false);
                        }}
                        value={date}
                      />
                    )}
                  </Menu.Item>
                </Menu.Items>
                // </Transition>
              )}
            </Menu>
          </div>
        </ul>
      </nav>
      <nav className="w-full h-[50px] flex justify-start items-start">
        <ul className="w-full h-full flex justify-start items-center gap-4">
          <div className="justify-start items-center flex relative h-[50px]">
            <select
              value={searshBy}
              onChange={(e) => setSearshBy(e.target.value)}
              className="block rounded-tl-md rounded-bl-md focus:rounded-bl-none
    shadow-md w-[100px] focus:outline-none focus:border-hover-border
    h-[40px] bg-secondary-bg px-2 text-primary-text border-b border-t border-l border-primary-border cursor-pointer"
              name="searsh"
            >
              <option value="Date" className="cursor-pointer">
                Date
              </option>
              <option value="email" className="cursor-pointer">
                Email
              </option>
              <option value="name" className="cursor-pointer">
                Name
              </option>
            </select>
            <div className="h-full flex justify-center items-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 w-6 h-6 my-auto text-primary-text left-[110px] cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => console.log("searsh")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                value={searshWord}
                onChange={(e) => setSearshWord(e.target.value)}
                type="text"
                placeholder={`Searsh By ${searshBy}`}
                className="w-[400px] py-3 pl-12 h-[40px] pr-4 text-secondary-text border border-primary-border shadow-md rounded-tr-md rounded-br-md outline-none bg-secondary-bg
      focus:bg-secondary-bg focus:border-hover-border"
              />
            </div>
          </div>
        </ul>
      </nav>
      <div className="w-full h-[calc(100%-160px)] bg-secondary-bg rounded-md shadow-sm flex justify-center items-center">
        calender goes here
      </div>
    </main>
  );
};
export default CalendarBar;
