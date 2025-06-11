import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/payment/all`);
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.error("Error fetching admin payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
  
      

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
    <div className=" mx-auto mt-6 px-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Events Payment History
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Amount (₹)</th>
              <th className="px-6 py-4">Seats</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date & Time</th>
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
                <tr key={pay._id} className="hover:bg-gray-50 border-b">
                  <td className="px-6 py-4">{pay.userId?.name || "Unknown"}</td>
                  <td className="px-6 py-4">
                    {pay.eventId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4">₹{pay.amount}</td>
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
                  <td className="px-6 py-4">
                    {date} <span className="text-gray-400">•</span> {time}
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

export default AdminPaymentHistory;
