import React from 'react';
import type { CollapseProps, SelectProps, SliderSingleProps } from 'antd';
import { Collapse, Input, Slider } from 'antd';
import { CustomSelect } from './search';
import { SearchOutlined } from '@ant-design/icons';

interface AccordianProps {
    selectedBreeds: string[];
    breeds: SelectProps['options'];
    setSelectedBreeds: (breeds: string[]) => void;
    onChange: (value: [number, number]) => void;
    setLocationSearch: (location: string) => void;
  }
  

const Accordian: React.FC<AccordianProps> = ({ selectedBreeds, breeds, setSelectedBreeds, onChange, setLocationSearch }) => {
    const onChangeActiveAccordian = (key: string | string[]) => {
        console.log(key);
    };

    const marks: SliderSingleProps['marks'] = {
        0: '0 yrs',
        10: '10 yrs',
        20: '20 yrs'
    };

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Breed',
            children: <CustomSelect selectedBreeds={selectedBreeds} breeds={breeds} setSelectedBreeds={setSelectedBreeds} />,
        },
        {
            key: '2',
            label: 'Age',
            children: <Slider marks={marks} range defaultValue={[0, 20]} max={20} onChange={onChange} />
            ,
        },
        {
            key: '3',
            label: 'Location',
            children: <Input prefix={<SearchOutlined />} placeholder={"City, State, or zip code"} onChange={(e) => {
                console.log(e.target.value)
                setLocationSearch(e.target.value)

            }} />
        },
    ];

    return <Collapse items={items} defaultActiveKey={['1']} onChange={onChangeActiveAccordian} />;
};

export default Accordian;