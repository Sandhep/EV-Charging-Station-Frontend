'use client';
import jsPDF from 'jspdf';

const ChargingReceipt = ({ billData, stationData, paymentStatus, RATE_PER_KWH }) => {
  const generatePDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Company name as header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(17, 24, 39);
    pdf.text('EV Charge', 20, 25);

    // Add receipt title
    pdf.setFontSize(16);
    pdf.text('Charging Receipt', 20, 45);

    // Add receipt details
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Receipt #${new Date().getTime()}`, 20, 55);
    pdf.text(`Date: ${billData.timestamp}`, 20, 60);

    // Add divider line
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, 65, 190, 65);

    // Station Details
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Station Details', 20, 75);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Station Name: ${stationData.stationName}`, 20, 85);
    pdf.text(`Station ID: ${stationData.stationId}`, 20, 90);
    pdf.text(`Charger Type: ${stationData.type}`, 20, 95);

    // Charging Session Details
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Charging Session Details', 20, 110);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Energy Consumed: ${billData.totalEnergy} kWh`, 20, 120);
    pdf.text(`Duration: ${billData.duration} seconds`, 20, 125);
    pdf.text(`Rate per kWh: $${RATE_PER_KWH.toFixed(2)}`, 20, 130);

    // Cost Summary Box
    pdf.setDrawColor(229, 231, 235);
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(20, 140, 170, 30, 3, 3, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Total Amount:', 30, 157);
    pdf.text(`$${billData.cost}`, 170, 157, { align: 'right' });

    // Payment Status
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Payment Status:', 20, 180);
    
    const statusColor = paymentStatus === 'completed' 
      ? [34, 197, 94]  // green-500
      : [239, 68, 68]; // red-500
    pdf.setTextColor(...statusColor);
    pdf.text(paymentStatus.toUpperCase(), 60, 180);

    // Footer
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.text('Thank you for choosing EV Charge!', 20, 270);
    pdf.text('For support: support@evcharge.com | www.evcharge.com', 20, 275);

    // Save the PDF
    pdf.save(`ev-charge-receipt-${new Date().getTime()}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="w-full h-11 px-4 font-medium border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      Download Receipt (PDF)
    </button>
  );
};

export default ChargingReceipt; 