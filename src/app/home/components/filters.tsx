import { Card, Button } from 'antd';
import Accordian from '@/components/accordian';
import { useUserProvider } from '../../userProvider';



export function Filters() {

    const { handleSearch, clearFilters, searchResult } = useUserProvider()
    return (
        <Card>
            <div className='flex justify-between'>
                <h1 className='mb-4 font-bold text-2xl'>
                    Filters
                </h1>
                <div className=' flex gap-2'>
                    <Button className='w-16' type="primary" htmlType="button" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button className='w-24' type="default" htmlType="button" onClick={clearFilters
                    }>
                        Clear Filters
                    </Button>
                </div>

            </div>

            <Accordian
            />

            {searchResult && (
                <div className='my-4 bg-sky-400 rounded-lg p-2'>
                    <pre className='text-wrap'>
                        {searchResult}

                    </pre>
                </div>
            )}
        </Card>
    );
}