import { Fragment, useState, useEffect,useContext } from 'react';
import { Dialog, Transition,DialogPanel,DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Admin/token/config';
import { OpenContext } from '../../contexts/OpenContext';

// Fetch room data
const fetchRoomData = async (roomId) => {
  try {
    const { data } = await axiosInstance.get(`/rooms/${roomId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching room data:', error);
    throw error;
  }
};

// Fetch riad data
const fetchRiadData = async (riadId) => {
  try {
    const { data } = await axiosInstance.get(`/riads/${riadId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching riad data:', error);
    throw error;
  }
};

// Upload image
const uploadImage = async ({ id, formData, type }) => {
  try {
    const response = await axiosInstance.post(`/${type}_images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete image
const deleteImage = async (imageId, type) => {
  if (!imageId) {
    throw new Error('Image ID is required for deletion');
  }
  try {
    await axiosInstance.delete(`/${type}_images/${imageId}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export default function ModalImages({ riadId, roomId }) {
  console.log("Riad in ModalImage :",riadId)
  console.log("Room in ModalImage :",roomId)
  const { modals, closeModal } = useContext(OpenContext);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const type = roomId ? 'room' : 'riad';
  const type2 = roomId ? 'rooom' : 'riiad';
  const id = roomId || riadId;

  const { data, error, isLoading, isError } = useQuery({
    queryKey: [type, id],
    queryFn: () => (type === 'room' ? fetchRoomData(id) : fetchRiadData(id)),
    onSuccess: (data) => {
      if (!data) {
        console.error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
        setOpen(false);
      }
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
      setOpen(false);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ id, formData }) => uploadImage({ id, formData, type: type2 }),
    onSuccess: () => {
      queryClient.invalidateQueries([type, id]);
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => deleteImage(imageId, type),
    onSuccess: () => {
      queryClient.invalidateQueries([type, id]);
    },
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching data:', error);
    }
  }, [isError, error]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('imageFile', file);
    if (roomId) formData.append('room', `${roomId}`);
    if (riadId) formData.append('riad', `${riadId}`);

    uploadMutation.mutate({ id, formData });
  };

  const handleDelete = (imageId) => {
    if (!imageId) {
      console.error('Image ID is not defined');
      return;
    }
    console.log('Deleting image with ID:', imageId);
    deleteMutation.mutate(imageId);
  };
  // useEffect(() => {
  //   setOpen(!!modals[`modalImages_${riadId}`]);
  // }, [modals, riadId]);

  // const handleClose = () => {
  //   setOpen(false);
  //   closeModal(`modalImages_${riadId}`);
  // };
  useEffect(() => {
    setOpen(!!modals[`modalImages_${riadId || roomId }`]);
  }, [modals, riadId, roomId]);

  const handleClose = () => {
    setOpen(false);
    closeModal(`modalImages_${riadId || roomId }`);
  };

  if (isLoading) return <div>Loading images...</div>;
  if (isError) return <div>Error loading images</div>;
  if (!data || !data.images) return <div>No images found</div>;

  return (
    <>
      {/* <button onClick={() => setOpen(true)} className="text-indigo-600 hover:text-indigo-900">
        Manage Images
      </button>
      <Transition show={open} as={Fragment}>
        <Dialog className="relative z-10" onClose={() => setOpen(false)}>
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
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Manage Images for {type.charAt(0).toUpperCase() + type.slice(1)} {id}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <h2 className="text-lg font-medium">
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {type === 'room' ? data.riad.name : data.name}
                          </h2>
                          <h3 className="text-md font-medium mt-2">
                            Images for {type.charAt(0).toUpperCase() + type.slice(1)} {id}
                          </h3>
                          <div className="flex flex-wrap mt-4">
                            {data.images.map((image) => (
                              <div key={image.id} className="relative w-32 h-32 m-2">
                                <img
                                  src={`http://localhost:8000${image.imageUrl}`}
                                  alt={image.imageName}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => handleDelete(image.id)}
                                  className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                                >
                                  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="mb-4"
                            />
                            <button
                              onClick={handleUpload}
                              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition> */}
      <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
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
                          {riadId ? 'Edit Riad' : roomId ? 'Edit Room' : userId ? 'Edit User' : 'Edit Item'}
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <h2 className="text-lg font-medium">
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {type === 'room' ? data.riad.name : data.name}
                          </h2>
                          <h3 className="text-md font-medium mt-2">
                            Images for {type.charAt(0).toUpperCase() + type.slice(1)} {id}
                          </h3>
                          <div className="flex flex-wrap mt-4">
                            {data.images.map((image) => (
                              <div key={image.id} className="relative w-32 h-32 m-2">
                                <img
                                  src={`http://localhost:8000${image.imageUrl}`}
                                  alt={image.imageName}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => handleDelete(image.id)}
                                  className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                                >
                                  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="mb-4"
                            />
                            <button
                              onClick={handleUpload}
                              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
    </>
  );
}



