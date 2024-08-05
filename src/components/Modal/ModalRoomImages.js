import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Admin/token/config';

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

const uploadImage = async ({ roomId, formData }) => {
  try {
    console.log('Uploading image with formData:', formData);
    const response = await axiosInstance.post('/room_images', formData, {
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

const deleteImage = async (imageId) => {
  try {
    await axiosInstance.delete(`/room_images/${imageId}`);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export default function ModalRoomImages({ roomId }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const { data: roomData, error, isLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => fetchRoomData(roomId),
    onError: (error) => {
      if (error.response?.status === 404) {
        console.error('Room not found');
        setOpen(false);
      }
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ roomId, formData }) => uploadImage({ roomId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['room', roomId]);
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['room', roomId]);
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('imageFile', file);
    formData.append('room', `${roomId}`);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    uploadMutation.mutate({ roomId, formData });
  };

  const handleDelete = (imageId) => {
    deleteMutation.mutate(imageId);
  };

  if (isLoading) return <div>Loading images...</div>;
  if (error) return <div>Error loading images</div>;

  if (roomData === null) return <div>Room not found</div>;

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-indigo-600 hover:text-indigo-900">
        Upload Image
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
                            Upload Image
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
                        <div>
                          <h2>Images for Room {roomId}</h2>
                          <div className="flex flex-wrap">
                            {roomData.images.map((image) => (
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
      </Transition>
    </>
  );
}
