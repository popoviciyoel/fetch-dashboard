import React, { useState, useCallback, useMemo } from "react";
import { Button, Card, Modal, List, Avatar } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { Dog } from "@/app/(dashboard)/interfaces";

interface FavoriteDogsProps {
    selectedDogs: Dog[];
    setSelectedDogs: React.Dispatch<React.SetStateAction<Dog[]>>; // ✅ Correct type
    handleMatch: () => Promise<void>;
    loading: boolean;
}

export const FavoriteDogs = ({ selectedDogs, setSelectedDogs, handleMatch, loading }: FavoriteDogsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasSelectedDogs = useMemo(() => selectedDogs.length > 0, [selectedDogs]);

    const handleRemove = useCallback((id: string) => {
        setSelectedDogs((prevDogs: Dog[]) => (prevDogs.filter(dog => dog.id !== id)));
    }, [setSelectedDogs]);

    return (
        <div>
            <Card className="mb-4">
                <div className="flex justify-between flex-col lg:text-2xl md:text-lg text-m">
                    <h1 className="mb-4 font-bold">Favorites</h1>
                    <div className="flex justify-between">
                        <Button
                            className="w-32"
                            type="primary"
                            onClick={handleMatch}
                            disabled={!hasSelectedDogs}
                            loading={loading}
                        >
                            Find Match
                        </Button>
                        <Button icon={<HeartOutlined />} type="default" onClick={() => setIsModalOpen(true)} disabled={!hasSelectedDogs}>
                            View ({selectedDogs.length})
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal
                title={<h1>Favorited Dogs</h1>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={
                    <>
                        <Button type="primary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        <Button type="default" danger onClick={() => setSelectedDogs([])}>Clear All</Button>
                    </>
                }
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedDogs}
                    renderItem={(dog: Dog) => (
                        <List.Item
                            key={dog.id}
                            actions={[
                                <Button key={`remove-${dog.id}`} danger onClick={() => handleRemove(dog.id)} size="small">
                                    Remove
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar size="large" src={dog.img} />}
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
