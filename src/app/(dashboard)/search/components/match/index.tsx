import { Dog } from '@/app/(dashboard)/interfaces';
import { Modal } from 'antd';
import Image from 'next/image'
import Lottie from 'react-lottie';
import animationData from './matchedAnimation.json'

interface MatchProps {
    match: Dog | null
    isModalOpen: boolean
    setIsModalOpen: (isModalOpen: boolean) => void
}


export const Match = ({ match, isModalOpen, setIsModalOpen }: MatchProps) => {



    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return <Modal
        // title="🐶 You've Got a Match!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
    >
        {match ? (
            <div className="flex flex-col items-center text-center">
<div className="flex mb-4 border-b-2 border-solid border-gray-300 items-center w-full justify-center">
                    <Lottie options={defaultOptions}
                        height={100}
                        width={100}
                        style={{margin: 0}}
                        
                    />
                    {`You've Got a Match!`}
                </div>
                <hr />

                <Image
                    width={192}
                    height={192}
                    src={match.img}
                    alt={match.name}
                    className="w-48 h-48 rounded-lg object-cover shadow-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{match.name}</h2>
                <p className="text-gray-600">{match.age} years old</p>
                <p className="text-gray-600">{match.breed}</p>
                <p className="text-gray-500">📍 Located in  {match.city} {match.state} , {match.zip_code}</p>

                <button
                    onClick={handleOk}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Learn More
                </button>
            </div>
        ) : (
            <p className="text-center text-gray-500">No match found.</p>
        )}
    </Modal>

}