import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import { FaChevronLeft, FaChevronRight, FaFileDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";


const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const itemsPerPage = 5;

  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = currentUser.id;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const res = await api.get(`/payment/history/${userId}`);
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userId]);

  const generateInvoice = (payment) => {
    setGeneratingInvoice(true);
    try {
      const pdf = new jsPDF();

      // Add invoice title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 53, 147); // indigo-800
      pdf.text("INVOICE", 105, 20, { align: "center" });

      // Invoice details
      pdf.setFontSize(12);
      pdf.setTextColor(75, 85, 99); // gray-600
      pdf.text(`Invoice : #${payment._id.slice(-8).toUpperCase()}`, 15, 30);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 15, 36);

      // Customer info
      pdf.setFontSize(14);
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.text(`Customer: ${currentUser.name}`, 15, 50);
      pdf.setFontSize(12);
      pdf.text(`Email: ${currentUser.email}`, 15, 56);

      // Event details
      pdf.setFontSize(14);
      pdf.text("Event Details", 15, 70);
      pdf.setFontSize(12);
      pdf.text(`Event: ${payment.eventId?.name || "N/A"}`, 15, 76);
      pdf.text(`Venue: ${payment.eventId?.venue || "Online"}`, 15, 82);
      pdf.text(
        `Date: ${
          new Date(payment.eventId?.date).toLocaleDateString() || "N/A"
        }`,
        15,
        88
      );

      // Line items table
      pdf.setFontSize(14);
      pdf.text("Items", 15, 102);

      // Table header
      pdf.setFillColor(243, 244, 246); // gray-100
      pdf.rect(15, 108, 180, 10, "F");
      pdf.setTextColor(55, 65, 81); // gray-700
      pdf.setFontSize(12);
      pdf.text("Event Name", 20, 115);
      pdf.text("Seat", 120, 115, { align: "right" });
      pdf.text("Price", 140, 115, { align: "right" });
      pdf.text("Amount", 170, 115, { align: "right" });

      // Table row
      pdf.setTextColor(75, 85, 99); // gray-600
      pdf.text(`Event Ticket - ${payment.eventId?.name || "N/A"}`, 20, 125);
      pdf.text(`${payment.seatsBooked}`, 120, 125, { align: "right" });
      pdf.text(
        `${
          payment.amount > 0
            ? (payment.amount / payment.seatsBooked).toFixed(2)
            : "0.00"
        }`,
        140,
        125,
        { align: "right" }
      );
      pdf.text(`${payment.amount.toFixed(2)}`, 170, 125, { align: "right" });

      // Total
      pdf.setFontSize(12);
      pdf.setTextColor(17, 24, 39); // gray-900
      pdf.text("Total:", 140, 140, { align: "right" });
      pdf.text(`${payment.amount.toFixed(2)}`, 170, 140, { align: "right" });

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175); // gray-400
      pdf.text("Thank you for your business!", 105, 160, { align: "center" });
      pdf.text(
        "For any questions, please contact support@eventra.com",
        105,
        166,
        { align: "center" }
      );

      // Save PDF
      pdf.save(`invoice_${payment._id.slice(-8)}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.", {
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const currentPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600 animate-pulse">
          ⏳ Loading payment history...
        </p>
      </div>
    );

  if (payments.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">No payment history found.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        🧾 Payment History
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Amount (₹)</th>
              <th className="px-6 py-4">Seats</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((pay) => {
              const dateObj = new Date(pay.createdAt);
              const date = dateObj.toLocaleDateString();
              const time = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <tr
                  key={pay._id}
                  className="hover:bg-gray-50 border-b transition-all duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {pay.eventId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ₹{pay.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{pay.seatsBooked}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        pay.amount > 0
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {pay.amount > 0 ? "Paid" : "Free"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {date} <span className="text-gray-400">•</span> {time}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => generateInvoice(pay)}
                      disabled={generatingInvoice}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                      <FaFileDownload />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;
