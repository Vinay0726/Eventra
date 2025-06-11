import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FaComments, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PublicFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("No feedback available.");
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const res = await api.get("/feedback/public");
        setFeedback(res.data.feedback || []);
        setEmptyMessage(res.data.message || "No feedback available.");
      } catch (err) {
        console.error("Error fetching public feedback:", err);
        toast.error(err.response?.data?.error || "Failed to fetch feedback", {
          duration: 4000,
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center mb-10">
          <FaComments className="text-indigo-600 mr-3" aria-hidden="true" />
          What Our Attendees Say
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-12">
            <FaComments
              className="mx-auto h-12 w-12 text-gray-400"
              aria-hidden="true"
            />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No Feedback
            </h3>
            <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Arrow Buttons */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-10"
              aria-label="Scroll left"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-10"
              aria-label="Scroll right"
            >
              <FaChevronRight size={20} />
            </button>

            {/* Feedback Carousel */}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-6 py-4 scrollbar-hide snap-x snap-mandatory"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              {feedback.map((item) => (
                <div
                  key={item._id}
                  className="ml-20 flex-shrink-0 w-80 bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 snap-center"
                >
                  <div className="flex items-center mb-4">
                    {/* Profile Circle with First Letter */}
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold mr-3">
                      {item.userName
                        ? item.userName.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.eventName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">From:</span>{" "}
                        {item.userName}
                      </p>
                    </div>
                  </div>
                  <p className="text-base text-gray-800 mb-3">
                    <span className="font-medium">Feedback:</span>{" "}
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted on:{" "}
                    {new Date(item.submittedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicFeedback;
