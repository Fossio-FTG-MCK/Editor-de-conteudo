import { config } from './config.js';
import { copyToClipboard } from './copy-utils.js';
import { 
    findAndDisplayTextElements,
    findAndDisplayImageElements,
    findAndDisplayVideoElements, 
    updateTextElement
} from './element-handler.js';

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('html-file');
    const htmlTextarea = document.getElementById('html-input');
    const processHtmlButton = document.getElementById('process-html');
    const previewArea = document.getElementById('preview-area');
    const editableElements = document.getElementById('editable-elements');
    const editorContainer = document.getElementById('editor-container');
    const outputActions = document.getElementById('output-actions');
    const copyCodeBtn = document.getElementById('copy-code');
    const downloadFileBtn = document.getElementById('download-file');
    const notification = document.getElementById('notification');
    const searchButton = document.getElementById('search-button');
    const searchBox = document.getElementById('search-box');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    let originalDoc = null;
    let currentDoc = null;
    let fileName = '';
    let editableElementsData = [];

    // Carregar arquivo HTML
    fileInput.addEventListener('change', handleFileSelect);
    
    // Processar HTML colado
    processHtmlButton.addEventListener('click', handlePastedHtml);

    // Botões de ação
    copyCodeBtn.addEventListener('click', copyCodeToClipboard);
    downloadFileBtn.addEventListener('click', downloadUpdatedFile);

    // Configuração de busca
    searchButton.addEventListener('click', toggleSearchBox);
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('focus', () => {
        searchBox.classList.add('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!searchButton.contains(e.target) && 
            !searchBox.contains(e.target) &&
            !searchResults.contains(e.target)) {
            searchBox.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });

    /**
     * Manipula HTML colado no textarea
     */
    function handlePastedHtml() {
        const htmlContent = htmlTextarea.value.trim();
        
        if (!htmlContent) {
            showNotification('Por favor, cole um código HTML válido!', 'error');
            return;
        }
        
        // Limpar áreas
        previewArea.innerHTML = '';
        editableElements.innerHTML = '';
        
        // Definir nome de arquivo padrão para HTML colado
        fileName = 'codigo-editado.html';
        
        // Analisar HTML
        parseHTMLContent(htmlContent);
        
        // Mostrar containers
        editorContainer.style.display = 'flex';
        outputActions.style.display = 'flex';
    }

    /**
     * Manipula a seleção de arquivo
     */
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        fileName = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Limpar áreas
            previewArea.innerHTML = '';
            editableElements.innerHTML = '';
            
            // Analisar HTML
            const htmlContent = e.target.result;
            parseHTMLContent(htmlContent);
            
            // Mostrar containers
            editorContainer.style.display = 'flex';
            outputActions.style.display = 'flex';
        };
        
        reader.readAsText(file);
    }

    /**
     * Mostra uma notificação
     */
    function showNotification(message = 'Código copiado!', type = 'success') {
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, config.notificationDuration);
    }

    /**
     * Analisa o conteúdo HTML e extrai elementos editáveis
     */
    function parseHTMLContent(htmlContent) {
        // Criar um parser de HTML
        const parser = new DOMParser();
        originalDoc = parser.parseFromString(htmlContent, 'text/html');
        currentDoc = parser.parseFromString(htmlContent, 'text/html');
        
        // Renderizar previsão
        updatePreview();
        
        // Limpar dados de elementos editáveis
        editableElementsData = [];
        
        // Encontrar elementos de texto
        findAndDisplayTextElements(currentDoc, editableElements, updatePreview, editableElementsData);
        
        // Encontrar imagens
        findAndDisplayImageElements(currentDoc, editableElements, updatePreview, editableElementsData, handleImageReplace);

        // Encontrar vídeos
        findAndDisplayVideoElements(currentDoc, editableElements, updatePreview, editableElementsData, handleVideoReplace);
    }

    /**
     * Manipula a substituição de imagem
     */
    function handleImageReplace(file, selector, index) {
        if (!file) return;
        
        // Verificar tipo de arquivo
        if (!config.allowedImageTypes.includes(file.type)) {
            alert('Tipo de arquivo não suportado. Use JPG, PNG, GIF, WebP ou SVG.');
            return;
        }
        
        // Verificar tamanho
        if (file.size > config.maxImageSizeMB * 1024 * 1024) {
            alert(`Arquivo muito grande. O tamanho máximo é ${config.maxImageSizeMB}MB.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const elements = currentDoc.querySelectorAll(selector);
            if (elements[index]) {
                elements[index].setAttribute('src', e.target.result);
                updatePreview();
            }
        };
        
        reader.readAsDataURL(file);
    }

    /**
     * Manipula a substituição de vídeo
     */
    function handleVideoReplace(file, selector, index) {
        if (!file) return;
        
        // Verificar tipo de arquivo
        if (!config.allowedVideoTypes.includes(file.type)) {
            alert('Tipo de arquivo não suportado. Use MP4 ou WebM.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const elements = currentDoc.querySelectorAll(selector);
            if (elements[index]) {
                elements[index].setAttribute('src', e.target.result);
                updatePreview();
            }
        };
        
        reader.readAsDataURL(file);
    }

    /**
     * Atualiza a visualização do documento
     */
    function updatePreview() {
        previewArea.innerHTML = '';
        
        // Cria um iframe para visualização segura
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = 'none';
        
        previewArea.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(currentDoc.documentElement.outerHTML);
        iframeDoc.close();
    }

    /**
     * Copia o código HTML atualizado para a área de transferência
     */
    function copyCodeToClipboard() {
        const htmlOutput = currentDoc.documentElement.outerHTML;
        copyToClipboard(htmlOutput);
    }

    /**
     * Faz o download do arquivo HTML atualizado
     */
    function downloadUpdatedFile() {
        const htmlOutput = currentDoc.documentElement.outerHTML;
        
        const blob = new Blob([htmlOutput], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileName ? `editado_${fileName}` : 'editado.html';
        
        // Trigger click directly instead of appending to document
        downloadLink.click();
        
        // Release the URL
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showNotification('Arquivo baixado com sucesso!');
    }

    /**
     * Alterna a exibição da caixa de pesquisa
     */
    function toggleSearchBox() {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchResults.classList.remove('active');
        }
    }

    /**
     * Realiza a pesquisa nos elementos editáveis
     */
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        const results = editableElementsData.filter(item => {
            if (typeof item.content === 'string') {
                return item.content.toLowerCase().includes(query);
            }
            return false;
        });
        
        if (results.length > 0) {
            searchResults.innerHTML = '';
            searchResults.classList.add('active');
            
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                // Limitar o texto da prévia para 30 caracteres
                let contentPreview = result.content;
                if (contentPreview.length > 30) {
                    contentPreview = contentPreview.substring(0, 30) + '...';
                }
                
                resultItem.textContent = `${result.type}: ${contentPreview}`;
                
                resultItem.addEventListener('click', () => {
                    scrollToElement(result.id);
                    searchBox.classList.remove('active');
                    searchResults.classList.remove('active');
                });
                
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.innerHTML = '<div class="search-result-item">Nenhum resultado encontrado</div>';
            searchResults.classList.add('active');
        }
    }

    /**
     * Rola suavemente até o elemento encontrado
     */
    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            
            // Adiciona efeito de destaque
            element.classList.add('highlight');
            setTimeout(() => {
                element.classList.remove('highlight');
            }, 2000);
        }
    }
});