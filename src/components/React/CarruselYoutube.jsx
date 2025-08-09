import React, { useEffect, useState } from "react";

const YOUTUBE_THUMB = (id) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const YOUTUBE_EMBED = (id) =>
  `https://www.youtube.com/embed/${id}?autoplay=1`;

export default function CarruselYoutube({ ids = [] }) {

  const [cantidadMostrar, setCantidadMostrar] = useState(2);
  const [start, setStart] = useState(0);
  const [popupId, setPopupId] = useState(null);

  const showPrev = start > 0;
  const showNext = start + cantidadMostrar < ids.length;

  const visibleIds = ids.slice(start, Math.min(start + cantidadMostrar, ids.length));

  React.useEffect(() => {
    if (start + cantidadMostrar > ids.length && ids.length > 0) {
      setStart(Math.max(0, ids.length - cantidadMostrar));
    }
  }, [ids.length, start]);

  useEffect(() => {
    if (popupId){

      const popup = document.createElement("div");
      popup.className = "carrusel-youtube-popup-overlay fixed inset-0 w-full h-full bg-black/70 backdrop-blur-sm z-[9999]";
      
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = '<button style="position:absolute; top:20px; right:20px; font-size:2rem; color:white; border:none; cursor:pointer;">✕</button>';

      document.body.style.overflow = "hidden";


      const closeButtonFromHtml = tempDiv.firstChild;
      closeButtonFromHtml.onclick = () => {
        popup.remove();
        setPopupId(null);
        document.body.style.overflow = "";

      };
      popup.appendChild(closeButtonFromHtml);
      document.body.appendChild(popup);

      //Crear un hueco para el iframe
      const iframeContainer = document.createElement("div");
      popup.appendChild(iframeContainer);
      iframeContainer.style.display = "flex";
      iframeContainer.style.height = "100%";

      // Hacer como que cierro el popup hecho por astro
      const tempOriginal = document.querySelector(".temporal-popup-astro-island-carrusel");
      if (tempOriginal) {
        const iframe = tempOriginal.querySelector("iframe");
        if (iframe) {
          iframeContainer.appendChild(iframe);
        }       
        tempOriginal.click();
      }
      
    }
    
  },[popupId]);

  return (
    <div className="relative w-auto">

      <div className="flex items-center">
        <button onClick={() => setStart(start - 1)} disabled={!showPrev} className={`text-2xl px-2 ${showPrev ? "" : "invisible"} hover:animate-glitch cursor-pointer`}>
          <svg  className="w-full max-w-[60px] fill-white" viewBox="0 0 24 24" >
            <path fillRule="evenodd" clipRule="evenodd" d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071C15.3165 19.0976 14.6834 19.0976 14.2929 18.7071L8.46963 12.8839C7.98148 12.3957 7.98148 11.6043 8.46963 11.1161L14.2929 5.29289C14.6834 4.90237 15.3165 4.90237 15.7071 5.29289Z"/>
          </svg>
        </button>

        <div className="flex gap-3">
          {visibleIds.map((id) => (
            <div key={id} onClick={() => setPopupId(id)} style={{ backgroundImage: `url(${YOUTUBE_THUMB(id)})` }} className={`hover:scale-105 transition-all duration-300 w-[280px] bg-center aspect-video cursor-pointer rounded-lg shadow-md bg-cover contrast-90 hover:contrast-100`}></div>
          ))}
        </div>

        <button onClick={() => setStart(start + 1)} disabled={!showNext} className={`text-2xl px-2 ${showNext ? "" : "invisible"} hover:animate-glitch cursor-pointer`}>
          <svg  className="w-full max-w-[60px] fill-white" viewBox="0 0 24 24" >
            <path fillRule="evenodd" clipRule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.5303 11.1161C16.0185 11.6043 16.0185 12.3957 15.5303 12.8839L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z"/>
          </svg>
        </button>
      </div>


      {popupId && (
        <div
          onClick={() => setPopupId(null)}
          className="temporal-popup-astro-island-carrusel fixed top-0 left-0 w-full h-[100vh]  bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-2 shadow-2xl max-w-[90vw] max-h-[80vh] flex flex-col items-center"
          >
            <iframe
              width="560"
              height="315"
              src={YOUTUBE_EMBED(popupId)}
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg w-[60vw] h-[34vw] max-w-[800px] max-h-[450px] border-0 m-auto"
            />            
          </div>
        </div>
      )}


    </div>
  );
}