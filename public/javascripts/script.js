let navmenu = document.querySelector('.menu-icons');


document.querySelector('#menu-btn').onclick = () => {
    navmenu.classList.toggle('active');
}

function Data(element) {
    element.classList.add('active');
}
