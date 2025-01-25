'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AlertDialog from '../components/AlertDialog';
import axios from "axios";
import Cookies from "js-cookie";
import {useSelector} from "react-redux";

export default function Booking() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [vehicles,setvehicles] = useState([]);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '30',
    vehicleModel: '',
    vehicleId:'',
    chargerId:'',
    stationId: '',
    stationName: '',
    power: '',
    type: ''
  });

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed, failed
  const BOOKING_CHARGE = 5.00; // $5 booking charge

  useEffect(() => {
    const stationId = searchParams.get('stationId');
    const chargerId = searchParams.get('chargerId');
    const stationName = searchParams.get('stationName');
    const power = searchParams.get('power');
    const type = searchParams.get('type');
    
    const fetchuserVehicles = async () =>{
      
      try{
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getvehicles`,{
          headers:{
            Authorization:`Bearer ${user.token}`,
          }
        });
        const vehicles = response.data.map((e)=>({
             id:e.VehicleID,
             model:`${e.Make} ${e.Model}`
        }));
        setvehicles(vehicles);
      }catch(error){
        console.error(error.message);
      }

    }

    fetchuserVehicles();

    if (stationId) {
      setBookingData(prev => ({
        ...prev,
        chargerId,
        stationId,
        stationName,
        power,
        type
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  async function book(bookingData) {

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookslot`,
        {
          bookingData: {
            StationID: bookingData.stationId,
            ChargerID: bookingData.chargerId,
            VehicleID: bookingData.vehicleId,
            Time: bookingData.time,
            Duration: bookingData.duration,
            Date: bookingData.date,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error booking slot:", error);
      return {};
    }    
  }


  const handlePayment = async () => {
    try {
      setPaymentStatus('processing');
      const res = await book(bookingData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('completed');
      
      // Generate booking ID
      const bookingId = res.data.message.BookingID;
      
      // Show success alert after payment
      setShowPayment(false);
      setAlertDialog({
        isOpen: true,
        title: 'Booking Confirmed',
        message: `Your charging slot has been booked for ${bookingData.date} at ${bookingData.time} for ${bookingData.duration} minutes. Booking ID: ${bookingId}`,
        onConfirm: () => {
          setAlertDialog(prev => ({ ...prev, isOpen: false }));
          // Redirect to mybookings page
          router.push('/mybookings');
        },
        confirmText: 'View Booking',
        confirmButtonClass: 'bg-green-600 hover:bg-green-700',
        icon: 'success'
      });
    } catch (error) {
      setPaymentStatus('failed');
      console.error('Payment failed:', error);
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

  const PaymentModal = () => {
    if (!showPayment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Confirm Booking</h3>
            <p className="text-sm text-gray-500 mt-1">Complete payment to confirm your booking</p>
          </div>

          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{bookingData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Station:</span>
                  <span className="font-medium">{bookingData.stationName}</span>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">Booking Charge</p>
                <p className="text-2xl font-bold text-gray-900">${BOOKING_CHARGE.toFixed(2)}</p>
              </div>
              
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Payment Status</p>
              <div className="flex items-center space-x-2">
                <div className={`h-2.5 w-2.5 rounded-full ${
                  paymentStatus === 'completed' ? 'bg-green-500' :
                  paymentStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
                  paymentStatus === 'failed' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
                <span className="text-sm font-medium capitalize text-gray-700">
                  {paymentStatus}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 h-11 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing' || paymentStatus === 'completed'}
                className={`flex-1 h-11 px-4 font-medium rounded-lg transition-colors duration-200
                  ${paymentStatus === 'processing' || paymentStatus === 'completed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Pay $${BOOKING_CHARGE.toFixed(2)}`
                )}
              </button>
            </div>
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
                          <select
                            value={bookingData.vehicleId}
                            onChange={(e) => {
                              const selectedVehicle = vehicles.find(
                                (vehicle) => vehicle.id === e.target.value
                              );
                              if (selectedVehicle) {
                                setBookingData({
                                  ...bookingData,
                                  vehicleModel: selectedVehicle.model,
                                  vehicleId: selectedVehicle.id,
                                });
                              }
                            }}
                            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select your Vehicle</option>
                            {vehicles.map((vehicle, index) => (
                              <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.model}
                              </option>
                            ))}
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
      <Footer />
      <PaymentModal />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        onConfirm={alertDialog.onConfirm}
        onClose={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
        confirmText={alertDialog.confirmText}
        confirmButtonClass={alertDialog.confirmButtonClass}
        icon={alertDialog.icon}
      />
    </div>
  );
}