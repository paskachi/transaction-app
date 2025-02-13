# transaction-app

Transaction App is a mobile application built with React Native (Expo) that allows users to log in, view their transaction history, and add new transactions. The backend is developed with Node.js and Express, featuring robust JWT-based authentication, persistent storage using SQLite, and unit tests with Jest and Supertest.

## Features

- **Login:**  
  - Secure login using placeholder credentials (`username: "test"`, `password: "password"`).
  - Robust authentication implemented with JWT and bcrypt for password hashing.
- **Transaction View:**  
  - Displays a scrollable list of transactions (each with a date, amount, and description) fetched from the backend.
- **Add Transaction:**  
  - Provides a form to submit new transaction records (date, amount, description) to the backend.
- **Improved UI/UX:**  
  - Clean and user-friendly interface with enhanced styling for better readability.
- **Backend API:**  
  - RESTful endpoints for login and transaction management.
- **Persistent Storage:**  
  - Uses SQLite to store user and transaction data persistently.
- **Unit Tests:**  
  - Comprehensive unit tests for the backend API endpoints using Jest and Supertest.

## Project Structure

- **Frontend (Mobile App)**
  - `src/screens/`  
    - `LoginScreen.js` – Handles user login.
    - `TransactionScreen.js` – Displays the list of transactions.
    - `AddTransactionScreen.js` – Contains the form to add new transactions.
  - `src/components/`
    - `TransactionItem.js` – Renders individual transaction details.
  - `src/services/`
    - `api.js` – Centralized API service for communicating with the backend.
- **Backend (Server)**
  - `server.js` – Main server file with API endpoints.
  - `database.db` – SQLite database file (automatically created).
  - `tests/`
    - `server.test.js` – Unit tests for backend endpoints.

## Setup Instructions

### Frontend (Mobile App)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/transaction-app.git
   cd transaction-app
   
2. Install Dependencies:
  npm install

3. Start the App:
   npx expo start



Backend
1. Navigate to the Backend Folder:
  cd backend

2. Install Dependencies:
   npm install

3. Start the Server:
   npm start

4. Run Unit Tests:
   npm test
