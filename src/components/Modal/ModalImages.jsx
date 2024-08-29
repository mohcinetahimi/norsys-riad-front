// import { Fragment, useState, useEffect, useContext } from 'react';
// import { Dialog, Transition, DialogPanel, DialogTitle } from '@headlessui/react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axiosInstance from '../Admin/token/config';
// import { OpenContext } from '../../contexts/OpenContext';
// import { useFlashMessage } from '../../contexts/FlashMessageContext'; // Import the context hook

// // Fetch room data
// const fetchRoomData = async (roomId) => {
//   try {
//     const { data } = await axiosInstance.get(`/rooms/${roomId}`);
//     return data;
//   } catch (error) {
//     if (error.response?.status === 404) {
//       return null;
//     }
//     console.error('Error fetching room data:', error);
//     throw error;
//   }
// };

// // Fetch riad data
// const fetchRiadData = async (riadId) => {
//   try {
//     const { data } = await axiosInstance.get(`/riads/${riadId}`);
//     return data;
//   } catch (error) {
//     if (error.response?.status === 404) {
//       return null;
//     }
//     console.error('Error fetching riad data:', error);
//     throw error;
//   }
// };

// // Upload images
// const uploadImages = async ({ id, formData, type }) => {
//   try {
//     const response = await axiosInstance.post(`/${type}_images`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     throw error;
//   }
// };

// // Delete image
// const deleteImage = async (imageId, type) => {
//   if (!imageId) {
//     throw new Error('Image ID is required for deletion');
//   }
//   try {
//     await axiosInstance.delete(`/${type}_images/${imageId}`);
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     throw error;
//   }
// };

// export default function ModalImages({ riadId, roomId }) {
//   const { modals, closeModal } = useContext(OpenContext);
//   const { showFlashMessage } = useFlashMessage(); // Use flash message hook
//   const [open, setOpen] = useState(false);
//   const [files, setFiles] = useState([]); // Update state to handle multiple files
//   const queryClient = useQueryClient();

//   const type = roomId ? 'room' : 'riad';
//   const type2 = roomId ? 'rooom' : 'riiad'; // Corrected typo
//   const id = roomId || riadId;

//   const { data, error, isLoading, isError } = useQuery({
//     queryKey: [type, id],
//     queryFn: () => (type === 'room' ? fetchRoomData(id) : fetchRiadData(id)),
//     onSuccess: (data) => {
//       if (!data) {
//         console.error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
//         setOpen(false);
//       }
//     },
//     onError: (error) => {
//       console.error('Error fetching data:', error);
//       setOpen(false);
//     },
//   });

//   const uploadMutation = useMutation({
//     mutationFn: ({ id, formData }) => uploadImages({ id, formData, type: type2 }),
//     onSuccess: () => {
//       queryClient.invalidateQueries([type, id]);
//       showFlashMessage('Images uploaded successfully!', 'success');
//       setOpen(false);
//     },
//     onError: (error) => {
//       console.error('Error uploading images:', error);
//       showFlashMessage('Failed to upload images.', 'error');
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (imageId) => deleteImage(imageId, type),
//     onSuccess: () => {
//       queryClient.invalidateQueries([type, id]);
//       showFlashMessage('Image deleted successfully!', 'success');
//     },
//     onError: (error) => {
//       console.error('Error deleting image:', error);
//       showFlashMessage('Failed to delete image.', 'error');
//     },
//   });

//   useEffect(() => {
//     if (isError) {
//       console.error('Error fetching data:', error);
//     }
//   }, [isError, error]);

//   const handleFileChange = (event) => {
//     const selectedFiles = Array.from(event.target.files); // Get all selected files
//     setFiles(selectedFiles);
//   };

//   const handleUpload = () => {
//     if (files.length === 0) {
//       console.log('No files selected');
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append('imageFiles[]', file); // Append each file with 'imageFiles[]' name
//     });
//     if (roomId) formData.append('rooom', `${roomId}`);
//     if (riadId) formData.append('riiad', `${riadId}`);

//     uploadMutation.mutate({ id, formData });
//   };

//   const handleDelete = (imageId) => {
//     if (!imageId) {
//       console.error('Image ID is not defined');
//       return;
//     }
//     console.log('Deleting image with ID:', imageId);
//     deleteMutation.mutate(imageId);
//   };

//   useEffect(() => {
//     setOpen(!!modals[`modalImages_${riadId || roomId}`]);
//   }, [modals, riadId, roomId]);

//   const handleClose = () => {
//     setOpen(false);
//     closeModal(`modalImages_${riadId || roomId}`);
//   };

//   if (isLoading) return <div>Loading images...</div>;
//   if (isError) return <div>Error loading images</div>;
//   if (!data || !data.images) return <div>No images found</div>;

//   return (
//     <>
//       <Transition show={open} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={handleClose}>
//           <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
//           <div className="fixed inset-0 overflow-hidden">
//             <div className="absolute inset-0 overflow-hidden">
//               <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
//                 <Transition.Child
//                   enter="transform transition ease-in-out duration-500 sm:duration-700"
//                   enterFrom="translate-x-full"
//                   enterTo="translate-x-0"
//                   leave="transform transition ease-in-out duration-500 sm:duration-700"
//                   leaveFrom="translate-x-0"
//                   leaveTo="translate-x-full"
//                 >
//                   <DialogPanel className="pointer-events-auto w-screen max-w-md">
//                     <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
//                       <div className="px-4 sm:px-6">
//                         <div className="flex items-start justify-between">
//                           <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
//                             {riadId ? 'Edit Riad' : roomId ? 'Edit Room' : 'Edit Item'}
//                           </DialogTitle>
//                           <div className="ml-3 flex h-7 items-center">
//                             <button
//                               type="button"
//                               className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                               onClick={handleClose}
//                             >
//                               <span className="absolute -inset-2.5" />
//                               <span className="sr-only">Close panel</span>
//                               <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="relative mt-6 flex-1 px-4 sm:px-6">
//                         <div className="flex flex-col items-center">
//                           <h2 className="text-lg font-medium">
//                             {type.charAt(0).toUpperCase() + type.slice(1)}: {type === 'room' ? data.riad.name : data.name}
//                           </h2>
//                           <h3 className="text-md font-medium mt-2">
//                             Images for {type.charAt(0).toUpperCase() + type.slice(1)} {id}
//                           </h3>
//                           <div className="flex flex-wrap mt-4">
//                             {data.images.map((image) => (
//                               <div key={image.id} className="relative w-32 h-32 m-2">
//                                 <img
//                                   src={`http://localhost:8000${image.imageUrl}`}
//                                   alt={image.imageName}
//                                   className="w-full h-full object-cover"
//                                 />
//                                 <button
//                                   onClick={() => handleDelete(image.id)}
//                                   className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
//                                 >
//                                   X
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                           <div className="mt-4">
//                             <input
//                               type="file"
//                               multiple
//                               onChange={handleFileChange}
//                               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
//                             />
//                             <button
//                               onClick={handleUpload}
//                               className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                             >
//                               Upload Images
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </DialogPanel>
//                 </Transition.Child>
//               </div>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }



import { Fragment, useState, useEffect, useContext } from 'react';
import { Dialog, Transition, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../Admin/token/config';
import { OpenContext } from '../../contexts/OpenContext';
import { useFlashMessage } from '../../contexts/FlashMessageContext';

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

// Upload images
const uploadImages = async ({ id, formData, type }) => {
  try {
    const response = await axiosInstance.post(`/${type}_images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error);
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
  const { modals, closeModal } = useContext(OpenContext);
  const { showFlashMessage } = useFlashMessage();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const queryClient = useQueryClient();

  const type = roomId ? 'room' : 'riad';
  const type2 = roomId ? 'rooom' : 'riiad'; // Corrected typo
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
    mutationFn: ({ id, formData }) => uploadImages({ id, formData, type: type2 }),
    onSuccess: () => {
      queryClient.invalidateQueries([type, id]);
      showFlashMessage('Images uploaded successfully!', 'success');
      setOpen(false);
    },
    onError: (error) => {
      console.error('Error uploading images:', error);
      showFlashMessage('Failed to upload images.', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => deleteImage(imageId, type),
    onSuccess: () => {
      queryClient.invalidateQueries([type, id]);
      showFlashMessage('Image deleted successfully!', 'success');
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      showFlashMessage('Failed to delete image.', 'error');
    },
  });

  useEffect(() => {
    if (isError) {
      console.error('Error fetching data:', error);
    }
  }, [isError, error]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      console.log('No files selected');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('imageFiles[]', file);
    });
    if (roomId) formData.append('rooom', `${roomId}`);
    if (riadId) formData.append('riiad', `${riadId}`);

    uploadMutation.mutate({ id, formData });
  };

  const handleDelete = (imageId) => {
    if (!imageId) {
      console.error('Image ID is not defined');
      return;
    }
    deleteMutation.mutate(imageId);
  };

  useEffect(() => {
    setOpen(!!modals[`modalImages_${riadId || roomId}`]);
  }, [modals, riadId, roomId]);

  const handleClose = () => {
    setOpen(false);
    closeModal(`modalImages_${riadId || roomId}`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  if (isLoading) return <div>Loading images...</div>;
  if (isError) return <div>Error loading images</div>;
  if (!data || !data.images) return <div>No images found</div>;

  return (
    <>
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
                            {riadId ? 'Edit Riad' : roomId ? 'Edit Room' : 'Edit Item'}
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
                        <div className="flex flex-col items-center">
                          <h2 className="text-lg font-medium">
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {type === 'room' ? data.riad.name : data.name}
                          </h2>
                          <h3 className="text-md font-medium mt-2">
                            Images for {type.charAt(0).toUpperCase() + type.slice(1)} {id}
                          </h3>
                          <div className="flex flex-wrap mt-4">
                            {data.images.map((image) => (
                              <div key={image.id} className="relative w-32 h-32 m-2 cursor-pointer">
                                <img
                                  src={`http://localhost:8000${image.imageUrl}`}
                                  alt={image.imageName}
                                  className="w-full h-full object-cover"
                                  onClick={() => handleImageClick(`http://localhost:8000${image.imageUrl}`)}
                                />
                                <button
                                  onClick={() => handleDelete(image.id)}
                                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                >
                                  <span className="sr-only">Delete image</span>
                                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <input type="file" multiple onChange={handleFileChange} />
                            <button
                              type="button"
                              onClick={handleUpload}
                              disabled={files.length === 0 || uploadMutation.isLoading}
                              className={`mt-4 text-white px-4 py-2 rounded ${files.length === 0 || uploadMutation.isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
                            >
                              {uploadMutation.isLoading ? 'Uploading...' : 'Upload Images'}
                            </button>

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

      {/* Lightbox */}
      {selectedImage && (
        <Transition show={!!selectedImage} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center" onClose={handleCloseLightbox}>
            <div className="absolute inset-0 bg-black bg-opacity-75" aria-hidden="true" />
            <div className="relative bg-white p-4 rounded-lg max-w-screen-sm max-h-screen mx-auto">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={handleCloseLightbox}
              >
                <span className="sr-only">Close lightbox</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <img src={selectedImage} alt="Selected" className="max-w-full max-h-[80vh] object-contain" />
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
}
