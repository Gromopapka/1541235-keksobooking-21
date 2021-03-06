'use strict';

const MIN_AD_TITLE = 30;
const MAX_AD_TITLE = 100;
const MAX_AD_PRICE = 1000000;
const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`, `svg`];
let minAdPrice = 1000;

const page = window.page;
const util = window.util;
const backend = window.backend;

const resetPrice = () => {
  const adPrice = document.querySelector(`input[name=price]`);
  minAdPrice = 1000;
  adPrice.placeholder = minAdPrice;
};

const addTimeInOutHandler = (selectorForAddEvent, selectorForChangeSelectValue) => {
  selectorForAddEvent.addEventListener(`change`, () => {
    switch (selectorForAddEvent.value) {
      case `12:00`:
        selectorForChangeSelectValue.selectedIndex = 0;
        break;
      case `13:00`:
        selectorForChangeSelectValue.selectedIndex = 1;
        break;
      case `14:00`:
        selectorForChangeSelectValue.selectedIndex = 2;
        break;
      default:
        selectorForChangeSelectValue.selectedIndex = 0;
    }
  });
};

const addShowPhotoHandler = (fileChooser, preview, isAvatar = true) => {
  fileChooser.addEventListener(`change`, function () {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      fileChooser.setCustomValidity(``);
      const reader = new FileReader();

      reader.addEventListener(`load`, function () {
        if (isAvatar) {
          preview.src = reader.result;
        } else {
          preview.innerHTML = ``;
          const node = document.createElement(`img`);
          node.width = 70;
          node.height = 70;
          node.src = reader.result;
          node.alt = `House Photo`;
          preview.appendChild(node);
        }
      });

      reader.readAsDataURL(file);
    } else {
      fileChooser.setCustomValidity(`Файл не является изображением!`);
    }
  });
};

const addAdFormHandlers = () => {
  const adForm = document.querySelector(`.ad-form`);
  const adFormReset = document.querySelector(`.ad-form__reset`);
  const adTitle = document.querySelector(`input[name=title]`);
  const adPrice = document.querySelector(`input[name=price]`);
  const adType = document.querySelector(`select[name=type]`);
  const adRooms = document.querySelector(`select[name=rooms]`);
  const adCapacity = document.querySelector(`select[name=capacity]`);
  const adSubmit = document.querySelector(`.ad-form__submit`);
  const adTimeIn = document.querySelector(`select[name=timein]`);
  const adTimeOut = document.querySelector(`select[name=timeout]`);
  const adAvatar = document.querySelector(`.ad-form-header__input`);
  const adAvatarPreview = document.querySelector(`.ad-form-header__preview`).querySelector(`img`);
  const adHousePhoto = document.querySelector(`.ad-form__input`);
  const adHousePhotoPreview = document.querySelector(`.ad-form__photo`);

  addShowPhotoHandler(adAvatar, adAvatarPreview);
  addShowPhotoHandler(adHousePhoto, adHousePhotoPreview, false);

  adTitle.addEventListener(`input`, () => {
    const valueLength = adTitle.value.length;

    if (valueLength < MIN_AD_TITLE) {
      adTitle.setCustomValidity(`Ещё ` + (MIN_AD_TITLE - valueLength) + ` симв.`);
    } else if (valueLength > MAX_AD_TITLE) {
      adTitle.setCustomValidity(`Удалите лишние ` + (valueLength - MAX_AD_TITLE) + ` симв.`);
    } else {
      adTitle.setCustomValidity(``);
    }
  });

  adPrice.addEventListener(`input`, () => {
    adPrice.value = adPrice.value.replace(/[^0-9.]/g, ``);
  });

  adType.addEventListener(`change`, () => {
    switch (adType.value) {
      case `bungalow`:
        minAdPrice = 0;
        adPrice.placeholder = minAdPrice;
        break;
      case `flat`:
        minAdPrice = 1000;
        adPrice.placeholder = minAdPrice;
        break;
      case `house`:
        minAdPrice = 5000;
        adPrice.placeholder = minAdPrice;
        break;
      case `palace`:
        minAdPrice = 10000;
        adPrice.placeholder = minAdPrice;
        break;
      default:
        minAdPrice = 1000;
        adPrice.placeholder = minAdPrice;
    }
  });

  addTimeInOutHandler(adTimeIn, adTimeOut);
  addTimeInOutHandler(adTimeOut, adTimeIn);

  adSubmit.addEventListener(`click`, () => {
    if ((+adRooms.value === 1) && (+adCapacity.value !== 1)) {
      adRooms.setCustomValidity(`1 комнатная квартира только для 1 гостя!`);
    } else if ((+adRooms.value === 2) && ((+adCapacity.value > 2) || (+adCapacity.value === 0))) {
      adRooms.setCustomValidity(`2 комнатная квартира только для 1 или 2 гостей!`);
    } else if ((+adRooms.value === 3) && ((+adCapacity.value > 3) || (+adCapacity.value === 0))) {
      adRooms.setCustomValidity(`3 комнатная квартира только для 1, 2 или 3 гостей!`);
    } else if ((+adRooms.value === 100) && (+adCapacity.value !== 0)) {
      adRooms.setCustomValidity(`100 комнатные помещения не для гостей!`);
    } else {
      adRooms.setCustomValidity(``);
    }
    if (adPrice.value > MAX_AD_PRICE) {
      adPrice.setCustomValidity(`Максимальная цена составляет: ${MAX_AD_PRICE}`);
    } else if (adPrice.value < minAdPrice) {
      adPrice.setCustomValidity(`Минимальная цена для данного типа жилья составляет ${minAdPrice} рублей`);
    } else {
      adPrice.setCustomValidity(``);
    }
  });

  adFormReset.addEventListener(`click`, () => {
    page.disable();
    resetPrice();
  });

  adForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    backend.save(new FormData(adForm), () => {
      page.disable();
      resetPrice();
      util.showSuccessSave();
    }, util.showErrorSave);
  });
};

window.addAdFormHandlers = addAdFormHandlers;
