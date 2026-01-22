// Menu Navigation Functionality
function showSection(sectionId) {
    // Hide all menu sections
    const allSections = document.querySelectorAll('.menu-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.menu-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked tab
    const clickedTab = event.target;
    clickedTab.classList.add('active');
    
    // Smooth scroll to top of content area
    const contentArea = document.querySelector('.menu-content-area');
    contentArea.scrollTop = 0;
}

// Initialize the menu system
document.addEventListener('DOMContentLoaded', function() {
    // Show the default section (coffee)
    showSection('#coffee');
    
    // Add keyboard navigation support
    const menuTabs = document.querySelectorAll('.menu-tab');
    menuTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', function(e) {
            let newIndex = index;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (index + 1) % menuTabs.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (index - 1 + menuTabs.length) % menuTabs.length;
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
                return;
            }
            
            if (newIndex !== index) {
                menuTabs[newIndex].focus();
            }
        });
    });
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const contentArea = document.querySelector('.menu-content-area');
    
    contentArea.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    contentArea.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const activeTab = document.querySelector('.menu-tab.active');
            const allTabs = Array.from(document.querySelectorAll('.menu-tab'));
            const currentIndex = allTabs.indexOf(activeTab);
            
            let newIndex;
            if (diff > 0) { // Swipe left - next section
                newIndex = (currentIndex + 1) % allTabs.length;
            } else { // Swipe right - previous section
                newIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
            }
            
            allTabs[newIndex].click();
        }
    }
});



// Add CSS for smooth transitions and better UX
const style = document.createElement('style');
style.textContent = `
    .menu-tab {
        position: relative;
        overflow: hidden;
    }
    
    .menu-tab:focus {
        outline: 2px solid var(--warm-orange);
        outline-offset: 2px;
    }
    
    .menu-tab:active {
        transform: translateY(0);
    }
    
    .menu-section {
        will-change: opacity, transform;
    }
    
    /* Loading state for sections */
    .menu-section.loading {
        opacity: 0.5;
        pointer-events: none;
    }
    
    /* Smooth transitions for mobile */
    @media (max-width: 768px) {
        .menu-content-area {
            scroll-behavior: smooth;
        }
    }
`;
document.head.appendChild(style);