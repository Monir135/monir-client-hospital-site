import './style.css';

/* 🔥 GENERATE BACKGROUND TEXT */
const container = document.getElementById('patternText');

let text = '';
for (let i = 0; i < 150; i++) {
  text += `<span>Q Care</span>`;
}
container.innerHTML = text;

/* BUTTONS */
document.querySelector('.google-btn').addEventListener('click', () => {
  alert('Google Sign-In (Firebase next step)');
});

document.querySelector('.phone-btn').addEventListener('click', () => {
  alert('OTP Flow next step');
});