import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ eventId, seats }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      // clientSecret comes from the parent component via Elements
      elements.getElement(CardElement),
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      // Save payment info to backend
      await api.post("/payments/confirm", {
        eventId,
        seats,
        paymentIntentId: paymentIntent.id,
      });

      alert("Payment successful and registration complete!");
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        disabled={!stripe}
      >
        Pay & Register
      </button>
    </form>
  );
};

export default CheckoutForm;
