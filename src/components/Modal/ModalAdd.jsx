import { Fragment, useContext } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AddRoom from '../Admin/Room/AddRoom';
import AddRiad from '../Admin/Riad/AddRiad';
import AddUser from '../Admin/Users/AddUser'; // Import the AddUser component
import { OpenContext } from '../../contexts/OpenContext'; // Verify this path

export default function ModalAdd() {
  const { modals, closeModal } = useContext(OpenContext);

  if (!modals) {
    // Handle the case where modals is undefined or null
    return null;
  }

  const pathname = window.location.pathname;

  const isRoomPage = pathname.includes('Rooms');
  const isRiadPage = pathname.includes('Riads');
  const isUserPage = pathname.includes('Users'); // Check if the current page is a user page

  return (
    <Transition
      show={!!modals.modalAdd}  // Ensure `show` is a boolean
      as={Fragment}
    >
      <Dialog className="relative z-10" onClose={() => closeModal('modalAdd')}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          {isRoomPage ? 'Add New Room' : isRiadPage ? 'Add New Riad' : isUserPage ? 'Add New User' : 'Add New Item'}
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => closeModal('modalAdd')}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {isRoomPage ? <AddRoom /> : isRiadPage ? <AddRiad /> : isUserPage ? <AddUser /> : <div>Select a page</div>}
                    </div>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
