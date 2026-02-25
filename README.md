# ClearPath 💰
### A Mobile Financial Decision Support Platform for College Students

ClearPath is a mobile application designed to help college students manage their personal finances through budgeting tools, debt payoff simulation, and interactive financial education.

---

## Project Description
Many college students lack the financial literacy and tools needed to make informed financial decisions. ClearPath addresses this gap by providing an accessible, student-focused platform with:
- Budget tracking with visual spending breakdowns
- Debt payoff simulation for student loans and credit cards
- A financial learning hub with interactive lessons
- Personalized user profiles and progress tracking

---

## Technologies Used
| Layer | Technology |
|---|---|
| Mobile Frontend | React Native / Expo |
| Language | TypeScript |
| Backend & Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Data Visualization | react-native-chart-kit |
| Version Control | Git & GitHub |

---

## Project Structure
```
ClearPath/
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── BudgetScreen.tsx
│   │   ├── DebtScreen.tsx
│   │   ├── LearnScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   └── AppNavigator.tsx
│   ├── firebase/
│   │   ├── firebaseConfig.js
│   │   └── googleAuth.ts
│   ├── components/
│   └── hooks/
├── App.tsx
├── app.json
└── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation
```bash
# Clone the repository
git clone https://github.com/bukkybune/clearPath.git
cd clearPath

# Install dependencies
npm install

# Create your Firebase config file (not included for security)
# Add src/firebase/firebaseConfig.js with your Firebase credentials:
# See src/firebase/firebaseConfig.example.js for the required format

# Start the development server
npx expo start
```

### Running the App
1. Run `npx expo start` in the project directory
2. Scan the QR code with the Expo Go app on your phone
3. Make sure your phone and computer are on the same WiFi network

---

## Features Implemented
- [x] User Registration and Login (Email/Password)
- [x] Google Sign-In UI
- [x] Onboarding Flow (first launch only)
- [x] Home Dashboard with real-time spending summary
- [x] Budget Tracker with category selection and pie chart
- [x] Expense management (add/delete) with Firestore sync
- [x] Debt Payoff Simulator (Student Loan & Credit Card)
- [x] Balance over time line chart
- [x] Financial Learning Hub (6 topics with progress tracking)
- [x] Profile Screen with editable user info

## Upcoming Features
- [ ] Budget limits per category with alerts
- [ ] Income tracking
- [ ] Quizzes in the Learn module
- [ ] Monthly expense filtering
- [ ] Onboarding improvements

---

## Developer
**Dorcas Ibrahim** 