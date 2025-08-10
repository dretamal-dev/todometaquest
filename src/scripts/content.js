document.addEventListener('astro:page-load', () => {
   document.querySelector('#js-close-image-popup').addEventListener('click', () => {
      document.querySelector('#image-content-popup').classList.add('hidden');
   });

   document.querySelectorAll('.css-content img').forEach((img) => {
      img.addEventListener('click', () => {
         const popup = document.querySelector('#image-content-popup');
         popup.classList.remove('hidden');
         popup.querySelector('.js-popup-modal-image').style.backgroundImage = `url(${img.src})`;
      });
   });

});