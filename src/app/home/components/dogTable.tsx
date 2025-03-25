import React from "react"
import { Dog } from "@/interfaces"
import { Table, type TableProps } from 'antd';
import { useUserProvider } from "@/app/userProvider";
import type { TableRowSelection } from 'antd/es/table/interface';
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// Table columns configuration
export const columns: TableProps<Dog>['columns'] = [
  {
    title: 'Image',
    dataIndex: 'img',
    key: 'img',
    render: (img: string) => (
      <Image
        width={50}
        height={50}
        objectFit="cover"


        src={img}
        alt="Dog"
        style={{ borderRadius: '4px' }}
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Breed',
    dataIndex: 'breed',
    key: 'breed',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
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


export const DogTable = ({ selectedDogs, setSelectedDogs }: DogTableProps) => {

  const { loading, onChangeTable, query, data } = useUserProvider()
  const param = useSearchParams()

  console.log('data', data)



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
    dataSource={data}
    rowKey="id"
    pagination={{
      pageSize: 10,
      showSizeChanger: true,
      onChange: onChangeTable,
      total: query?.total,
      current: Number(param.get('page'))
    }}
  />
}
