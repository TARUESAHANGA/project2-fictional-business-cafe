// ===== Main JavaScript for The Cafe Website =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== Active Page Highlight  =====
    function highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const currentFolder = currentPath.includes('/pages/') ? 'pages' : 'root';
        
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Normalize paths for comparison
            let normalizedLinkHref = linkHref;
            let normalizedCurrentPage = currentPage;
            
            if (currentFolder === 'pages') {
                if (linkHref === '../index.html') {
                    normalizedLinkHref = 'index.html';
                } else {
                    normalizedLinkHref = linkHref.startsWith('../') ? linkHref.substring(3) : linkHref;
                }
            } else {
                if (linkHref.startsWith('pages/')) {
                    normalizedLinkHref = linkHref.substring(6);
                }
            }
            
            if (normalizedLinkHref === normalizedCurrentPage || 
                (normalizedCurrentPage === 'index.html' && normalizedLinkHref === '/') ||
                (normalizedCurrentPage === '' && normalizedLinkHref === 'index.html')) {
                link.classList.add('active');
            }
            
            // Special handling for dropdown items
            if (link.closest('.dropdown')) {
                const parentNavItem = link.closest('.nav-item');
                const parentLink = parentNavItem.querySelector('.nav-link:not(.dropdown-link)');
                
                if (parentLink && normalizedLinkHref === normalizedCurrentPage) {
                    parentLink.classList.add('active');
                }
            }
        });
    }

    // Call on load
    highlightActivePage();

    // ===== Mobile Menu Toggle =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Add overlay effect
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Update active highlight after navigation
            setTimeout(highlightActivePage, 100);
        });
    });

    // ===== Dropdown Menu Toggle for Mobile =====
    navItems.forEach(item => {
        const chevron = item.querySelector('.fa-chevron-down');
        const dropdown = item.querySelector('.dropdown');
        
        if (chevron && dropdown) {
            // Click event for chevron on mobile
            chevron.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Only toggle on mobile (when hamburger menu is visible)
                if (window.innerWidth <= 920) {
                    item.classList.toggle('active');
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                }
            });
        }
    });

    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ===== Active Navigation Link on Scroll =====
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
             const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ===== Cart Functionality =====
    const cartIcon = document.querySelector('.fa-shopping-cart');
    let cartCount = 0;

    if (cartIcon) {
        cartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determine correct cart page path based on current location
            const currentPath = window.location.pathname;
            const cartPath = currentPath.includes('/pages/') ? 'cart.html' : 'pages/cart.html';
            
            // Redirect to cart page instead of showing notification
            window.location.href = cartPath;
        });
    }

    // ===== Menu Navigation Integration =====
    // Update active page highlight when showing menu sections
    const originalShowSection = window.showSection;
    if (originalShowSection) {
        window.showSection = function(sectionId) {
            originalShowSection(sectionId);
            
            // Update URL hash without jumping
            const currentPath = window.location.pathname;
            const basePath = currentPath.split('#')[0];
            history.replaceState(null, null, basePath + sectionId);
            
            // Update active states for menu navigation
            const menuTabs = document.querySelectorAll('.menu-tab');
            menuTabs.forEach(tab => {
                if (tab.getAttribute('onclick').includes(sectionId)) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        };
    }

    // ===== Mobile Quick Menu =====
    const quickNav = document.getElementById('quick-nav');
    
    if (quickNav) {
        quickNav.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue) {
                this.style.opacity = '0.7';
                
                // Determine correct path based on current location
                const currentPath = window.location.pathname;
                const isInPagesFolder = currentPath.includes('/pages/');
                
                let finalUrl = selectedValue;
                
                if (isInPagesFolder) {
                    if (selectedValue === 'index.html') {
                        finalUrl = '../index.html';
                    } else if (!selectedValue.startsWith('../') && !selectedValue.includes('#')) {
                        finalUrl = selectedValue;
                    }
                } else {
                    if (selectedValue !== 'index.html' && !selectedValue.includes('#') && !selectedValue.startsWith('http')) {
                        finalUrl = 'pages/' + selectedValue;
                    }
                }
                
                // Smooth scroll 
                if (selectedValue.includes('#')) {
                    const targetId = selectedValue.split('#')[1];
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        // Reset select after a moment
                        setTimeout(() => {
                            this.selectedIndex = 0;
                            this.style.opacity = '1';
                        }, 1000);
                    } else {
                        window.location.href = finalUrl;
                    }
                } else {
                    window.location.href = finalUrl;
                }
            }
        });
        
        // Reset to placeholder when user returns using back button
        window.addEventListener('pageshow', function() {
            quickNav.selectedIndex = 0;
            quickNav.style.opacity = '1';
        });
    }

    // ===== Window Resize Handler =====
    function handleResize() {
        if (window.innerWidth > 920) {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset dropdowns
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Re-highlight active page on resize
        highlightActivePage();
    }

    window.addEventListener('resize', handleResize);

    // ===== Handle Browser Navigation =====
    window.addEventListener('popstate', function() {
        highlightActivePage();
        
        // Handle menu section navigation
        const hash = window.location.hash;
        if (hash && window.showSection) {
            window.showSection(hash);
        }
    });

    // ===== Loading Animation =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        highlightActivePage();
    });

    // ===== Utility Functions =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== Initialize =====
    updateActiveLink();
    highlightActivePage();
});

// ===== Additional CSS for Active Page Highlighting =====
const additionalStyles = `
    .search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    }

    .search-modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        position: relative;
    }

    .close-search {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }

    .search-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        margin: 1rem 0;
    }

    .search-result-item {
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    }

    .search-result-item:hover {
        background-color: #f5f5f5;
    }

    .cart-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1500;
        animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .cart-notification a {
        color: #FF6B35;
        font-weight: bold;
    }

    body.loaded {
        animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Active page highlight styles */
    .nav-link.active {
        color: var(--accent-color) !important;
        font-weight: 600;
        position: relative;
    }

    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-color);
        border-radius: 2px;
    }

    .nav-item.active .nav-link {
        color: var(--accent-color) !important;
    }

    /* Mobile active page styles */
    @media (max-width: 920px) {
        .nav-link.active {
            background: rgba(255, 107, 53, 0.1);
            border-radius: 5px;
            padding: 0.5rem 1rem;
        }
        
        .nav-link.active::after {
            display: none;
        }
    }

    /* Dropdown active state */
    .dropdown-link.active {
        color: var(--accent-color);
        background: rgba(255, 107, 53, 0.1);
    }

    /* Menu tab active state (for menu page) */
    .menu-tab.active {
        background: var(--primary-brown) !important;
        color: cara !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);