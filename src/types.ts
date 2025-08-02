export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  image: string;
  availability: string;
  schedule: string[];
  rating: number;       // ✅ should be a number, not a function
  reviews: number;      // ✅ number of reviews
};
