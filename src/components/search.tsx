import { Input, Button, Slider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Select, Space, } from 'antd';
import type { SelectProps } from 'antd';


const CustomSelect = ({ breeds , setSelectedBreeds }) => {


    const options: SelectProps['options'] = breeds || [];



    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);

        setSelectedBreeds(value)
    };


    return <Space style={{ width: '50%' }} direction="vertical">
        <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
            onChange={handleChange}
            options={options}
        />
    </Space>
}


export const Search = ({ breeds, handleSearch, handleMatch, onChange, setSelectedBreeds, setLocationSearch }) => {
    return <div className="mb-4 flex  justify-between ">

        <CustomSelect breeds={breeds} setSelectedBreeds={setSelectedBreeds} />
        <div>
            <label>Age: </label>
            <Slider className=' w-16' range defaultValue={[0, 20]} max={20} onChange={onChange} />
        </div>
        <div className=' w-48'>
            <Input prefix={<SearchOutlined />} placeholder={"City, State, or zip code"} onChange={(e) => {
                console.log(e.target.value)
                setLocationSearch(e.target.value)

            }} />

        </div>


        <Button className=' w-16' type="default" htmlType="button" onClick={handleSearch}>
            Search
        </Button>

        <Button className=' w-16' type="primary" htmlType="button" onClick={handleMatch}>
            Find Match
        </Button>


    </div>
}