# PlaceSense – Intelligent Placement Readiness & Probability System

PlaceSense is a student-centric system designed to track academic progress, analyze skill gaps, and predict placement probability for various companies.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Mongoose ODM).
- **Authentication:** JWT, Bcrypt.

## Project Structure
```
placence/
├── backend/            # Express Server
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── services/       # Prediction & Capability logic
│   ├── middleware/     # Auth & Role-based protection
│   └── index.js        # Entry point
└── frontend/           # React App (Vite)
    ├── src/
    │   ├── api/        # Axios configuration
    │   ├── components/ # Shared components
    │   ├── context/    # Global state (Auth)
    │   └── pages/      # Application views
    └── tailwind.config.js
```

## How to Run

### 1. Backend
```bash
cd backend
npm install
npm start
```
Note: Ensure the `.env` file in `backend/` has the correct `MONGO_URI`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## User Roles
1. **Student:** Can manage profile, track capabilities, and predict placement probability.
2. **Faculty:** Can add and manage company requirements and scoring weightages.
3. **Admin:** Full access (implicitly through role-based middleware).

## Features
- **Dynamic Dashboard:** Reflects students' current capabilities in real-time.
- **Intelligent Engine:** Weighted scoring model based on company-specific requirements.
- **Gap Analysis:** Identifies weaknesses and provides actionable suggestions.
- **Modern UI:** Responsive, minimalist design with smooth animations.
"# Placence" 
"# Placence" 
