const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET_KEY = "soanchirhi_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Load data
let users = JSON.parse(fs.readFileSync("./database/users.json", "utf-8"));
const resources = JSON.parse(fs.readFileSync("./database/resources.json", "utf-8"));
const classes = JSON.parse(fs.readFileSync("./database/classes.json", "utf-8"));

// ✅ Load Admission Link from JSON
const getAdmissionLink = () => {
  try {
    const admission = JSON.parse(fs.readFileSync("./database/admission.json", "utf-8"));
    return admission.admissionLink || null;
  } catch (err) {
    return null;
  }
};

// 🔹 Route to Get Admission Link
app.get("/admission-link", (req, res) => {
  const link = getAdmissionLink();
  if (link) {
    res.json({ admissionLink: link });
  } else {
    res.status(404).json({ message: "Admission link not found." });
  }
});

// Login Route
app.post("/login", (req, res) => {
  console.log("Login Attempt:", req.body.email, req.body.password);

  const { email, password } = req.body;

  const user =
    users.students.find(u => u.email === email && u.password === password) ||
    users.teachers.find(u => u.email === email && u.password === password) ||
    users.admin.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const role = user.role || "student";
  const token = jwt.sign({ email: user.email, role, level: user.level || null }, SECRET_KEY, {
    expiresIn: "2h",
  });

  res.json({ success: true, token, role, level: user.level || null });
});

// Resources by level (for students)
app.get("/resources/:level", (req, res) => {
  const level = req.params.level.toLowerCase();
  const data = resources[level];
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "No resources found for this level." });
  }
});

// All resources (for teachers)
app.get("/all-resources", (req, res) => {
  res.json(resources);
});

// Classes
app.get("/classes", (req, res) => {
  res.json(classes);
});

// Password Change (for logged in users)
app.post("/change-password", (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  let userGroup = null;

  const user =
    users.students.find(u => u.email === email) ||
    users.teachers.find(u => u.email === email) ||
    users.admin.find(u => u.email === email);

  if (users.students.some(u => u.email === email)) userGroup = "students";
  if (users.teachers.some(u => u.email === email)) userGroup = "teachers";
  if (users.admin.some(u => u.email === email)) userGroup = "admin";

  if (user && user.password === oldPassword) {
    user.password = newPassword;

    fs.writeFileSync('./database/users.json', JSON.stringify(users, null, 2));
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Incorrect email or old password." });
  }
});

// Admin-Initiated Password Reset (Forgot Password)
app.post("/forgot-password", (req, res) => {
  const { email, newPassword } = req.body;
  let userFound = false;

  ['students', 'teachers', 'admin'].forEach(role => {
    users[role].forEach(user => {
      if (user.email === email) {
        user.password = newPassword;
        user.firstLogin = false;
        user.resetToken = null;
        userFound = true;
      }
    });
  });

  if (userFound) {
    fs.writeFileSync('./database/users.json', JSON.stringify(users, null, 2));
    res.json({ success: true, message: "Password reset successful." });
  } else {
    res.json({ success: false, message: "Email not found." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
