/**
 * Utility functions for filtering editable elements
 */

/**
 * Applies filters to the editable elements
 * @param {Array} elementsData - Array of editable element data
 * @param {Object} activeFilters - Object containing active filters
 * @returns {Array} - Filtered elements data
 */
export function applyFilters(elementsData, activeFilters) {
    // If 'all' filter is active, return all elements in original order
    if (activeFilters.all) {
        return elementsData;
    }
    
    return elementsData.filter(item => {
        // If no filters are active, show all elements
        if (Object.values(activeFilters).every(filter => !filter)) {
            return true;
        }

        // Filter by type
        if (activeFilters.text && item.type === 'text') return true;
        if (activeFilters.media && (item.type === 'image' || item.type === 'video')) return true;
        
        // Filter by selector (section)
        if (activeFilters.sections) {
            const sectionSelectors = ['div', 'section', 'article', 'aside', 'main', 'header', 'footer'];
            if (sectionSelectors.includes(item.selector)) return true;
        }
        
        // Filter by page (if the element has a page attribute)
        if (activeFilters.pages && item.page) return true;
        
        return false;
    });
}

/**
 * Updates element visibility based on filters
 * @param {Array} elementsData - Array of editable element data
 * @param {Object} activeFilters - Object containing active filters
 */
export function updateElementsVisibility(elementsData, activeFilters) {
    const filteredElements = applyFilters(elementsData, activeFilters);
    const filteredIds = filteredElements.map(item => item.id);
    
    // Hide/show elements based on filter
    elementsData.forEach(item => {
        const element = item.element;
        if (filteredIds.includes(item.id)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Show count of visible elements
    const visibleCount = document.getElementById('visible-elements-count');
    if (visibleCount) {
        visibleCount.textContent = `${filteredElements.length} de ${elementsData.length} elementos`;
    }
}