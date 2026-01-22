// Menu Cart Integration
class MenuCart {
    constructor() {
        this.cart = new ShoppingCart();
        this.init();
    }

    init() {
        this.updateCartBadge();
        this.bindMenuEvents();
        this.addAddToCartButtons();
    }

    bindMenuEvents() {
        // Make menu items clickable for adding to cart
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons or inputs
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                
                this.showQuickAddModal(item);
            });
        });
    }

    addAddToCartButtons() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            // Don't add button if it already exists
            if (item.querySelector('.add-to-cart-btn')) return;

            const button = document.createElement('button');
            button.className = 'add-to-cart-btn';
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            button.onclick = (e) => {
                e.stopPropagation();
                this.showQuickAddModal(item);
            };
            
            // Add button to item-info div
            const itemInfo = item.querySelector('.item-info');
            if (itemInfo) {
                itemInfo.appendChild(button);
            }
        });
    }

    showQuickAddModal(menuItem) {
        const itemName = menuItem.querySelector('.item-name').textContent.trim();
        const itemPrice = menuItem.querySelector('.item-price').textContent.trim();
        const itemDescription = menuItem.querySelector('.item-description').textContent.trim();
        
        // Remove existing modal if present
        const existingModal = document.querySelector('.quick-add-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'quick-add-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${itemName}</h3>
                    <button class="close-modal" onclick="this.closest('.quick-add-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="item-description">${itemDescription}</p>
                    <div class="price-display">${itemPrice}</div>
                    
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button type="button" class="qty-btn minus" onclick="updateQuantity(this, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="1" min="1" max="10">
                            <button type="button" class="qty-btn plus" onclick="updateQuantity(this, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="customization-options">
                        <h4>Customizations</h4>
                        <div class="option-group">
                            <label class="option-label">
                                <input type="checkbox" name="extra-hot" value="Extra Hot">
                                <span>Extra Hot (+£0.50)</span>
                            </label>
                            <label class="option-label">
                                <input type="checkbox" name="decaf" value="Decaf">
                                <span>Decaf (Free)</span>
                            </label>
                            <label class="option-label">
                                <input type="checkbox" name="extra-shot" value="Extra Shot">
                                <span>Extra Shot (+£1.00)</span>
                            </label>
                        </div>
                    </div>

                    <div class="special-instructions">
                        <label>Special Instructions:</label>
                        <textarea placeholder="Any special requests?" rows="2"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="this.closest('.quick-add-modal').remove()">
                        Cancel
                    </button>
                    <button class="btn-add-to-cart" onclick="menuCart.addItemToCartFromModal(this)">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add modal styles if not already present
        if (!document.querySelector('#menu-cart-styles')) {
            this.addMenuCartStyles();
        }
    }

    addItemToCartFromModal(button) {
        const modal = button.closest('.quick-add-modal');
        const itemName = modal.querySelector('.modal-header h3').textContent.trim();
        const itemPrice = modal.querySelector('.price-display').textContent.trim();
        const quantity = parseInt(modal.querySelector('.quantity-input').value);
        const description = modal.querySelector('.item-description').textContent.trim();
        
        // Get customizations
        const customizations = [];
        const checkedOptions = modal.querySelectorAll('input[type="checkbox"]:checked');
        let extraPrice = 0;
        
        checkedOptions.forEach(option => {
            customizations.push(option.value);
            if (option.value.includes('Extra Shot')) extraPrice += 1.00;
            if (option.value.includes('Extra Hot')) extraPrice += 0.50;
        });

        // Get special instructions
        const specialInstructions = modal.querySelector('textarea').value.trim();

        // Calculate final price
        const basePrice = this.parsePrice(itemPrice);
        const finalPrice = basePrice + extraPrice;

        // Create cart item
        const cartItem = {
            id: 'menu_item_' + itemName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now(),
            name: itemName,
            price: finalPrice,
            quantity: quantity,
            description: description,
            category: 'menu',
            image: this.getMenuItemImage(itemName),
            customizations: customizations,
            specialInstructions: specialInstructions
        };

        // Add to cart
        if (typeof cart !== 'undefined') {
            // Add multiple items if quantity > 1
            for (let i = 0; i < quantity; i++) {
                cart.addToCart(cartItem);
            }
        } else {
            // Fallback to localStorage
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = cartItems.find(item => 
                item.name === itemName && 
                JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
                item.specialInstructions === specialInstructions
            );
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push(cartItem);
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }

        // Update cart badge
        this.updateCartBadge();

        // Show success message
        this.showSuccessMessage(`${itemName} (${quantity}x) added to cart!`);

        // Close modal
        modal.remove();
    }

    getMenuItemImage(itemName) {
        const imageMap = {
            'espresso': 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=Espresso',
            'americano': 'https://via.placeholder.com/80x80/A0522D/FFFFFF?text=Americano',
            'cappuccino': 'https://via.placeholder.com/80x80/D2691E/FFFFFF?text=Cappuccino',
            'café latte': 'https://via.placeholder.com/80x80/BC9A6A/FFFFFF?text=Latte',
            'mocha': 'https://via.placeholder.com/80x80/654321/FFFFFF?text=Mocha',
            'caramel macchiato': 'https://via.placeholder.com/80x80/8B7355/FFFFFF?text=Macchiato',
            'croissant': 'https://via.placeholder.com/80x80/DEB887/FFFFFF?text=Croissant',
            'muffin': 'https://via.placeholder.com/80x80/F4A460/FFFFFF?text=Muffin',
            'pancakes': 'https://via.placeholder.com/80x80/FFE4B5/FFFFFF?text=Pancakes',
            'sandwich': 'https://via.placeholder.com/80x80/F5DEB3/FFFFFF?text=Sandwich',
            'salad': 'https://via.placeholder.com/80x90/90EE90/FFFFFF?text=Salad',
            'cake': 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=Cake'
        };

        // Find matching image based on item name
        for (const [key, image] of Object.entries(imageMap)) {
            if (itemName.toLowerCase().includes(key)) {
                return image;
            }
        }

        return 'https://via.placeholder.com/80x80/D4A574/FFFFFF?text=Food';
    }

    parsePrice(priceString) {
        const match = priceString.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        if (!cartBadge) {
            // Create cart badge if it doesn't exist
            const cartLink = document.querySelector('a[href="#cart"], a[href="cart.html"]');
            if (cartLink) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartLink.appendChild(badge);
                this.updateCartBadge();
                return;
            }
        }

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

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'cart-success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }

    addMenuCartStyles() {
        const styles = document.createElement('style');
        styles.id = 'menu-cart-styles';
        styles.textContent = `
            /* Quick Add Modal Styles */
            .quick-add-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 1;
            }

            .modal-content {
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                z-index: 2;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #f0f0f0;
            }

            .modal-header h3 {
                color: #2c1810;
                font-size: 1.5rem;
                margin: 0;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .close-modal:hover {
                background: #f5f5f5;
                color: #333;
            }

            .item-description {
                color: #666;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .price-display {
                font-size: 1.8rem;
                font-weight: bold;
                color: #d4a574;
                margin-bottom: 1.5rem;
            }

            .quantity-selector {
                margin-bottom: 1.5rem;
            }

            .quantity-selector label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: bold;
                color: #2c1810;
            }

            .quantity-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .qty-btn {
                width: 40px;
                height: 40px;
                border: none;
                background: #d4a574;
                color: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .qty-btn:hover {
                background: #b8935f;
                transform: scale(1.1);
            }

            .qty-btn:active {
                transform: scale(0.95);
            }

            .quantity-input {
                width: 60px;
                text-align: center;
                border: 2px solid #ddd;
                border-radius: 8px;
                padding: 0.5rem;
                font-size: 1.1rem;
                font-weight: bold;
            }

            .customization-options {
                margin-bottom: 1.5rem;
            }

            .customization-options h4 {
                color: #2c1810;
                margin-bottom: 1rem;
            }

            .option-group {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }

            .option-label {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: background 0.3s ease;
            }

            .option-label:hover {
                background: #f8f8f8;
            }

            .option-label input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #d4a574;
            }

            .special-instructions {
                margin-bottom: 1.5rem;
            }

            .special-instructions label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: bold;
                color: #2c1810;
            }

            .special-instructions textarea {
                width: 100%;
                padding: 0.8rem;
                border: 2px solid #ddd;
                border-radius: 8px;
                resize: vertical;
                font-family: inherit;
                font-size: 1rem;
            }

            .special-instructions textarea:focus {
                outline: none;
                border-color: #d4a574;
            }

            .modal-footer {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                padding-top: 1.5rem;
                border-top: 2px solid #f0f0f0;
            }

            .btn-cancel, .btn-add-to-cart {
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            }

            .btn-cancel {
                background: #f5f5f5;
                color: #666;
            }

            .btn-cancel:hover {
                background: #e0e0e0;
            }

            .btn-add-to-cart {
                background: #d4a574;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .btn-add-to-cart:hover {
                background: #b8935f;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(212, 165, 116, 0.4);
            }

            /* Add to Cart Button for Menu Items */
            .add-to-cart-btn {
                background: #d4a574;
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.8rem;
                transition: all 0.3s ease;
            }

            .add-to-cart-btn:hover {
                background: #b8935f;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            /* Success Message */
            .cart-success-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1001;
                animation: slideInRight 0.3s ease;
            }

            .success-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            /* Cart Badge */
            .cart-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #d4a574;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: bold;
                display: none;
            }

            .cart-badge:not(:empty) {
                display: flex;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .modal-content {
                    padding: 1.5rem;
                    margin: 1rem;
                }

                .modal-footer {
                    flex-direction: column;
                }

                .btn-cancel, .btn-add-to-cart {
                    width: 100%;
                    justify-content: center;
                }
            }

            @media (max-width: 480px) {
                .quantity-controls {
                    justify-content: center;
                }

                .customization-options {
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Global functions for modal
function updateQuantity(button, change) {
    const input = button.parentElement.querySelector('.quantity-input');
    const newValue = parseInt(input.value) + change;
    if (newValue >= 1 && newValue <= 10) {
        input.value = newValue;
    }
}

// Initialize menu cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make sure ShoppingCart is available
    if (typeof ShoppingCart === 'undefined') {
        // Fallback ShoppingCart implementation
        window.ShoppingCart = class {
            constructor() {
                this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            }
            
            addToCart(item) {
                const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
                
                if (existingItem) {
                    existingItem.quantity += item.quantity || 1;
                } else {
                    this.cartItems.push({
                        ...item,
                        quantity: item.quantity || 1
                    });
                }
                
                localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
            }
        };
    }

    window.menuCart = new MenuCart();
});