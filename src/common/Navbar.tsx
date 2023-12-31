import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BellRingIcon, CommandIcon, SearchIcon } from "lucide-react";
import { useSidebar } from "../hook/sidebarHooks";

function Navbar() {
  const { expanded } = useSidebar();
  const [isOpenGlobalSearch, setIsOpenGlobalSearch] = useState(false);

  const closeGlobalSearch = () => {
    setIsOpenGlobalSearch(false);
  };
  const openGlobalSearch = () => {
    setIsOpenGlobalSearch(true);
  };
  const toggleGlobalSearch = () => {
    setIsOpenGlobalSearch((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        toggleGlobalSearch();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div
      className={`fixed pt-3 pb-6 top-0 z-10 bg-slate-100 ${
        expanded ? "w-[calc(100%-328px)]" : "w-[calc(100%-116px)]"
      }`}
    >
      <nav className="py-4 px-5 rounded-xl bg-white w-full before:content-[''] before:absolute before:bg-transparent before:left-0 before:-bottom-12 before:h-12 before:w-full before:rounded-t-xl before:shadow-[0_-12px_0_0_rgb(241,245,249)]">
        <div className="grid items-center grid-cols-12 gap-2">
          <div className="col-span-7 xl:col-span-5">
            <button
              type="button"
              onClick={openGlobalSearch}
              className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 pl-3 pr-4 py-2 text-gray-400 transition-all-200 hover:border-gray-300 w-full"
            >
              <span className="flex items-center">
                <SearchIcon className="inline-block mr-2" size={18} />
                Quick search...
              </span>
              <span className="text-xs flex items-center bg-white py-0.5 px-1 rounded border border-gray-100 font-medium">
                <CommandIcon size={13} className="mr-1" strokeWidth={2} />F
              </span>
            </button>
          </div>
          <div className="col-span-5 xl:col-span-7">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-6">
                <button
                  className="text-gray-800 hover:text-indigo-500 relative block"
                  title="Notification"
                >
                  <BellRingIcon size={18} />
                  <div className="absolute -right-1 w-2.5 h-2.5 -top-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 -translate-y-[6.55px] translate-x-[0.5px]"></span>
                  </div>
                </button>
                <button className="" title="Profile">
                  <img
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Iwan+Suryaningrat"
                    alt="iwan suryaningrat profile"
                    className="w-9 h-9 rounded-full object-cover object-center"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Transition appear show={isOpenGlobalSearch} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeGlobalSearch}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeGlobalSearch}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Navbar;
