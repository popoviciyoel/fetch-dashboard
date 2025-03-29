import React from "react"
import { Dog } from "@/app/(dashboard)/interfaces"
import { Table, type TableProps } from 'antd';
import { useUserProvider } from "@/app/(dashboard)/userProvider";
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
        style={{ borderRadius: '4px', width: 50, height: 50 }}
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
}


export const DogTable = ({ selectedDogs, setSelectedDogs }: DogTableProps) => {

  const { loading, onChangeTable, query, data } = useUserProvider()
  const param = useSearchParams()

  console.log('data', data, selectedDogs)



  const rowSelection: TableRowSelection<Dog> = {
    // Use all selectedDogs from the parent state
    selectedRowKeys: selectedDogs,
    onChange: (selectedRowKeys) => {
      // Determine all keys currently visible in this page's data
      const currentPageKeys = data ? data.map((dog) => dog.id) : [];
      // Remove any keys from the current page already stored in selectedDogs,
      // so that we don't accidentally drop selections from other pages.
      const remainingSelections = selectedDogs.filter((key) => !currentPageKeys.includes(key));
      // Merge the remaining (previous page) selections with the new current page selections
      setSelectedDogs([...remainingSelections, ...(selectedRowKeys as string[])]);
    },
  };
  

  const paginationConfig = {
    pageSize: 10,
    showSizeChanger: false,
    onChange: onChangeTable,
    total: query?.total,
    showQuickJumper: true,
    current: Number(param.get('page'))
  }


  return <Table<Dog>
    loading={loading}
    rowSelection={rowSelection}
    columns={columns}
    dataSource={data}
    rowKey="id"
    pagination={paginationConfig}
  />
}
