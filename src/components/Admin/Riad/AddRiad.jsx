
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OpenContext } from '../../../contexts/OpenContext';
import axios from 'axios';
import * as yup from 'yup';
export default function AddRiad() {

  const schema = yup.object().shape({
    name: yup.string().required('Name is required').max(100, 'Name cannot exceed 100 characters'),
    description: yup.string().required('Description is required').max(500, 'Description cannot exceed 500 characters'),
    address: yup.string().required('Address is required').max(200, 'Address cannot exceed 200 characters'),
    city: yup.string().required('City is required').max(100, 'City cannot exceed 100 characters'),
});
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { closeModal } = useContext(OpenContext); // Correctly use closeModal function
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addRiad,
    onSuccess: () => {
      queryClient.invalidateQueries(['riads']);
      closeModal('modalAdd'); // Use the closeModal function to close the modal
    },
    onError: (error) => {
      console.error('Adding riad failed:', error);
    }
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('city', data.city);

    Array.from(images).forEach((image) => {
      formData.append('images[]', image);
    });

    mutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of the new riad below.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("name")}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("description")}
                  />
                  {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("address")}
                  />
                  {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                  City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register("city")}
                  />
                  {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
                  Images
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    name="images"
                    id="images"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => closeModal('modalAdd')}>Cancel</button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
