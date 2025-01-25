'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// StationCard Component
const StationCard = ({ station }) => {
  const router = useRouter();
  const handleBooking = () => {
    router.push(
      `/booking?stationId=${station.stationId}&chargerId=${station.id}&stationName=${encodeURIComponent(station.name)}&power=${encodeURIComponent(station.power)}&type=${station.type}`
    );
  };

  const handleConnect = () => {
    router.push(
      `/connect?stationId=${station.stationId}&chargerId=${station.id}&stationName=${encodeURIComponent(station.name)}&power=${encodeURIComponent(station.power)}&type=${station.type}`
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all duration-200">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{station.name}</h3>
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 rounded-md text-sm font-medium text-white ${
            station.type === 'AC' ? 'bg-gray-900' : 'bg-gray-800'
          }`}
        >
          {station.type}
        </span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <svg
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {station.address}
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <svg
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Power Output: {station.power} kW
      </div>
      <div
        className={`flex items-center mb-4 ${
          station.availability === 'Available'
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      >
        <div className="h-2 w-2 rounded-full mr-2 bg-current"></div>
        Status: {station.availability}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <button
          onClick={handleBooking}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
            station.availability === 'Available'
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
          }`}
          disabled={station.availability !== 'Available'}
        >
          Book
        </button>
        <button
          onClick={handleConnect}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
            station.availability === 'Available'
              ? 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
          }`}
          disabled={station.availability !== 'Available'}
        >
          Connect
        </button>
      </div>

    </div>
  );
};

// Main StationPage Component
const StationPage = () => {
  const [stationData, setStationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const[prompt,setprompt] = useState('No stations found. Try adjusting your search criteria.');

  // Fetch Data
  const fetchStations = async (location = '', type = '') => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stations?location=${location}&type=${type}`
      );
      const stations = response.data.map((station) => ({
        id: station.ChargerID,
        stationId:station.Station.StationID,
        name: station.Station.Name,
        address: station.Station.Address,
        location: station.Station.Location,
        type: station.Type,
        power: station.Capacity,
        availability: station.Status,
      }));
      return stations;
    } catch (error) {
      setprompt(error.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const stations = await fetchStations();
      setStationData(stations);
      const locations = [...new Set(stations.map((station) => station.location))];
      setLocationData(locations);
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const location = e.target.value;
    setSearchTerm(location);
    const stations = await fetchStations(location, filterType === 'all' ? '' : filterType);
    setStationData(stations);
  };

  const handleFilter = async (e) => {
    const type = e.target.value;
    setFilterType(type);
    const stations = await fetchStations(searchTerm, type === 'all' ? '' : type);
    setStationData(stations);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-6">
            Find Charging Stations
          </h1>
          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-8">
              <select
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Search by location</option>
                {locationData.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4">
              <select
                value={filterType}
                onChange={handleFilter}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="AC">AC Charging</option>
                <option value="DC">DC Charging</option>
              </select>
            </div>
          </div>
        </div>

        {stationData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{prompt}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stationData.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StationPage;
