import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {AiOutlineCheck} from 'react-icons/ai'
import {RiArrowUpDownFill} from 'react-icons/ri'
export default function Example({ value, setValue, gender }) {
  return (
    <div className=" w-72 h-full  z-50">
      <Listbox value={value} onChange={setValue}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-sm bg-white border py-[6px] pl-2 pr-10 text-left shadow-sm shadow-green-500 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{value}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <RiArrowUpDownFill
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {gender.map((type) => (
                <Listbox.Option
                  key={type}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-[20px] ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={type}
                >
                  {({ value }) => (
                    <>
                      <span
                        className={`block truncate ${
                          value ? "font-medium" : "font-normal"
                        }`}
                      >
                        {type}
                      </span>
                      {value ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <AiOutlineCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
