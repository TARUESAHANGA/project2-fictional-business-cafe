
class ProductCart {
    constructor() {
        // Use the existing CartManager instance or create a reference to it
        this.cartManager = window.cartManager;
        this.init();
    }

    init() {
        this.bindProductEvents();
        this.updateCartBadge();
    }

    bindProductEvents() {
        // Add to cart buttons on product cards
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .btn-add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productCard = e.target.closest('.product-card, .featured-card, .offer-card');
                if (productCard) {
                    const productData = this.extractProductData(productCard);
                    this.addProductToCart(productData);
                }
            });
        });

        // Also bind to any onclick addToCart calls in HTML
        window.addToCart = (id, name, price, image) => {
            this.addProductToCart({
                id: id,
                name: name,
                price: parseFloat(price),
                image: image || '',
                quantity: 0,
                category: 'products'
            });
        };
    }

    extractProductData(productCard) {
        let title, price, description, category, image;

        if (productCard.classList.contains('product-card') || productCard.classList.contains('featured-card')) {
            title = productCard.querySelector('.product-title, .featured-content h3')?.textContent.trim();
            price = productCard.querySelector('.product-price, .featured-price')?.textContent.trim();
            description = productCard.querySelector('.product-description, .featured-content p')?.textContent.trim();
            category = productCard.dataset.category || 'general';
            
            // Get icon as image placeholder
            const iconElement = productCard.querySelector('.product-image i, .featured-image i');
            if (iconElement) {
                const iconClass = iconElement.className;
                image = this.getProductImage(iconClass);
            }
        } else if (productCard.classList.contains('offer-card')) {
            title = productCard.querySelector('.offer-title')?.textContent.trim();
            price = productCard.querySelector('.offer-price')?.textContent.trim();
            description = productCard.querySelector('.offer-description')?.textContent.trim();
            category = 'special-offers';
            image = 'https://via.placeholder.com/150x150/8B4513/FFFFFF?text=Special+Offer';
        }

        // Generate a consistent ID
        const id = 'prod_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_');

        return {
            id: id,
            name: title,
            price: this.parsePrice(price),
            description: description || '',
            category: category,
            image: image || 'https://via.placeholder.com/150x150/D4A574/FFFFFF?text=Product',
            quantity: 1
        };
    }

    getProductImage(iconClass) {
        const iconMap = {
            'fas fa-coffee': 'https://via.placeholder.com/150x150/8B4513/FFFFFF?text=Coffee+Beans',
            'fas fa-croissant': 'https://via.placeholder.com/150x150/D2691E/FFFFFF?text=Pastries',
            'fas fa-mug-hot': 'https://via.placeholder.com/150x150/A0522D/FFFFFF?text=Mug',
            'fas fa-gift': 'https://via.placeholder.com/150x150/228B22/FFFFFF?text=Gift+Box',
            'fas fa-blender': 'https://via.placeholder.com/150x150/696969/FFFFFF?text=Coffee+Grinder',
            'fas fa-leaf': 'https://via.placeholder.com/150x150/32CD32/FFFFFF?text=Tea',
            'fas fa-star': 'https://via.placeholder.com/150x150/FFD700/FFFFFF?text=Featured',
            'fas fa-calendar': 'https://via.placeholder.com/150x150/FF6347/FFFFFF?text=Subscription'
        };

        // Check if any key exists in iconClass
        for (let [key, value] of Object.entries(iconMap)) {
            if (iconClass.includes(key)) return value;
        }
        
        return 'https://via.placeholder.com/150x150/D4A574/FFFFFF?text=Product';
    }

    parsePrice(priceString) {
        // Extract numeric value from price string (e.g., "£24.99" -> 24.99)
        if (!priceString) return 0;
        const match = priceString.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    addProductToCart(productData) {
        // Use the existing CartManager from cart.js
        if (this.cartManager) {
            this.cartManager.addItem(productData);
        } else if (window.cartManager) {
            window.cartManager.addItem(productData);
        } else {
            // Fallback: try to initialize or use localStorage directly
            console.warn('CartManager not found, initializing fallback...');
            this.fallbackAddToCart(productData);
        }
        
        this.updateCartBadge();
    }

    fallbackAddToCart(productData) {
        // Direct localStorage manipulation using cafeCart key
        let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        
        const existingItem = cart.find(item => item.id === productData.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(productData);
        }
        
        localStorage.setItem('cafeCart', JSON.stringify(cart));
        this.showAddToCartFeedback(productData.name);
    }

    updateCartBadge() {
        // Use CartManager's updateCartCount method if available
        if (this.cartManager && this.cartManager.updateCartCount) {
            this.cartManager.updateCartCount();
        } else if (window.cartManager && window.cartManager.updateCartCount) {
            window.cartManager.updateCartCount();
        } else {
            // Fallback: manual badge update
            const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            const cartIcons = document.querySelectorAll('.fa-shopping-cart');
            cartIcons.forEach(icon => {
                let badge = icon.parentElement.querySelector('.cart-badge');
                if (!badge && totalItems > 0) {
                    badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    icon.parentElement.style.position = 'relative';
                    icon.parentElement.appendChild(badge);
                }
                
                if (badge) {
                    badge.textContent = totalItems > 99 ? '99+' : totalItems;
                    badge.style.display = totalItems > 0 ? 'flex' : 'none';
                }
            });
        }
    }

    showAddToCartFeedback(productName) {
        // Use CartManager's notification if available
        if (this.cartManager && this.cartManager.showNotification) {
            this.cartManager.showNotification(`${productName} added to cart!`);
            return;
        }

        // Fallback notification
        const existing = document.querySelector('.cart-feedback');
        if (existing) existing.remove();

        const message = document.createElement('div');
        message.className = 'cart-feedback';
        message.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-check-circle"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment to ensure CartManager is loaded first
    setTimeout(() => {
        window.productCart = new ProductCart();
    }, 100);
});

// ============================================
// GLOBAL FUNCTIONS FOR INLINE HTML CALLS
// ============================================

// This function can be called directly from HTML onclick attributes
function addToCart(id, name, price, image) {
    const productData = {
        id: id,
        name: name,
        price: parseFloat(price),
        image: image || '',
        quantity: 1,
        category: 'products'
    };
    
    // Try to use ProductCart instance
    if (window.productCart) {
        window.productCart.addProductToCart(productData);
    } else if (window.cartManager) {
        window.cartManager.addItem(productData);
    } else {
        // Ultimate fallback
        let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(productData);
        }
        
        localStorage.setItem('cafeCart', JSON.stringify(cart));
        
        // Show simple notification
        alert(`${name} added to cart!`);
    }
    
    return false; // Prevent default link behavior
}

// Update badge on page load
function updateCartBadge() {
    if (window.cartManager && window.cartManager.updateCartCount) {
        window.cartManager.updateCartCount();
    } else {
        const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }
}

// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);