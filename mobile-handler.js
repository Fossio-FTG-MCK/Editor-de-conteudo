/**
 * This file handles mobile-specific functionality, particularly
 * the collapsible input section for the HTML editor.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        const inputSectionContainer = document.getElementById('input-section-container');
        const dragHandle = document.getElementById('input-section-drag-handle');
        const fileInput = document.getElementById('html-file');
        const processHtmlButton = document.getElementById('process-html');
        
        let startY = 0;
        let startHeight = 0;
        let isDragging = false;
        
        // Collapse input section when file is selected or HTML is processed
        fileInput.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                collapseInputSection();
            }
        });
        
        processHtmlButton.addEventListener('click', () => {
            const htmlContent = document.getElementById('html-input').value.trim();
            if (htmlContent) {
                collapseInputSection();
            }
        });
        
        // Make the handle draggable
        dragHandle.addEventListener('mousedown', initDrag);
        dragHandle.addEventListener('touchstart', initDrag);
        
        function initDrag(e) {
            e.preventDefault();
            
            // Handle touch events
            if (e.type === 'touchstart') {
                startY = e.touches[0].clientY;
            } else {
                startY = e.clientY;
            }
            
            startHeight = parseInt(document.defaultView.getComputedStyle(inputSectionContainer).height, 10);
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('touchmove', doDrag, { passive: false });
            
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            
            isDragging = true;
            document.body.style.userSelect = 'none';
        }
        
        function doDrag(e) {
            if (!isDragging) return;
            
            // Prevent default scrolling when dragging
            if (e.type === 'touchmove') {
                e.preventDefault();
            }
            
            let currentY;
            if (e.type === 'touchmove') {
                currentY = e.touches[0].clientY;
            } else {
                currentY = e.clientY;
            }
            
            // Calculate new height (dragging down increases height)
            const deltaY = startY - currentY;
            const newHeight = startHeight + deltaY;
            
            // Set minimum and maximum height
            if (newHeight > 50 && newHeight < window.innerHeight * 0.8) {
                inputSectionContainer.style.height = `${newHeight}px`;
                
                // Toggle collapsed class based on height
                if (newHeight < 100) {
                    inputSectionContainer.classList.add('collapsed');
                } else {
                    inputSectionContainer.classList.remove('collapsed');
                }
            }
        }
        
        function stopDrag() {
            isDragging = false;
            document.body.style.userSelect = '';
            
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('touchmove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
        
        // Double tap to expand/collapse
        dragHandle.addEventListener('dblclick', toggleInputSection);
        
        function toggleInputSection() {
            inputSectionContainer.classList.toggle('collapsed');
            if (!inputSectionContainer.classList.contains('collapsed')) {
                inputSectionContainer.style.height = 'auto';
            }
        }
        
        function collapseInputSection() {
            inputSectionContainer.classList.add('collapsed');
        }
    }
});