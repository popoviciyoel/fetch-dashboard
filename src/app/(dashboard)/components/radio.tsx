import React, { JSX } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { SortOrder } from '../interfaces';

// Define props interface
interface CustomRadioProps {
  className?: string;
  value: string | number;
  options: { key: string, label: JSX.Element; value: string | number }[];
  onChange: (value: SortOrder) => void;
}

export const CustomRadio: React.FC<CustomRadioProps> = ({ className, value, options, onChange }) => {
  const handleOnChange = (e: RadioChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <Radio.Group
      className={className}
      onChange={handleOnChange}
      value={value}
      options={options}
    />
  );
};
