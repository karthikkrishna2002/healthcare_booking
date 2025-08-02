import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

const symptomMapping: Record<
  string,
  { cause: string; doctor: string; tip: string }
> = {
  headache: {
    cause: "Mild migraine, dehydration, or stress.",
    doctor: "Neurologist",
    tip: "Drink water, rest in a dark room, and avoid screen time.",
  },
  fever: {
    cause: "Common viral infection, flu, or mild bacterial infection.",
    doctor: "General Physician",
    tip: "Stay hydrated, monitor temperature, and rest.",
  },
  rash: {
    cause: "Skin allergy, dermatitis, or insect bite.",
    doctor: "Dermatologist",
    tip: "Apply soothing lotion and avoid scratching.",
  },
  stomach: {
    cause: "Indigestion, gastritis, or mild food poisoning.",
    doctor: "Gastroenterologist",
    tip: "Eat bland food, avoid spicy meals, and drink plenty of fluids.",
  },
  cough: {
    cause: "Common cold, flu, or throat infection.",
    doctor: "General Physician",
    tip: "Drink warm fluids and consider steam inhalation.",
  },
  sore_throat: {
    cause: "Viral infection, strep throat, or allergies.",
    doctor: "ENT Specialist",
    tip: "Gargle with warm salt water and rest your voice.",
  },
  chest_pain: {
    cause: "Possible heart issue, GERD, or anxiety-related pain.",
    doctor: "Cardiologist",
    tip: "Seek immediate medical help if severe or radiating.",
  },
  dizziness: {
    cause: "Low blood pressure, dehydration, or ear issues.",
    doctor: "Neurologist",
    tip: "Sit down immediately and drink fluids.",
  },
  fatigue: {
    cause: "Anemia, thyroid disorder, or lack of sleep.",
    doctor: "Endocrinologist",
    tip: "Get adequate rest and eat iron-rich foods.",
  },
  back_pain: {
    cause: "Poor posture, muscle strain, or spinal issues.",
    doctor: "Orthopedic Specialist",
    tip: "Maintain good posture and use a firm mattress.",
  },
  knee_pain: {
    cause: "Arthritis, ligament injury, or overuse.",
    doctor: "Orthopedic Specialist",
    tip: "Apply ice and avoid putting weight on the knee.",
  },
  toothache: {
    cause: "Cavity, gum infection, or tooth decay.",
    doctor: "Dentist",
    tip: "Rinse with warm salt water and avoid sugary foods.",
  },
  eye_redness: {
    cause: "Conjunctivitis, allergies, or strain.",
    doctor: "Ophthalmologist",
    tip: "Avoid rubbing eyes and use prescribed eye drops.",
  },
  ear_pain: {
    cause: "Ear infection or wax buildup.",
    doctor: "ENT Specialist",
    tip: "Avoid inserting objects and use warm compress.",
  },
  high_bp: {
    cause: "Hypertension due to stress or lifestyle factors.",
    doctor: "Cardiologist",
    tip: "Limit salt intake and monitor BP regularly.",
  },
  low_bp: {
    cause: "Dehydration or endocrine disorder.",
    doctor: "General Physician",
    tip: "Drink water and rest with legs elevated.",
  },
  chest_tightness: {
    cause: "Asthma, heart issue, or anxiety.",
    doctor: "Pulmonologist",
    tip: "Practice deep breathing and seek urgent care if severe.",
  },
  diarrhea: {
    cause: "Food poisoning or viral gastroenteritis.",
    doctor: "Gastroenterologist",
    tip: "Drink ORS and avoid oily/spicy foods.",
  },
  constipation: {
    cause: "Low fiber diet or dehydration.",
    doctor: "Gastroenterologist",
    tip: "Increase fiber intake and drink plenty of water.",
  },
  anxiety: {
    cause: "Stress or generalized anxiety disorder.",
    doctor: "Psychiatrist",
    tip: "Practice deep breathing and meditation.",
  },
  depression: {
    cause: "Mental health condition, prolonged stress.",
    doctor: "Psychiatrist",
    tip: "Seek therapy, talk to loved ones, and stay active.",
  },
  shortness_of_breath: {
    cause: "Asthma, lung infection, or heart condition.",
    doctor: "Pulmonologist",
    tip: "Sit upright and avoid physical exertion.",
  },
  swelling_legs: {
    cause: "Heart, kidney, or venous issue.",
    doctor: "Cardiologist",
    tip: "Elevate legs and reduce salt intake.",
  },
  urinary_burning: {
    cause: "UTI or dehydration.",
    doctor: "Urologist",
    tip: "Drink plenty of water and cranberry juice.",
  },
  hair_loss: {
    cause: "Hormonal imbalance or nutritional deficiency.",
    doctor: "Dermatologist",
    tip: "Eat protein-rich foods and avoid harsh chemicals.",
  },
  acne: {
    cause: "Hormonal imbalance or clogged pores.",
    doctor: "Dermatologist",
    tip: "Wash face twice daily and avoid oily foods.",
  },
  insomnia: {
    cause: "Stress, anxiety, or poor sleep hygiene.",
    doctor: "Psychiatrist",
    tip: "Avoid screens before bed and maintain a routine.",
  },
  vomiting: {
    cause: "Food poisoning or stomach infection.",
    doctor: "Gastroenterologist",
    tip: "Drink ORS and avoid solid foods initially.",
  },
  joint_pain: {
    cause: "Arthritis or injury.",
    doctor: "Orthopedic Specialist",
    tip: "Apply heat or ice and rest the joint.",
  },
  weight_gain: {
    cause: "Thyroid disorder or lifestyle habits.",
    doctor: "Endocrinologist",
    tip: "Exercise regularly and reduce processed foods.",
  },
  weight_loss: {
    cause: "Hyperthyroidism or diabetes.",
    doctor: "Endocrinologist",
    tip: "Eat nutrient-dense foods and consult for blood tests.",
  },
  palpitations: {
    cause: "Anxiety or heart rhythm problem.",
    doctor: "Cardiologist",
    tip: "Practice relaxation and avoid caffeine.",
  },
  blurred_vision: {
    cause: "Eye strain or diabetes.",
    doctor: "Ophthalmologist",
    tip: "Rest eyes and check blood sugar if diabetic.",
  },
};

export default function HealthBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [suggestedDoctor, setSuggestedDoctor] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Process bot response
    const lowerInput = input.toLowerCase();
    let response =
      "🤖 I'm sorry, I couldn't identify that symptom. Try 'fever', 'headache', 'rash', or 'stomach pain'.";
    let doctor: string | null = null;

    Object.keys(symptomMapping).forEach((key) => {
      if (lowerInput.includes(key)) {
        const data = symptomMapping[key];
        response = `🤖 Possible cause: ${data.cause}\n\n👨‍⚕️ Recommended: ${data.doctor}\n💡 Tip: ${data.tip}`;
        doctor = data.doctor;
      }
    });

    setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    setSuggestedDoctor(doctor);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50 animate-fadeIn">
          <div className="bg-blue-600 text-white px-4 py-3 font-bold">
            💬 HealthBot
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-80">
            {messages.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                🤖 Hi! Describe your symptom (e.g., "I have a headache").
              </p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto max-w-[80%]"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start mr-auto max-w-[80%]"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Doctor Suggestion */}
          {suggestedDoctor && (
            <div className="px-4 pb-2">
              <Button
                onClick={() => navigate("/")}
                className="w-full mt-2 bg-green-600 hover:bg-green-700"
              >
                Book {suggestedDoctor}
              </Button>
            </div>
          )}

          {/* Input Box */}
          <div className="flex p-3 border-t dark:border-gray-700">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptom..."
              className="flex-1 rounded-l-lg"
            />
            <Button
              onClick={handleSend}
              className="rounded-l-none bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
      `}</style>
    </>
  );
}
