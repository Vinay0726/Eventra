import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (sessionId) {
          const response = await api.post("/payment/confirm-checkout", {
            sessionId,
          });
          console.log("Payment Confirmation:", response.data);
          toast.success("Payment successful and registration complete!", {
            duration: 4000,
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        toast.error(
          "Payment confirmed, but there was an issue registering. Please contact support.",
          {
            duration: 6000,
            position: "top-right",
          }
        );
      } finally {
        navigate("/"); // Redirect to homepage
      }
    };

    confirmPayment();
  }, [sessionId, navigate]);

  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-bold mb-4">Processing Payment...</h2>
      <p>Please wait while we confirm your payment.</p>
    </div>
  );
};

export default Success;
