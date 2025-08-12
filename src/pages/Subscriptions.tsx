import { useState } from "react";
import { CheckCircle, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "₹199/mo",
    subtitle: "Essential Healthcare Access",
    description: "Perfect for individuals seeking affordable and reliable appointment booking with basic support.",
    features: [
      "Book unlimited appointments with verified doctors",
      "Access to basic customer support via email",
      "Secure appointment management dashboard",
    ],
  },
  {
    name: "Premium",
    price: "₹399/mo",
    subtitle: "Enhanced Care Experience",
    description: "Ideal for those who want priority access and virtual consultations with round-the-clock support.",
    features: [
      "Priority booking with top specialists",
      "Unlimited video consultations",
      "24/7 live chat support with health advisors",
      "Appointment reminders and notifications",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹599/mo",
    subtitle: "Comprehensive Health Support",
    description: "Best for users seeking personalized health coaching and detailed health insights.",
    features: [
      "Everything in Premium plan",
      "Dedicated personal health coach",
      "Monthly health report with actionable insights",
      "Priority access to new features and updates",
    ],
  },
];

const faqs = [
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit/debit cards, UPI, and net banking for secure transactions.",
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel anytime from your account settings. Refunds are subject to our policy.",
  },
  {
    question: "Are there any hidden fees?",
    answer: "No hidden fees! The price displayed is the final amount you'll be charged monthly.",
  },
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-20 font-sans antialiased">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">
          Choose Your HealthCare+ Plan
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Unlock premium healthcare benefits tailored to your needs. Select a plan to access top doctors, personalized support, and exclusive features.
        </p>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-8 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
              plan.highlighted ? "ring-2 ring-blue-300 border-blue-400" : ""
            }`}
          >
            {plan.highlighted && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{plan.subtitle}</p>
            <p className="text-3xl font-extrabold text-blue-600 mt-4">{plan.price}</p>
            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            <ul className="mt-6 space-y-3 text-gray-600">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" /> {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`mt-8 w-full rounded-lg ${
                plan.highlighted
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } hover:scale-105 transition-all duration-300`}
              onClick={() => handleSubscribe(plan.name)}
            >
              Subscribe Now
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-gray-100/50 transition-all duration-300 ${
                openFaq === idx ? "border-blue-200 shadow-lg" : "hover:shadow-lg hover:scale-[1.01]"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex justify-between items-center w-full px-6 py-4 text-left"
              >
                <span
                  className={`font-semibold text-base ${
                    openFaq === idx ? "text-blue-700" : "text-gray-800"
                  }`}
                >
                  {faq.question}
                </span>
               
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openFaq === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-gray-600 text-sm">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Modal */}
      {paymentOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Subscription</h2>
            <p className="text-gray-600 mb-6">
              You're subscribing to the{" "}
              <span className="font-semibold text-blue-600">{selectedPlan}</span> plan
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  className="w-1/2 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  className="w-1/2 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
            </div>
            <Button
              onClick={handlePayment}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <CreditCard className="w-5 h-5" /> Pay Now
            </Button>
            <button
              onClick={() => setPaymentOpen(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
              <HelpCircle className="w-4 h-4" />
              <a href="mailto:support@healthcareplus.com" className="hover:text-blue-600">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Toast */}
      {paymentSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600/90 text-white px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-3 animate-slideUp">
          <CheckCircle className="w-5 h-5" />
          <span>Subscription Successful! Enjoy your {selectedPlan} plan benefits.</span>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}