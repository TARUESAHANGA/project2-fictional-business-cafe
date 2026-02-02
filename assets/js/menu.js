// ===== Menu Page Specific JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Section Navigation =====
    window.showSection = function(sectionId) {
        // Remove active class from all sections
        document.querySelectorAll('.menu-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to target section
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update active tab
        const activeTab = document.querySelector(`.menu-tab[onclick="showSection('${sectionId}')"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Update URL hash without jumping
        const currentPath = window.location.pathname;
        history.replaceState(null, null, currentPath + sectionId);
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // ===== Handle URL Hash on Page Load =====
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            // Small delay to ensure DOM is fully loaded
            setTimeout(() => {
                showSection(hash);
            }, 100);
        } else {
            // Default to coffee section
            showSection('#coffee');
        }
    }

    // ===== Search Functionality =====
    const searchInput = document.getElementById('menu-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Reset view - show current active section
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.style.display = 'flex';
                });
                document.querySelectorAll('.menu-category').forEach(cat => {
                    cat.style.display = 'block';
                });
                return;
            }
            
            // Search across all sections
            let hasResults = false;
            const allItems = document.querySelectorAll('.menu-item');
            
            allItems.forEach(item => {
                const itemName = item.querySelector('.item-name')?.textContent.toLowerCase() || '';
                const itemDesc = item.querySelector('.item-description')?.textContent.toLowerCase() || '';
                const itemTags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                
                if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm) || itemTags.includes(searchTerm)) {
                    item.style.display = 'flex';
                    item.closest('.menu-section')?.classList.add('active');
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide categories based on visible items
            document.querySelectorAll('.menu-category').forEach(category => {
                const visibleItems = category.querySelectorAll('.menu-item[style="display: flex;"], .menu-item:not([style*="display: none"])');
                category.style.display = visibleItems.length > 0 ? 'block' : 'none';
            });
            
            // Show all sections when searching
            if (searchTerm !== '') {
                document.querySelectorAll('.menu-section').forEach(section => {
                    section.classList.add('active');
                });
            }
        });
        
        // Clear search on escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                this.dispatchEvent(new Event('input'));
                this.blur();
            }
        });
    }

    // ===== Mobile Quick Menu =====
    const quickNav = document.getElementById('quick-nav');
    
    if (quickNav) {
        // Override the inline onchange to use our smooth function
        quickNav.removeAttribute('onchange');
        
        quickNav.addEventListener('change', function() {
            const selectedValue = this.value;
            if (!selectedValue) return;
            
            this.style.opacity = '0.7';
            
            if (selectedValue.includes('#')) {
                const sectionId = selectedValue.substring(selectedValue.indexOf('#'));
                showSection(sectionId);
                
                // Reset select after animation
                setTimeout(() => {
                    this.selectedIndex = 0;
                    this.style.opacity = '1';
                }, 1000);
            } else {
                window.location.href = selectedValue;
            }
        });
        
        // Reset on page show (back button)
        window.addEventListener('pageshow', function() {
            if (quickNav) {
                quickNav.selectedIndex = 0;
                quickNav.style.opacity = '1';
            }
        });
    }

    // ===== Add to Cart Buttons (if not handled by menu-cart.js) =====
    function initializeAddToCart() {
        document.querySelectorAll('.menu-item').forEach(item => {
            // Check if button already exists
            if (!item.querySelector('.add-to-cart-btn')) {
                const priceDiv = item.querySelector('.item-price');
                if (priceDiv) {
                    const addBtn = document.createElement('button');
                    addBtn.className = 'add-to-cart-btn';
                    addBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
                    addBtn.setAttribute('aria-label', 'Add to cart');
                    
                    // Get item details
                    const itemName = item.querySelector('.item-name')?.textContent || 'Item';
                    const itemPrice = priceDiv.textContent.replace('£', '').trim();
                    
                    addBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        // Dispatch custom event for cart.js to handle
                        const addToCartEvent = new CustomEvent('addToCart', {
                            detail: {
                                name: itemName,
                                price: parseFloat(itemPrice),
                                quantity: 1
                            }
                        });
                        document.dispatchEvent(addToCartEvent);
                        
                        // Visual feedback
                        this.innerHTML = '<i class="fas fa-check"></i> Added';
                        this.style.background = '#28a745';
                        
                        setTimeout(() => {
                            this.innerHTML = '<i class="fas fa-plus"></i> Add';
                            this.style.background = '';
                        }, 1500);
                    });
                    
                    // Insert button after price
                    priceDiv.parentNode.insertBefore(addBtn, priceDiv.nextSibling);
                }
            }
        });
    }

    // ===== Intersection Observer for Scroll Spy =====
    function initializeScrollSpy() {
        const sections = document.querySelectorAll('.menu-section');
        const tabs = document.querySelectorAll('.menu-tab');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Update tabs
                    tabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('onclick')?.includes(`#${id}`)) {
                            tab.classList.add('active');
                        }
                    });
                    
                    // Update URL
                    history.replaceState(null, null, `#${id}`);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }

    // ===== Initialize =====
    handleInitialHash();
    initializeAddToCart();
    initializeScrollSpy();
    
    // Re-initialize add to cart buttons after any dynamic content changes
    window.addEventListener('cartUpdated', initializeAddToCart);
});