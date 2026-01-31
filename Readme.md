<<<<<<< HEAD
# AuraSutra Patient Portal

A modern, AI-powered patient portal for the AuraSutra Ayurvedic healthcare platform.

## 🚀 Features

- **AI Doctor Search**: Describe symptoms and get AI-powered doctor recommendations
- **Appointment Management**: Book, view, and manage appointments with doctors
- **Video Consultations**: Integrated video calling for online appointments
- **Prescription Tracking**: View and manage prescriptions
- **Medication Adherence**: Track medication intake and adherence rates
- **Profile Management**: Update personal information and preferences

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and database
- Kinde authentication account
- ZegoCloud account (for video calls)
- Google Gemini API key (for AI features)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL scripts in order:
   - `Project_DB.sql` - Creates tables and schema
   - `Project_DB_Functions.sql` - Creates functions and triggers

### 3. Environment Variables

Copy `.env.local` and update with your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Kinde Auth
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# ZegoCloud Video
NEXT_PUBLIC_ZEGO_APP_ID=your_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_server_secret

# Google Gemini AI
GOOGLE_API_KEY=your_gemini_api_key

# Razorpay Payments (Optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
patient_view/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Patient dashboard pages
│   ├── page.tsx           # AI search homepage
│   └── layout.tsx         # Root layout
├── lib/                   # Shared utilities
│   └── shared/           # Database and auth helpers
├── public/               # Static assets
├── Logos/                # Logo files
├── .env.local           # Environment variables
├── Project_DB.sql       # Database schema
└── Project_DB_Functions.sql  # Database functions
```

## 🎨 Key Pages

- **/** - AI-powered doctor search
- **/dashboard** - Patient dashboard with stats
- **/dashboard/find-doctors** - Browse and search doctors
- **/dashboard/appointments** - Manage appointments
- **/dashboard/prescriptions** - View prescriptions
- **/dashboard/profile** - Update profile
- **/dashboard/video-call/[id]** - Video consultation

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Kinde Auth
- **Video Calls**: ZegoCloud
- **AI**: Google Gemini
- **UI Components**: Radix UI, Lucide Icons

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

See `vercel_deployment_guide.md` for detailed Vercel deployment instructions.

### Quick Deploy to Vercel

1. Import this directory as a new project
2. Set all environment variables
3. Deploy!

## 🔐 Security Notes

- Never commit `.env.local` to git
- Keep service role keys secure
- Update Kinde callback URLs for production
- Enable RLS policies in Supabase

## 📝 License

Private - AuraSutra Healthcare Platform

## 🤝 Support

For issues or questions, contact the development team.
=======
## ✨ Features

### 🔍 Core Patient Features
- **AI-Powered Doctor Search**: Find Ayurvedic doctors using Gemini AI and GROQ SDK
- **Smart Recommendations**: Get personalized doctor recommendations based on symptoms
- **Appointment Booking**: Book online (video) or offline (in-person) appointments
- **Video Consultations**: HD video calls with doctors using ZegoCloud
- **Prescription Management**: View and track all your prescriptions
- **Medication Tracking**: Monitor medication adherence with reminders
- **Health Progress**: Track your health journey with visual dashboards
- **Payment Integration**: Secure payments via Razorpay
- **Multi-language Support**: English and Hindi with i18n
- **Real-time Notifications**: Instant updates on appointments and prescriptions

### 🌐 Technical Features
- **Progressive Web App (PWA)**: Install on mobile/desktop, offline support
- **Responsive Design**: Seamless experience on all devices
- **Secure Authentication**: Kinde Auth with JWT tokens
- **End-to-End Encryption**: Medical data encryption with libsodium
- **Real-time Updates**: Supabase real-time subscriptions
- **Server-Side Rendering**: Fast page loads with Next.js 14
- **Type Safety**: Full TypeScript coverage
- **Shared Library Integration**: Uses `@aurasutra/shared-lib` for consistency

### Frontend
- **Framework**: Next.js 14.0.4
- **Language**: TypeScript 5.3.3
- **Styling**: TailwindCSS 3.4.0
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend & Services
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Kinde Auth
- **AI/ML**: 
  - Google Gemini AI (doctor search)
  - GROQ SDK (inference)
- **Video**: ZegoCloud WebRTC
- **Payments**: Razorpay
- **Storage**: Appwrite
- **Monitoring**: Sentry

### Development
- **Testing**: Jest + Playwright
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database**: Supabase CLI

## 📖 Usage Guide

### Patient Registration Flow
```
1. Visit http://localhost:3000
2. Click "Sign Up" → Register via Kinde
3. Complete profile information
4. Access patient dashboard
```

### Booking an Appointment
```
1. Go to "Find Doctors" or use AI Search
2. Browse doctor profiles
3. Click "Book Appointment"
4. Fill booking form:
   - Select appointment type (online/offline)
   - Choose date and time
   - Add symptoms/reason
5. Make payment (if required)
6. Receive confirmation
```

### Video Consultation
```
1. Go to "My Appointments"
2. Find confirmed appointment
3. Click "Join Video Call" (15 min before)
4. Allow camera/microphone permissions
5. Wait for doctor to join
6. Consult with doctor
7. Receive prescription after call
```

### Viewing Prescriptions
```
1. Navigate to "Prescriptions"
2. View all prescriptions
3. Download PDF
4. Track medication adherence
5. click on "taken" or "skipped" to update medication adherence
```
>>>>>>> 15f2075 (Patien_View final ver)
