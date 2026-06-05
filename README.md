# Enterprise AI-Powered IT Ticketing System

An enterprise-grade, full-stack web application designed to streamline End User IT Support. This system features an employee-facing request portal, an IT admin dashboard, and an automated "Mock AI" interceptor that attempts to resolve Tier 1 support issues before they enter the manual IT queue.

## Features

* **Automated Tier 1 Resolution (Mock AI):** Intercepts common IT requests (VPN, Password Resets, Printer configurations) and suggests immediate, automated fixes based on keyword analysis.
* **Employee Request Portal:** A clean, React-based UI for users to submit structured IT issues with priority levels.
* **IT Admin Dashboard:** Real-time data table allowing IT staff to track, sort, and manage incoming incidents.
* **Cloud Database Integration:** Utilizes MongoDB Atlas for scalable, NoSQL document storage of users, tickets, and AI interaction logs.
* **Enterprise UI/UX:** Custom-built frontend using Vite and React, styled with a professional corporate color palette (Navy, Royal Blue, Mustard Yellow).

## Tech Stack

**Frontend:**
* React.js (via Vite)
* React Router DOM
* Axios (API requests)
* Custom CSS (CSS Variables, Flexbox)

**Backend:**
* Node.js & Express.js
* MongoDB Atlas (Cloud Database)
* Mongoose (ODM & Schema Definition)
* CORS & Dotenv (Security & Middleware)

## Architecture & AI Workflow

Unlike standard CRUD applications, this system introduces an asynchronous interception layer to reduce IT workload:
1. User submits a descriptive IT issue.
2. The React frontend pauses the submission and calls the `/api/tickets/analyze` endpoint.
3. The Node.js server scans the payload against a centralized Knowledge Base of common resolutions.
4. If a match is found, the UI intercepts the ticket creation and offers the user a self-service fix.
5. If the issue is complex or the user declines the automated fix, the ticket is formally logged to the MongoDB cluster for IT review.

## Local Setup & Installation

To run this application locally, you will need [Node.js](https://nodejs.org/) and a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
