import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import API_BASE_URL from "../config/api";
import { authFetch } from "../utils/auth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ orderNumber }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // page redirect nahi karega
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // Backend ko confirm karo
      try {
        const res = await authFetch(`${API_BASE_URL}/orders/confirm-stripe/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderNumber,
            payment_intent_id: paymentIntent.id,
          }),
        });

        const data = await res.json().catch(() => ({}));

        console.log("VERIFY STATUS:", res.status);
        console.log("VERIFY DATA:", data);

        if (res.ok) {
          toast.success("Payment Successful!");
          sessionStorage.clear();
          setTimeout(() => navigate("/myorder"), 1000);
        } else {
          toast.error(data.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("VERIFY ERROR:", err);
        toast.error("Server error verifying payment");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-red-500 py-3 font-bold text-white hover:bg-red-600 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function StripePayment() {
  const navigate = useNavigate();
  const clientSecret = sessionStorage.getItem("stripeClientSecret");
  const orderNumber = sessionStorage.getItem("stripeOrderNumber");
  const totalAmount = sessionStorage.getItem("stripeTotalAmount");

  useEffect(() => {
    if (!clientSecret) {
      toast.error("No payment session found");
      navigate("/checkout");
    }
  }, [clientSecret, navigate]);

  if (!clientSecret) return null;

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-10">
      <ToastContainer position="top-center" />
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Complete Payment</h1>
        <p className="text-sm text-gray-500 mb-6">
          Order #{orderNumber} | Total: ${totalAmount}
        </p>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm orderNumber={orderNumber} />
        </Elements>
      </div>
    </div>
  );
}
