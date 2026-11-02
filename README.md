# Mini Project Manager

A MERN stack application to manage projects and tasks with secure user authentication.

## Live Demo

- **Frontend:** https://webplant-eosin.vercel.app
- **Backend API:** https://webplant-efim.onrender.com

## Features

- User signup and login with JWT authentication.
- Create, update, and delete projects.
- Manage tasks within projects.
- Update task status (To Do, In Progress, Done).
- Filter tasks by status.
- Sort tasks by due date.
- User-specific project and task access.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, HTTP-only cookies
- **Deployment:** Vercel, Render

## Run Locally

**1. Clone the repository**

```bash
git clone [<your-repository-url>](https://github.com/dushyantkumar4/webplant)
cd webplant
```

**2. Install dependencies**

Install dependencies in both frontend and backend folders:

```bash
npm install
```

**3. Configure environment variables**

Backend `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**4. Start the application**

Run the backend and frontend development servers in their respective folders:

```bash
npm run dev
```

## Author

Developed as a MERN Stack Mini Project Manager application.