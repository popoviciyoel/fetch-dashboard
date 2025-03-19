
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons'
import { useUserProvider } from '@/app/userProvider';


interface CustomSelectProps {
    availableBreeds: SelectProps['options']
    selectedBreeds: string[]
    handleBreedFilter: (selectedBreeds: string[]) => void

}

export const CustomSelect = ({ availableBreeds, selectedBreeds, handleBreedFilter }: CustomSelectProps) => {





    return <div className='w-full'
    >
        <Select
            mode="multiple"
            // allowClear
            prefix={selectedBreeds?.length > 0 && <span>{selectedBreeds?.length}</span>}
            className='w-full'
            placeholder="Select Breeds"
            onChange={handleBreedFilter}
            options={availableBreeds}
            maxTagCount={0} // Hides tags in the input field
            value={selectedBreeds} // Display the selected values
            tagRender={() => null} // Hides individual tags
        />
        <div className='mt-4 gap-1 flex flex-wrap'>
            {selectedBreeds?.map((displayBreed: string) => {
                return <Tag color="blue" key={displayBreed}>{displayBreed} <CloseOutlined onClick={() => handleBreedFilter(selectedBreeds.filter(breed => breed !== displayBreed))} /></Tag>

            })}

        </div>

    </div>

}

