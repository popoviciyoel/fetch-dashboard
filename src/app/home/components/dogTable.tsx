import React from "react"
import { Dog } from "@/interfaces"
import { Table, type TableProps } from 'antd';
import { useUserProvider } from "@/app/userProvider";
import type { TableRowSelection } from 'antd/es/table/interface';

// Table columns configuration
export const columns: TableProps<Dog>['columns'] = [
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
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: 'County',
    dataIndex: 'county',
    key: 'county',
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
  },
];

interface DogTableProps {
  selectedDogs: string[]
  setSelectedDogs: (selectedDogs: string[]) => void,
  results?: Dog[]
}


export const DogTable = ({ selectedDogs, setSelectedDogs, results }: DogTableProps) => {

  const { loading, onChangeTable, searchResult } = useUserProvider()

  // Row selection configuration
  const rowSelection: TableRowSelection<Dog> = {
    selectedRowKeys: selectedDogs,
    onChange: (selectedRowKeys) => {
      setSelectedDogs(selectedRowKeys as string[]);
    },
  };


  return <Table<Dog>
    loading={loading}
    rowSelection={rowSelection}
    columns={columns}
    dataSource={results}
    rowKey="id"
    pagination={{
      pageSize: 10,
      showSizeChanger: true,
      onChange: onChangeTable,
      total: Number(searchResult)
    }}
  />
}
