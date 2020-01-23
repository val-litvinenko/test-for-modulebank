window.onload = function() {
  baron({
    root: '.modal__wrapper',
    scroller: '.modal__scroller',
    container: '.modal__container',
    bar: '.baron__bar',
  });
};

const closeButton = document.querySelector('.modal__close');
const modalWindow = document.querySelector('.modal');
const addButton = document.querySelector('.page-navigation__item--new-pay');
const page = document.querySelector('.page-main');

const openModal = () => {
  page.insertAdjacentElement('afterbegin', modalWindow);
  closeButton.addEventListener('click', closeModal);
  addButton.removeEventListener('click', openModal);
};

const closeModal = () => {
  modalWindow.remove();
  addButton.addEventListener('click', openModal);
  closeButton.removeEventListener('click', closeModal);
}

closeButton.addEventListener('click', closeModal);



