import { useState, useEffect } from "react";
import {
  Bell,
  Pill,
  Trash2,
  CheckCircle2,
  AlarmClock,
  Calendar,
  Activity,
  Droplets,
} from "lucide-react";

type Reminder = {
  id: number;
  medicine: string;
  time: string;
  recurring: boolean;
  taken: boolean;
  date: string;
};

export default function MedicineDashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [recurring, setRecurring] = useState(true);
  const [selectedDate, ] = useState(new Date().toDateString());
  const [adherenceHistory, setAdherenceHistory] = useState<
    { date: string; taken: number; total: number }[]
  >([]);

  // ✅ Load reminders & history
  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    const savedHistory = JSON.parse(localStorage.getItem("adherence") || "[]");
    setReminders(savedReminders);
    setAdherenceHistory(savedHistory);
  }, []);

  // ✅ Save reminders & history
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
    localStorage.setItem("adherence", JSON.stringify(adherenceHistory));
  }, [reminders, adherenceHistory]);

  // ✅ Add Reminder
  const addReminder = () => {
    if (!medicine || !time) return alert("Please enter medicine & time!");
    const today = new Date().toDateString();
    setReminders((prev) => [
      ...prev,
      {
        id: Date.now(),
        medicine,
        time,
        recurring,
        taken: false,
        date: today,
      },
    ]);
    setMedicine("");
    setTime("");
  };

  const markAsTaken = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, taken: true } : r))
    );
    updateAdherence();
  };

  const deleteReminder = (id: number) =>
    setReminders((prev) => prev.filter((r) => r.id !== id));

  // ✅ Track adherence % for chart
  const updateAdherence = () => {
    const today = new Date().toDateString();
    const todayReminders = reminders.filter((r) => r.date === today);
    const takenCount = todayReminders.filter((r) => r.taken).length;

    setAdherenceHistory((prev) => {
      const existing = prev.find((p) => p.date === today);
      if (existing) {
        return prev.map((p) =>
          p.date === today ? { ...p, taken: takenCount, total: todayReminders.length } : p
        );
      }
      return [
        ...prev,
        { date: today, taken: takenCount, total: todayReminders.length },
      ];
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const todayReminders = reminders.filter((r) => r.date === selectedDate);
  const takenCount = todayReminders.filter((r) => r.taken).length;

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold flex items-center gap-2 text-blue-700">
          <Bell className="w-8 h-8" /> Medicine Dashboard
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow">
          <Calendar size={18} /> {selectedDate}
        </button>
      </div>

      {/* ADD REMINDER */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 border rounded-lg"
          />
          <button
            onClick={addReminder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg shadow"
          >
            ➕ Add
          </button>
        </div>
        <label className="flex items-center gap-2 mt-3 text-gray-700">
          <input
            type="checkbox"
            checked={recurring}
            onChange={() => setRecurring(!recurring)}
            className="w-4 h-4 accent-blue-600"
          />
          Repeat Daily
        </label>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-4 rounded-xl shadow border flex flex-col">
          <Activity className="text-green-600 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg">Adherence Rate</h3>
          <p className="text-2xl font-extrabold text-green-700">
            {todayReminders.length > 0
              ? Math.round((takenCount / todayReminders.length) * 100)
              : 0}
            %
          </p>
          <span className="text-sm text-gray-500">
            {takenCount} / {todayReminders.length} medicines taken today
          </span>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow border">
          <AlarmClock className="text-blue-600 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg">Next Medicine</h3>
          <p className="text-xl">
            {todayReminders.find((r) => !r.taken)?.medicine || "All Done!"}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow border">
          <Droplets className="text-blue-500 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg">Tip of the Day</h3>
          <p className="text-gray-700 text-sm">
            Stay hydrated! Drink water before taking medicines for better
            absorption.
          </p>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      <div className="overflow-x-auto mb-8">
        <div className="flex gap-4">
          {Array.from({ length: 24 }).map((_, hour) => {
            const medsAtHour = todayReminders.filter(
              (r) => parseInt(r.time.split(":")[0]) === hour
            );
            return (
              <div
                key={hour}
                className="flex flex-col items-center w-20 text-sm"
              >
                <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-100">
                  {hour % 12 || 12}
                  {hour >= 12 ? "PM" : "AM"}
                </div>
                {medsAtHour.map((m) => (
                  <div
                    key={m.id}
                    className={`mt-2 px-2 py-1 rounded-full text-xs ${
                      m.taken
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.medicine}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* REMINDER LIST */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Today's Reminders</h2>
      <div className="space-y-4">
        {todayReminders.length === 0 ? (
          <p className="text-gray-500">No reminders yet.</p>
        ) : (
          todayReminders.map((rem) => (
            <div
              key={rem.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow border hover:shadow-lg"
            >
              <div className="flex gap-4 items-center">
                <Pill className="text-blue-600 w-6 h-6" />
                <div>
                  <p
                    className={`font-semibold ${
                      rem.taken ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {rem.medicine}
                  </p>
                  <p className="text-sm text-gray-500">
                    ⏰ {formatTime(rem.time)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!rem.taken && (
                  <button
                    onClick={() => markAsTaken(rem.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <CheckCircle2 size={16} /> Taken
                  </button>
                )}
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
