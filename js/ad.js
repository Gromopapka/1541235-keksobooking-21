'use strict';

(function () {
  window.PIN_HEIGHT = 70;
  window.PIN_WIDTH = 50;

  const createAd = function (arr) {
    const newPin = document.querySelector(`#pin`).content.cloneNode(true);
    const pinButton = newPin.querySelector(`.map__pin`);
    pinButton.style.cssText = `left: ${arr.location.x - window.PIN_WIDTH / 2}px; top: ${arr.location.y - window.PIN_HEIGHT}px;`;
    const pinPhoto = newPin.querySelector(`img`);
    pinPhoto.src = `${arr.author.avatar}`;
    pinPhoto.alt = `${arr.offer.title}`;
    return newPin;
  };

  window.placeAds = function () {
    const pins = document.querySelector(`.map__pins`);
    let pinsArray = window.createAdArray();

    let fragment = document.createDocumentFragment();
    for (let i = 0; i < pinsArray.length; i++) {
      fragment.appendChild(createAd(pinsArray[i]));
    }
    pins.appendChild(fragment);
  };
})();