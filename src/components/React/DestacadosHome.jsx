import React, { useState , useEffect} from 'react';

//https://spline.design/
//https://pitch.com/
//https://vrroom.studio/
//https://sidequestvr.com/

const DestacadosHome = () => {
  const items = [
    { 
      id: 1, 
      title: 'Primeros pasos con Meta Quest 3', 
      description: 'Aprende a configurar y utilizar tu Meta Quest 3 con esta guía completa. Incluye consejos para la configuración inicial, ajustes de seguridad, y recomendaciones de apps imprescindibles para comenzar tu experiencia en realidad virtual.', 
      img: '/images/guias/enfrentados.png',
      category: 'Guía de Inicio',
    },
    { 
      id: 2, 
      title: 'Explora SideQuest VR', 
      description: 'Descubre cómo instalar aplicaciones y juegos no oficiales en tu Meta Quest usando SideQuest VR. Aprende a navegar por la plataforma, instalar contenido y mantener tu dispositivo seguro.', 
      img: '/images/guias/rompiendo_cristal.png' 
    },
    { 
      id: 3, 
      title: 'Crea presentaciones inmersivas con Pitch', 
      description: 'Utiliza Pitch para diseñar presentaciones interactivas y colaborativas en realidad virtual. Ideal para equipos creativos y profesionales que buscan nuevas formas de comunicar ideas.', 
      img: '/images/guias/enfrentados.png' 
    },
    { 
      id: 4, 
      title: 'Diseño 3D fácil con Spline', 
      description: 'Aprende a crear y compartir diseños 3D de manera sencilla con Spline. Perfecto para principiantes y expertos que desean experimentar con modelado en VR.', 
      img: '/images/guias/palomitas.jpg' 
    },
    { 
      id: 5, 
      title: 'Eventos virtuales en VRROOM', 
      description: 'Participa en eventos y conciertos virtuales a través de VRROOM Studio. Descubre cómo acceder, interactuar y disfrutar experiencias sociales en realidad virtual.', 
      img: '/images/guias/ejercicio.jpg' 
    },
  ];

  const [selected, setSelected] = useState(items[0]);
  const [progress, setProgress] = useState(0);
  const [progressEnabled, setProgressEnabled] = useState(true);

  // useEffect(() => {
  //   console.log(`Item seleccionado: ${selected.title}`);
  // }, [selected]);

  useEffect(() => {
    if (!progressEnabled) return;
    const interval = setInterval(() => {
      setSelected(prev => {
        const currentIndex = items.findIndex(item => item.id === prev.id);
        const nextIndex = (currentIndex + 1) % items.length;
        return items[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [items]);


  useEffect(() => {
    if (!progressEnabled) return;

    setProgress(0);
    const step = 100 / (5 * 10); // 5 segundos, 10 pasos por segundo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev + step >= 100) {
          setSelected(prevSelected => {
            const currentIndex = items.findIndex(item => item.id === prevSelected.id);
            const nextIndex = (currentIndex + 1) % items.length;
            return items[nextIndex];
          });
          return 100;
        }
        return prev + step;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [selected]);

  const handleClick = (item) => {
    setSelected(item);
    setProgressEnabled(false);
  };









  return (
    <article className="flex flex-col items-center mb-12 w-11/12 mx-auto">
      <div
        className="overflow-hidden w-full max-w-6xl h-140 rounded-2xl flex flex-col items-center justify-center mb-8 bg-gradient-to-br from-zinc-950 to-zinc-900 shadow-2xl transition-all duration-300 relative"
        style={{
          backgroundImage: `url(${selected.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span className="absolute mt-4 mr-8 top-0 right-0 bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-4 z-10">
              {selected.category || 'Sin categoría'}
          </span>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/100 to-zinc-900/0 rounded-2xl pointer-events-none" />
            
            <div className='absolute flex flex-col m-6 gap-4 bottom-0 left-0'>
              <h2 className="text-5xl font-bold text-gray-100 mb-2 relative z-10">{selected.title}</h2>
              <p className="max-w-2xl text-pretty text-gray-200 text-xl text-left mb-4 relative z-10">{selected.description}</p>
              <a
                href={selected.link || '#'}
                className="text-white hover:scale-105 transition-all  bg-gradient-to-br from-pink-800 to-pink-500 px-5 py-2 rounded-lg font-medium duration-200 relative z-10"
                target="_blank"
                rel="noopener noreferrer"

                style={{ width: 'fit-content' }}
              >
                Ver contenido
              </a>
            </div>
            

            {progressEnabled && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-br from-zinc-900 to-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-800 to-pink-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
        </div>

      <div className="flex gap-3 w-full max-w-6xl">
        {items.map((item, idx) => {

          let roundedClass = '';
          if (idx === 0) {
            roundedClass = 'rounded-l-2xl';
          } else if (idx === items.length - 1) {
            roundedClass = 'rounded-r-2xl';
          }

          return (
            <button
              key={item.id}
              className={`h-20 w-full cursor-pointer py-6 flex items-center justify-center font-semibold text-md px-2 transition-colors duration-200 focus:outline-none
                ${selected.id === item.id
                  ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-lg scale-105'
                  : 'bg-gradient-to-br from-zinc-950 to-zinc-900 text-gray-400 hover:from-zinc-900 hover:to-zinc-800'}
                ${roundedClass}
              `}
              onClick={() => handleClick(item)}
              type="button"
              tabIndex={0}
              style={{ flex: 1, minWidth: 0 }}
            >
              {item.title}
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default DestacadosHome;