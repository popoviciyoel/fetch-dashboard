import React from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

// Define props interface
interface CustomRadioProps {
  className?: string;
  value: string | number;
  options: { key: string, label: string; value: string | number }[];
  onChange: (value: string | number) => void;
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
