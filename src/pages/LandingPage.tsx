import { useState, useEffect, useRef } from "react";
import doctorsData from "../data/doctors.json";
import { useNavigate } from "react-router-dom";
import type { Doctor } from "../types";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Search,
  Stethoscope,
  Users,
  Clock,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
} from "lucide-react";

type Reminder = {
  id: number;
  medicine: string;
  time: string; // "HH:MM"
  recurring: boolean;
};

const specializations = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Gynecologist",
  "Neurologist",
];

const healthTips = [
  {
    text: "💧 Stay hydrated: Drink 8 glasses daily",
    color: "bg-blue-100 text-blue-800",
  },
  { text: "🏃 Exercise 30 mins/day", color: "bg-green-100 text-green-800" },
  {
    text: "🥦 Eat leafy greens for heart health",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    text: "🛌 Sleep 7–8 hrs for recovery",
    color: "bg-purple-100 text-purple-800",
  },
  {
    text: "🩺 Regular health check-ups matter",
    color: "bg-red-100 text-red-800",
  },
];

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Search for a doctor, open their profile, and click 'Book Appointment'.",
  },
  {
    q: "Can I reschedule or cancel?",
    a: "Yes! Manage it easily from the 'My Appointments' page.",
  },
  {
    q: "Do you support online consultations?",
    a: "Yes, many doctors provide virtual consultations.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely! We use encryption to protect your data.",
  },
];

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [alert, setAlert] = useState<Reminder | null>(null);

  const availabilityOptions = [
    "All",
    "Available Today",
    "Fully Booked",
    "On Leave",
  ];
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load doctors & reminders
  useEffect(() => {
    setDoctors(doctorsData);
    const savedReminders = localStorage.getItem("reminders");
    if (savedReminders) setReminders(JSON.parse(savedReminders));
  }, []);

  // Auto-scroll tips
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let scrollAmount = 0;
    const scrollSpeed = 1;
    const interval = setInterval(() => {
      if (!container) return;
      scrollAmount += scrollSpeed;
      container.scrollLeft += scrollSpeed;
      if (scrollAmount >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Reminder Alert: Check every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder) => {
        const [hour, min] = reminder.time.split(":").map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hour, min, 0, 0);

        const diff = reminderTime.getTime() - now.getTime();
        if (diff > 0 && diff <= 30 * 60 * 1000) {
          setAlert(reminder);
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  // Auto-hide alert after 10 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const filteredDoctors = doctors.filter(
    (doc) =>
      (selectedSpec === "All" || doc.specialization === selectedSpec) &&
      (selectedAvailability === "All" ||
        doc.availability === selectedAvailability) &&
      (doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(search.toLowerCase()))
  );

  const featuredDoctors = doctors.slice(0, 3);

  return (
    <div>
      {/* 🚨 REMINDER ALERT BANNER */}
      {alert && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>
              💊 It's almost time! Please take <strong>{alert.medicine}</strong>{" "}
              at <strong>{alert.time}</strong> to stay on track with your
              health.
            </span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-yellow-700 hover:text-yellow-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-purple-50 overflow-hidden">
        {/* Floating Shapes for Modern Feel */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 -right-16 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center py-24 sm:py-28">
          {/* Tagline */}
          <span className="px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full shadow-sm inline-block mb-4">
            🏥 Trusted by 10,000+ Patients
          </span>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-900 leading-tight drop-shadow-sm">
            Your Health, Our{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Priority
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Book trusted doctors online with{" "}
            <span className="font-semibold text-blue-700">easy scheduling</span>
            , secure consultations, and top-rated specialists anytime, anywhere.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-300/50 transition-transform hover:scale-105"
              onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            >
              📅 Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:bg-blue-50 hover:border-blue-400 transition-transform hover:scale-105"
              onClick={() => window.scrollTo({ top: 1200, behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* CSS for Floating Blob Animation */}
        <style>{`
    @keyframes blob {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    .animate-blob { animation: blob 8s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }
  `}</style>
      </section>

      {/* STATS SECTION */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-blue-50 rounded-lg shadow">
            <Stethoscope className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">500+</h3>
            <p className="text-gray-600">Qualified Doctors</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg shadow">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">10k+</h3>
            <p className="text-gray-600">Happy Patients</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg shadow">
            <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">24/7</h3>
            <p className="text-gray-600">Booking Available</p>
          </div>
        </div>
      </section>

      {/* HEALTH TIP CAROUSEL */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
            💡 Healthy Living Tips
          </h2>
          <div
            ref={scrollRef}
            className="overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth"
          >
            <div className="gap-4 inline-flex w-max">
              {[...healthTips, ...healthTips].map((tip, idx) => (
                <div
                  key={idx}
                  className={`min-w-[250px] sm:min-w-[300px] flex-shrink-0 rounded-xl shadow-md border border-gray-100 p-5 transition hover:shadow-xl hover:-translate-y-1 ${tip.color}`}
                >
                  <p className="text-base font-medium">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Featured Doctors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <Card
              key={doc.id}
              className="p-4 text-center shadow hover:shadow-lg transition"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="font-semibold text-lg">{doc.name}</h3>
              <p className="text-gray-600">{doc.specialization}</p>
              <Button
                onClick={() => navigate(`/doctor/${doc.id}`)}
                className="mt-3"
              >
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Find Your Doctor
        </h2>
        <div className="flex justify-center mb-6 relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full shadow-md"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={selectedSpec === spec ? "default" : "outline"}
              onClick={() => setSelectedSpec(spec)}
              className="capitalize"
            >
              {spec}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {availabilityOptions.map((status) => (
            <Button
              key={status}
              variant={selectedAvailability === status ? "default" : "outline"}
              onClick={() => setSelectedAvailability(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* DOCTOR CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="relative cursor-pointer group rounded-xl shadow-md hover:shadow-xl transition-all"
              onClick={() => navigate(`/doctor/${doctor.id}`)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mb-4 transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-gray-500 text-sm">{doctor.specialization}</p>
                <span
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    doctor.availability === "Available Today"
                      ? "bg-green-100 text-green-700"
                      : doctor.availability === "Fully Booked"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {doctor.availability}
                </span>
                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 bg-blue-50 border-t border-blue-100 transition-all duration-300 rounded-b-xl">
                  <div className="flex justify-around py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/${doctor.id}`);
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/${doctor.id}/book`);
                      }}
                      disabled={
                        doctor.availability === "On Leave" ||
                        doctor.availability === "Fully Booked"
                      }
                      className={`${
                        doctor.availability === "On Leave" ||
                        doctor.availability === "Fully Booked"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredDoctors.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No doctors found.</p>
        )}
      </section>

      {/* FAQ SECTION */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 via-white to-blue-50 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] opacity-5"></div>
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 tracking-tight">
          ❓ Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4 px-6 relative z-10">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg border relative overflow-hidden transition-all duration-300 ${
                openFaq === idx
                  ? "bg-white border-blue-300 shadow-blue-100"
                  : "bg-white/80 backdrop-blur-lg border-gray-200 hover:shadow-xl hover:scale-[1.01]"
              }`}
            >
              {/* Clickable Question */}
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex justify-between items-center w-full px-6 py-5 text-left group"
              >
                <span
                  className={`font-semibold text-lg transition-colors ${
                    openFaq === idx
                      ? "text-blue-700"
                      : "text-gray-800 group-hover:text-blue-600"
                  }`}
                >
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
                    openFaq === idx
                      ? "rotate-180"
                      : "rotate-0 group-hover:translate-y-1"
                  }`}
                />
              </button>

              {/* Animated Answer */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openFaq === idx
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed animate-slideDown">
                    {item.a}
                  </div>
                </div>
              </div>

              {/* Accent Bar */}
              {openFaq === idx && (
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
              )}
            </div>
          ))}
        </div>

        {/* Decorative Shapes */}
        <div className="absolute top-10 left-10 w-28 h-28 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-10 right-16 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        {/* Animations */}
        <style>{`
    @keyframes slideDown { 
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slideDown { animation: slideDown 0.3s ease forwards; }
  `}</style>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-800 text-white py-12 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🏥 HealthCare+</h3>
            <p className="text-blue-200 text-sm">
              Your trusted platform for booking doctors and managing
              appointments securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => navigate("/appointments")}
              >
                My Appointments
              </li>
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => navigate("/doctors")}
              >
                Find Doctors
              </li>
              <li
                className="hover:text-white cursor-pointer"
                onClick={() => navigate("/about")}
              >
                About Us
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} /> 123 Health St, Wellness City
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@healthcareplus.com
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-blue-300 text-xs mt-8">
          © {new Date().getFullYear()} HealthCare+. All rights reserved.
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
