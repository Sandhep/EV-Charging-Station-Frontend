'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import ChargingReceipt from '../components/ChargingReceipt';

export default function ConnectToCharger() {
  const searchParams = useSearchParams();
  const [stationData, setStationData] = useState({
    stationId: '',
    stationName: '',
    power: '',
    type: ''
  });

  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [chargingData, setChargingData] = useState({
    duration: '0',
    energyConsumed: '0',
    chargingSpeed: '0'
  });

  const [chargingStatus, setChargingStatus] = useState('stopped'); // stopped, starting, charging, stopping

  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState({
    totalEnergy: '0',
    duration: '0',
    cost: '0',
    timestamp: ''
  });

  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed, failed

  // Rate per kWh (you can move this to an environment variable or API)
  const RATE_PER_KWH = 0.30; // $0.30 per kWh

  const calculateBill = (energy, duration) => {
    const totalCost = (parseFloat(energy) * RATE_PER_KWH).toFixed(2);
    const timestamp = new Date().toLocaleString();
    
    setBillData({
      totalEnergy: energy,
      duration: duration,
      cost: totalCost,
      timestamp: timestamp
    });
    setShowBill(true);
  };

  useEffect(() => {
    const stationId = searchParams.get('stationId');
    const stationName = searchParams.get('stationName');
    const power = searchParams.get('power');
    const type = searchParams.get('type');

    if (stationId) {
      setStationData({
        stationId,
        stationName,
        power,
        type
      });
    }
  }, [searchParams]);

  const handleConnect = async () => {
    try {
      setConnectionStatus('connecting');
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus('connected');
      startChargingSession();
    } catch (error) {
      setConnectionStatus('error');
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setChargingData({
      duration: '0',
      energyConsumed: '0',
      chargingSpeed: '0'
    });
  };

  const startChargingSession = () => {
    // Simulate real-time charging data updates
    const updateInterval = setInterval(() => {
      if (connectionStatus === 'connected') {
        setChargingData(prev => ({
          duration: (parseFloat(prev.duration) + 1).toFixed(0),
          energyConsumed: (parseFloat(prev.energyConsumed) + parseFloat(stationData.power) / 60).toFixed(2),
          chargingSpeed: stationData.power
        }));
      } else {
        clearInterval(updateInterval);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  };

  const handleStartCharging = async () => {
    try {
      setChargingStatus('starting');
      // Simulate API call to start charging
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChargingStatus('charging');
      startChargingSession();
    } catch (error) {
      setChargingStatus('stopped');
      console.error('Failed to start charging:', error);
    }
  };

  const handleStopCharging = async () => {
    try {
      setChargingStatus('stopping');
      // Simulate API call to stop charging
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChargingStatus('stopped');
      
      // Calculate bill before resetting charging data
      calculateBill(chargingData.energyConsumed, chargingData.duration);
      
      // Reset charging data
      setChargingData({
        duration: '0',
        energyConsumed: '0',
        chargingSpeed: '0'
      });
    } catch (error) {
      setChargingStatus('charging');
      console.error('Failed to stop charging:', error);
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentStatus('processing');
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('completed');
      // You would typically make an API call to your payment processor here
    } catch (error) {
      setPaymentStatus('failed');
      console.error('Payment failed:', error);
    }
  };

  const ChargingControls = () => {
    if (connectionStatus !== 'connected') return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Charging Controls</h3>
          <div className="flex items-center space-x-2">
            <div className={`h-2.5 w-2.5 rounded-full ${
              chargingStatus === 'charging' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {chargingStatus === 'charging' ? 'Charging in Progress' : 'Charging Stopped'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleStartCharging}
            disabled={chargingStatus === 'charging' || chargingStatus === 'starting'}
            className={`h-11 px-4 rounded-lg font-medium transition-all duration-200
              ${chargingStatus === 'charging' || chargingStatus === 'starting'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2'
              }`}
          >
            {chargingStatus === 'starting' ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Starting...</span>
              </div>
            ) : (
              'Start Charging'
            )}
          </button>

          <button
            onClick={handleStopCharging}
            disabled={chargingStatus !== 'charging'}
            className={`h-11 px-4 rounded-lg font-medium transition-all duration-200
              ${chargingStatus !== 'charging'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2'
              }`}
          >
            {chargingStatus === 'stopping' ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Stopping...</span>
              </div>
            ) : (
              'Stop Charging'
            )}
          </button>
        </div>
      </div>
    );
  };

  const StatusIndicator = () => {
    const statusColors = {
      disconnected: 'bg-gray-400',
      connecting: 'bg-yellow-400',
      connected: 'bg-green-500',
      error: 'bg-red-500'
    };

    const statusMessages = {
      disconnected: 'Disconnected',
      connecting: 'Connecting...',
      connected: 'Connected',
      error: 'Connection Error'
    };

    return (
      <div className="flex items-center font-medium text-gray-900">
        <div className={`h-2.5 w-2.5 rounded-full ${statusColors[connectionStatus]} ${
          connectionStatus === 'connecting' ? 'animate-pulse' : ''
        }`} />
        <span className="ml-2">{statusMessages[connectionStatus]}</span>
      </div>
    );
  };

  const BillingSummary = () => {
    if (!showBill) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Charging Session Summary</h3>
            <p className="text-sm text-gray-500 mt-1">{billData.timestamp}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Energy Consumed</p>
                  <p className="text-lg font-bold text-gray-900">{billData.totalEnergy} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-bold text-gray-900">{billData.duration} seconds</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Rate per kWh</p>
                <p className="text-sm font-medium text-gray-900">${RATE_PER_KWH.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${billData.cost}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
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

              {(paymentStatus === 'pending' || paymentStatus === 'failed') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    Payment is required to complete your charging session
                  </p>
                </div>
              )}

              {(paymentStatus === 'pending' || paymentStatus === 'failed') && (
                <button
                  onClick={handlePayment}
                  disabled={paymentStatus === 'processing'}
                  className="w-full h-11 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 mb-3"
                >
                  {paymentStatus === 'processing' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Pay $${billData.cost}`
                  )}
                </button>
              )}

              {paymentStatus === 'completed' && (
                <div className="space-y-4">
                  <ChargingReceipt
                    billData={billData}
                    stationData={stationData}
                    paymentStatus={paymentStatus}
                    RATE_PER_KWH={RATE_PER_KWH}
                  />

                  <button
                    onClick={() => {
                      if (paymentStatus === 'completed') {
                        setShowBill(false);
                        setPaymentStatus('pending'); // Reset for next session
                      }
                    }}
                    disabled={paymentStatus !== 'completed'}
                    className={`w-full h-11 px-4 font-medium rounded-lg transition-colors duration-200
                      ${paymentStatus === 'completed'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {paymentStatus === 'completed' ? 'Close' : 'Payment Required'}
                  </button>
                </div>
              )}
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
                  Connect to Charger
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg">
                  Monitor your charging session in real-time
                </p>
              </div>

              <div className="w-full max-w-xl mt-6">
                <div className="bg-white rounded-2xl p-7 shadow-lg">
                  {/* Station Info */}
                  <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Station Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500">Station Name</p>
                        <p className="font-medium text-gray-900">{stationData.stationName}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500">Power Output</p>
                        <p className="font-medium text-gray-900">{stationData.power} kW</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500">Charger Type</p>
                        <p className="font-medium text-gray-900">{stationData.type}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500">Connection Status</p>
                        <StatusIndicator />
                      </div>
                    </div>
                  </div>

                  {/* Charging Controls */}
                  <ChargingControls />

                  {/* Charging Stats */}
                  {chargingStatus === 'charging' && (
                    <div className="mb-6 grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                        <p className="text-xl font-bold text-gray-900">{chargingData.duration}s</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Energy</p>
                        <p className="text-xl font-bold text-gray-900">{chargingData.energyConsumed} kWh</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Speed</p>
                        <p className="text-xl font-bold text-gray-900">{chargingData.chargingSpeed} kW</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {connectionStatus !== 'connected' ? (
                      <button
                        onClick={handleConnect}
                        disabled={connectionStatus === 'connecting'}
                        className="w-full h-11 px-5 text-white font-medium bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg transition-colors duration-200"
                      >
                        {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to Charger'}
                      </button>
                    ) : (
                      <button
                        onClick={handleDisconnect}
                        className="w-full h-11 px-5 text-gray-900 font-medium bg-white border-2 border-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg transition-colors duration-200"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full flex justify-center border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-600">© 2024 EV Charge. All rights reserved.</p>
      </footer>
      
      {/* Add the BillingSummary component at the root level */}
      <BillingSummary />
    </div>
  );
}