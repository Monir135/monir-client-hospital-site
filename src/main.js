import './style.css';
let currentView = "home";
let currentScreen = "home";
let selectedDoctor = null;
let selectedTime = null;
const home = document.getElementById('home');
const content = document.getElementById('content');

/* ===== DATA ===== */

const homeOptions = [
  { title: 'Patient Dashboard', type: 'patient' },
  { title: 'Hospital Dashboard', type: 'hospital' }
];

const patientOptions = [
  'Search Doctor',
  'Select Time Slot',
  'Book Appointment',
  'Pay Online',
  'SMS / WhatsApp Confirmation'
];

const hospitalOptions = [
  'Calendar Management',
  'Patient List',
  'Appointment Status',
  'Add / Cancel Appointment'
];

const doctors = [
  { name: "Dr. Sharma", specialty: "Cardiologist", available: "10:00 AM - 2:00 PM" },
  { name: "Dr. Khan", specialty: "Dermatologist", available: "12:00 PM - 4:00 PM" },
  { name: "Dr. Roy", specialty: "Neurologist", available: "9:00 AM - 1:00 PM" },
  { name: "Dr. Mehta", specialty: "Orthopedic", available: "3:00 PM - 7:00 PM" }
];

/* ===== RENDER HOME ===== */

function renderHome() {
  home.innerHTML = homeOptions.map(opt => `
    <div class="card" onclick="handleHomeClick('${opt.type}')">
      <h2>${opt.title}</h2>
    </div>
  `).join('');
}

/* ===== CLICK HANDLER ===== */

window.handleHomeClick = function (type) {
  currentView = type; // 'patient' or 'hospital'
  currentScreen = "dashboard";
  home.classList.add('hidden');
  content.classList.remove('hidden');

  const data = type === 'patient' ? patientOptions : hospitalOptions;

  content.innerHTML = `
    <button class="back-btn" onclick="goBack()">← Back</button>
    ${data.map(item => `
  <div class="card" onclick="handleFeatureClick('${item}')">
    <h3>${item}</h3>
  </div>
`).join('')}
  `;
};


window.handleFeatureClick = function (feature) {
  currentScreen = "feature";

  // SEARCH DOCTOR FEATURE
  if (feature === "Search Doctor") {
    content.innerHTML = `
      <button class="back-btn" onclick="goBack()">← Back</button>

      <input 
        type="text" 
        id="searchInput" 
        placeholder="Search doctor by name or specialty..."
        class="search-box"
      />

      <div id="doctorList" class="grid"></div>
    `;

    renderDoctors(doctors);

    document.getElementById('searchInput')
      .addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();

        const filtered = doctors.filter(doc =>
          doc.name.toLowerCase().includes(value) ||
          doc.specialty.toLowerCase().includes(value)
        );

        renderDoctors(filtered);
      });
  }

};

function renderDoctors(list) {
  const doctorList = document.getElementById('doctorList');
  if (!doctorList) return; // ✅ safety check

  doctorList.innerHTML = list.map(doc => `
    <div class="card" onclick="selectDoctor('${doc.name}')">
      <h3>${doc.name}</h3>
      <p>${doc.specialty}</p>
      <small>${doc.available}</small>
    </div>
  `).join('');
}

/* ===== BACK ===== */



/* ===== INIT ===== */

renderHome();

window.goBack = function () {

  if (currentScreen === "feature") {
    handleHomeClick(currentView); // back to dashboard
    return;
  }

  if (currentScreen === "dashboard") {
    content.classList.add('hidden');
    home.classList.remove('hidden');
    currentScreen = "home";
    return;
  }
};

window.selectDoctor = function (name) {
  selectedDoctor = doctors.find(doc => doc.name === name);

  renderTimeSlots();
};
function renderTimeSlots() {
  currentScreen = "feature";

  // ✅ get bookings ONCE
  const bookings = JSON.parse(localStorage.getItem('appointments')) || [];

  content.innerHTML = `
    <button class="back-btn" onclick="goBack()">← Back</button>

    <h2>Select Time Slot</h2>

    <div class="grid">
      ${generateTimeSlots().map(time => {

        const isBooked = bookings.find(app =>
          app.doctor === selectedDoctor.name &&
          app.time === time
        );

        return `
          <div class="card"
            style="opacity:${isBooked ? 0.4 : 1};
                   pointer-events:${isBooked ? 'none' : 'auto'}"
            onclick="confirmBooking('${time}')"
          >
            <h3>${time}</h3>
            ${isBooked ? '<small>Booked</small>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}



function generateTimeSlots() {
  return [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];
}

window.confirmBooking = function (time) {
  selectedTime = time;

  renderPatientForm();
};

function renderPatientForm() {
  currentScreen = "feature";

  content.innerHTML = `
    <button class="back-btn" onclick="goBack()">← Back</button>

    <h2>Enter Patient Details</h2>

    <div class="card form-card">
      <input type="text" id="name" placeholder="Full Name" />
      <input type="number" id="age" placeholder="Age" />
      
      <select id="gender">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input type="text" id="phone" placeholder="Phone Number" />

      <button class="submit-btn" onclick="submitBooking()">
        Confirm Appointment
      </button>
    </div>
  `;
}

window.submitBooking = function () {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const phone = document.getElementById('phone').value;

  if (!name || !age || !gender || !phone) {
    alert("Please fill all details");
    return;
  }

  const booking = {
    doctor: selectedDoctor.name,
    specialty: selectedDoctor.specialty,
    time: selectedTime,
    patient: { name, age, gender, phone }
  };

  // ✅ get old bookings
  const existing = JSON.parse(localStorage.getItem('appointments')) || [];

  // ❌ prevent duplicate booking
  const alreadyBooked = existing.find(app =>
    app.doctor === booking.doctor &&
    app.time === booking.time
  );

  if (alreadyBooked) {
    alert("This slot is already booked");
    return;
  }

  // ✅ save booking
  existing.push(booking);
  localStorage.setItem('appointments', JSON.stringify(existing));

  // simulate backend delay
  setTimeout(() => {
    showConfirmation(booking.patient);
  }, 500);
};




function showConfirmation(patient) {
  content.innerHTML = `
    <button class="back-btn" onclick="goBack()">← Back</button>

    <div class="card">
      <h2>Appointment Confirmed ✅</h2>

      <p><strong>Doctor:</strong> ${selectedDoctor.name}</p>
      <p><strong>Specialty:</strong> ${selectedDoctor.specialty}</p>
      <p><strong>Time:</strong> ${selectedTime}</p>

      <hr style="margin: 10px 0; opacity: 0.2;" />

      <p><strong>Patient:</strong> ${patient.name}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Gender:</strong> ${patient.gender}</p>
      <p><strong>Phone:</strong> ${patient.phone}</p>
    </div>
  `;
}