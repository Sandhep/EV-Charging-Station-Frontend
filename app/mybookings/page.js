'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AlertDialog from '../components/AlertDialog';
import LoadingOverlay from '../components/LoadingOverlay';
import ChargingReceipt from '../components/ChargingReceipt';

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const RATE_PER_KWH = 0.30;

  // Updated mock data to include cancelled bookings
  const mockBookings = {
    upcoming: [
      {
        id: 'BK123456',
        stationName: 'EV Station Downtown',
        date: '2024-03-25',
        time: '14:30',
        duration: '60',
        status: 'confirmed',
        chargerType: 'Type 2',
        vehicleModel: 'Tesla Model 3',
        bookingCharge: 5.00,
        power: '7.4kW'
      }
    ],
    past: [
      {
        id: 'BK789012',
        stationName: 'EV Station Mall',
        date: '2024-03-20',
        time: '10:00',
        duration: '30',
        status: 'completed',
        chargerType: 'CCS',
        vehicleModel: 'Tesla Model 3',
        bookingCharge: 5.00,
        chargingCost: 15.50,
        energyConsumed: '25.5',
        power: '50kW'
      }
    ],
    cancelled: [
      {
        id: 'BK789014',
        stationName: 'EV Station Central',
        date: '2024-03-18',
        time: '13:30',
        duration: '45',
        status: 'cancelled',
        chargerType: 'Type 2',
        vehicleModel: 'Tesla Model 3',
        bookingCharge: 5.00,
        power: '7.4kW',
        cancellationDate: '2024-03-17T15:30:00',
        refundStatus: 'completed'
      }
    ]
  };

  // Add helper function for refund status badge
  const getRefundStatusBadge = (status) => {
    const statusConfig = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const handleCancelBooking = (bookingId) => {
    setAlertDialog({
      isOpen: true,
      title: 'Cancel Booking',
      message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setAlertDialog(prev => ({ ...prev, isOpen: false }));
          setIsLoading(true);
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setIsLoading(false);
          setAlertDialog({
            isOpen: true,
            title: 'Booking Cancelled',
            message: 'Your booking has been successfully cancelled. The booking charge will be refunded within 3-5 business days.',
            onConfirm: () => setAlertDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            confirmButtonClass: 'bg-green-600 hover:bg-green-700',
            icon: 'success'
          });
        } catch (error) {
          setIsLoading(false);
          setAlertDialog({
            isOpen: true,
            title: 'Error',
            message: 'Failed to cancel booking. Please try again.',
            onConfirm: () => setAlertDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700',
            icon: 'error'
          });
        }
      },
      confirmText: 'Cancel Booking',
      cancelText: 'Keep Booking',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      icon: 'warning'
    });
  };

  const handleGenerateBill = (booking) => {
    const billData = {
      timestamp: new Date(`${booking.date}T${booking.time}`).toLocaleString(),
      totalEnergy: booking.energyConsumed,
      duration: parseInt(booking.duration) * 60,
      cost: (booking.bookingCharge + booking.chargingCost).toFixed(2)
    };

    const stationData = {
      stationName: booking.stationName,
      stationId: booking.id,
      type: booking.chargerType
    };

    setSelectedBooking({
      billData,
      stationData,
      paymentStatus: 'completed'
    });
  };

  const BookingCard = ({ booking, type }) => {
    const isUpcoming = type === 'upcoming';
    const isCancelled = type === 'cancelled';
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = bookingDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const getStatusColor = (status) => {
      const colors = {
        confirmed: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800',
        ongoing: 'bg-yellow-100 text-yellow-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Safe number formatting with fallback
    const formatCurrency = (amount) => {
      return typeof amount === 'number' ? amount.toFixed(2) : '0.00';
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{booking.stationName}</h3>
              <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{formattedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{formattedTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{booking.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Power</p>
                <p className="font-medium text-gray-900">{booking.power}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Charger Type</p>
                <p className="font-medium text-gray-900">{booking.chargerType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium text-gray-900">{booking.vehicleModel}</p>
              </div>
            </div>

            {/* Cost Summary - Only show for past bookings */}
            {!isUpcoming && !isCancelled && booking.bookingCharge && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking Charge</p>
                    <p className="font-medium text-gray-900">${formatCurrency(booking.bookingCharge)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Charging Cost</p>
                    <p className="font-medium text-gray-900">${formatCurrency(booking.chargingCost)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <p className="font-medium text-gray-900">Total Cost</p>
                  <p className="font-bold text-gray-900">
                    ${formatCurrency((booking.bookingCharge || 0) + (booking.chargingCost || 0))}
                  </p>
                </div>
              </div>
            )}

            {/* Cancellation Details */}
            {isCancelled && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Cancelled On</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.cancellationDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Refund Status</p>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${getRefundStatusBadge(booking.refundStatus)}`}>
                      {booking.refundStatus?.charAt(0).toUpperCase() + booking.refundStatus?.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Refund Amount</p>
                    <p className="font-medium text-gray-900">${formatCurrency(booking.bookingCharge)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isUpcoming ? (
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 h-10 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                View Details
              </button>
              <button 
                onClick={() => handleCancelBooking(booking.id)}
                disabled={isLoading}
                className={`flex-1 h-10 px-4 font-medium rounded-lg transition-colors duration-200
                  ${isLoading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
              >
                {isLoading ? 'Processing...' : 'Cancel Booking'}
              </button>
            </div>
          ) : isCancelled ? (
            <div className="mt-6">
              <button
                className="w-full h-10 px-4 flex items-center justify-center space-x-2 font-medium rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span>Contact Support</span>
              </button>
            </div>
          ) : (
            <div className="mt-6">
              {selectedBooking && selectedBooking.stationData.stationId === booking.id ? (
                <ChargingReceipt
                  billData={selectedBooking.billData}
                  stationData={selectedBooking.stationData}
                  paymentStatus="completed"
                  RATE_PER_KWH={RATE_PER_KWH}
                />
              ) : (
                <button
                  onClick={() => handleGenerateBill(booking)}
                  className="w-full h-10 px-4 flex items-center justify-center space-x-2 font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <span>Generate Bill</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-6">My Bookings</h1>
          </div>

          {/* Simplified Tabs without count badges */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 max-w-sm">
            {['upcoming', 'past', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-sm font-medium px-4 py-2 rounded-md capitalize transition-colors duration-200
                  ${activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Bookings Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBookings[activeTab].map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                type={activeTab}
              />
            ))}
          </div>

          {/* Empty State */}
          {mockBookings[activeTab].length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="text-gray-500 mt-2">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming bookings" 
                  : activeTab === 'past'
                    ? "You don't have any past bookings"
                    : "You don't have any cancelled bookings"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <LoadingOverlay 
        isLoading={isLoading} 
        message="Processing..." 
        subMessage="Please wait"
      />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        onConfirm={alertDialog.onConfirm}
        onClose={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
        confirmText={alertDialog.confirmText}
        cancelText={alertDialog.cancelText}
        confirmButtonClass={alertDialog.confirmButtonClass}
        icon={alertDialog.icon}
      />
    </div>
  );
}