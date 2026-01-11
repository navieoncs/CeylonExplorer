const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
const db = admin.firestore();

// Helper to check if email vars are set
const getEmailConfig = () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    if (!apiKey || !fromEmail) {
        console.error("Missing SENDGRID_API_KEY or FROM_EMAIL environment variables.");
        return null;
    }
    sgMail.setApiKey(apiKey);
    return { fromEmail };
};

exports.onBookingStatusChange = functions.firestore
    .document("bookings/{bookingId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Only trigger on status change to approved or rejected
        if (newData.status === oldData.status) return null;
        if (!["APPROVED", "REJECTED"].includes(newData.status)) return null;

        const config = getEmailConfig();
        if (!config) return null;

        const { bookingId } = context.params;
        const subject = `Booking Update: ${newData.status.toUpperCase()} - ${bookingId}`;
        
        const html = `
            <h2>Booking Update</h2>
            <p>Your booking status has been updated to: <strong>${newData.status}</strong></p>
            <p><strong>Admin Note:</strong> ${newData.adminNote || "No notes provided."}</p>
            <hr/>
            <h3>Booking Details:</h3>
            <ul>
                <li><strong>Vehicle Type:</strong> ${newData.vehicleType || "N/A"}</li>
                <li><strong>Location:</strong> ${newData.location || "N/A"}</li>
                <li><strong>Dates:</strong> ${newData.startDate} to ${newData.endDate}</li>
            </ul>
        `;

        const msg = {
            to: newData.email,
            from: config.fromEmail,
            subject: subject,
            html: html,
        };

        try {
            await sgMail.send(msg);
            console.log(`Email sent for booking ${bookingId} to ${newData.email}`);
        } catch (error) {
            console.error("Error sending email:", error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    });
