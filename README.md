# CampusGrid Resource Matching Engine

## Overview
CampusGrid is a comprehensive full-stack application that allows students and administrators to manage and bid for campus resources seamlessly. It comprises a dynamic Next.js frontend and a robust FastAPI (Python) backend powered by an SQLite database.

## Key Features
- **User Authentication:** Secure registration and login workflow utilizing JWT and hashed passwords.
- **Resource Management Dashboard:** View the live status and availability of various campus resources (such as labs).
- **Resource Bidding System:** Authorized students and users can place bids on the resources they require.
- **Real-time Stats Syncing:** The dashboard polls the statistics to keep all data regarding bids and available labs up-to-date.
- **Modern Responsive UI:** A smooth user interface leveraging Radix UI, Framer Motion, Recharts, and Tailwind CSS.

## Technology Stack
- **Frontend:** Next.js 15 (React 19), Tailwind CSS, Framer Motion, React Hook Form, Radix UI.
- **Backend:** Python, FastAPI, SQLAlchemy ORM (SQLite DB - `campusgrid.db`), PyJWT.

## Installation and Project Setup

### 1. Frontend Setup
1. Open a terminal in the root directory.
2. Install the necessary Node module dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Access the frontend application at `http://localhost:3000`.

### 2. Backend Setup
1. Open a new terminal inside the `CampusGrid-Backend` directory.
2. Initialize and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn sqlalchemy pyjwt passlib
   ```
4. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload
   ```
5. The API will be available at `http://localhost:8000`.

---

## Team Juggeranut

- Siddharth Kumar Jena
- Ashutosh Nayak
- Ayutayam Sutar
