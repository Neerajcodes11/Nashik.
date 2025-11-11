# Nashik LocalKart

A bilingual web platform (English and Marathi) to connect local vendors and customers in Nashik. It provides verified business listings, communication options, and Google Maps integration to support the "Vocal for Local" initiative.

## Prerequisites
- Node.js (18+ recommended)
- A Google Maps API key (Maps JavaScript API enabled)
- A Gemini API key

## Setup

1. Install dependencies:
   npm install

2. Configure environment:
   - Create a `.env.local` file in the project root and set:
     GEMINI_API_KEY=your_gemini_api_key_here

   - In `index.html`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key:
     <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&loading=async"></script>

3. Run the app:
   npm run dev

## Build & Preview

- Build:
  npm run build

- Preview:
  npm run preview

## Notes

- The Gemini API key is injected into the app via Vite’s `define` configuration in `vite.config.ts`:
  process.env.API_KEY and process.env.GEMINI_API_KEY
- The app uses Tailwind CSS via CDN and React with Vite bundling through npm dependencies.