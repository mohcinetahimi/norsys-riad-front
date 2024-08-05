import React, { useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { OpenContext } from '../../../contexts/OpenContext';
import AddRiad from '../Riad/AddRiad';
import ModalAdd from '../../Modal/ModalAdd';
import ModalEdit from '../../Modal/ModalEdit';
import ModalImagesRiad from '../../Modal/ModalImagesRiad';


const fetchRiads = async () => {
  const { data } = await axios.get('http://localhost:8000/api/riads');
  return data;
};

export default function Table() {
  const { modals, openModal, closeModal } = useContext(OpenContext);
  const queryClient = useQueryClient();
  const { data: riads = [], error, isLoading } = useQuery({
    queryKey: ['riads'],
    queryFn: fetchRiads
  });

  const deleteRiad = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/riads/${id}`);
      queryClient.invalidateQueries(['riads']);
    } catch (error) {
      console.error("There was an error deleting the riad!", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <input 
        className='ml-44 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out' 
        type='text' 
        placeholder='Start your search...' 
        // Your search implementation here
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Riads</h1>
          <p className="mt-2 text-sm text-gray-700">A table of Riads.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              console.log("I click the Add BButtonn");
              console.log(modals);
              openModal('modalAdd')
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >

            Add
          </button>
          <ModalAdd></ModalAdd>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Riad ID
                  </th>
                  <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Address
                  </th>
                  <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
                    City
                  </th>
                  <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {riads['hydra:member'].map((riad) => (
                  <tr key={riad.id}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{riad.id}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{riad.name}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{riad.description}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{riad.address}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{riad.city}</td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <ModalEdit riadId={riad.id} />
                      <button
                        type="button"
                        onClick={() => deleteRiad(riad.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </button>
                      <ModalImagesRiad riadId={riad.id}></ModalImagesRiad>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
