// ===== Main JavaScript for The Cafe Website =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== Active Page Highlight =====
    function highlightActivePage() {
        const normalizePath = (path) => {
            if (!path) return '/';
            const withoutSlash = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
            return withoutSlash.toLowerCase();
        };

        const currentPath = normalizePath(window.location.pathname);
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref || linkHref.startsWith('#') || linkHref.startsWith('javascript:')) {
                return;
            }

            link.classList.remove('active');

            const resolvedUrl = new URL(linkHref, window.location.href);
            const linkPath = normalizePath(resolvedUrl.pathname);
            const isIndexMatch =
                (currentPath === '/' && linkPath.endsWith('/index.html')) ||
                (linkPath === '/' && currentPath.endsWith('/index.html'));

            if (linkPath === currentPath || isIndexMatch) {
                link.classList.add('active');
            }

            if (link.closest('.dropdown')) {
                const parentNavItem = link.closest('.nav-item');
                const parentLink = parentNavItem ? parentNavItem.querySelector('.nav-link:not(.dropdown-link)') : null;

                if (parentLink && (linkPath === currentPath || isIndexMatch)) {
                    parentLink.classList.add('active');
                }
            }
        });
    }

    highlightActivePage();

    // ===== Mobile Menu Toggle =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            setTimeout(highlightActivePage, 100);
        });
    });

    // ===== Direct Dropdown Navigation =====
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href) return;

            e.preventDefault();

            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }

            window.location.href = new URL(href, window.location.href).href;
        });
    });

    // ===== Dropdown Menu Toggle for Mobile =====
    navItems.forEach(item => {
        const hasDropdown = item.querySelector('.dropdown');
        const mainLink = item.querySelector('.nav-link:not(.dropdown-link)');
        const chevron = item.querySelector('.fa-chevron-down');
        
        if (hasDropdown && mainLink) {
            mainLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 920) {
                    e.preventDefault();
                    
                    const isActive = item.classList.contains('active');
                    
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    item.classList.toggle('active');
                    
                    if (!isActive) {
                        e.stopPropagation();
                    } else {
                        const href = mainLink.getAttribute('href');
                        if (href && href !== '#') {
                            window.location.href = href;
                        }
                    }
                }
            });
            
            if (chevron) {
                chevron.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (window.innerWidth <= 920) {
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                        
                        item.classList.toggle('active');
                    }
                });
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 920) {
            const isClickInsideNav = e.target.closest('.nav-menu');
            if (!isClickInsideNav) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
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
                
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ===== Active Navigation Link on Scroll =====
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const hashLinks = document.querySelectorAll('.nav-link[href*="#"]');
        if (sections.length === 0 || hashLinks.length === 0) {
            return;
        }

        const scrollPos = window.scrollY + 100;
        let matchedLink = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight && navLink) {
                matchedLink = navLink;
            }
        });

        if (matchedLink) {
            hashLinks.forEach(link => {
                link.classList.remove('active');
            });
            matchedLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveLink);

    // ===== Cart Functionality =====
    const cartIcon = document.querySelector('.fa-shopping-cart');

    if (cartIcon) {
        cartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentPath = window.location.pathname;
            const cartPath = currentPath.includes('/pages/') ? 'cart.html' : 'pages/cart.html';
            
            window.location.href = cartPath;
        });
    }

    // ===== Menu Navigation Integration =====
    const originalShowSection = window.showSection;
    if (originalShowSection) {
        window.showSection = function(sectionId) {
            originalShowSection(sectionId);
            
            const currentPath = window.location.pathname;
            const basePath = currentPath.split('#')[0];
            history.replaceState(null, null, basePath + sectionId);
            
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
            
            if (!selectedValue) return;
            
            this.style.opacity = '0.7';
            
            const currentPath = window.location.pathname;
            const isInPagesFolder = currentPath.includes('/pages/');
            const isMenuPage = currentPath.includes('menu.html');
            
            let finalUrl = selectedValue;
            
            // Handle path resolution based on current location
            if (isInPagesFolder) {
                // Currently in /pages/ folder
                if (selectedValue === 'index.html') {
                    finalUrl = '../index.html';
                }
                // menu.html#section stays as is since we're in pages folder
            } else {
                // Currently in root folder
                if (selectedValue.startsWith('menu.html')) {
                    finalUrl = 'pages/' + selectedValue;
                } else if (selectedValue !== 'index.html' && !selectedValue.startsWith('http')) {
                    finalUrl = 'pages/' + selectedValue;
                }
            }
            
            // Handle hash navigation for smooth scroll on current page
            if (selectedValue.includes('#')) {
                const [page, hash] = selectedValue.split('#');
                const targetId = hash;
                
                // If we're already on the menu page, just scroll to section
                if (isMenuPage || (isInPagesFolder && page === 'menu.html') || (!isInPagesFolder && page === 'pages/menu.html')) {
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        
                        // Update URL hash
                        history.pushState(null, null, '#' + targetId);
                        
                        // Reset select after animation
                        setTimeout(() => {
                            this.selectedIndex = 0;
                            this.style.opacity = '1';
                        }, 1000);
                        return;
                    }
                }
                
                // Navigate to page with hash
                window.location.href = finalUrl;
            } else {
                // Regular page navigation
                window.location.href = finalUrl;
            }
        });
        
        // Reset when returning via back button
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                quickNav.selectedIndex = 0;
                quickNav.style.opacity = '1';
            }
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
            
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
        
        highlightActivePage();
    }

    window.addEventListener('resize', handleResize);

    // ===== Handle Browser Navigation =====
    window.addEventListener('popstate', function() {
        highlightActivePage();
        
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

    // ===== Initialize =====
    if (window.location.hash && window.showSection) {
        window.showSection(window.location.hash);
    }

    updateActiveLink();
    highlightActivePage();
});

// ===== Inject Additional Styles =====
const additionalStyles = `
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

    .dropdown-link.active {
        color: var(--accent-color);
        background: rgba(255, 107, 53, 0.1);
    }

    .menu-tab.active {
        background: var(--primary-brown) !important;
        color: caramel !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
