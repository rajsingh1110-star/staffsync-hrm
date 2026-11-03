
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('StaffSync API Server is running smoothly!');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/trainings', require('./routes/trainingRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
