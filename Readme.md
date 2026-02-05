# 📊 Progressly - Personal Analytics Dashboard

> A beautiful, GitHub-inspired progress tracking dashboard for goal-oriented individuals who want to visualize their productivity, learning journey, and personal growth.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🌟 Overview

ProgressTrack helps you track daily tasks, monitor learning progress, and achieve your goals with visual insights and analytics. Unlike generic todo apps, ProgressTrack focuses on **long-term progress visualization** with a beautiful, data-driven dashboard.

### ✨ Key Features

- 📝 **Daily Task Management** - Plan your day and track completion with smart scoring
- 🎯 **Goal Tracking** - Set and monitor monthly/yearly goals with progress visualization
- 📚 **Skills Tracker** - Log your learning journey and see your growth over time
- 📈 **Analytics Dashboard** - GitHub-style contribution heatmap and productivity insights
- 🔥 **Streak Tracking** - Stay motivated with consistency scores and streaks
- 🌙 **Dark Mode** - Beautiful UI optimized for day and night use

## 🎯 Problem Statement

Students, freelancers, and self-learners struggle to:
- Maintain consistency in their goals
- Visualize long-term progress
- Understand productivity patterns
- Stay accountable without external pressure

ProgressTrack solves this by providing **visual feedback loops** that make progress tangible and motivating.

## 🚀 Demo

🔗 **Live Demo**: [Coming Soon]

### Screenshots

| Dashboard | Tasks | Goals |
|-----------|-------|-------|
| ![Dashboard](link) | ![Tasks](link) | ![Goals](link) |

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **JavaScript**
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### DevOps & Tools
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/yourusername/progresstrack.git
cd progresstrack
```

### Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### Environment Variables

Create `.env` file in the `server` directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/progresstrack
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/progresstrack

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Create `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Run Application

**Development Mode:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

**Production Build:**
```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

## 📁 Project Structure
```
progresstrack/
├── client/                 # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Dashboard/
│   │   │   ├── Tasks/
│   │   │   ├── Goals/
│   │   │   ├── Skills/
│   │   │   └── Common/
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React context
│   │   ├── utils/         # Helper functions
│   │   ├── types/         # TypeScript types
│   │   ├── api/           # API calls
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Backend Node/Express app
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   ├── Goal.js
│   │   │   └── Skill.js
│   │   ├── routes/        # API routes
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   ├── goals.js
│   │   │   └── skills.js
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Helper functions
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## 🎨 Features Breakdown

### 1. Daily Task Management
- Create tasks for each day
- Mark tasks as complete/incomplete
- Get daily productivity score (0-100)
- View task history

### 2. Goal Tracking
- Set monthly and long-term goals
- Categorize goals (Career, Health, Learning, etc.)
- Update progress with percentage completion
- View goal timelines and achievements

### 3. Skills Tracker
- Add skills you're learning
- Log daily progress notes
- Track time invested
- View learning timeline

### 4. Analytics Dashboard
- **Contribution Heatmap**: GitHub-style calendar showing daily activity
- **Productivity Charts**: Weekly and monthly completion trends
- **Streak Counter**: Track consecutive days of productivity
- **Consistency Score**: Overall performance metric
- **Smart Insights**: AI-powered suggestions based on your patterns

### 5. Weekly Reflection
- Prompted every Sunday
- Journal what went well and what to improve
- View past reflections in timeline

## 🔐 Authentication

JWT-based authentication with:
- User registration
- Login/logout
- Protected routes
- Token refresh

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Task Model
```javascript
{
  userId: ObjectId,
  title: String,
  completed: Boolean,
  date: Date,
  priority: String (low/medium/high)
}
```

### Goal Model
```javascript
{
  userId: ObjectId,
  title: String,
  category: String,
  targetDate: Date,
  progress: Number (0-100),
  status: String (active/completed/archived)
}
```

### Skill Model
```javascript
{
  userId: ObjectId,
  name: String,
  progressLogs: [{
    date: Date,
    note: String,
    hoursSpent: Number
  }],
  totalHours: Number
}
```

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Tasks
```
GET    /api/tasks            - Get all tasks
POST   /api/tasks            - Create new task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
GET    /api/tasks/score      - Get daily score
```

### Goals
```
GET    /api/goals            - Get all goals
POST   /api/goals            - Create new goal
PUT    /api/goals/:id        - Update goal
DELETE /api/goals/:id        - Delete goal
```

### Skills
```
GET    /api/skills           - Get all skills
POST   /api/skills           - Create new skill
PUT    /api/skills/:id       - Update skill
POST   /api/skills/:id/log   - Add progress log
```

### Analytics
```
GET    /api/analytics/dashboard    - Get dashboard data
GET    /api/analytics/heatmap      - Get contribution heatmap
GET    /api/analytics/insights     - Get smart insights
```

## 🧪 Testing
```bash
# Run frontend tests
cd client
npm run test

# Run backend tests
cd server
npm run test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend (Railway/Render)
```bash
cd server
# Push to GitHub
# Connect repository to Railway/Render
# Set environment variables
```

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Roadmap

- [x] Core task management
- [x] Goal tracking
- [x] Skills tracker
- [x] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Social features (share progress)
- [ ] AI-powered insights
- [ ] Integration with Google Calendar
- [ ] Team/group progress tracking
- [ ] Export to PDF

## 🐛 Known Issues

- [ ] Heatmap performance optimization needed for large datasets
- [ ] Mobile responsiveness improvements in progress
- [ ] Notification system under development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: MR-MSBORA
- LinkedIn: www.linkedin.com/in/manishsingh-webdev
- Email: manishsinghbora7115@gmail.com

## 🙏 Acknowledgments

- Inspired by GitHub's contribution graph
- Design inspiration from Linear and Notion
- Icons by Lucide React
- Charts by Recharts

## 📞 Support

For support, email manishsinghbora7115@gmail.com or open an issue on GitHub.

---

⭐ **Star this repo if you find it helpful!**

Built with ❤️ by MANISH SINGH
