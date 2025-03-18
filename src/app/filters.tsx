import { Card, Button } from 'antd';
import { SelectProps } from 'antd';
import Accordian from '@/components/accordian';

interface FiltersProps {
    selectedBreeds: string[];
    breeds: SelectProps['options'];
    setSelectedBreeds: (breeds: string[]) => void;
    onChange: (e: any) => void;
    handleSearch: () => void;
    result: React.ReactNode;
    setLocationSearch: (locationSearch: string) => void
}

export function Filters({
    selectedBreeds,
    breeds,
    setSelectedBreeds,
    onChange,
    handleSearch,
    result,
    setLocationSearch
}: FiltersProps) {
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
                    <Button className='w-24' type="default" htmlType="button" onClick={() => {
                        setSelectedBreeds([])
                        setLocationSearch('')
                        onChange([])
                    }}>
                        Clear Filters
                    </Button>
                </div>

            </div>

            <Accordian
          
                selectedBreeds={selectedBreeds}
                breeds={breeds}
                setSelectedBreeds={setSelectedBreeds}
                onChange={onChange}
                setLocationSearch={setLocationSearch}
            />

            {result && (
                <div className='my-4 bg-sky-400 rounded-lg p-2'>
                    {result}
                </div>
            )}
        </Card>
    );
}