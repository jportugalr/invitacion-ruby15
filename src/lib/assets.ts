export const BACKGROUNDS = {
    envelope: {
        // Fondo interno del sobre o textura
        texture: "https://www.transparenttextures.com/patterns/cubes.png",
    },
    hero: {
        // Sección principal (Ruby Zavaleta)
        // Por defecto un color sólido, pero listo para imagen
        image: "",
        overlayOpacity: 0.1 // Para que el texto resalte
    },
    eventInfo: {
        // Sección "Celebremos la vida" (Mensaje inicial)
        messageSection: "",

        // Sección "La Fiesta" (Hacienda La Fortaleza)
        partySection: "",

        // Sección "Protocolo Real" (Dress Code)
        dressCodeSection: "",

        // Sección "Lluvia de Sobres" (Regalos)
        giftsSection: "https://www.transparenttextures.com/patterns/stardust.png" // Textura opcional usada actualmente
    },
    dj: {
        // Sección "DJ & Música"
        image: "",
    },
    guestMessages: {
        // Sección "Un Deseo Real"
        image: "",
    },
    rsvp: {
        // Sección CTA "¿Estás listo para brillar?"
        ctaSection: "",
        // Fondo del Modal
        modalTexture: "https://www.transparenttextures.com/patterns/stardust.png"
    }
};

// Helper para aplicar estilos de fondo
export const getBackgroundStyle = (imageUrl?: string) => {
    if (!imageUrl) return {};
    return {
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };
};
