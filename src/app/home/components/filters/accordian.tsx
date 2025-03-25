import React from 'react';
import type { CollapseProps, SliderSingleProps } from 'antd';
import { Collapse, Flex, Input, Select, Slider } from 'antd';
import { CustomSelect } from './customSelect';
import { SearchOutlined } from '@ant-design/icons';
import { useUserProvider } from '@/app/userProvider';
import { CustomRadio } from '../../../../components/radio';
import { SortField, SortOrder } from '@/interfaces';


const sortFieldOptions = Object.values(SortField).map((value) => {
    return { label: value, value: value }
})

const sortOrderOptions = [
    {
        key: '0',
        value: SortOrder.ASC,
        label: (
            <Flex gap="small" justify="center" align="center" vertical>
                Ascending
            </Flex>
        ),
    },
    {
        key: '1',

        value: SortOrder.DESC,
        label: (
            <Flex gap="small" justify="center" align="center" vertical>
                Descending
            </Flex>
        ),
    }
]

const marks: SliderSingleProps['marks'] = {
    0: '0 yrs',
    10: '10 yrs',
    20: '20 yrs'
};


const Accordian: React.FC = () => {
  
    const { user, handleAgeFilter, handleBreedFilter, handleLocationSearchFilter, handleSortOrder, handleSortField } = useUserProvider()




    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Breed',
            children: <CustomSelect availableBreeds={user?.availableBreeds} selectedBreeds={user?.filters?.breeds} handleBreedFilter={handleBreedFilter} />,
        },
        {
            key: '2',
            label: 'Age',
            children: <Slider marks={marks} range defaultValue={[0, 20]} max={20} onChange={handleAgeFilter} />
            ,
        },
        {
            key: '3',
            label: 'Location',
            children: <Input prefix={<SearchOutlined />} value={user?.filters.locationSearch} placeholder={"City, State, or zip code"} onChange={handleLocationSearchFilter} />
        },
        {
            key: '4',
            label: 'Sort By',
            children: <div>
                <Select
                    className='w-full'
                    placeholder="Select field"
                    onChange={handleSortField}
                    options={sortFieldOptions}
                    value={user?.filters.field} // Display the selected values
                />
                <CustomRadio className={'mt-4'} value={user?.filters.order} options={sortOrderOptions} onChange={handleSortOrder} />

            </div>
        },
    ];

    return <Collapse items={items} defaultActiveKey={['1']}  />;
};

export default Accordian;