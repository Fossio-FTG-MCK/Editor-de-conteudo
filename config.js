export const config = {
    maxImageSizeMB: 5, // Tamanho máximo para imagens em MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    textSelectors: [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'span', 'div', 'a', 'button', 'li', 'label',
        'td', 'th', 'caption', 'figcaption'
    ],
    imageSelectors: ['img'],
    videoSelectors: ['video source'],
    notificationDuration: 3000 // Increased notification duration
};