'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Card, Button, Slider } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableRowSelection } from 'antd/es/table/interface';
import { Dog } from '../interfaces';
import { Select, Space, Modal, message } from 'antd';
import type { SelectProps } from 'antd';
import { useRouter } from 'next/navigation';
import { SignOutButton } from '@/components/SignOutButton';
import { fetchZipCodesByLocation } from './fetch/location';
import { fetchDogsByFilters } from './fetch/dogs';
import { fetchMatch } from './fetch/match';
import { Search } from '@/components/search';
import { Header } from '@/components/header';





// Table columns configuration
const columns: TableProps<Dog>['columns'] = [
  {
    title: 'Image',
    dataIndex: 'img',
    key: 'img',
    render: (img: string) => (
      <img
        src={img}
        alt="Dog"
        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Breed',
    dataIndex: 'breed',
    key: 'breed',
    filterable: true,
    sorter: (a, b) => a.breed.localeCompare(b.breed),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Zip Code',
    dataIndex: 'zip_code',
    key: 'zip_code',
  },
];


export default function DogsPage() {
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([])
  const [breeds, setBreeds] = useState()
  const [nextPage, setNextPage] = useState<string>('/dogs/search?sort=breed:asc')
  const [locationSearch, setLocationSearch] = useState<string>()
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(20)
  const [total, setTotal] = useState()
  const [match, setMatch] = useState<Dog>()

  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };




  // Row selection configuration
  const rowSelection: TableRowSelection<Dog> = {
    selectedRowKeys: selectedDogs,
    onChange: (selectedRowKeys) => {
      setSelectedDogs(selectedRowKeys as string[]);
    },
  };



  console.log('selectdogs', selectedDogs)



  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };








  const onChange = (e: any) => {
    const [min, max] = e
    setMinAge(min)
    setMaxAge(max)

  };



  console.log('selectedBreeds', selectedBreeds)
  console.log('locationSearch', locationSearch)
  console.log('minAge', minAge)
  console.log('maxAge', maxAge)

  const handleSearch = async () => {
    try {

      let zipcode: string[] = []

      if (locationSearch) {
        zipcode = await fetchZipCodesByLocation(locationSearch)
      }
      const result = await fetchDogsByFilters(selectedBreeds, minAge, maxAge, zipcode, true, '')
      console.log('data', result)
      setDogs(result.data)
      setNextPage(result.next)
      setTotal(result.total)

    } catch (error) {
      console.log('error', error)
    }
  }

  const handleMatch = async () => {
    try {

      const match = await fetchMatch(selectedDogs)

      const findDog = dogs.find(dog => dog.id === match)
      setMatch(findDog)
      showModal()
    } catch (e) {
      console.log('error', e)
      error()
    }

  }


  const tableOnChange = async (page: number, pageSize: number) => {



    console.log(page, pageSize)
    if (page >= Math.ceil((dogs.length / pageSize)) - 1 && nextPage) {

      console.log('fetchAPI')
      const result = await fetchDogsByFilters(selectedBreeds, minAge, maxAge, [], false, nextPage)


      setDogs([...dogs, ...result.data])
      setNextPage(result.next)
    }

  }

  // Add data fetching
  const fetchBreeds = async () => {
    setLoading(true);
    try {

      const response3 = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/dogs/breeds', {
        credentials: 'include',
        method: 'GET',

        headers: {
          'Accept': 'application/json',
        }
      });
      const breeds = await response3.json()

      console.log('breeds', breeds)
      // await fetchAPI()

      handleSearch()

      // console.log('data', dogs)
      setBreeds(breeds.map((breed: string) => ({ label: breed, value: breed })))


    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBreeds()

  }, [])




  return (
    <>
          {contextHolder}
          <Header/>

 
      <div className="p-6">
        <Card>
          <Search breeds={breeds} handleMatch={handleMatch} handleSearch={handleSearch} onChange={onChange} setLocationSearch={setLocationSearch} setSelectedBreeds={setSelectedBreeds} />

          {total && <div className='bg-sky-400'>
            <p>{selectedBreeds.join(', ') + ' in ' + (locationSearch || "United States") + ' between ages ' + minAge + " - " + maxAge}</p>
            <p>{total} Results</p>

          </div>}

          <Table<Dog>
            loading={loading}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dogs}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              onChange: tableOnChange
            }}
          />
        </Card>
      </div>

      <Modal
        title="🐶 You've Got a Match!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        {match ? (
          <div className="flex flex-col items-center text-center">
            <img
              src={match.img}
              alt={match.name}
              className="w-48 h-48 rounded-lg object-cover shadow-lg mb-4"
            />
            <h2 className="text-xl font-semibold">{match.name}</h2>
            <p className="text-gray-600">{match.age} years old</p>
            <p className="text-gray-600">{match.breed}</p>
            <p className="text-gray-500">📍 Located in {match.zip_code}</p>

            <button
              onClick={handleOk}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Learn More
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No match found.</p>
        )}
      </Modal>


    </>





  );
}


// General Requirements
// You first should have users enter their name and email on a login screen. Then, you should use this information to hit our login endpoint to authenticate with our service (see API Reference below).

// Once a user is successfully authenticated, they should be brought to a search page where they can browse available dogs. This page must meet the following requirements:

// Users must be able to filter by breed
// Results should be paginated
// Results should be sorted alphabetically by breed by default. Users should be able to modify this sort to be ascending or descending.
// All fields of the Dog object (except for id) must be presented in some form
// Users should be able to select their favorite dogs from the search results. When finished searching, they should be able to generate a match based on dogs added to the favorites list. A single match will be generated by sending all favorited dog IDs to the /dogs/match endpoint. You should display this match however you see fit.

// As for everything else, you have free rein, so get creative! We strongly encourage you to go beyond the minimum requirements to build something that showcases your strengths.

// You may find it helpful to make use of a component library.



// State: 
// breedFilter: string
// dataLength =  25: number , 10, 15, pageSize
// sort breed by default , sorting = ascending / descending 
// favorites: string [] - of dogs ids


// actions 
// find match button 
// breed search / filter
// location search / filter 
// - returns location , use zipcode, to use dog search
// - use map
// filter by age 
