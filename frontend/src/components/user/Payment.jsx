import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const seats = parseInt(searchParams.get("seats")) || 1;

  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        if (isNaN(seats) || seats <= 0) {
          throw new Error("Invalid number of seats");
        }

        const eventRes = await api.get(`/events/${eventId}`);
        console.log("Event Response:", eventRes.data);
        setEventDetails(eventRes.data);

        if (eventRes.data.isPaid) {
          const token = localStorage.getItem("userToken");
          if (!token) {
            throw new Error("Please log in to proceed with payment.");
          }

          const userId = JSON.parse(atob(token.split(".")[1])).id; // Extract userId from JWT token
          const sessionRes = await api.post(
            "/payment/create-checkout-session",
            { userId, eventId, seats },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Checkout Session Response:", sessionRes.data);

          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({
            sessionId: sessionRes.data.sessionId,
          });
          if (error) {
            throw new Error(error.message);
          }
        }
      } catch (err) {
        console.error(
          "Error in createCheckoutSession:",
          err.response?.data || err.message
        );
        setError(
          "Failed to load payment details: " +
            (err.response?.data?.error || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [eventId, seats]);

  if (loading) {
    return <div className="text-center py-10">Loading Payment...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center">Complete Payment</h2>
      <p className="mb-2 text-center text-gray-700">
        Event: <strong>{eventDetails?.name}</strong>
      </p>
      <p className="mb-4 text-center text-gray-700">
        Amount: ₹{(eventDetails?.ticketPrice * seats || 0).toFixed(2)} for{" "}
        {seats} seat(s)
      </p>

      {!eventDetails?.isPaid && (
        <div className="text-center text-green-600 font-medium">
          This event is free. You have been registered successfully!
        </div>
      )}
    </div>
  );
};

export default Payment;
