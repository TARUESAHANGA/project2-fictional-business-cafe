// Cart functionality
class ShoppingCart {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartCount();
        this.bindEvents();
    }

    bindEvents() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }
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
        
        this.saveCart();
        this.updateCartCount();
        this.showSuccessMessage(`${item.name} added to cart!`);
    }

    removeFromCart(id) {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }

    updateQuantity(id, quantity) {
        const item = this.cartItems.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity));
            this.saveCart();
            this.renderCart();
        }
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cartItems = [];
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    calculateTotals() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 2.99;
        const tax = subtotal * 0.10;
        const total = subtotal + deliveryFee + tax;
        
        return { subtotal, deliveryFee, tax, total };
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartItemsContainer) return;

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious items from our menu!</p>
                    <a href="menu.html" class="btn-primary">Browse Menu</a>
                </div>
            `;
            cartSummary.style.display = 'none';
            return;
        }

        cartSummary.style.display = 'block';
        
        cartItemsContainer.innerHTML = this.cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                </div>
                <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="cart.updateQuantity('${item.id}', this.value)" min="1">
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="cart.removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        const { subtotal, deliveryFee, tax, total } = this.calculateTotals();
        
        document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
        document.getElementById('deliveryFee').textContent = `£${deliveryFee.toFixed(2)}`;
        document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `£${total.toFixed(2)}`;
    }

    checkout() {
        if (this.cartItems.length === 0) return;
        
        // Simulate checkout process
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        checkoutBtn.disabled = true;
        
        setTimeout(() => {
            alert('Order placed successfully! Thank you for your purchase.');
            this.clearCart();
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to Checkout';
            checkoutBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage(message) {
        // Create and show success message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        
        const cartItems = document.getElementById('cartItems');
        cartItems.insertBefore(messageDiv, cartItems.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Function to add items to cart (can be called from other pages)
function addToCart(item) {
    cart.addToCart(item);
}

// Function to get cart items (useful for other pages)
function getCartItems() {
    return cart.cartItems;
}