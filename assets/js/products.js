// Products page cart integration
class ProductCart {
    constructor() {
        this.cart = new ShoppingCart();
        this.init();
    }

    init() {
        this.updateCartBadge();
        this.bindProductEvents();
    }

    bindProductEvents() {
        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = e.target.closest('.product-card, .featured-card, .offer-card');
                const productData = this.extractProductData(productCard);
                this.addProductToCart(productData);
            });
        });
    }

    extractProductData(productCard) {
        let title, price, description, category, image;

        if (productCard.classList.contains('product-card') || productCard.classList.contains('featured-card')) {
            title = productCard.querySelector('.product-title, .featured-content h3').textContent.trim();
            price = productCard.querySelector('.product-price, .featured-price').textContent.trim();
            description = productCard.querySelector('.product-description, .featured-content p').textContent.trim();
            category = productCard.dataset.category || 'general';
            
            // Get icon as image placeholder
            const iconElement = productCard.querySelector('.product-image i, .featured-image i');
            if (iconElement) {
                const iconClass = iconElement.className;
                image = this.getProductImage(iconClass);
            }
        } else if (productCard.classList.contains('offer-card')) {
            title = productCard.querySelector('.offer-title').textContent.trim();
            price = productCard.querySelector('.offer-price').textContent.trim();
            description = productCard.querySelector('.offer-description').textContent.trim();
            category = 'special-offers';
            image = 'https://via.placeholder.com/150x150/8B4513/FFFFFF?text=Special+Offer';
        }

        return {
            id: this.generateProductId(title),
            name: title,
            price: this.parsePrice(price),
            description: description,
            category: category,
            image: image
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

        return iconMap[iconClass] || 'https://via.placeholder.com/150x150/D4A574/FFFFFF?text=Product';
    }

    generateProductId(name) {
        return 'product_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    }

    parsePrice(priceString) {
        // Extract numeric value from price string (e.g., "£24.99" -> 24.99)
        const match = priceString.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    addProductToCart(productData) {
        // Add to cart using the existing ShoppingCart class
        if (typeof cart !== 'undefined') {
            cart.addToCart(productData);
            this.updateCartBadge();
            this.showAddToCartFeedback(productData.name);
        } else {
            // Fallback: store in localStorage for cart page
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            const existingItem = cartItems.find(item => item.name === productData.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    ...productData,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            this.updateCartBadge();
            this.showAddToCartFeedback(productData.name);
        }
    }

    updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            let cartItems = [];
            
            if (typeof cart !== 'undefined') {
                cartItems = cart.cartItems;
            } else {
                cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            }
            
            const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    showAddToCartFeedback(productName) {
        // Create a temporary success message
        const message = document.createElement('div');
        message.className = 'cart-feedback';
        message.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-check-circle"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Add CSS for the feedback message
        if (!document.querySelector('#cart-feedback-styles')) {
            const styles = document.createElement('style');
            styles.id = 'cart-feedback-styles';
            styles.textContent = `
                .cart-feedback {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4caf50;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                }
                
                .feedback-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .cart-feedback i {
                    font-size: 1.2rem;
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
            `;
            document.head.appendChild(styles);
        }
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Initialize products cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make sure ShoppingCart is available
    if (typeof ShoppingCart === 'undefined') {
        // Fallback ShoppingCart implementation for products page
        window.ShoppingCart = class {
            constructor() {
                this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            }
            
            addToCart(item) {
                const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cartItems.push({
                        ...item,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
            }
        };
    }
    
    // Initialize products cart
    new ProductCart();
});

// Update the existing addToCart function calls in your HTML
function addToCart(name, price) {
    const productData = {
        id: 'product_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now(),
        name: name,
        price: parseFloat(price.replace('£', '')),
        description: 'Product from The Cafe',
        category: 'general',
        image: 'https://via.placeholder.com/150x150/D4A574/FFFFFF?text=Product'
    };
    
    // Add to cart using the ProductCart system
    if (window.productCart) {
        window.productCart.addProductToCart(productData);
    } else {
        // Fallback direct to localStorage
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItem = cartItems.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...productData,
                quantity: 1
            });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Show feedback
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        message.textContent = `${name} added to cart!`;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 3000);
    }
}

function addToCart(id, name, price) {
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item exists
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
        });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update badge
    updateCartBadge();
    
    // Show success message
    showNotification(`${name} added to cart!`);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);