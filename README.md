# ClearPath

ClearPath is a mobile financial decision-support and learning platform designed for college students.  
The application focuses on helping users understand budgeting, debt management, and basic financial concepts through interactive tools and visualizations.

This project is developed as part of **CSCI 411/412 – Senior Seminar** and serves as a semester-long capstone experience.

---

## Project Overview

Many college students lack accessible tools that help them understand the long-term impact of financial decisions, such as spending habits and debt repayment. ClearPath addresses this gap by combining practical financial tracking features with educational simulations and visual feedback.

The system emphasizes **clarity, guided exploration, and learning**, rather than automation or real-money financial transactions.

---

## Features

The core features of ClearPath include:

- User authentication and account management
- Budget tracking with categorized income and expenses
- Interactive data visualizations of spending patterns
- Debt payoff simulation tools for student loans and credit cards
- Introductory financial learning modules
- Persistent data storage across sessions

Additional features may be added incrementally as time permits.

---

## System Architecture

ClearPath follows a client–backend architecture:

- Mobile Frontend: React Native (Expo)  
- Backend Services: Firebase Authentication and Cloud Firestore  
- Data Layer: Firestore collections for users, budgets, and simulations  

The mobile application communicates with Firebase services using secure API calls for authentication and data storage.

---

## Technologies Used

- Platform: Mobile (iOS and Android)
- Programming Languages: JavaScript / TypeScript
- Frontend Framework: React Native with Expo
- Backend Services: Firebase
  - Firebase Authentication
  - Cloud Firestore
- Data Visualization: React Native-compatible chart libraries
- Version Control: Git and GitHub


## Project Structure

