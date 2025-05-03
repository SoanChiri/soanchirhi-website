const token = localStorage.getItem("token");
const role = localStorage.getItem("userRole");

if (!token || role !== "admin") {
  alert("Access denied. You are not authorized to view this page.");
  window.location.href = "teacher_login.html";  // or a common login/homepage
}


// Utility to convert Google Drive view links to direct file links
function convertDriveLink(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  return match ? `https://drive.google.com/uc?id=${match[1]}` : link;
}

// ✅ Reset Teacher Password
document.getElementById("resetTeacherPasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("teacherEmail").value;
  const password = document.getElementById("newPassword").value;
  const message = document.getElementById("resetMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, newPassword: password }),
  });

  const data = await res.json();
  message.textContent = data.message || "Password reset.";
});

// ✅ Update Admission Link
document.getElementById("updateAdmissionLinkForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const link = convertDriveLink(document.getElementById("newAdmissionLink").value);
  const message = document.getElementById("admissionLinkMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/update-admission-link", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ admissionLink: link }),
  });

  const data = await res.json();
  message.textContent = data.message || "Link updated.";
});

// ✅ Update Class Info
document.getElementById("classInfoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const schedule = document.getElementById("classSchedule").value;
  const map = convertDriveLink(document.getElementById("classMapUrl").value);
  const message = document.getElementById("classInfoMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/update-classes", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ schedule, map }),
  });

  const data = await res.json();
  message.textContent = data.message;
});

// ✅ Update Team Info
document.getElementById("teamInfoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const management = document.getElementById("managementTeam").value.split("\n").filter(Boolean);
  const teaching = document.getElementById("teachingTeam").value.split("\n").filter(Boolean);
  const message = document.getElementById("teamInfoMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/update-team-info", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ managementTeam: management, teachingTeam: teaching }),
  });

  const data = await res.json();
  message.textContent = data.message;
});

// ✅ Update Team Photo
document.getElementById("teamPhotoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const teamPhotoUrl = convertDriveLink(document.getElementById("teamPhotoUrl").value);
  const message = document.getElementById("teamPhotoMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/update-team-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ teamPhotoUrl }),
  });

  const data = await res.json();
  message.textContent = data.message;
});

// ✅ Update Gallery Photos
document.getElementById("galleryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const urls = [
    document.getElementById("galleryUrl1").value,
    document.getElementById("galleryUrl2").value,
    document.getElementById("galleryUrl3").value,
    document.getElementById("galleryUrl4").value,
  ];

  const message = document.getElementById("galleryMessage");
  let successCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = convertDriveLink(urls[i]);
    const res = await fetch(`https://soanchirhi-backend.onrender.com/update-gallery-photo/${i + 1}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ galleryUrl: url })
    });

    const data = await res.json();
    if (data.success) successCount++;
  }

  message.textContent = successCount === 4 ? "All gallery photos updated." : "Some updates failed.";
});

// ✅ Manage Users
document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    preferred_name: document.getElementById("preferredName").value,
    email: document.getElementById("userEmail").value,
    password: document.getElementById("userPassword").value,
    role: document.getElementById("userRole").value,
    level: document.getElementById("userLevel").value || "",
  };

  const message = document.getElementById("userAddMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/manage-users", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  });

  const data = await res.json();
  message.textContent = data.message;
});

// ✅ Update Resource Links
document.getElementById("resourceLinksForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const levels = ["level1", "level2", "level3", "level4", "level5", "sace", "teachers"];
  const updatedResources = {};

  for (let level of levels) {
    const rawUrl = document.getElementById(level)?.value;
    if (rawUrl) {
      updatedResources[level] = [{ title: "Homework", url: convertDriveLink(rawUrl) }];
    }
  }

  const message = document.getElementById("resourceMessage");

  const res = await fetch("https://soanchirhi-backend.onrender.com/update-resources", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(updatedResources),
  });

  const data = await res.json();
  message.textContent = data.message || "Resource links updated.";
});
