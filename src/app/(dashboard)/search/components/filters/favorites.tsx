import React, { useState } from "react";
import { Button, Card, Modal, List, Avatar } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { Dog } from "@/app/(dashboard)/interfaces";




interface FavoriteDogsProps {
    selectedDogs: Dog[];
    setSelectedDogs: (selectedDogs: Dog[]) => void;
    handleMatch: () => Promise<void>;
    loading: boolean

}


export const FavoriteDogs = ({ selectedDogs, setSelectedDogs, handleMatch, loading }: FavoriteDogsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Function to handle removal
    const handleRemove = (id: string) => {
        setSelectedDogs(selectedDogs.filter(dog => dog.id !== id));
    };


    return (
        <div>
            <Card className='mb-4! '>
                <div className='flex justify-between lg:text-2xl md:text-lg text-m flex flex-col'>
                    <div className="flex justify-between">
                        <h1 className='mb-4 font-bold '>
                            Favorites
                        </h1>


                    </div>

                    <div className="flex justify-between">


                        <Button
                            className="w-32"
                            type="primary"
                            onClick={handleMatch}
                            disabled={!selectedDogs.length} // Disable if no dogs are selected
                            loading={loading} // Show loading spinner during match fetching
                        >
                            Find Match
                        </Button>
                        <Button icon={<HeartOutlined />} type="default" onClick={() => setIsModalOpen(true)} disabled={selectedDogs.length === 0}>
                            View ({selectedDogs.length})
                        </Button>

                    </div>
                </div>
            </Card>


            <Modal title={<div><h1>
                Favorited Dogs

            </h1>
            </div>} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={<>
                <Button type="primary" onClick={() => setIsModalOpen(false)} >
                    Close
                </Button>
                <Button type="default" danger
                    htmlType="button" onClick={() => { setSelectedDogs([]) }}>
                    Clear All
                </Button>


            </>}>

                <List
                    itemLayout="horizontal"
                    dataSource={selectedDogs}
                    renderItem={(dog: Dog) => (
                        <List.Item
                            actions={[
                                <Button
                                    danger
                                    onClick={() => handleRemove(dog.id)}
                                    size="small"
                                >
                                    Remove
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar size={"large"} src={dog.img} />}
                                title={dog.name}
                                description={
                                    <div>
                                        <p><strong>Breed:</strong> {dog.breed}</p>
                                        <p><strong>Age:</strong> {dog.age} years old</p>
                                        <p><strong>Location:</strong> {dog.city}, {dog.state}</p>
                                        <p><strong>ZIP Code:</strong> {dog.zip_code}</p>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

