'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function Booking() {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '30',
    vehicleModel: '',
    chargerType: 'Type2',
    stationId: '',
    stationName: '',
    power: '',
    type: ''
  });

  useEffect(() => {
    const stationId = searchParams.get('stationId');
    const stationName = searchParams.get('stationName');
    const power = searchParams.get('power');
    const type = searchParams.get('type');

    if (stationId) {
      setBookingData(prev => ({
        ...prev,
        stationId,
        stationName,
        power,
        type
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API call here to submit booking
      console.log('Booking submitted:', bookingData);
      alert('Booking successful!');
    } catch (error) {
      alert('Failed to book slot. Please try again.');
    }
  };

  const SelectedStationInfo = () => {
    if (!bookingData.stationId) return null;

    return (
      <div className="mb-5 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Selected Station</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-sm text-gray-500">Station Name</p>
            <p className="font-medium text-gray-900">{bookingData.stationName}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-500">Power Output</p>
            <p className="font-medium text-gray-900">{bookingData.power} kW</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-gray-500">Charger Type</p>
            <p className="font-medium text-gray-900">{bookingData.type}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-6 md:py-10 lg:py-14 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-5 text-center">
              <div className="space-y-3 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                  Book Your Charging Slot
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg">
                  Select your preferred time and duration for charging your vehicle
                </p>
              </div>

              <div className="w-full max-w-xl mt-6">
                <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-7 shadow-lg">
                  <SelectedStationInfo />
                  
                  {!bookingData.stationId && (
                    <div className="text-center py-7 px-5 bg-gray-50 rounded-xl">
                      <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Please select a station from the stations page to make a booking.
                      </p>
                    </div>
                  )}

                  {bookingData.stationId && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900 block">Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                              value={bookingData.date}
                              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900 block">Time</label>
                          <div className="relative">
                            <input
                              type="time"
                              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                              value={bookingData.time}
                              onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 block">Duration</label>
                        <select
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          value={bookingData.duration}
                          onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="90">1.5 hours</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 block">Vehicle Model</label>
                        <input
                          type="text"
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your vehicle model (e.g., Tesla Model 3)"
                          value={bookingData.vehicleModel}
                          onChange={(e) => setBookingData({...bookingData, vehicleModel: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 block">Charger Type</label>
                        <select
                          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          value={bookingData.chargerType}
                          onChange={(e) => setBookingData({...bookingData, chargerType: e.target.value})}
                        >
                          <option value="Type2">Type 2</option>
                          <option value="CCS">CCS</option>
                          <option value="CHAdeMO">CHAdeMO</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 px-5 text-white font-medium bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg transition-colors duration-200"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full flex justify-center border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-600">© 2024 EV Charge. All rights reserved.</p>
      </footer>
    </div>
  );
}