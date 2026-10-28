// src/js/config.js
/**
 * Configuración centralizada de la invitación.
 * Jardín Encantado Nocturno — Alba Guissell Díaz Reyes
 */
export const EVENT_CONFIG = {
  // Datos de la Quinceañera
  quinceanera: {
    fullName: "Alba Guissell Díaz Reyes",
    shortName: "Alba Guissell",
    monogram: "A",
    parents: {
      father: "Henry Díaz Gutiérrez",
      mother: "Alba Luz Reyes Castillo"
    }
  },

  // Fecha y hora del evento
  date: {
    year: 2026,
    month: 11, // Noviembre
    day: 27,
    dayName: "Viernes",
    displayDate: "Viernes 27 de Noviembre del 2026",
    isoTarget: "2026-11-27T18:00:00" // 6:00 PM
  },

  // Itinerario y ubicaciones
  locations: {
    ceremony: {
      title: "Ceremonia Religiosa",
      time: "6:00 PM",
      place: "Iglesia Altamira",
      address: "Iglesia Altamira",
      mapUrl: "https://maps.google.com/?q=Iglesia+Altamira"
    },
    reception: {
      title: "Recepción y Fiesta",
      time: "8:00 PM",
      place: "Altamira Eventos",
      address: "Altamira Eventos",
      mapUrl: "https://maps.google.com/?q=Altamira+Eventos"
    }
  },

  // Mensaje y dedicatoria
  messages: {
    coverPoem: "Con el corazón lleno de ilusión, comienza uno de los capítulos más especiales de mi vida.",
    invitationGreeting: "Hay momentos en la vida que son inolvidables, y compartirlos con quienes más quiero los hace eternos. Con la bendición de Dios y el amor incondicional de mis padres, tengo la alegría de invitarte a celebrar mis quince años.",
    dressCode: {
      title: "Código de Vestimenta",
      badge: "Formal / Rigurosa Gala",
      description: "Deseamos que nos acompañes luciendo tu atuendo más distinguido en esta noche inolvidable.",
      reservedNote: "El color rojo queda reservado exclusivamente para la quinceañera."
    },
    thankYou: "Gracias por formar parte de este capítulo tan especial en mi vida. Tu presencia, cariño y buenos deseos harán de esta noche un recuerdo imborrable en mi corazón."
  },

  // Configuración de Música
  audio: {
    src: "/audio/golden_hour.mp3",
    title: "Golden Hour (Violin Version)",
    artist: "ViOLiNiA · Zhanna Stelmakh",
    autoplayOnOpen: true,
    initialVolume: 0.75
  },

  // Galería de fotos (URLs de las imágenes)
  gallery: {
    images: [
      // Agrega aquí las URLs de las fotos cuando las tengas
      // "/assets/images/gallery/foto1.jpg",
      // "/assets/images/gallery/foto2.jpg",
      // "/assets/images/gallery/foto3.jpg",
    ]
  },

  // Tema visual
  theme: {
    name: "Jardín Encantado Nocturno",
    palette: {
      emeraldDeep: "#031a12",
      emeraldMid: "#0a5e42",
      magentaBright: "#c73d82",
      blueNight: "#060d1f",
      gold: "#d4af37"
    },
    // Configuración de partículas
    particles: {
      fireflies: 25,
      petals: 12,
      stars: 80
    }
  }
};
