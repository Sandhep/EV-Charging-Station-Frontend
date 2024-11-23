'use client';

const LoadingOverlay = ({ 
  isLoading, 
  message = 'Processing...', 
  subMessage = 'Please wait' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-800 font-medium">{message}</p>
        {subMessage && <p className="text-sm text-gray-500 mt-1">{subMessage}</p>}
      </div>
    </div>
  );
};

export default LoadingOverlay; 