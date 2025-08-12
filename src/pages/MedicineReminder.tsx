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
  const [selectedDate] = useState(new Date().toDateString());
  const [adherenceHistory, setAdherenceHistory] = useState<
    { date: string; taken: number; total: number }[]
  >([]);

  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    const savedHistory = JSON.parse(localStorage.getItem("adherence") || "[]");
    setReminders(savedReminders);
    setAdherenceHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
    localStorage.setItem("adherence", JSON.stringify(adherenceHistory));
  }, [reminders, adherenceHistory]);

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
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-10">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold text-indigo-700 select-none">
          <Bell className="w-10 h-10 text-indigo-600" />
          Medicine Dashboard
        </h1>
        <button
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg shadow-lg transition"
          aria-label="Selected date"
        >
          <Calendar size={20} />
          <span>{selectedDate}</span>
        </button>
      </header>

      {/* ADD REMINDER */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-indigo-100">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-36 border border-gray-300 rounded-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            onClick={addReminder}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition"
            aria-label="Add reminder"
          >
            ➕ Add
          </button>
        </div>
        <label className="flex items-center gap-3 mt-5 text-gray-700 text-md font-medium select-none cursor-pointer">
          <input
            type="checkbox"
            checked={recurring}
            onChange={() => setRecurring(!recurring)}
            className="w-5 h-5 accent-indigo-600"
          />
          Repeat Daily
        </label>
      </section>

      {/* ANALYTICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 flex flex-col items-center">
          <Activity className="text-green-600 w-8 h-8 mb-3" />
          <h3 className="font-semibold text-xl text-green-800 mb-2">Adherence Rate</h3>
          <p className="text-4xl font-extrabold text-green-700 mb-1">
            {todayReminders.length > 0
              ? Math.round((takenCount / todayReminders.length) * 100)
              : 0}
            %
          </p>
          <span className="text-gray-500 font-medium">
            {takenCount} / {todayReminders.length} medicines taken today
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 flex flex-col items-center">
          <AlarmClock className="text-blue-600 w-8 h-8 mb-3" />
          <h3 className="font-semibold text-xl text-blue-800 mb-2">Next Medicine</h3>
          <p className="text-lg font-medium text-gray-800">
            {todayReminders.find((r) => !r.taken)?.medicine || "All Done!"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 p-6 flex flex-col items-center">
          <Droplets className="text-yellow-500 w-8 h-8 mb-3" />
          <h3 className="font-semibold text-xl text-yellow-700 mb-2">Tip of the Day</h3>
          <p className="text-center text-gray-700 text-sm max-w-xs">
            Stay hydrated! Drink water before taking medicines for better absorption.
          </p>
        </div>
      </section>

      {/* TIMELINE VIEW */}
      <section className="overflow-x-auto mb-12">
        <div className="flex gap-6 min-w-max px-2">
          {Array.from({ length: 24 }).map((_, hour) => {
            const medsAtHour = todayReminders.filter(
              (r) => parseInt(r.time.split(":")[0]) === hour
            );
            return (
              <div
                key={hour}
                className="flex flex-col items-center w-20"
                aria-label={`${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"} timeline`}
              >
                <div className="w-14 h-14 rounded-full border-2 border-indigo-300 flex items-center justify-center bg-indigo-50 text-indigo-700 font-semibold select-none">
                  {hour % 12 || 12}
                  <span className="text-xs ml-1">{hour >= 12 ? "PM" : "AM"}</span>
                </div>
                {medsAtHour.map((m) => (
                  <div
                    key={m.id}
                    className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold cursor-default select-none ${
                      m.taken
                        ? "bg-green-200 text-green-800 shadow-inner"
                        : "bg-red-200 text-red-800 shadow-sm"
                    }`}
                    title={`${m.medicine} at ${formatTime(m.time)} (${m.taken ? "Taken" : "Pending"})`}
                  >
                    {m.medicine}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* REMINDER LIST */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 select-none">Today's Reminders</h2>
        <div className="space-y-5">
          {todayReminders.length === 0 ? (
            <p className="text-gray-500 text-lg">No reminders yet.</p>
          ) : (
            todayReminders.map((rem) => (
              <div
                key={rem.id}
                className="flex justify-between items-center bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition"
                role="listitem"
              >
                <div className="flex gap-5 items-center">
                  <Pill className="text-indigo-600 w-7 h-7 flex-shrink-0" />
                  <div>
                    <p
                      className={`text-lg font-semibold ${
                        rem.taken ? "line-through text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {rem.medicine}
                    </p>
                    <p className="text-sm text-gray-500 select-text">
                      ⏰ {formatTime(rem.time)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!rem.taken && (
                    <button
                      onClick={() => markAsTaken(rem.id)}
                      className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                      aria-label={`Mark ${rem.medicine} as taken`}
                    >
                      <CheckCircle2 size={18} />
                      Taken
                    </button>
                  )}
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    aria-label={`Delete reminder for ${rem.medicine}`}
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
