import { applyFilters, updateElementsVisibility } from './filter-utils.js';

/**
 * Initializes the filtering functionality
 * @param {Array} editableElementsData - Array of editable elements data
 */
export function initializeFilters(editableElementsData) {
    const editSection = document.getElementById('edit-section');
    
    // Create filter container
    if (!document.getElementById('filter-container')) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.id = 'filter-container';
        
        filterContainer.innerHTML = `
            <div class="filter-title">
                <span>Filtrar elementos</span>
                <span id="visible-elements-count">${editableElementsData.length} de ${editableElementsData.length} elementos</span>
            </div>
            <div class="filter-options">
                <div class="filter-option active" data-filter="all">Todos</div>
                <div class="filter-option" data-filter="text">Textos</div>
                <div class="filter-option" data-filter="media">Mídias</div>
                <div class="filter-option" data-filter="sections">Seções</div>
                <div class="filter-option" data-filter="pages">Páginas</div>
            </div>
        `;
        
        // Insert filter container before editable elements
        const editableElements = document.getElementById('editable-elements');
        editSection.insertBefore(filterContainer, editableElements);
        
        // Set up filter state with 'all' active by default
        const activeFilters = {
            all: true,
            text: false,
            media: false,
            sections: false,
            pages: false
        };
        
        // Add event listeners to filter options
        const filterOptions = filterContainer.querySelectorAll('.filter-option');
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                const filterType = option.getAttribute('data-filter');
                
                // If clicking 'all', deactivate other filters
                if (filterType === 'all') {
                    filterOptions.forEach(opt => {
                        if (opt.getAttribute('data-filter') !== 'all') {
                            opt.classList.remove('active');
                            activeFilters[opt.getAttribute('data-filter')] = false;
                        }
                    });
                    activeFilters.all = true;
                    option.classList.add('active');
                } else {
                    // If clicking another filter, deactivate 'all'
                    const allOption = filterContainer.querySelector('.filter-option[data-filter="all"]');
                    allOption.classList.remove('active');
                    activeFilters.all = false;
                    
                    // Toggle current filter
                    activeFilters[filterType] = !activeFilters[filterType];
                    option.classList.toggle('active');
                    
                    // If no filters active, activate 'all' again
                    if (Object.values(activeFilters).every(val => val === false)) {
                        allOption.classList.add('active');
                        activeFilters.all = true;
                    }
                }
                
                // Update elements visibility
                updateElementsVisibility(editableElementsData, activeFilters);
            });
        });
        
        // Initially show all elements
        updateElementsVisibility(editableElementsData, activeFilters);
    }
}