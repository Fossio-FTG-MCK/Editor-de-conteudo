/**
 * Utility functions for copy functionality
 */

/**
 * Copies text to clipboard and shows notification
 * @param {string} text - Text to copy
 * @param {string} message - Notification message
 */
export function copyToClipboard(text, message = 'Conteúdo copiado!') {
    navigator.clipboard.writeText(text)
        .then(() => {
            showCopyNotification(message);
        })
        .catch(err => {
            console.error('Erro ao copiar para área de transferência', err);
            showCopyNotification('Erro ao copiar conteúdo!', 'error');
        });
}

/**
 * Shows a notification after copy
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
export function showCopyNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}