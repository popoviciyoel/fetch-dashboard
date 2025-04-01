import React, { useState } from "react"
import { Dog } from "@/app/(dashboard)/interfaces"
import { Checkbox, CheckboxOptionType, Table, type TableProps } from 'antd';
import { useUserProvider } from "@/app/(dashboard)/userProvider";
import type { TableRowSelection } from 'antd/es/table/interface';
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { NoResults } from "./noResults";

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
  selectedDogs: Dog[]
  setSelectedDogs: (selectedDogs: Dog[]) => void,
}

const defaultCheckedList = columns.map((item) => item.key);


export const DogTable = ({ selectedDogs, setSelectedDogs }: DogTableProps) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const { loading, onChangeTable, query, data } = useUserProvider()
  const param = useSearchParams()


  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key as string),
  }));


  const rowSelection: TableRowSelection<Dog> = {
    // Use all selectedDogs from the parent state
    selectedRowKeys: selectedDogs.map(dog => dog.id),
    onChange: (selectedRowKeys) => {
      if (!data) return;
  
      // Step 1: Map selectedRowKeys to dog objects from current page's data
      const selectedFromCurrentPage = data.filter(dog => selectedRowKeys.includes(dog.id));
  
      // Step 2: Keep selected dogs from other pages
      const currentPageIds = data.map(dog => dog.id);
      const selectedFromOtherPages = selectedDogs.filter(dog => !currentPageIds.includes(dog.id));
  
      // Step 3: Merge and update
      setSelectedDogs([...selectedFromOtherPages, ...selectedFromCurrentPage]);
    },
  };
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));


  const paginationConfig = {
    pageSize: 10,
    showSizeChanger: false,
    onChange: onChangeTable,
    total: query?.total,
    showQuickJumper: true,
    current: Number(param.get('page'))
  }


  return <>
  <div       className=" mb-4"
  >
    <Checkbox.Group
      value={checkedList}
      options={options as CheckboxOptionType[]}
      onChange={(value) => {
        setCheckedList(value as string[]);
      }}
    />
    </div>

    <Table<Dog>
      className=" m-w-full overflow-x-auto"
      loading={loading}
      rowSelection={rowSelection}
      columns={newColumns}
      dataSource={data}
      rowKey="id"
      pagination={paginationConfig}
      locale={{ emptyText: <NoResults /> }}

    />
  </>

}


