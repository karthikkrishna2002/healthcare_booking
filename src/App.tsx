import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Subscriptions from "./pages/Subscriptions";
import HealthBot from "./pages/HealthBot";
import MedicineReminder from "./pages/MedicineReminder";

export default function App() {
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
           
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/doctor/:id/book" element={<BookAppointment />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/reminders" element={<MedicineReminder />} />
          </Routes>
        </main>
        <Toaster />
        <HealthBot />
      </div>
    </Router>
  );
}
