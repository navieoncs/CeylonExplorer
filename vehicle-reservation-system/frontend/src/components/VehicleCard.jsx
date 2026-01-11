import { Link } from "react-router-dom";
import { VEHICLE_TYPES } from "../constants/vehicleTypes";

export default function VehicleCard({ vehicle, searchParams }) {
  const { id, name, type, capacity, pricePerDay, imageUrl } = vehicle;

  // Construct query string if params exist
  const query = new URLSearchParams();
  if (searchParams?.startDate) query.set('startDate', searchParams.startDate);
  if (searchParams?.endDate) query.set('endDate', searchParams.endDate);
  const queryString = query.toString() ? `?${query.toString()}` : '';

  return (
    <div className="vehicle-card">
      <img src={imageUrl || "https://placehold.co/600x400?text=No+Image"} alt={name} className="vehicle-image" />
      <div className="vehicle-details">
        <h3>{name}</h3>
        <span className={`badge ${type.toLowerCase()}`}>{VEHICLE_TYPES[type] || type}</span>
        <p>Capacity: {capacity} Persons</p>
        <p className="price">${pricePerDay} / day</p>
        <Link to={`/book/${id}${queryString}`} className="btn-primary">Book Now</Link>
      </div>
    </div>
  );
}
