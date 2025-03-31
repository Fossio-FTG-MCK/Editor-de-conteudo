import { config } from './config.js';
import { copyToClipboard } from './copy-utils.js';
import { initializeFilters } from './filter-handler.js';

/**
 * Functions for handling editable elements in the HTML editor
 */

/**
 * Updates a text element in the document
 * @param {Document} currentDoc - Current document
 * @param {string} selector - CSS selector 
 * @param {number} index - Element index
 * @param {string} newText - New text content
 * @returns {boolean} - Success status
 */
export function updateTextElement(currentDoc, selector, index, newText) {
    const elements = currentDoc.querySelectorAll(selector);
    if (elements[index]) {
        elements[index].textContent = newText;
        return true;
    }
    return false;
}

/**
 * Finds and displays text elements for editing
 * @param {Document} currentDoc - Current document
 * @param {HTMLElement} editableElements - Container for editable elements
 * @param {Function} updatePreview - Function to update preview
 * @param {Array} editableElementsData - Array to store elements data
 */
export function findAndDisplayTextElements(currentDoc, editableElements, updatePreview, editableElementsData) {
    config.textSelectors.forEach(selector => {
        const elements = currentDoc.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            // Verificar se o elemento tem conteúdo de texto
            if (element.textContent.trim() && !element.children.length) {
                const originalText = element.textContent;
                
                const elementItem = document.createElement('div');
                elementItem.className = 'element-item';
                elementItem.id = `element-text-${selector.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
                
                elementItem.innerHTML = `
                    <div class="element-header">
                        <div class="element-type">Texto (${selector})</div>
                        <button class="copy-button" title="Copiar conteúdo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="element-input">
                        <label>Conteúdo:</label>
                        <textarea data-selector="${selector}" data-index="${index}">${originalText}</textarea>
                    </div>
                `;
                
                // Adicionar evento de alteração do texto
                const textarea = elementItem.querySelector('textarea');
                textarea.addEventListener('input', (e) => {
                    updateTextElement(currentDoc, selector, index, e.target.value);
                    updatePreview();
                });
                
                // Adicionar evento para o botão de cópia
                const copyButton = elementItem.querySelector('.copy-button');
                copyButton.addEventListener('click', () => {
                    copyToClipboard(textarea.value);
                });
                
                editableElements.appendChild(elementItem);
                
                // Armazenar para pesquisa
                editableElementsData.push({
                    id: elementItem.id,
                    type: 'text',
                    selector,
                    index,
                    content: originalText,
                    element: elementItem
                });
            }
        });
    });
    
    // Initialize filters after adding elements
    initializeFilters(editableElementsData);
}

/**
 * Finds and displays image elements for editing
 * @param {Document} currentDoc - Current document
 * @param {HTMLElement} editableElements - Container for editable elements
 * @param {Function} updatePreview - Function to update preview
 * @param {Array} editableElementsData - Array to store elements data
 * @param {Function} handleImageReplace - Function to handle image replacement
 */
export function findAndDisplayImageElements(currentDoc, editableElements, updatePreview, editableElementsData, handleImageReplace) {
    config.imageSelectors.forEach(selector => {
        const elements = currentDoc.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            const src = element.getAttribute('src');
            if (!src) return;
            
            const elementItem = document.createElement('div');
            elementItem.className = 'element-item';
            elementItem.id = `element-image-${selector.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
            
            elementItem.innerHTML = `
                <div class="element-header">
                    <div class="element-type">Imagem</div>
                    <button class="copy-button" title="Copiar URL da imagem">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                    </button>
                </div>
                <div class="element-input">
                    <label>URL atual:</label>
                    <input type="text" readonly value="${src}">
                    
                    <div class="image-preview">
                        <img src="${src}" alt="Imagem atual" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItaW1hZ2UiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+'; this.style.padding='20px'; this.style.background='#f5f5f5';">
                    </div>
                    
                    <div class="image-input-container">
                        <label>Substituir imagem:</label>
                        <input type="file" accept="image/*" data-selector="${selector}" data-index="${index}">
                    </div>
                </div>
            `;
            
            // Adicionar evento para substituir a imagem
            const fileInput = elementItem.querySelector('input[type="file"]');
            fileInput.addEventListener('change', (e) => {
                handleImageReplace(e.target.files[0], selector, index);
            });
            
            // Adicionar evento para o botão de cópia
            const copyButton = elementItem.querySelector('.copy-button');
            const srcInput = elementItem.querySelector('input[type="text"]');
            copyButton.addEventListener('click', () => {
                copyToClipboard(srcInput.value, 'URL da imagem copiada!');
            });
            
            editableElements.appendChild(elementItem);
            
            // Armazenar para pesquisa
            editableElementsData.push({
                id: elementItem.id,
                type: 'image',
                selector,
                index,
                content: src,
                element: elementItem
            });
        });
    });
}

/**
 * Finds and displays video elements for editing
 * @param {Document} currentDoc - Current document
 * @param {HTMLElement} editableElements - Container for editable elements
 * @param {Function} updatePreview - Function to update preview
 * @param {Array} editableElementsData - Array to store elements data
 * @param {Function} handleVideoReplace - Function to handle video replacement
 */
export function findAndDisplayVideoElements(currentDoc, editableElements, updatePreview, editableElementsData, handleVideoReplace) {
    config.videoSelectors.forEach(selector => {
        const elements = currentDoc.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            const src = element.getAttribute('src');
            if (!src) return;
            
            const elementItem = document.createElement('div');
            elementItem.className = 'element-item';
            elementItem.id = `element-video-${selector.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
            
            elementItem.innerHTML = `
                <div class="element-header">
                    <div class="element-type">Vídeo</div>
                    <button class="copy-button" title="Copiar URL do vídeo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                    </button>
                </div>
                <div class="element-input">
                    <label>URL atual:</label>
                    <input type="text" readonly value="${src}">
                    
                    <div class="image-input-container">
                        <label>Substituir vídeo:</label>
                        <input type="file" accept="video/*" data-selector="${selector}" data-index="${index}">
                    </div>
                </div>
            `;
            
            // Adicionar evento para substituir o vídeo
            const fileInput = elementItem.querySelector('input[type="file"]');
            fileInput.addEventListener('change', (e) => {
                handleVideoReplace(e.target.files[0], selector, index);
            });
            
            // Adicionar evento para o botão de cópia
            const copyButton = elementItem.querySelector('.copy-button');
            const srcInput = elementItem.querySelector('input[type="text"]');
            copyButton.addEventListener('click', () => {
                copyToClipboard(srcInput.value, 'URL do vídeo copiada!');
            });
            
            editableElements.appendChild(elementItem);
            
            // Armazenar para pesquisa
            editableElementsData.push({
                id: elementItem.id,
                type: 'video',
                selector,
                index,
                content: src,
                element: elementItem
            });
        });
    });
}