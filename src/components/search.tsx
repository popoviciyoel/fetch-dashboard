
import { Select, Tag } from 'antd';
import type { SelectProps } from 'antd';


export const CustomSelect = ({ selectedBreeds, breeds, setSelectedBreeds }) => {


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
            className='w-full'
            placeholder="Select Breeds"
            onChange={handleChange}
            options={options}
            value={undefined} // Display the selected values
        // Optionally, format the displayed values to show just the numbers
        // tagRender={({ label }) => label} // Show only the numbers (if needed)
        // labelRender={selectedBreeds.length}
        />
        <div>
            {selectedBreeds?.map((breed: string) => {
                return <Tag color="blue">{breed}</Tag>

            })}

        </div>

    </div>

}

