const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://aadipal1989_db_user:7yMpGMPpvTNYuNrr@cluster0.a4pyn.mongodb.net/campusflow?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("DB Connection Error: ", err));

// MongoDB Fee Schema
const feeSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true, unique: true },
  totalFees: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Fee = mongoose.model('Fee', feeSchema);

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

// ADMIN ROUTE: Admin fees update ya add karega
app.post('/api/admin/update-fee', async (req, res) => {
  try {
    const { studentEmail, totalFees, paidAmount } = req.body;
    const dueAmount = totalFees - paidAmount;

    // MongoDB mein check karke update ya naya record create karein
    const updatedFee = await Fee.findOneAndUpdate(
      { studentEmail: studentEmail },
      { totalFees, paidAmount, dueAmount, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Fee updated in MongoDB!", data: updatedFee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Admin fee update failed" });
  }
});

// STUDENT ROUTE: Student dashboard dynamic fee fetch karega
app.get('/api/student/fees', async (req, res) => {
  try {
    const { email } = req.query;
    const feeRecord = await Fee.findOne({ studentEmail: email });

    if (!feeRecord) {
      return res.json({ 
        success: true, 
        data: { totalFees: 0, paidAmount: 0, dueAmount: 0 } 
      });
    }

    res.json({ success: true, data: feeRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching student fee" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

