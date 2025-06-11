import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OrganizerFeedbackView = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState(
    "No feedback available for your events."
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const currentUser = JSON.parse(
          localStorage.getItem("userData") || "{}"
        );

        if (!currentUser.id || !/^[0-9a-fA-F]{24}$/.test(currentUser.id)) {
          toast.error("Please log in as an organizer to view feedback", {
            duration: 4000,
            position: "top-right",
          });
          navigate("/login");
          return;
        }

        const res = await api.get(
          `/feedback/organizer?organizerId=${currentUser.id}`
        );
        setFeedback(res.data.feedback || []);
        setEmptyMessage(
          res.data.message || "No feedback available for your events."
        );
      } catch (err) {
        console.error("Error fetching organizer feedback:", err);
        toast.error(err.response?.data?.error || "Failed to fetch feedback", {
          duration: 4000,
          position: "top-right",
        });
        if (err.response?.status === 400) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [navigate]);

  return (
    <div className="py-10 px-16">
      <h2 className="text-2xl font-bold mb-4">Feedback for Your Events</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Event</th>
              <th className="p-3">From</th>
              <th className="p-3">Email</th>
              <th className="p-3">Feedback</th>
              <th className="p-3">Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {feedback.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              feedback.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">
                    {item.eventId?.name || "Unknown Event"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.message}</td>
                  <td className="p-3">
                    {new Date(item.submittedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrganizerFeedbackView;
