/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import {
  CalendarDays,
  User,
  XCircle,
  CheckCircle,
  Video,
  Clock,
  Star,
  FileDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import doctorsData from "../data/doctors.json";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const STATUS_TABS = ["All", "Upcoming", "Completed", "Canceled"];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [rescheduleIndex, setRescheduleIndex] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showTooEarlyModal, setShowTooEarlyModal] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Load appointments from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    const allAppointments = JSON.parse(
      localStorage.getItem("appointments") || "{}"
    );
    const userAppointments = (allAppointments[user.username] || []).map(
      (appt: any) => {
        const apptDate = new Date(appt.date);
        const now = new Date();
        if (appt.status !== "Canceled") {
          appt.status = apptDate < now ? "Completed" : "Upcoming";
        }
        const doctor = doctorsData.find((doc) => doc.name === appt.doctorName);
        appt.image = doctor?.image || "https://via.placeholder.com/100";
        return appt;
      }
    );

    setAppointments(userAppointments);
    allAppointments[user.username] = userAppointments;
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
  }, [navigate]);

  const updateAppointments = (updated: any[]) => {
    setAppointments(updated);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const allAppointments = JSON.parse(
      localStorage.getItem("appointments") || "{}"
    );
    allAppointments[user.username] = updated;
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
  };

  // Cancel appointment
  const cancelAppointment = (index: number) => {
    const updated = [...appointments];
    updated[index].status = "Canceled";
    updateAppointments(updated);
    setSuccessMessage(
      `Appointment with ${updated[index].doctorName} was canceled`
    );
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Complete appointment
  const completeAppointment = (index: number) => {
    const updated = [...appointments];
    updated[index].status = "Completed";
    updateAppointments(updated);
    setReviewIndex(index);
    setShowReviewModal(true);
    toast({
      title: "Appointment Completed",
      description: "Marked as completed successfully.",
    });
  };

  // Submit review
  const submitReview = () => {
    if (reviewIndex === null) return;
    const updated = [...appointments];
    updated[reviewIndex].review = { rating, comment };
    updateAppointments(updated);
    setShowReviewModal(false);
    setRating(0);
    setComment("");
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  // Reschedule appointment
  const rescheduleAppointment = (index: number) => {
    if (!newDate) return;
    const updated = [...appointments];
    updated[index].date = newDate;
    updated[index].status = "Upcoming";
    updateAppointments(updated);
    setRescheduleIndex(null);
    setNewDate("");

    const formattedDate = new Date(updated[index].date).toLocaleString();
    setSuccessMessage(`Appointment rescheduled to ${formattedDate}`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Video call join
  const joinVideoCall = (apptDate: string) => {
    const now = new Date();
    const apptTime = new Date(apptDate);
    const diffMinutes = (apptTime.getTime() - now.getTime()) / (1000 * 60);

    if (diffMinutes <= 15 && diffMinutes > -30) {
      window.open("https://meet.google.com/new", "_blank");
    } else {
      setShowTooEarlyModal(true); // ✅ Show popup instead of toast
    }
  };

  // ✅ Generate Appointment Letter PDF
  const downloadAppointmentLetter = async (appt: any) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ✅ Hospital Logo (Base64)
    const logoUrl = "https://cdn-icons-png.flaticon.com/512/2966/2966480.png";
    const logo = await fetch(logoUrl).then((res) => res.blob());
    const logoData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logo);
    });

    // 🔥 Add Watermark (Diagonally)
    // Watermark
    (doc as any).saveGraphicsState();
    (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));
    doc.addImage(logoData, "PNG", 40, 70, 130, 130, undefined, undefined, 45);
    (doc as any).restoreGraphicsState();

    // 🎨 Header with Branding
    doc.setFillColor(25, 90, 160);
    doc.rect(0, 0, 210, 35, "F");
    doc.addImage(logoData, "PNG", 15, 7, 20, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255);
    doc.text("HealthCare+ Hospital", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("123 Wellness Street, New Delhi | +91 98765 43210", 105, 22, {
      align: "center",
    });

    // ✅ Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 70, 150);
    doc.text("Appointment Confirmation Letter", 105, 50, { align: "center" });

    // ✅ Date
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 58, {
      align: "right",
    });

    // ✅ Letter Content
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Dear ${appt.patientName},`, 20, 70);

    doc.text(
      `We are pleased to confirm your appointment with Dr. ${appt.doctorName}, our specialist in ${appt.specialization}.`,
      20,
      80,
      { maxWidth: 170 }
    );

    doc.text("Here are your appointment details:", 20, 92);

    // ✅ Appointment Details Table
    autoTable(doc, {
      startY: 98,
      margin: { left: 20 },
      head: [["Field", "Details"]],
      body: [
        ["Doctor Name", appt.doctorName],
        ["Specialization", appt.specialization],
        ["Patient Name", appt.patientName],
        ["Appointment Date & Time", new Date(appt.date).toLocaleString()],
        ["Status", appt.status],
      ],
      headStyles: { fillColor: [30, 70, 150], textColor: 255 },
      bodyStyles: { fontSize: 11 },
      theme: "striped",
    });

    // ✅ Important Instructions
    let yPos = (doc as any).lastAutoTable.finalY + 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(25, 90, 160);
    doc.text("Important Instructions:", 20, yPos);

    yPos += 8;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50);

    const instructions = [
      "• Arrive 15 minutes early and carry your medical reports.",
      "• Online consultation: Join the video link 10 mins before the slot.",
      "• Masks are mandatory for in-person visits.",
      "• Cancellation must be done at least 24 hours in advance.",
      "• For emergencies, call: +91 98765 43210.",
    ];

    instructions.forEach((line) => {
      doc.text(line, 25, yPos, { maxWidth: 160 });
      yPos += 7;
    });

    // ✅ QR Code
    const qrData = `Appointment: ${appt.doctorName} | ${new Date(
      appt.date
    ).toLocaleString()} | Patient: ${appt.patientName}`;
    const qrImage = await QRCode.toDataURL(qrData);
    doc.addImage(qrImage, "PNG", 160, yPos - 10, 35, 35);

    // ✅ Signature
    yPos += 45;
    doc.setFont("times", "italic");
    doc.setTextColor(80);
    doc.text("Sincerely,", 20, yPos);

    yPos += 12;
    doc.setFont("times", "bold");
    doc.setTextColor(30, 70, 150);
    doc.text(`Dr. Admin`, 20, yPos);
    doc.setFont("times", "normal");
    doc.setTextColor(80);
    doc.text("Hospital Administration", 20, yPos + 6);

    // ✅ Footer Disclaimer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "This is a computer-generated letter and does not require a physical signature.",
      105,
      287,
      { align: "center" }
    );

    // ✅ Save PDF
    doc.save(`Appointment_${appt.patientName}.pdf`);
  };

  // Filtering
  const filteredAppointments =
    selectedTab === "All"
      ? appointments
      : appointments.filter((appt) => appt.status === selectedTab);

  const statusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCountdown = (date: string) => {
    const now = new Date();
    const apptDate = new Date(date);
    const diff = apptDate.getTime() - now.getTime();
    if (diff <= 0) return "Starting soon or in progress!";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  const getNoAppointmentEmoji = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "😕 No upcoming appointments.";
      case "Completed":
        return "✅ No completed appointments.";
      case "Canceled":
        return "🎉 No canceled appointments.";
      default:
        return "📅 No appointments found.";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700">
        My Appointments
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? "default" : "outline"}
            onClick={() => setSelectedTab(tab)}
            className="px-6 py-2 capitalize rounded-full"
          >
            {tab}
          </Button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg mb-4">
            {getNoAppointmentEmoji(selectedTab)}
          </p>
          <Button onClick={() => navigate("/")}>Book an Appointment</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredAppointments.map((appt, index) => (
            <Card
              key={index}
              className={`shadow-lg hover:shadow-2xl transition-all border-l-4 ${
                appt.status === "Upcoming"
                  ? "border-blue-500"
                  : appt.status === "Completed"
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-5">
                  <img
                    src={appt.image}
                    alt={appt.doctorName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {appt.doctorName}
                        </h2>
                        <p className="text-gray-500">{appt.specialization}</p>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColor(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-gray-700">
                      <p className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        <strong>Date:</strong>{" "}
                        {new Date(appt.date).toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-blue-500" />
                        <strong>Patient:</strong> {appt.patientName}
                      </p>
                      {appt.status === "Upcoming" && (
                        <p className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                          <Clock className="w-4 h-4" />{" "}
                          {getCountdown(appt.date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Review */}
                {appt.status === "Completed" && appt.review && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-semibold text-gray-700">
                      Your Review:
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(appt.review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>
                    {appt.review.comment && (
                      <p className="text-gray-600 text-sm mt-1 italic">
                        "{appt.review.comment}"
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 space-y-3">
                  {appt.status === "Upcoming" && rescheduleIndex === index ? (
                    <div className="flex gap-2">
                      <Input
                        type="datetime-local"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                      <Button onClick={() => rescheduleAppointment(index)}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setRescheduleIndex(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {appt.status === "Upcoming" && (
                        <>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => cancelAppointment(index)}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-green-500 text-green-600"
                            onClick={() => completeAppointment(index)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Complete
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setRescheduleIndex(index)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="default"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => joinVideoCall(appt.date)}
                          >
                            <Video className="w-4 h-4 mr-2" /> Join Call
                          </Button>
                        </>
                      )}

                      {/* ✅ Download Letter */}
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-500 text-blue-600"
                        onClick={() => downloadAppointmentLetter(appt)}
                      >
                        <FileDown className="w-4 h-4 mr-2" /> Download Letter
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Leave a Review
            </h2>
            <p className="text-gray-600 mb-4">
              How was your experience with{" "}
              <strong>{appointments[reviewIndex!]?.doctorName}</strong>?
            </p>

            {/* Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              className="w-full border rounded-lg p-2 text-sm mb-4 focus:outline-blue-400"
              placeholder="Write a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitReview} disabled={rating === 0}>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-bounceIn">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              {successMessage}
            </h2>
            <p className="text-gray-600 mt-2">Your changes have been saved.</p>
          </div>
        </div>
      )}

      {/* Too Early Modal */}
      {showTooEarlyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center animate-fadeIn">
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              Too Early!
            </h2>
            <p className="text-gray-600 mb-4">
              You can join the call only <strong>15 minutes before</strong> your
              appointment time.
            </p>
            <Button onClick={() => setShowTooEarlyModal(false)}>
              Okay, Got It
            </Button>
          </div>
        </div>
      )}

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
