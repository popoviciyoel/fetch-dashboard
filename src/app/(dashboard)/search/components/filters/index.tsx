import { Card, Button } from 'antd';
import { AccordionFilters } from '@/app/(dashboard)/search/components/filters/accordianFilters';
import { useUserProvider } from '@/app/(dashboard)/userProvider';
import { SearchOutlined } from '@ant-design/icons'


export function Filters() {

    const { handleSearch, clearFilters, searchResults } = useUserProvider()
    return (


        <Card className=' sticky!   top-20!'>
            <div className='flex justify-between lg:text-2xl md:text-lg text-m'>

                <h1 className='mb-4 font-bold '>
                    Filters
                </h1>
                <div className=' flex gap-2'>
                    <Button className='lg:w-24 md:w-10 w-8' icon={<SearchOutlined />} type="primary" htmlType="button" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button className='lg:w-24 md:w-12 w-8' type="default" htmlType="button" onClick={clearFilters
                    }>
                        Clear Filters
                    </Button>
                </div>

            </div>

            <AccordionFilters
            />

            {searchResults && (
                <div className='my-4 rounded-lg p-2' style={{ background: '#1677ff' }}>
                    <pre className='text-wrap text-white'>
                        {searchResults}

                    </pre>
                </div>
            )}
        </Card>

    );
}