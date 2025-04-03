# Flatmate Finder App

A mobile application to help students and working professionals find shared accommodations easily by connecting them with potential flatmates.

## Features

- Phone number authentication with OTP
- User profiles with lifestyle preferences
- Property listings with detailed information
- Advanced search and filtering
- Secure contact sharing
- Identity verification
- Report system for inappropriate listings

## Tech Stack

- Frontend: React Native with TypeScript
- Backend: Supabase (PostgreSQL + Auth)
- UI Components: Radix UI + Tailwind CSS
- State Management: React Context + React Query
- Maps Integration: Google Maps API
- Communication: WhatsApp API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Maps API key
- WhatsApp Business API access

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. For mobile development:
   ```bash
   npm run android
   # or
   npm run ios
   ```

## Database Setup

1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/` directory
3. Enable the required authentication providers in Supabase dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
