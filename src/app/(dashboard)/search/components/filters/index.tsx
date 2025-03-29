import { Card, Button } from 'antd';
import { AccordionFilters } from '@/app/(dashboard)/search/components/filters/accordianFilters';
import { useUserProvider } from '@/app/(dashboard)/userProvider';



export function Filters() {

    const { handleSearch, clearFilters, searchResults } = useUserProvider()
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

            <AccordionFilters
            />

            {searchResults && (
                <div className='my-4 bg-sky-400 rounded-lg p-2'>
                    <pre className='text-wrap'>
                        {searchResults}

                    </pre>
                </div>
            )}
        </Card>
    );
}