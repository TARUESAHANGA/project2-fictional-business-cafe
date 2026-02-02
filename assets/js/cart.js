/**
 * Cart JavaScript - The Cafe Website
 * Handles shopping cart functionality, localStorage management
 */

// ============================================
// CART STATE MANAGEMENT
// ============================================

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.deliveryFee = 2.99;
        this.taxRate = 0.10;
        this.init();
    }

    init() {
        this.updateCartUI();
        this.attachEventListeners();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('cafeCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('cafeCart', JSON.stringify(this.cart));
            this.updateCartCount();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.cart.push({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price),
                quantity: item.quantity || 1,
                category: item.category || 'general'
            });
        }
        
        this.saveCart();
        this.showNotification(`${item.name} added to cart!`);
        
        if (document.getElementById('cartItems')) {
            this.updateCartUI();
        }
    }

    // Remove item from cart
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = parseInt(newQuantity);
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.showNotification('Cart cleared successfully');
        }
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        const tax = subtotal * this.taxRate;
        const total = subtotal + this.deliveryFee + tax;
        
        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // Update cart count badge in navigation
    updateCartCount() {
        const cartIcons = document.querySelectorAll('.fa-shopping-cart');
        const totals = this.calculateTotals();
        const count = totals.itemCount;
        
        cartIcons.forEach(icon => {
            const existingBadge = icon.parentElement.querySelector('.cart-badge');
            if (existingBadge) existingBadge.remove();
            
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                `;
                icon.parentElement.style.position = 'relative';
                icon.parentElement.appendChild(badge);
            }
        });
    }

    // Update cart page UI
    updateCartUI() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious items from our menu!</p>
                    <a href="menu.html" class="btn-primary">Browse Menu</a>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (cartSummary) cartSummary.style.display = 'block';
        
        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">£${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-action="decrease" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-action="increase" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    £${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="cart-item-remove" data-action="remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateSummary();
        this.attachItemEventListeners();
    }

    // Update order summary
    updateSummary() {
        const totals = this.calculateTotals();
        
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        
        if (subtotalEl) subtotalEl.textContent = `£${totals.subtotal}`;
        if (taxEl) taxEl.textContent = `£${totals.tax}`;
        if (totalEl) totalEl.textContent = `£${totals.total}`;
    }

    // Attach event listeners
    attachEventListeners() {
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearCart());

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }

    // Attach listeners to cart items
    attachItemEventListeners() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        cartItemsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const itemId = button.dataset.id;
            const currentItem = this.cart.find(item => item.id === itemId);

            switch(action) {
                case 'increase':
                    this.updateQuantity(itemId, (currentItem?.quantity || 0) + 1);
                    break;
                case 'decrease':
                    this.updateQuantity(itemId, (currentItem?.quantity || 0) - 1);
                    break;
                case 'remove':
                    this.removeItem(itemId);
                    break;
            }
        });
    }

    // Show notification
    showNotification(message, type = 'success') {
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
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

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Checkout process
    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        sessionStorage.setItem('checkoutCart', JSON.stringify({
            items: this.cart,
            totals: this.calculateTotals()
        }));

        alert(`Proceeding to checkout...\n\nTotal: £${this.calculateTotals().total}\n\n(Checkout page coming soon!)`);
    }
}

// ============================================
// UTILITY FUNCTIONS FOR MENU/PRODUCTS PAGES
// ============================================

// Function to create "Add to Cart" buttons
function createAddToCartButton(itemData) {
    const button = document.createElement('button');
    button.className = 'btn-add-to-cart';
    button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
    button.dataset.item = JSON.stringify(itemData);
    
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const item = JSON.parse(button.dataset.item);
        window.cartManager.addItem(item);
    });
    
    return button;
}

// Quick add function
function addToCart(itemId, itemName, itemPrice, itemImage) {
    window.cartManager.addItem({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImage,
        quantity: 1
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Sync cart across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'cafeCart' && window.cartManager) {
        window.cartManager.cart = window.cartManager.loadCart();
        window.cartManager.updateCartUI();
        window.cartManager.updateCartCount();
    }
});