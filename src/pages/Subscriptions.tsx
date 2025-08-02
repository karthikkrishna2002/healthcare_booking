import { useState } from "react";
import { CheckCircle, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "₹199/mo",
    features: ["Book unlimited appointments", "Basic support"],
  },
  {
    name: "Premium",
    price: "₹399/mo",
    features: [
      "Priority booking",
      "Video consultations",
      "24/7 chat support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹599/mo",
    features: [
      "Everything in Premium",
      "Personal health coach",
      "Monthly health report",
    ],
  },
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  const handlePayment = () => {
    setTimeout(() => {
      localStorage.setItem("subscription", JSON.stringify({ plan: selectedPlan, active: true }));
      setPaymentOpen(false);
      setPaymentSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
        Choose Your Plan
      </h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-xl shadow-lg bg-white border hover:shadow-2xl transition transform hover:-translate-y-2 ${
              plan.highlighted ? "border-blue-500 ring-2 ring-blue-300" : ""
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
            <p className="text-3xl font-extrabold text-blue-600 mt-2">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              onClick={() => handleSubscribe(plan.name)}
            >
              Subscribe Now
            </Button>
          </div>
        ))}
      </div>

      {/* Dummy Payment Modal */}
      {paymentOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
            <p className="text-gray-600 mb-4">
              Pay for <span className="font-semibold">{selectedPlan}</span> plan
            </p>
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />
            <input
              type="password"
              placeholder="CVV"
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />
            <Button onClick={handlePayment} className="w-full flex gap-2">
              <CreditCard className="w-4 h-4" /> Pay Now
            </Button>
          </div>
        </div>
      )}

      {/* Payment Success Toast */}
      {paymentSuccess && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
          ✅ Subscription Successful! Enjoy your benefits.
        </div>
      )}
    </div>
  );
}
