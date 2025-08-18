document.addEventListener('astro:page-load', () => {
   document.querySelector('#js-close-image-popup, .js-close-popup').addEventListener('click', () => {
      document.querySelector('#image-content-popup').classList.add('hidden');
   });

   document.querySelectorAll('.css-content img, .js-ficha .js-open-popup').forEach((item) => {
      item.addEventListener('click', () => handlePopupClick(item));
   });

   function handlePopupClick(item) {
      const popup = document.querySelector('#image-content-popup');
      popup.classList.remove('hidden');
      if (item.src)
         popup.querySelector('.js-popup-modal-image').style.backgroundImage = `url(${item.src})`;
      else if (item.dataset.img) {
         popup.querySelector('.js-popup-modal-image').style.backgroundImage = `url(${item.dataset.img})`;
      }
   }

});