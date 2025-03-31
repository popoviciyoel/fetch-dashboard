import React, { useState } from "react";
import { Button, Card, Modal, List, Avatar } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Dog } from "@/app/(dashboard)/interfaces";




interface FavoriteDogsProps {
    selectedDogs: Dog[];
    setSelectedDogs: (selectedDogs: Dog[]) => void;
}


export const FavoriteDogs = ({ selectedDogs, setSelectedDogs }: FavoriteDogsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <div>
            <Card className='mb-4! '>
                <div className='flex justify-between lg:text-2xl md:text-lg text-m flex flex-col'>
                    <h1 className='mb-4 font-bold '>
                        Favorites
                    </h1>
                    <div className="flex justify-between">

                        <Button icon={<HeartOutlined />} type="primary" onClick={() => setIsModalOpen(true)} disabled={selectedDogs.length === 0}>
                            View ({selectedDogs.length})
                        </Button>
                        <Button type="default" htmlType="button" onClick={() => { setSelectedDogs([]) }}>
                            Clear
                        </Button>
                    </div>
                </div>
            </Card>


            <Modal title="Favorited Dogs" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <List
                    itemLayout="horizontal"
                    dataSource={selectedDogs}
                    renderItem={(dog) => (
                        <List.Item>
                            <List.Item.Meta avatar={<Avatar src={dog.img} />} title={dog.name} />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

