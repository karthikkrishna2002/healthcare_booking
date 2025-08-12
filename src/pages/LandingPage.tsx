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
  time: string;
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
    color: "bg-blue-100/80 text-blue-900 backdrop-blur-sm",
  },
  { text: "🏃 Exercise 30 mins/day", color: "bg-green-100/80 text-green-900 backdrop-blur-sm" },
  {
    text: "🥦 Eat leafy greens for heart health",
    color: "bg-emerald-100/80 text-emerald-900 backdrop-blur-sm",
  },
  {
    text: "🛌 Sleep 7–8 hrs for recovery",
    color: "bg-purple-100/80 text-purple-900 backdrop-blur-sm",
  },
  {
    text: "🩺 Regular health check-ups matter",
    color: "bg-red-100/80 text-red-900 backdrop-blur-sm",
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

  useEffect(() => {
    setDoctors(doctorsData);
    const savedReminders = localStorage.getItem("reminders");
    if (savedReminders) setReminders(JSON.parse(savedReminders));
  }, []);

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
    <div className="font-sans antialiased">
      {/* REMINDER ALERT BANNER */}
      {alert && (
        <div className="bg-gradient-to-r from-yellow-100/90 to-yellow-200/90 border-y border-yellow-300/50 text-yellow-900 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg backdrop-blur-sm animate-slideDown">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-700" />
            <span className="text-sm font-medium tracking-tight">
              💊 <strong>{alert.medicine}</strong> reminder: Take at{" "}
              <strong>{alert.time}</strong> to stay healthy!
            </span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-yellow-800 hover:text-yellow-900 font-bold text-lg transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-10 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-blue-100/80 text-blue-800 rounded-full shadow-sm backdrop-blur-sm mb-6 animate-fadeIn">
            🏥 Trusted by 10,000+ Patients
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Your Health, Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Priority
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with top specialists for seamless online booking and secure consultations anytime, anywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-300/30 hover:scale-105 transition-all duration-300"
              onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            >
              📅 Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50/80 hover:border-blue-600 hover:scale-105 transition-all duration-300"
              onClick={() => window.scrollTo({ top: 1200, behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>
        </div>
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40px, -30px) scale(1.15); }
            66% { transform: translate(-30px, 40px) scale(0.85); }
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Stethoscope className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-600">Qualified Doctors</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900">10k+</h3>
            <p className="text-gray-600">Happy Patients</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
            <p className="text-gray-600">Booking Available</p>
          </div>
        </div>
      </section>

      {/* HEALTH TIP CAROUSEL */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-8 tracking-tight">
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
                  className={`min-w-[280px] sm:min-w-[320px] flex-shrink-0 rounded-2xl shadow-md border border-gray-100/50 p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${tip.color}`}
                >
                  <p className="text-base font-medium tracking-tight">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-8 tracking-tight">
          Featured Doctors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <Card
              key={doc.id}
              className="p-6 text-center bg-gradient-to-b from-white to-blue-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-28 h-28 mx-auto rounded-full mb-4 border-4 border-blue-100/50 object-cover"
              />
              <h3 className="font-semibold text-xl text-gray-900">{doc.name}</h3>
              <p className="text-gray-600">{doc.specialization}</p>
              <Button
                onClick={() => navigate(`/doctor/${doc.id}`)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-all"
              >
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-8 tracking-tight">
          Find Your Doctor
        </h2>
        <div className="flex justify-center mb-8 relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-3.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 w-full rounded-lg shadow-md border-gray-200 focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={selectedSpec === spec ? "default" : "outline"}
              onClick={() => setSelectedSpec(spec)}
              className={`capitalize rounded-lg ${
                selectedSpec === spec
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border-blue-500 text-blue-600 hover:bg-blue-50/80 hover:border-blue-600"
              } transition-all hover:scale-105`}
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
              className={`capitalize rounded-lg ${
                selectedAvailability === status
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border-blue-500 text-blue-600 hover:bg-blue-50/80 hover:border-blue-600"
              } transition-all hover:scale-105`}
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
              className="relative cursor-pointer group rounded-2xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-b from-white to-blue-50/50 overflow-hidden"
              onClick={() => navigate(`/doctor/${doctor.id}`)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-100/50 mb-4 transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                <span
                  className={`mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
                    doctor.availability === "Available Today"
                      ? "bg-green-100/80 text-green-800"
                      : doctor.availability === "Fully Booked"
                      ? "bg-red-100/80 text-red-800"
                      : "bg-yellow-100/80 text-yellow-800"
                  } backdrop-blur-sm`}
                >
                  {doctor.availability}
                </span>
                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 bg-blue-50/80 border-t border-blue-100/50 transition-all duration-300 rounded-b-2xl backdrop-blur-sm">
                  <div className="flex justify-around py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/${doctor.id}`);
                      }}
                      className="border-blue-500 text-blue-600 hover:bg-blue-100/80 hover:scale-105 transition-all"
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
                          : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                      } transition-all`}
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
          <p className="text-center text-gray-500 mt-8 text-lg">No doctors found.</p>
        )}
      </section>

      {/* FAQ SECTION */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] opacity-5"></div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-blue-800 tracking-tight">
          ❓ Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-4 px-6 relative z-10">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg border relative overflow-hidden transition-all duration-300 ${
                openFaq === idx
                  ? "bg-white/90 border-blue-200 shadow-blue-100/50 backdrop-blur-sm"
                  : "bg-white/80 border-gray-100/50 hover:shadow-xl hover:scale-[1.01] backdrop-blur-sm"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex justify-between items-center w-full px-6 py-5 text-left group"
              >
                <span
                  className={`font-semibold text-lg tracking-tight ${
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
                      : "rotate-0 group-hover:translate-y-0.5"
                  }`}
                />
              </button>
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
              {openFaq === idx && (
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-16 w-36 h-36 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <style>{`
          @keyframes slideDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slideDown { animation: slideDown 0.3s ease forwards; }
        `}</style>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-blue-800 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">🏥 HealthCare+</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Your trusted platform for booking doctors and managing appointments securely.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 tracking-tight">Quick Links</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li
                className="hover:text-white cursor-pointer transition-colors"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li
                className="hover:text-white cursor-pointer transition-colors"
                onClick={() => navigate("/appointments")}
              >
                My Appointments
              </li>
              <li
                className="hover:text-white cursor-pointer transition-colors"
                onClick={() => navigate("/doctors")}
              >
                Find Doctors
              </li>
              <li
                className="hover:text-white cursor-pointer transition-colors"
                onClick={() => navigate("/about")}
              >
                About Us
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 tracking-tight">Contact Us</h4>
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
          <div>
            <h4 className="font-semibold text-lg mb-3 tracking-tight">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-blue-600/80 p-2 rounded-full hover:bg-blue-500 transition-all hover:scale-110 backdrop-blur-sm"
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}