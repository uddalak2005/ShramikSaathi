# Migrant Worker Support Platform

## Overview
The **Migrant Worker Support Platform** is a full-stack application designed to empower migrant workers by providing them with essential digital services.  
It helps them find jobs, negotiate wages, access loans based on work history and community reviews, seek legal support, and engage in a community forum.  
For workers without smartphones, the platform also integrates an **IVR system** that allows interaction via calls and SMS.  

An AI-powered **Neural-Symbolic RAG Chat Agent** further assists workers by answering their queries in an intuitive and personalized manner.

---

## Features
- **Job Portal**: Workers can browse and apply for jobs, post requirements, and negotiate wages.
- **Loan Support**: Loan opportunities are offered based on worker performance, job history, and reviews.
- **Community Forum**: A space where workers can post grievances, queries, or success stories.
- **Legal Support**: Dedicated support page offering guidance on legal issues.
- **AI Chat Agent**: Neural-symbolic RAG-based assistant that answers worker queries naturally.
- **IVR System**: Workers without smartphones can book jobs, access services, and interact via **Twilio-powered IVR** and SMS.
- **Authentication**: Secure token-based authentication system.
- **Mailing Services**: Notifications and updates via **Nodemailer**.
- **Database**: All data stored securely in **MongoDB**.

---

## Tech Stack

### Frontend
- **React + Vite**  
- TailwindCSS / shadcn (UI styling)  
- Context API for authentication and global state  

### Backend
- **Node.js + Express**  
- TypeScript (for services and gateway)  
- REST APIs for authentication, job management, community, and legal services  

### IVR
- **Twilio** integration for calls, SMS, and job booking  

### AI Engine
- **HuggingFace Transformers**, **PyTorch**, **scikit-learn**  
- Neural-Symbolic RAG models for contextual query answering  

### Database
- **MongoDB**  

### Other
- **Nodemailer** (email services)  
- **JWT** for token-based authentication  

---

## Project Structure

### Backend
```
backend/
├── gateway/ # API gateway (entry point for services)
├── services/
│ ├── auth-service/ # Authentication & user management
│ ├── community-service # Community forum APIs
│ ├── ivr-service/ # IVR system integration (Twilio)
│ ├── mandi-service/ # Market/job-related services
```


### Frontend
```
frontend/
├── src/
│ ├── components/ # UI components (cards, loaders, layouts, etc.)
│ ├── context/ # Auth context and global state
│ ├── pages/ # Pages (Jobs, Loans, Community, Legal, etc.)
│ ├── App.jsx # Root application
│ ├── main.jsx # Entry point
```


---

## Installation & Setup

### Prerequisites
- Node.js (>=18)
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Python (for AI engine training/deployment)
- Twilio account (for IVR & SMS)

---

### Backend Setup
```bash
cd backend

# Install dependencies for all services
cd gateway && npm install
cd ../services/auth-service && npm install
cd ../services/community-service && npm install
cd ../services/ivr-service && npm install
cd ../services/mandi-service && npm install

# Run gateway
cd ../../gateway
npm run dev

#Frontend setup
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Common
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net
JWT_SECRET=your_secret_key

# Nodemailer
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number



