const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://aadipal1989_db_user:7yMpGMPpvTNYuNrr@cluster0.okgvv4o.mongodb.net/campusflow?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("DB Connection Error: ", err));

// Test Route
app.get('/', (req, res) => {
  res.send("CampusFlow Backend Live Hai!");
});

// Student Login API Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === "student@campus.com" && password === "123456") {
    res.json({ success: true, message: "Login successful", role: "student" });
  } else {
    res.status(400).json({ success: false, message: "Invalid email or password" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
