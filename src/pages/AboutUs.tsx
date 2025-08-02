import {
  Users,
  Stethoscope,
  HeartPulse,
  Target,
  Quote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white text-gray-800 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative text-center py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-700/90 to-purple-700/90 animate-gradient-x"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-white px-4">
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-4 drop-shadow-lg">
            About <span className="text-yellow-300">HealthCare+</span>
          </h1>
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            Revolutionizing healthcare through innovation, compassion, and
            technology – all at your fingertips.
          </p>
        </div>
        {/* Removed w-[120%], replaced with w-full */}
        <div className="absolute -bottom-16 left-0 right-0 w-full h-32 bg-white rounded-t-[50%] shadow-inner"></div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="backdrop-blur-md bg-white/70 shadow-xl rounded-2xl p-8 border border-white/20 hover:scale-[1.02] transition-transform">
          <Target className="w-14 h-14 text-blue-600 mb-5" />
          <h2 className="text-3xl font-bold mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To make quality healthcare accessible for everyone with seamless
            booking, secure virtual consultations, and world-class specialists.
          </p>
        </div>
        <div className="backdrop-blur-md bg-white/70 shadow-xl rounded-2xl p-8 border border-white/20 hover:scale-[1.02] transition-transform">
          <HeartPulse className="w-14 h-14 text-red-600 mb-5" />
          <h2 className="text-3xl font-bold mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            A world where technology bridges the gap between patients and
            doctors, delivering trusted care anytime, anywhere.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
          Our Impact in Numbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto px-6">
          {[
            {
              icon: Users,
              number: "500+",
              label: "Trusted Doctors",
              color: "bg-blue-100 text-blue-700",
            },
            {
              icon: Stethoscope,
              number: "10k+",
              label: "Appointments Booked",
              color: "bg-green-100 text-green-700",
            },
            {
              icon: ShieldCheck,
              number: "98%",
              label: "Patient Satisfaction",
              color: "bg-purple-100 text-purple-700",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 ${stat.color}`}
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-4xl font-extrabold">{stat.number}</h3>
              <p className="mt-2 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 max-w-6xl mx-auto px-6 text-center">
        <Sparkles className="w-12 h-12 mx-auto text-yellow-500 mb-4 animate-bounce" />
        <h2 className="text-4xl font-bold text-blue-700 mb-10">
          Why Choose HealthCare+
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Instant doctor booking",
            "Secure online consultations",
            "Verified specialists",
            "Easy rescheduling",
          ].map((point, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl shadow-md bg-white hover:bg-blue-50 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <p className="text-lg font-semibold">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20 text-center relative">
        <Quote className="w-14 h-14 mx-auto mb-4 opacity-80" />
        <p className="text-2xl italic max-w-3xl mx-auto">
          "Your health deserves the best care. With HealthCare+, we connect you
          to excellence in every consultation."
        </p>
        {/* Fixed cut-out to avoid horizontal scroll */}
        <div className="absolute -bottom-8 left-0 right-0 w-full h-20 bg-white rounded-t-[50%] shadow-inner"></div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-white">
        <h2 className="text-4xl font-extrabold mb-4 text-blue-700">
          Take Charge of Your Health Today
        </h2>
        <p className="text-gray-600 mb-6">
          Book an appointment with top specialists in just a few clicks.
        </p>
        <Button
          size="lg"
          className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          Book Your Appointment
        </Button>
      </section>

      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 8s ease infinite;
          }
        `}
      </style>
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Join Our Subscription Plans
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Get unlimited consultations, exclusive discounts, and more.
        </p>
        <Button
          size="lg"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
          onClick={() => (window.location.href = "/subscriptions")}
        >
          View Plans & Subscribe
        </Button>
      </section>
    </div>
  );
}
