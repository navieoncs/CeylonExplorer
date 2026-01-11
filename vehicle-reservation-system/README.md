# Vehicle Reservation System

A vehicle booking system built with React (Vite) and Firebase.

## Setup Steps

1.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Environment Variables**:
    - Copy `frontend/.env.example` to `frontend/.env` and fill in your Firebase configuration.
    - Copy `functions/.env.example` to `functions/.env` (if running locally) or set secrets in Firebase Functions.

3.  **Firebase Setup**:
    - Create a Firebase project.
    - Enable **Authentication** (Email/Password).
    - Enable **Firestore Database**.
    - Enable **Cloud Functions**.

4.  **Admin Access**:
    - Create a user in Firebase Auth.
    - Manually create a document in the `admins` collection in Firestore with the ID matching the user's UID: `admins/{USER_UID}`. The content can be `{ "active": true }` or even empty.

5.  **Seed Data**:
    - You must manually seed at least 6 vehicles in the `vehicles` collection.
    - **Fields**:
        - `name` (string): e.g., "Toyota Prius"
        - `type` (string): "economy", "standard", or "luxury"
        - `capacity` (number): e.g., 4
        - `pricePerDay` (number): e.g., 50
        - `imageUrl` (string): Public URL to an image
        - `active` (boolean): true

## Running Locally

1.  **Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

## Deployment

1.  **Deploy to Firebase**:
    ```bash
    firebase deploy
    ```
