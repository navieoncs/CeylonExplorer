import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebase";

// --- Vehicles ---

import { FALLBACK_VEHICLES } from "../constants/fallbackVehicles";

export const fetchVehicles = async () => {
  try {
    const q = query(collection(db, "vehicles"), where("active", "==", true));
    const querySnapshot = await getDocs(q);
    
    // Fallback if empty
    if (querySnapshot.empty) {
      console.warn("Firestore returned no vehicles. Using fallback data.");
      return FALLBACK_VEHICLES;
    }

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching vehicles (using fallback):", error);
    // Fallback on error (e.g. permission denied, offline)
    return FALLBACK_VEHICLES;
  }
};

export const fetchVehicleById = async (id) => {
  try {
    const docRef = doc(db, "vehicles", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Vehicle not found");
    }
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    throw error;
  }
};

// --- Bookings ---

/**
 * Fetch bookings for a specific vehicle that are 'PENDING' or 'APPROVED'.
 * Used for conflict checking.
 */
export const fetchBookingsForVehicle = async (vehicleId) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("vehicleId", "==", vehicleId),
      where("status", "in", ["PENDING", "APPROVED"])
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching vehicle bookings:", error);
    throw error;
  }
};

export const createBooking = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...payload,
      status: "PENDING", // Force PENDING
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const fetchBookingsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching bookings by status:", error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status, adminNote = "") => {
  try {
    const docRef = doc(db, "bookings", bookingId);
    
    const updateData = {
      status,
      adminNote,
      updatedAt: serverTimestamp()
    };

    if (status === "APPROVED") {
      updateData.approvedAt = serverTimestamp();
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};
