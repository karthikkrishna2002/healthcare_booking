/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import doctorsData from "../data/doctors.json";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";
import jsPDF from "jspdf";

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctorsData.find((d) => d.id === Number(id));

  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const consultationFee = 500; // ₹500 fixed fee for demo

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) setEmailError("Enter a valid email address");
    else setEmailError("");
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !email || !date || emailError) return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("You need to login first!");
      navigate("/login");
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = () => {
    const txnId = "TXN" + Date.now();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const newAppointment = {
      doctorName: doctor?.name,
      specialization: doctor?.specialization,
      date,
      patientName,
      email,
      fee: consultationFee,
      transactionId: txnId,
    };

    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "{}");
    if (!allAppointments[user.username]) allAppointments[user.username] = [];
    allAppointments[user.username].push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(allAppointments));

    setReceiptData(newAppointment);
    setShowPayment(false);
    setShowReceipt(true);
  };

  const downloadReceiptPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Appointment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient: ${receiptData.patientName}`, 20, 40);
    doc.text(`Email: ${receiptData.email}`, 20, 50);
    doc.text(`Doctor: ${receiptData.doctorName}`, 20, 60);
    doc.text(`Specialization: ${receiptData.specialization}`, 20, 70);
    doc.text(`Date: ${new Date(receiptData.date).toLocaleString()}`, 20, 80);
    doc.text(`Consultation Fee: ₹${receiptData.fee}`, 20, 90);
    doc.text(`Transaction ID: ${receiptData.transactionId}`, 20, 100);

    doc.save("appointment_receipt.pdf");
  };

  if (!doctor)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">Doctor not found</p>
    );

  return (
    <div className="relative flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-blue-100 via-white to-blue-100 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      {/* Booking Form */}
      {!showPayment && !showReceipt && (
        <form
          onSubmit={handleBooking}
          className="backdrop-blur-lg bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-8 w-full max-w-lg transform transition-all hover:scale-[1.01]"
        >
          <div className="flex flex-col items-center mb-6">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-blue-200"
            />
            <h1 className="text-3xl font-bold mt-4 text-gray-800 text-center">
              Book Appointment
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              with <span className="font-semibold">{doctor.name}</span> ({doctor.specialization})
            </p>
            <p className="mt-2 text-blue-700 font-medium">
              💰 Consultation Fee: ₹{consultationFee}
            </p>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            <div>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl text-lg">
            Proceed to Payment
          </Button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Dummy Payment Modal */}
      {showPayment && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-bounceIn w-96">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>
            <p className="mb-6">Pay ₹{consultationFee} to confirm your booking.</p>
            <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700">
              Pay Now
            </Button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-[400px] animate-bounceIn">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Appointment Confirmed!</h2>
            <p className="text-gray-600 mt-2">Transaction ID: {receiptData.transactionId}</p>
            <div className="mt-4 text-left text-gray-700">
              <p><strong>Patient:</strong> {receiptData.patientName}</p>
              <p><strong>Doctor:</strong> {receiptData.doctorName}</p>
              <p><strong>Specialization:</strong> {receiptData.specialization}</p>
              <p><strong>Date:</strong> {new Date(receiptData.date).toLocaleString()}</p>
              <p><strong>Fee:</strong> ₹{receiptData.fee}</p>
            </div>
            <Button onClick={downloadReceiptPDF} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
              Download Receipt (PDF)
            </Button>
            <Button
              onClick={() => navigate("/appointments")}
              className="mt-3 w-full bg-green-600 hover:bg-green-700"
            >
              Go to My Appointments
            </Button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounceIn { animation: bounceIn 0.4s ease; }
      `}</style>
    </div>
  );
}
