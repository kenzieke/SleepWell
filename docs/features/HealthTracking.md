# Health Tracking Feature

## Overview
The health tracking feature allows users to log daily metrics such as stress levels, diet quality, weight, and caffeine intake. Data is synced in real-time to Firebase Firestore.

## Components
- **HealthTrackerScreen**: The main screen for logging health data.
- **DateComponent**: A reusable component for selecting a date.

## Firebase Integration
Health data is stored in a Firestore collection under the authenticated user's document. Example structure: users/{userId}/healthData/{date}

## Key Functions
- **Real-Time Sync**: Fetches and subscribes to updates for the current date's health data.
- **Save Data**: Persists the user-entered data to Firestore.

## Future Enhancements
- Add more granular metrics (e.g., sleep tracking).
- Implement analytics to track long-term health trends.
