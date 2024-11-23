'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChargingReceipt from '../components/ChargingReceipt';

export default function PaymentHistory() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const RATE_PER_KWH = 0.30;

  const handleGenerateBill = (payment) => {
    const billData = {
      timestamp: new Date(`${payment.date}T${payment.time}`).toLocaleString(),
      totalEnergy: payment.energyConsumed,
      duration: parseInt(payment.duration) * 60,
      cost: payment.type === 'booking' 
        ? (payment.bookingCharge + payment.chargingCost).toFixed(2)
        : payment.chargingCost.toFixed(2)
    };

    const stationData = {
      stationName: payment.stationName,
      stationId: payment.id,
      type: payment.chargerType
    };

    setSelectedPayment({
      billData,
      stationData,
      paymentStatus: 'completed'
    });
  };

  const mockPayments = {
    all: [
      {
        id: 'PAY123456',
        type: 'booking',
        stationName: 'EV Station Downtown',
        date: '2024-03-20',
        time: '14:30',
        duration: '60',
        status: 'completed',
        chargerType: 'Type 2',
        vehicleModel: 'Tesla Model 3',
        bookingCharge: 5.00,
        chargingCost: 15.50,
        energyConsumed: '25.5',
        power: '7.4kW'
      },
      {
        id: 'PAY123457',
        type: 'direct',
        stationName: 'EV Station Mall',
        date: '2024-03-18',
        time: '10:00',
        duration: '45',
        status: 'completed',
        chargerType: 'CCS',
        vehicleModel: 'Tesla Model Y',
        chargingCost: 18.75,
        energyConsumed: '22.5',
        power: '50kW'
      }
    ]
  };

  // Filter payments
  mockPayments.booking = mockPayments.all.filter(payment => payment.type === 'booking');
  mockPayments.direct = mockPayments.all.filter(payment => payment.type === 'direct');

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return typeof amount === 'number' ? amount.toFixed(2) : '0.00';
  };

  const PaymentCard = ({ payment }) => {
    const paymentDate = new Date(`${payment.date}T${payment.time}`);
    const formattedDate = paymentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = paymentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{payment.stationName}</h3>
              <p className="text-sm text-gray-500">Transaction ID: {payment.id}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {payment.type === 'booking' ? 'Booked Charging' : 'Direct Charging'}
              </span>
            </div>
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
                <p className="font-medium text-gray-900">{payment.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Power</p>
                <p className="font-medium text-gray-900">{payment.power}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Charger Type</p>
                <p className="font-medium text-gray-900">{payment.chargerType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Energy Consumed</p>
                <p className="font-medium text-gray-900">{payment.energyConsumed} kWh</p>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {payment.type === 'booking' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Booking Charge</p>
                      <p className="font-medium text-gray-900">${formatCurrency(payment.bookingCharge)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Charging Cost</p>
                      <p className="font-medium text-gray-900">${formatCurrency(payment.chargingCost)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <p className="font-medium text-gray-900">Total Amount</p>
                    <p className="font-bold text-gray-900">
                      ${formatCurrency((payment.bookingCharge || 0) + (payment.chargingCost || 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">Charging Cost</p>
                  <p className="font-bold text-gray-900">${formatCurrency(payment.chargingCost)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Updated Bill Generation/Download Section */}
          <div className="mt-6">
            {selectedPayment && selectedPayment.stationData.stationId === payment.id ? (
              <ChargingReceipt
                billData={selectedPayment.billData}
                stationData={selectedPayment.stationData}
                paymentStatus="completed"
                RATE_PER_KWH={RATE_PER_KWH}
              />
            ) : (
              <button
                onClick={() => handleGenerateBill(payment)}
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-6">Payment History</h1>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 max-w-sm">
            {[
              { id: 'all', label: 'All Payments' },
              { id: 'booking', label: 'Booked Charging' },
              { id: 'direct', label: 'Direct Charging' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-sm font-medium px-4 py-2 rounded-md capitalize transition-colors duration-200
                  ${activeTab === tab.id 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payments Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPayments[activeTab].map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>

          {/* Empty State */}
          {mockPayments[activeTab].length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
              <p className="text-gray-500 mt-2">No payment history available for this category</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 