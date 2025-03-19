import React from 'react';
import type { CollapseProps, SelectProps, SliderSingleProps } from 'antd';
import { Collapse, Input, Slider } from 'antd';
import { CustomSelect } from './search';
import { SearchOutlined } from '@ant-design/icons';
import { useUserProvider } from '@/app/userProvider';


const Accordian: React.FC = () => {
    const onChangeActiveAccordian = (key: string | string[]) => {
        console.log(key);
    };

    const { user, handleAgeFilter, handleBreedFilter, handleLocationSearchFilter } = useUserProvider()

    const marks: SliderSingleProps['marks'] = {
        0: '0 yrs',
        10: '10 yrs',
        20: '20 yrs'
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Breed',
            children: <CustomSelect availableBreeds={user?.availableBreeds} selectedBreeds={user?.filters?.selectedBreeds} handleBreedFilter={handleBreedFilter} />,
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
    ];

    return <Collapse items={items} defaultActiveKey={['1']} onChange={onChangeActiveAccordian} />;
};

export default Accordian;