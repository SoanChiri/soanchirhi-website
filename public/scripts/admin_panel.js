
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admin Panel - Soan Chirhi School</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="styles/forms.css" />
  <link rel="stylesheet" href="styles/admin.css" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6fc;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .admin-panel-container {
      background: white;
      padding: 30px 40px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 700px;
    }

    h2, h3 {
      text-align: center;
      margin-bottom: 20px;
      color: #2e3a74;
    }

    form {
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
    }

    input[type="email"],
    input[type="text"],
    input[type="url"],
    input[type="file"],
    textarea,
    select {
      padding: 12px;
      margin-bottom: 15px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 16px;
      width: 100%;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    button {
      padding: 12px;
      background-color: #2e3a74;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #1c265a;
    }

    p.message {
      margin-top: 10px;
      font-weight: bold;
      color: green;
      text-align: center;
    }

    hr {
      margin: 30px 0;
      border: none;
      border-top: 1px solid #ccc;
    }

    label {
      font-weight: bold;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="admin-panel-container">
    <h2>Admin Panel</h2>

    <!-- Reset Password -->
    <h3>Reset Teacher Password</h3>
    <form id="resetTeacherPasswordForm">
      <input type="email" id="teacherEmail" placeholder="Teacher's email" required />
      <input type="text" id="newPassword" placeholder="New password" required />
      <button type="submit">Reset Password</button>
    </form>
    <p id="resetMessage" class="message"></p>

    <hr />

    <!-- Update Admission Link -->
    <h3>Update Admission Link</h3>
    <form id="updateAdmissionLinkForm">
      <input type="url" id="newAdmissionLink" placeholder="Enter new admission link" required />
      <button type="submit">Update Link</button>
    </form>
    <p id="admissionLinkMessage" class="message"></p>

    <hr />

    <!-- Update Class Info -->
    <h3>Update Class Info</h3>
    <form id="classInfoForm">
      <label for="classSchedule">Class Schedule (use bullet points or line breaks):</label>
      <textarea id="classSchedule" placeholder="• Day: Saturdays (closed during school holidays)\n• Time: 2:30 PM – 4:30 PM\n• Location: TafeSA Regency Park, 137 Days Road, Regency Park, South Australia 5010"></textarea>

      <label for="locationLink">Google Drive Link for Location Map:</label>
      <input type="url" id="classMapUrl" value="https://drive.google.com/uc?id=1m1JzxLzbFGjM1BKOdqvtgk7ZrFzMmp0t" required />

      <button type="submit">Save Class Info</button>
    </form>
    <p id="classInfoMessage" class="message"></p>

    <hr />

    <!-- Update Team Info -->
    <h3>Update Team Info</h3>
    <form id="teamInfoForm">
      <label for="managementTeam">Management Team (one per line):</label>
      <textarea id="managementTeam" placeholder="Name – Role"></textarea>

      <label for="teachingTeam">Teaching Team (one per line):</label>
      <textarea id="teachingTeam" placeholder="Name"></textarea>

      <button type="submit">Save Team Info</button>
    </form>
    <p id="teamInfoMessage" class="message"></p>

    <hr />

    <!-- Update Team Photo -->
    <h3>Update Team Photo</h3>
    <form id="teamPhotoForm">
      <label for="teamPhotoUrl">Paste Google Drive Link:</label>
      <input type="url" id="teamPhotoUrl" value="https://drive.google.com/uc?id=1IrmwTXxcz1B9UY6w9QlsWq9gUqMmpv2W" required />
      <button type="submit">Save Team Photo</button>
    </form>
    <p id="teamPhotoMessage" class="message"></p>

    <hr />

    <!-- Update Gallery Photos via Google Drive -->
    <!-- Update Gallery Photos via Google Drive -->
<!-- ✅ Update Gallery Photos via Google Drive -->
<h3>Update Gallery Photos</h3>
<form id="galleryForm">
  <label for="galleryUrl1">Gallery Photo 1</label>
  <input type="url" id="galleryUrl1" value="https://drive.google.com/uc?id=1Jd3gpxW2qcwHVw5JQ-WldpvPXgk6CVz-" required />

  <label for="galleryUrl2">Gallery Photo 2</label>
  <input type="url" id="galleryUrl2" value="https://drive.google.com/uc?id=1kHP4uIjQkAzu7GcYZp8SgTT50-0-lCNr" required />

  <label for="galleryUrl3">Gallery Photo 3</label>
  <input type="url" id="galleryUrl3" value="https://drive.google.com/uc?id=1AEhFUF2npkNpNc1Dd5HyVBLJ3YLRIN3i" required />

  <label for="galleryUrl4">Gallery Photo 4</label>
  <input type="url" id="galleryUrl4" value="https://drive.google.com/uc?id=1w2jJs2-O0uB5sxGos7AJJCHXwbnF_cvp" required />

  <button type="submit">Save Gallery Photos</button>
</form>
<p id="galleryMessage" class="message"></p>

    <hr />

    <!-- Manage Users -->
    <h3>Manage Users</h3>
    <form id="addUserForm">
      <input type="text" id="firstName" placeholder="First Name" required />
      <input type="text" id="lastName" placeholder="Last Name" required />
      <input type="text" id="preferredName" placeholder="Preferred Name (optional)" />
      <input type="email" id="userEmail" placeholder="Email" required />
      <input type="text" id="userPassword" placeholder="Password" required />
      <select id="userRole" required>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
     <input type="text" id="userLevel" placeholder="Level (e.g., Level 1)" />
     <button type="submit">Add User</button>
    </form>
    <p id="userAddMessage" class="message"></p>

<hr />

<!-- 🔁 Upload Resources -->
<h3>Update Resource Links</h3>
<form id="resourceLinksForm">
  <label for="level1">Level 1 Resource Link:</label>
  <input type="url" id="level1" placeholder="Paste Google Drive link for Level 1" />

  <label for="level2">Level 2 Resource Link:</label>
  <input type="url" id="level2" placeholder="Paste Google Drive link for Level 2" />

  <label for="level3">Level 3 Resource Link:</label>
  <input type="url" id="level3" placeholder="Paste Google Drive link for Level 3" />

  <label for="level4">Level 4 Resource Link:</label>
  <input type="url" id="level4" placeholder="Paste Google Drive link for Level 4" />

  <label for="level5">Level 5 Resource Link:</label>
  <input type="url" id="level5" placeholder="Paste Google Drive link for Level 5" />

  <label for="sace">SACE Resource Link:</label>
  <input type="url" id="sace" placeholder="Paste Google Drive link for SACE" />

  <label for="teacher">Teacher Resource Link:</label>
  <input type="url" id="teacher" placeholder="Paste Google Drive link for Teachers" />

  <button type="submit">Update All Resource Links</button>
</form>
<p id="resourceMessage" class="message"></p>

  </div>

<!-- Just link the file — DO NOT include JS code here -->
<script src="scripts/admin_panel.js"></script>
</body>
</html>


