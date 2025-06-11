import React from "react";
import { FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewRegisteredUsersModal = ({ users, eventName, isOpen, onClose }) => {
  if (!isOpen) return null;

  const totalUsers = users.length;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toString() !== "Invalid Date"
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Registered Users for ${eventName}`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Total Registered Users: ${totalUsers}`, 14, 22);

    const headers = [
      ["No.", "Name", "Email", "Seats Booked", "Payment Date", "Amount"],
    ];
    const data = users.map((user, index) => [
      index + 1,
      user.name,
      user.email,
      user.seatsBooked || 1,
      formatDate(user.paymentDate),
      user.amount ? `${Math.round(user.amount)}` : "Free",
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
    });

    doc.save(`${eventName}-registrations.pdf`);
  };

  return (
    <div
      className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-300 shadow-2xl rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex justify-between w-full">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Registered Users for {eventName}
              </h3>
            </div>

            {/* Total Users Box on Right Side */}
            <div className="border flex justify-center items-center gap-2 border-blue-500 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg shadow-sm text-sm">
              <p className="font-medium">Total Registered Users :</p>
              <p className="text-lg font-bold text-center">{totalUsers}</p>
            </div>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {totalUsers === 0 ? (
          <p className="text-gray-500 text-center">
            No users registered for this event.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">No.</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Seats Booked</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.userId} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.seatsBooked}</td>
                    <td className="p-3">{formatDate(user.paymentDate)}</td>
                    <td className="p-3">
                      {user.amount ? `₹${Math.round(user.amount)}` : "Free"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRegisteredUsersModal;
