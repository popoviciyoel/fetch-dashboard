import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback, useMemo } from 'react';

interface CustomSelectProps {
    availableBreeds: SelectProps['options'];
    selectedBreeds: string[];
    handleBreedFilter: (selectedBreeds: string[]) => void;
}

export const CustomSelect = ({ availableBreeds, selectedBreeds, handleBreedFilter }: CustomSelectProps) => {
    const hasBreedsSelected = useMemo(() => selectedBreeds.length > 0, [selectedBreeds]);

    const handleRemoveBreed = useCallback((breedToRemove: string) => {
        handleBreedFilter(selectedBreeds.filter(breed => breed !== breedToRemove));
    }, [selectedBreeds, handleBreedFilter]);

    return (
        <div className="w-full">
            <Select
                mode="multiple"
                prefix={hasBreedsSelected && <span>{selectedBreeds.length}</span>}
                className="w-full"
                placeholder="Select Breeds"
                onChange={handleBreedFilter}
                options={availableBreeds}
                maxTagCount={0} // Hides tags in the input field
                value={selectedBreeds} // Display the selected values
                tagRender={() => <></>} 
            />
            {hasBreedsSelected && (
                <div className="mt-4 gap-1 flex flex-wrap">
                    {selectedBreeds.map((displayBreed) => (
                        <Tag color="blue" key={displayBreed}>
                            {displayBreed}{' '}
                            <CloseOutlined onClick={() => handleRemoveBreed(displayBreed)} />
                        </Tag>
                    ))}
                </div>
            )}
        </div>
    );
};
