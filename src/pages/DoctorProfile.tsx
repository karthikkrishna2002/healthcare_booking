import { useParams, useNavigate } from "react-router-dom";
import doctorsData from "../data/doctors.json";
import type { Doctor } from "../types";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const doctor: Doctor | undefined = doctorsData.find(
    (d) => d.id === Number(id)
  );

  if (!doctor) {
    return (
      <h1 className="p-6 text-center text-red-500 text-xl">Doctor not found</h1>
    );
  }

  const handleBooking = () => {
    if (
      doctor.availability === "On Leave" ||
      doctor.availability === "Fully Booked"
    ) {
      setShowModal(true);
      return;
    }
    navigate(`/doctor/${doctor.id}/book`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Doctor Header */}
      <Card className="shadow-lg">
        <CardContent className="flex gap-6 items-center p-6">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
          />
          <div>
            <h1 className="text-3xl font-bold">{doctor.name}</h1>
            
            <p className="text-lg text-gray-600">{doctor.specialization}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                doctor.availability === "Available Today"
                  ? "bg-green-100 text-green-700"
                  : doctor.availability === "Fully Booked"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {doctor.availability}
            </span>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-3 text-yellow-500">
              {[...Array(Math.floor(doctor.rating))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500" />
              ))}
              {[...Array(5 - Math.floor(doctor.rating))].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gray-300" />
              ))}
              <span className="ml-2 text-gray-600 text-sm">
                ({doctor.reviews} reviews)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            Dr. {doctor.name} is an experienced {doctor.specialization} with
            over {5 + Math.floor(Math.random() * 15)} years of practice,
            specializing in patient-centered care and modern treatment methods.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              Email: {doctor.name.split(" ")[1].toLowerCase()}@healthcare.com
            </p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Location: City Health Clinic, Main St.</p>
          </CardContent>
        </Card>
      </div>

      {/* Availability Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-gray-700">
            {doctor.schedule.map((slot, idx) => (
              <li key={idx} className="py-1">
                {slot}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Book Appointment */}
      <div className="flex justify-center">
        <Button size="lg" className="px-8 py-4 text-lg" onClick={handleBooking}>
          Book Appointment
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              {doctor.availability === "On Leave"
                ? "Doctor Unavailable"
                : "Fully Booked"}
            </h2>
            <p className="text-gray-700 mb-6">
              {doctor.name} is currently <strong>{doctor.availability}</strong>.
              Please choose another doctor or try booking later.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button onClick={() => navigate("/")}>View Other Doctors</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
