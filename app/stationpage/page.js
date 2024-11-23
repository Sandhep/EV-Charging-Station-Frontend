'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

const stationData = [
  {
    id: 1,
    name: "Central Station Charging Hub",
    type: "AC",
    address: "123 Main Street, Downtown",
    availability: "Available",
    power: "7.4"
  },
  {
    id: 2,
    name: "Express Charging Point",
    type: "DC",
    address: "456 Park Avenue, Uptown",
    availability: "Busy",
    power: "50"
  },
  {
    id: 3,
    name: "Shopping Mall Charger",
    type: "AC",
    address: "789 Market Street",
    availability: "Available",
    power: "11"
  },
  {
    id: 4,
    name: "Highway Rest Stop Station",
    type: "DC",
    address: "Highway 101, Mile Marker 45",
    availability: "Available",
    power: "150"
  },
  {
    id: 5,
    name: "City Center Parking Garage",
    type: "AC",
    address: "25 Downtown Plaza",
    availability: "Busy",
    power: "22"
  },
  {
    id: 6,
    name: "Tech Park Charging Station",
    type: "DC",
    address: "100 Innovation Drive",
    availability: "Available",
    power: "100"
  },
  {
    id: 7,
    name: "Residential Complex Hub",
    type: "AC",
    address: "555 Apartment Boulevard",
    availability: "Available",
    power: "7.4"
  },
  {
    id: 8,
    name: "Supermarket Quick Charge",
    type: "DC",
    address: "200 Retail Row",
    availability: "Busy",
    power: "50"
  },
  {
    id: 9,
    name: "Hotel Valet Charging",
    type: "AC",
    address: "888 Luxury Lane",
    availability: "Available",
    power: "22"
  },
  {
    id: 10,
    name: "Airport Long-Term Parking",
    type: "DC",
    address: "1 Airport Terminal Road",
    availability: "Available",
    power: "150"
  }
];

const StationCard = ({ station }) => {
  const router = useRouter();

  const handleBooking = () => {
    router.push(`/booking?stationId=${station.id}&stationName=${encodeURIComponent(station.name)}&power=${encodeURIComponent(station.power)}&type=${station.type}`);
  };

  const handleConnect = () => {
    router.push(`/connect?stationId=${station.id}&stationName=${encodeURIComponent(station.name)}&power=${encodeURIComponent(station.power)}&type=${station.type}`);
  };

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all duration-200">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {station.name}
      </h3>
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium text-white ${
          station.type === 'AC' ? 'bg-gray-900' : 'bg-gray-800'
        }`}>
          {station.type}
        </span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {station.address}
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Power Output: {station.power} kW
      </div>
      <div className={`flex items-center mb-4 ${
        station.availability === 'Available' ? 'text-green-600' : 'text-red-600'
      }`}>
        <div className="h-2 w-2 rounded-full mr-2 bg-current"></div>
        Status: {station.availability}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <button
          onClick={handleBooking}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Book
        </button>
        <button
          onClick={handleConnect}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 
            ${station.availability === 'Available' 
              ? 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-100' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'}`}
          disabled={station.availability !== 'Available'}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

function StationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Filter stations based on search term and type
  const filteredStations = stationData.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || station.type === filterType;
    return matchesSearch && matchesType;
  });

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
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by location or station name"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="AC">AC Charging</option>
                <option value="DC">DC Charging</option>
              </select>
            </div>
          </div>
        </div>

        {filteredStations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No stations found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default StationPage;