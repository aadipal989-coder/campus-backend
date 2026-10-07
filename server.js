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

// Fee Schema with studentId (Roll No / User ID)
const feeSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
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

// ADMIN ROUTE: Roll No / User ID ke through update karega
app.post('/api/admin/update-fee', async (req, res) => {
  try {
    const { studentId, totalFees, paidAmount } = req.body;

    const total = Number(totalFees) || 0;
    const paid = Number(paidAmount) || 0;
    const due = total - paid;

    const updatedFee = await Fee.findOneAndUpdate(
      { studentId: String(studentId).trim() },
      { totalFees: total, paidAmount: paid, dueAmount: due, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Fee updated in MongoDB!", data: updatedFee });
  } catch (error) {
    console.log("DB Update Error: ", error);
    res.status(500).json({ success: false, message: "Admin fee update failed: " + error.message });
  }
});

// STUDENT ROUTE: Roll No / User ID se fee fetch karega
app.get('/api/student/fees', async (req, res) => {
  try {
    const { studentId } = req.query;
    const feeRecord = await Fee.findOne({ studentId: String(studentId).trim() });

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
