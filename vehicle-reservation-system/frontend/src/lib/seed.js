import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { VEHICLE_TYPES } from "../constants/vehicleTypes";

const initialVehicles = [
  {
    name: "Toyota Prius",
    category: VEHICLE_TYPES.Economy,
    capacity: 4,
    pricePerDay: 40,
    active: true,
    imageUrl: "https://placehold.co/600x400?text=Toyota+Prius"
  },
  {
    name: "Toyota Axio",
    category: VEHICLE_TYPES.Economy,
    capacity: 4,
    pricePerDay: 45,
    active: true,
    imageUrl: "https://placehold.co/600x400?text=Toyota+Axio"
  },
  {
    name: "Toyota Premos",
    category: VEHICLE_TYPES.Standard,
    capacity: 4,
    pricePerDay: 60,
    active: true,
    imageUrl: "https://placehold.co/600x400?text=Toyota+Premos"
  },
  {
    name: "Honda Grace",
    category: VEHICLE_TYPES.Standard,
    capacity: 4,
    pricePerDay: 55,
    active: true,
    imageUrl: "https://placehold.co/600x400?text=Honda+Grace"
  },
  {
    name: "Toyota KDH",
    category: VEHICLE_TYPES.Luxury,
    capacity: 9,
    pricePerDay: 100,
    active: true,
    imageUrl: "https://placehold.co/600x400?text=Toyota+KDH"
  },
  {
    name: "Mercedes Benz C-Class",
    category: VEHICLE_TYPES.Luxury,
    capacity: 4,
    pricePerDay: 150,
    active: true,
    imageUrl: "https://placehold.co/600x400?text=Mercedes+Benz"
  }
];

export const seedVehicles = async () => {
  try {
    const colRef = collection(db, "vehicles");
    // Check if empty
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      alert("Vehicles collection is not empty. Seeding aborted.");
      return;
    }

    for (const v of initialVehicles) {
      await addDoc(colRef, v);
    }
    alert("Seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
    alert("Seeding failed: " + error.message);
  }
};
