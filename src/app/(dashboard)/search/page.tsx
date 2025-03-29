'use client'; // This directive indicates that the code should run on the client side

import { useState, useCallback, Suspense } from 'react';
import { Card, Button, message } from 'antd';
import { EnvironmentOutlined, TableOutlined } from '@ant-design/icons';

import { Dog } from '../interfaces';
import { fetchMatch } from '../queries/match';
import { useUserProvider } from '../userProvider';

import { Filters } from './components/filters';
import { Map } from './components/map';
import { DogTable } from './components/dogTable';
import { Match } from './components/match';

export default function DogsPage() {
  // Destructure the 'results' from our user provider's query for cleaner access.
  const { results } = useUserProvider().query;

  // Manage state for selected dogs, matched dog, map view toggle, modal visibility, and loading state.
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [match, setMatch] = useState<Dog | null>(null);
  const [mapView, setMapView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Ant Design's message API to display notifications.
  const [messageApi, contextHolder] = message.useMessage();

  // Memoized function to handle the match fetching process.
  const handleMatch = useCallback(async () => {
    // Ensure at least one dog is selected before attempting to fetch a match.
    if (!selectedDogs.length) {
      messageApi.error('Please select a dog to find a match.');
      return;
    }

    setLoading(true); // Start loading indicator
    try {
      // Fetch the matched dog's ID based on the selected dogs.
      const matchedDogId = await fetchMatch(selectedDogs);
      // Find the matched dog's full details in the results array.
      const matchedDog = results?.find((dog) => dog.id === matchedDogId);

      // If no matching dog is found, display an error.
      if (!matchedDog) {
        messageApi.error('No match found.');
        return;
      }

      // Set the matched dog in state and open the match modal.
      setMatch(matchedDog);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Match fetching error:', error);
      messageApi.error('An error occurred while finding a match.');
    } finally {
      setLoading(false); // Stop loading indicator regardless of success or failure
    }
  }, [selectedDogs, results, messageApi]);

  // Memoized function to toggle between Map and Table views.
  const toggleMapView = useCallback(() => setMapView((prev) => !prev), []);

  return (
    <Suspense fallback={<>Loading dogs</>}>
      {/* Render Ant Design's message context holder */}
      {contextHolder}

      <div className="p-6 grid grid-cols-4 gap-5">
        {/* Sidebar Filters */}
        <div className="col-start-1">
          <Filters />
        </div>

        {/* Main content card containing header and view components */}
        <Card className="col-start-2 col-end-5">
          <div className="flex justify-between">
            {/* Header */}
            <h1 className="mb-4 font-bold text-2xl">Fetch Database Search</h1>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center">
              <Button
                className="w-32"
                type="primary"
                onClick={handleMatch}
                disabled={!selectedDogs.length} // Disable if no dogs are selected
                loading={loading} // Show loading spinner during match fetching
              >
                Find Match
              </Button>
              <Button
                className="w-32"
                type="default"
                icon={mapView ? <TableOutlined /> : <EnvironmentOutlined />}
                onClick={toggleMapView}
              >
                {mapView ? 'Table View' : 'Map View'}
              </Button>
            </div>
          </div>

          {/* Conditionally render either the MapChart or DogTable based on mapView state */}
          {mapView ? (
            <Map
              results={results}
              selectedDogs={selectedDogs}
              setSelectedDogs={setSelectedDogs}
            />
          ) : (
            <DogTable
              selectedDogs={selectedDogs}
              setSelectedDogs={setSelectedDogs}
            />
          )}
        </Card>
      </div>

      {/* Modal component for displaying match details */}
      <Match match={match} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Suspense>
  );
}
