const fs = require("fs");
const path = require("path");

// Sample specializations
const specializations = [
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "Orthopedic",
  "ENT Specialist",
  "Psychiatrist",
  "Ophthalmologist",
  "Endocrinologist",
];

// Availability options
const availabilityOptions = ["Available Today", "Fully Booked", "On Leave"];

// Random schedule generator
const generateSchedule = () => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return [
    `${weekdays[Math.floor(Math.random() * 5)]}-${
      weekdays[Math.floor(Math.random() * 6)]
    }: ${8 + Math.floor(Math.random() * 3)} AM - ${
      2 + Math.floor(Math.random() * 5)
    } PM`,
    `${weekdays[Math.floor(Math.random() * 7)]}: ${
      9 + Math.floor(Math.random() * 2)
    } AM - ${3 + Math.floor(Math.random() * 3)} PM`,
  ];
};

// Random name generator
const firstNames = [
  "Emily",
  "Michael",
  "Sarah",
  "James",
  "Olivia",
  "William",
  "Ava",
  "Daniel",
  "Sophia",
  "Ethan",
  "Lucas",
  "Amelia",
  "Liam",
  "Charlotte",
  "Benjamin",
  "Mia",
  "Noah",
  "Isabella",
  "Henry",
  "Grace",
];
const lastNames = [
  "Johnson",
  "Lee",
  "Kim",
  "Anderson",
  "Martinez",
  "Davis",
  "Wilson",
  "Thomas",
  "White",
  "Harris",
  "Clark",
  "Lewis",
  "Walker",
  "Hall",
  "Allen",
  "Young",
  "King",
  "Wright",
  "Scott",
  "Green",
];

const generateDoctors = (count = 50) => {
  const doctors = [];

  for (let i = 1; i <= count; i++) {
    const gender = Math.random() > 0.5 ? "men" : "women";
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    doctors.push({
      id: i,
      name: `Dr. ${firstName} ${lastName}`,
      specialization:
        specializations[Math.floor(Math.random() * specializations.length)],
      image: `https://randomuser.me/api/portraits/${gender}/${Math.floor(
        Math.random() * 99
      )}.jpg`,
      availability:
        availabilityOptions[
          Math.floor(Math.random() * availabilityOptions.length)
        ],
      schedule: generateSchedule(),
      rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)), // e.g., 4.2
      reviews: Math.floor(Math.random() * 200) + 20,
    });
  }

  return doctors;
};

// Generate and save file
const doctors = generateDoctors(50);
const outputPath = path.join(__dirname, "src", "data", "doctors.json");

fs.writeFileSync(outputPath, JSON.stringify(doctors, null, 2));
console.log(`✅ Generated ${doctors.length} doctors in src/data/doctors.json`);
