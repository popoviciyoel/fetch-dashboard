import { SortField, SortOrder } from '@/app/(dashboard)/interfaces';
import { CustomRadio } from '../../../components/radio';
import { Flex, Select } from 'antd';

interface SortByProps {
  handleSortField: (value: SortField) => void;
  handleSortOrder: (value: SortOrder) => void;
  filters: { field: SortField; order: SortOrder };
}

// Generate sort field options dynamically
const sortFieldOptions = Object.values(SortField).map((value) => ({
  label: value,
  value,
}));

// Define sort order options
const sortOrderOptions = [
  {
    key: 'asc',
    value: SortOrder.ASC,
    label: (
      <Flex gap="small" justify="center" align="center" vertical>
        Ascending
      </Flex>
    ),
  },
  {
    key: 'desc',
    value: SortOrder.DESC,
    label: (
      <Flex gap="small" justify="center" align="center" vertical>
        Descending
      </Flex>
    ),
  },
];

export const SortBy = ({ handleSortField, handleSortOrder, filters }: SortByProps) => {
  return (
    <div>
      {/* Sort field selection */}
      <Select
        className="w-full mb-4"
        placeholder="Select field"
        onChange={handleSortField}
        options={sortFieldOptions}
        value={filters.field}
      />

      {/* Sort order selection */}
      <div className="mt-4">
        <CustomRadio value={filters.order} options={sortOrderOptions} onChange={handleSortOrder} />
      </div>
    </div>
  );
};
