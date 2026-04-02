import './style.css';

/* 🔥 PROTECT LOGIN PAGE */
if (localStorage.getItem("auth")) {
  window.location.replace("dashboard.html");
}

/* 🔥 GENERATE BACKGROUND TEXT */
const container = document.getElementById('patternText');

let text = '';
for (let i = 0; i < 150; i++) {
  text += `<span>Q Care</span>`;
}
container.innerHTML = text;

/* 🔥 BUTTONS */

/* 🔥 PHONE AUTH FLOW */

const otpModal = document.getElementById("otpModal");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const phoneInput = document.getElementById("phoneInput");
const otpInput = document.getElementById("otpInput");
const otpSection = document.getElementById("otpSection");

/* OPEN MODAL */
document.querySelector('.phone-btn').addEventListener('click', () => {
  otpModal.style.display = "flex";
});

/* SEND OTP */
sendOtpBtn.addEventListener('click', () => {
  const phone = phoneInput.value;

  if (phone.length < 10) {
    alert("Enter valid phone number");
    return;
  }

  otpSection.style.display = "block";
  sendOtpBtn.style.display = "none";
  verifyOtpBtn.style.display = "block";
});

/* VERIFY OTP */
verifyOtpBtn.addEventListener('click', () => {
  if (otpInput.value === "1234") {
    localStorage.setItem("auth", "true");

    otpModal.style.display = "none"; // ✅ ADD HERE

    window.location.replace("dashboard.html");
  } else {
    alert("Invalid OTP");
  }
});


/* 🔥 GOOGLE (keep fake) */
/* 🔥 GOOGLE AUTH FLOW */

const googleModal = document.getElementById("googleModal");
const googleUser = document.getElementById("googleUser");

/* OPEN GOOGLE MODAL */
document.querySelector('.google-btn').addEventListener('click', () => {
  googleModal.style.display = "flex";

  // reset UI
  googleUser.style.pointerEvents = "auto";
  googleUser.style.opacity = "1";
  googleUser.innerHTML = `
<img src="https://randomuser.me/api/portraits/men/32.jpg" />
    <div>
      <p>demo.user@gmail.com</p>
      <span>Use this account</span>
    </div>
  `;
});

googleUser.addEventListener('click', () => {
  // disable multiple clicks
  googleUser.style.pointerEvents = "none";
  googleUser.style.opacity = "0.6";

  // show loading
  googleUser.innerHTML = `
    <div style="padding:10px;">Signing in...</div>
  `;

  setTimeout(() => {
    localStorage.setItem("auth", "true");
    window.location.replace("dashboard.html");
  }, 1000);
});

/* SELECT ACCOUNT */


/* CLOSE ON OUTSIDE CLICK */
googleModal.addEventListener('click', (e) => {
  if (e.target === googleModal) {
    googleModal.style.display = "none";
  }
});



/* 🔥 FAKE AUTH FUNCTION */
function fakeLogin(method) {
  console.log(`Logging in with ${method}...`);

  setTimeout(() => {
    localStorage.setItem("auth", "true");
    window.location.replace("dashboard.html");
  }, 800);
}