import React from 'react';
import type { CollapseProps, SliderSingleProps } from 'antd';
import { Collapse, Input, Slider } from 'antd';
import { CustomSelect } from './customSelect';
import { SortBy } from './sortBy';
import {  useUserProvider } from '@/app/(dashboard)/userProvider';
import { Filters } from '@/app/(dashboard)/interfaces';

// Age slider marks
const AGE_MARKS: SliderSingleProps['marks'] = {
  0: '0 yrs',
  10: '10 yrs',
  20: '20 yrs',
};

export const AccordionFilters: React.FC = () => {
  const { 
    user, 
    handleAgeFilter, 
    handleBreedFilter, 
    handleLocationSearchFilter, 
    handleSortOrder, 
    handleSortField 
  } = useUserProvider();

  // Extract filters with defaults to avoid optional chaining in JSX
  const { availableBreeds, filters } = user ?? {};
  const { breeds = [], locationSearch = '' } = filters as Filters;

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Breed',
      children: <CustomSelect availableBreeds={availableBreeds} selectedBreeds={breeds} handleBreedFilter={handleBreedFilter} />,
    },
    {
      key: '2',
      label: 'Age',
      children: <Slider marks={AGE_MARKS} range defaultValue={[0, 20]} max={20} onChange={handleAgeFilter} />,
    },
    {
      key: '3',
      label: 'Location',
      children: (
        <Input 
          value={locationSearch} 
          placeholder="City, State, or ZIP code" 
          onChange={handleLocationSearchFilter} 
        />
      ),
    },
    {
      key: '4',
      label: 'Sort By',
      children: <SortBy handleSortField={handleSortField} handleSortOrder={handleSortOrder} filters={filters} />,
    },
  ];

  return <Collapse items={items} defaultActiveKey={['1']} />;
};

