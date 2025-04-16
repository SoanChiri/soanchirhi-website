const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET_KEY = "soanchirhi_secret_key";

// CORS configuration
const corsOptions = {
  origin: 'https://soanchiri.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ JWT Token Verification Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Format: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user; // Attach user to request object
    next();
  });
};


// Load data with error handling for file reads
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`Error reading file at ${filePath}:`, err);
    return {};
  }
};

let users = readJsonFile("./database/users.json");
let resources = readJsonFile("./database/resources.json");
let classes = readJsonFile("./database/classes.json");
let admission = readJsonFile("./database/admission.json");

// ✅ Load Admission Link from JSON
const getAdmissionLink = () => {
  try {
    return admission.admissionLink || null;
  } catch (err) {
    console.error("Error loading admission link:", err);
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

// 🔄 Route to Update Admission Link (Admin Only)
app.post("/update-admission-link", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Only admins can update the admission link." });
  }

  const { admissionLink } = req.body;
  if (!admissionLink) {
    return res.status(400).json({ message: "Admission link is required." });
  }

  try {
    const newAdmission = { admissionLink };
    fs.writeFileSync('./database/admission.json', JSON.stringify(newAdmission, null, 2));
    admission = newAdmission; // Update in-memory
    res.json({ success: true, message: "Admission link updated successfully." });
  } catch (error) {
    console.error("Error updating admission link:", error);
    res.status(500).json({ success: false, message: "Failed to update admission link." });
  }
});
// ✅ Load Images JSON (gallery, team, map)
let images = readJsonFile("./database/images.json");

// 🔹 Route to Get Team Photo
app.get("/team-photo", (req, res) => {
  res.json({ teamPhotos: images.teamPhotos || [] });
});

// 🔹 Route to Get Gallery Photos
app.get("/gallery", (req, res) => {
  res.json({ gallery: images.gallery || [] });
});

// 🔹 Route to Get Class Map Image
app.get("/class-map", (req, res) => {
  res.json({ classMap: images.classMap || [] });
});

// 🔄 Admin-Only Route to Update Team Photo
app.post("/update-team-photo", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can update team photo." });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ message: "Team photo URL required." });

  images.teamPhotos = [url];
  fs.writeFileSync("./database/images.json", JSON.stringify(images, null, 2));
  res.json({ success: true, message: "Team photo updated." });
});

// 🔄 Admin-Only Route to Update Gallery Photo (by index 1–4)
app.post("/update-gallery-photo/:id", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can update gallery." });
  }

  const id = parseInt(req.params.id, 10);
  const { url } = req.body;

  if (!url || isNaN(id) || id < 1 || id > 4) {
    return res.status(400).json({ message: "Invalid gallery index or URL." });
  }

  images.gallery = images.gallery || [];
  images.gallery[id - 1] = url;

  fs.writeFileSync("./database/images.json", JSON.stringify(images, null, 2));
  res.json({ success: true, message: `Gallery photo ${id} updated.` });
});

// 🔄 Admin-Only Route to Update Class Map
app.post("/update-class-map", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can update class map." });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ message: "Map URL required." });

  images.classMap = [url];
  fs.writeFileSync("./database/images.json", JSON.stringify(images, null, 2));
  res.json({ success: true, message: "Class location map updated." });
});

// ✅ Login Route
app.post("/login", (req, res) => {
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

  // Ensure that the user has a level for students
  if (!user.level && user.role === "student") {
    return res.status(400).json({ success: false, message: "User has no level assigned." });
  }

  res.json({ success: true, token, role, level: user.level || null });
});

// ✅ Resources by level (for students)
app.get("/resources/:level", authenticateToken, (req, res) => {
  const level = req.params.level.toLowerCase();
  const data = resources[level];
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: "No resources found for this level." });
  }
});

// ✅ All resources (for teachers and admins)
app.get("/all-resources", authenticateToken, (req, res) => {
  if (req.user.role !== "teacher" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Only teachers and admins can access all resources." });
  }

  res.json(resources);
});

// ✅ Route for Teacher Resources Only (matches frontend expectation)
app.get("/resources/teacher", authenticateToken, (req, res) => {
  if (req.user.role !== "teacher" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Only teachers and admins can access this." });
  }

  const teacherResource = resources.teachers;

  if (Array.isArray(teacherResource) && teacherResource.length > 0) {
    res.json(teacherResource);
  } else {
    res.status(404).json({ message: "Teacher resources not found." });
  }
});


// 🔄 Route to Update Class Info (Admin Only)
app.post("/update-classes", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Only admins can update class info." });
  }

  const { schedule, map } = req.body;
  if (!schedule || !map) {
    return res.status(400).json({ message: "Schedule and map are required." });
  }

  try {
    const updatedClassInfo = { schedule, map };
    fs.writeFileSync("./database/classes.json", JSON.stringify(updatedClassInfo, null, 2));
    res.json({ success: true, message: "Class info updated successfully." });
  } catch (error) {
    console.error("Error updating class info:", error);
    res.status(500).json({ success: false, message: "Failed to update class info." });
  }
});
// 🔄 Route to Update Team Info (Admin Only)
app.post("/update-team-info", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Only admins can update team info." });
  }

  const { managementTeam, teachingTeam } = req.body;

  if (!Array.isArray(managementTeam) || !Array.isArray(teachingTeam)) {
    return res.status(400).json({ message: "Both managementTeam and teachingTeam must be arrays." });
  }

  try {
    const newTeamData = { managementTeam, teachingTeam };
    fs.writeFileSync("./database/team.json", JSON.stringify(newTeamData, null, 2));
    res.json({ success: true, message: "Team info updated successfully." });
  } catch (error) {
    console.error("Error updating team info:", error);
    res.status(500).json({ success: false, message: "Failed to update team info." });
  }
});
// 🔄 Route to Update Team Photo (Admin Only)
app.post("/update-team-photo", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Only admins can update the team photo." });
  }

  const { teamPhotoUrl } = req.body;

  if (!teamPhotoUrl) {
    return res.status(400).json({ message: "Team photo URL is required." });
  }

  try {
    const imageData = readJsonFile("./database/images.json");
    imageData.teamPhotos = [teamPhotoUrl]; // only one main team photo at a time
    fs.writeFileSync("./database/images.json", JSON.stringify(imageData, null, 2));
    res.json({ success: true, message: "Team photo updated successfully." });
  } catch (error) {
    console.error("Error updating team photo:", error);
    res.status(500).json({ success: false, message: "Failed to update team photo." });
  }
});
// 🔄 Route to Update Gallery Photos (Admin Only)
app.post("/update-gallery-photo/:id", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Only admins can update gallery photos." });
  }

  const { id } = req.params;
  const { galleryUrl } = req.body;

  if (!galleryUrl || isNaN(id) || id < 1 || id > 4) {
    return res.status(400).json({ message: "Invalid request. ID must be 1–4 and a valid URL must be provided." });
  }

  try {
    const imageData = readJsonFile("./database/images.json");
    imageData.gallery = imageData.gallery || [];

    // Adjust index (0-based)
    imageData.gallery[id - 1] = galleryUrl;

    fs.writeFileSync("./database/images.json", JSON.stringify(imageData, null, 2));
    res.json({ success: true, message: `Gallery photo ${id} updated successfully.` });
  } catch (error) {
    console.error("Error updating gallery photo:", error);
    res.status(500).json({ success: false, message: "Failed to update gallery photo." });
  }
});

// 🔄 Route to Add or Update Users (Admin Only)
app.post("/manage-users", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Only admins can manage users." });
  }

  const { first_name, last_name, preferred_name, email, password, role, level } = req.body;

  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const userObject = {
    id: Date.now(),
    first_name,
    last_name,
    preferred_name: preferred_name || "",
    email,
    password,
    role,
    level: role === "student" ? level || "" : "Level 0",
    firstLogin: false,
    resetToken: null
  };

  try {
    let targetGroup = users[`${role}s`];
    if (!targetGroup) return res.status(400).json({ message: "Invalid role." });

    const existingIndex = targetGroup.findIndex(u => u.email === email);
    if (existingIndex !== -1) {
      // update user
      targetGroup[existingIndex] = { ...targetGroup[existingIndex], ...userObject };
    } else {
      // add user
      targetGroup.push(userObject);
    }

    fs.writeFileSync("./database/users.json", JSON.stringify(users, null, 2));
    res.json({ success: true, message: "User saved successfully." });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ success: false, message: "Failed to save user." });
  }
});



// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});