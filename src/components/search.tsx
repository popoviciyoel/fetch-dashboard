
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons'


interface CustomSelectProps {
    selectedBreeds: string[]
    breeds: SelectProps['options']
    setSelectedBreeds: (selectedBreeds: string[]) => void

}

export const CustomSelect = ({ selectedBreeds, breeds, setSelectedBreeds }: CustomSelectProps) => {


    const options: SelectProps['options'] = breeds || [];



    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);

        setSelectedBreeds(value)
    };


    return <div className='w-full'
    >
        <Select
            mode="multiple"
            // allowClear
            prefix={selectedBreeds?.length > 0  ? <span>{selectedBreeds?.length}</span> : null}
            className='w-full'
            placeholder="Select Breeds"
            onChange={handleChange}
            options={options}
            maxTagCount={0} // Hides tags in the input field

            value={selectedBreeds} // Display the selected values
            // Optionally, format the displayed values to show just the numbers
            // tagRender={({ label }) => label} // Show only the numbers (if needed)
            // labelRender={selectedBreeds.length}
            tagRender={() => null} // Hides individual tags
        />
        <div className='mt-4 gap-1 flex flex-wrap'>
            {selectedBreeds?.map((displayBreed: string) => {
                return <Tag color="blue" key={displayBreed}>{displayBreed} <CloseOutlined onClick={() => handleChange(selectedBreeds.filter(breed => breed !== displayBreed))} /></Tag>

            })}

        </div>

    </div>

}

