import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const OrganizerPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const organizerId = currentUser.id;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/payment/organizer/${organizerId}`);
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (error) {
        console.error("Error fetching organizer payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [organizerId]);

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const currentPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading)
    return <p className="text-center mt-10">⏳ Loading payment history...</p>;
  if (payments.length === 0)
    return <p className="text-center mt-10">No payments found.</p>;

  return (
    <div className="py-10 px-12 mx-auto mt-2">
      <h2 className="text-2xl font-bold mb-4 text-center">Payment History</h2>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">User Name</th>
            <th className="p-3">Event</th>
            <th className="p-3">Amount (₹)</th>
            <th className="p-3">Seats</th>
            <th className="p-3">Type</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((pay) => {
            const dateObj = new Date(pay.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const formattedTime = dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <tr key={pay._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{pay.userId?.name || "Unknown"}</td>
                <td className="p-3">{pay.eventId?.name || "Unknown"}</td>
                <td className="p-3">₹{pay.amount.toFixed(2)}</td>
                <td className="p-3">{pay.seatsBooked}</td>
                <td className="p-3">{pay.amount > 0 ? "Paid" : "Free"}</td>
                <td className="p-3">{formattedDate}</td>
                <td className="p-3">{formattedTime}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default OrganizerPaymentHistory;
