let navmenu = document.querySelector('.menu-icons');

document.querySelector('#menu-btn').onclick = () => {
  navmenu.classList.toggle('active');
};

function Data(element) {
  element.classList.add('active');
}

let info = document.querySelector('#profile-info');
let pass = document.querySelector('#profile-pass');
let infoForm = document.querySelector('#change-info-form');
let passForm = document.querySelector('#change-pass-form');

document.querySelector('#profile-info').onclick = () => {
  info.classList.add('active');
  infoForm.style.display = 'block';
  pass.classList.remove('active');
  passForm.style.display = 'none';
};

document.querySelector('#profile-pass').onclick = () => {
  pass.classList.add('active');
  passForm.style.display = 'block';
  info.classList.remove('active');
  infoForm.style.display = 'none';
};
