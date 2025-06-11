import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../api/axios"; 

const OrgReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const organizerId = currentUser.id;

  const fetchReport = async () => {
    try {
      const res = await api.get(`/org-report/${organizerId}`);
      setReports(res.data.reports || []);
    } catch (err) {
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizerId) {
      fetchReport();
    } else {
      setError("Organizer not found. Please log in.");
      setLoading(false);
    }
  }, [organizerId]);

  const handleDownloadPDF = (report) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Payment Report: ${report.eventName}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Total Users: ${report.totalUsers}`, 14, 30);
    doc.text(`Total Seats: ${report.totalSeatsBooked}`, 14, 36);
    doc.text(`Total Revenue: ${report.totalRevenue}`, 14, 42);
    doc.text(`Remaining Tickets: ${report.remainingTickets}`, 14, 48);

    autoTable(doc, {
      startY: 55,
      head: [["No.", "Name", "Email", "Seats", "Payment Date", "Amount"]],
      body: report.users.map((u, i) => [
        i + 1,
        u.name,
        u.email,
        u.seatsBooked,
        new Date(u.paymentDate).toLocaleDateString("en-IN"),
        u.amount ? `${Math.round(u.amount)}` : "Free",
      ]),
    });

    doc.save(`${report.eventName.replace(/\s+/g, "_")}_Report.pdf`);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full  mx-auto py-6 px-16">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Organizer Payment Reports
      </h2>

      {reports.map((report, idx) => (
        <div
          key={report.eventId}
          className="mb-8 border p-4 rounded shadow bg-white"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-blue-600">
              {idx + 1}. {report.eventName}
            </h3>
            <button
              onClick={() => handleDownloadPDF(report)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
            <div className="border p-2 rounded bg-blue-50 text-center">
              <strong>Total Users:</strong> {report.totalUsers}
            </div>
            <div className="border p-2 rounded bg-green-50 text-center">
              <strong>Total Seats:</strong> {report.totalSeatsBooked}
            </div>
            <div className="border p-2 rounded bg-yellow-50 text-center">
              <strong>Total Revenue:</strong> ₹{Math.round(report.totalRevenue)}
            </div>
            <div className="border p-2 rounded bg-purple-50 text-center">
              <strong>Remaining:</strong> {report.remainingTickets}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">No.</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Seats</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {report.users.map((u, i) => (
                  <tr key={u.paymentId} className="border-t">
                    <td className="p-2 border text-center">{i + 1}</td>
                    <td className="p-2 border">{u.name}</td>
                    <td className="p-2 border">{u.email}</td>
                    <td className="p-2 border text-center">{u.seatsBooked}</td>
                    <td className="p-2 border text-center">
                      {new Date(u.paymentDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-2 border text-right">
                      {u.amount ? `₹${Math.round(u.amount)}` : "Free"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrgReport;
