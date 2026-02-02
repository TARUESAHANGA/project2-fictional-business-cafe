// ===== Menu Page Cart Integration =====
// Connects menu items to the main cart system

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Initialize Cart from LocalStorage =====
    let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    
    // ===== Update Cart Badge =====
    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // ===== Add Item to Cart =====
    function addToCart(itemData) {
        // Ensure item has all required properties
        const newItem = {
            id: Date.now().toString(),
            name: itemData.name,
            price: parseFloat(itemData.price),
            quantity: 1,
            image: itemData.image || null,
            description: itemData.description || ''
        };
        
        // Check if item already exists in cart (by name)
        const existingItemIndex = cart.findIndex(item => item.name === newItem.name);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(newItem);
        }
        
        // Save to localStorage
        saveCart();
        
        // Update UI
        updateCartBadge();
        showAddNotification(newItem.name);
        
        // Dispatch event for other scripts
        document.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { cart: cart, item: newItem } 
        }));
        
        console.log('Cart updated:', cart); // Debug log
    }
    
    // ===== Save Cart to LocalStorage =====
    function saveCart() {
        localStorage.setItem('cafeCart', JSON.stringify(cart));
        // Also dispatch storage event for other tabs/pages
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cafeCart',
            newValue: JSON.stringify(cart)
        }));
    }
    
    // ===== Show Add Notification =====
    function showAddNotification(itemName) {
        // Remove existing notification
        const existing = document.querySelector('.add-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'add-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span><strong>${itemName}</strong> added to cart!</span>
            <a href="cart.html" class="view-cart-link">View Cart →</a>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => notification.classList.add('show'));
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ===== Listen for Add to Cart Events =====
    document.addEventListener('addToCart', function(e) {
        if (e.detail) {
            addToCart(e.detail);
        }
    });
    
    // ===== Add Buttons to Menu Items =====
    function addCartButtons() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach((item, index) => {
            // Skip if already has button
            if (item.querySelector('.add-to-cart-btn')) return;
            
            const priceDiv = item.querySelector('.item-price');
            const nameDiv = item.querySelector('.item-name');
            const descDiv = item.querySelector('.item-description');
            
            if (priceDiv && nameDiv) {
                // Create button container if needed
                let btnContainer = item.querySelector('.item-actions');
                if (!btnContainer) {
                    btnContainer = document.createElement('div');
                    btnContainer.className = 'item-actions';
                    priceDiv.parentNode.appendChild(btnContainer);
                }
                
                const btn = document.createElement('button');
                btn.className = 'add-to-cart-btn';
                btn.innerHTML = '<i class="fas fa-plus"></i>';
                btn.setAttribute('aria-label', `Add ${nameDiv.textContent} to cart`);
                btn.title = 'Add to cart';
                
                // Parse price - handle various formats
                let priceText = priceDiv.textContent.replace(/[£$€]/g, '').replace('FREE', '0').trim();
                let price = parseFloat(priceText);
                
                // Skip if price is invalid or zero (optional items)
                if (isNaN(price) || price < 0) return;
                
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get item details
                    const itemData = {
                        name: nameDiv.textContent.trim(),
                        price: price,
                        description: descDiv ? descDiv.textContent.trim() : '',
                        image: item.dataset.image || null
                    };
                    
                    addToCart(itemData);
                    
                    // Button animation
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.classList.add('added');
                    
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-plus"></i>';
                        this.classList.remove('added');
                    }, 1500);
                });
                
                btnContainer.appendChild(btn);
            }
        });
    }
    
    // ===== Inject Styles =====
    const styles = `
        .item-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .add-to-cart-btn {
            background: var(--accent-color, #FF6B35);
            color: white;
            border: none;
            margin-left: 20px;
            border-radius: 8px;
            width: 100%;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
        }
        
        .add-to-cart-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            background: #e55a2b;
        }
        
        .add-to-cart-btn:active {
            transform: scale(0.95);
        }
        
        .add-to-cart-btn.added {
            background: #28a745 !important;
            transform: scale(1.1);
        }
        
        .menu-item {
            position: relative;
        }
        
        .item-price {
            font-weight: 600;
            color: var(--primary-brown, #8B4513);
            font-size: 1.1rem;
        }
        
        .add-notification {
            position: fixed;
            top: 100px;
            right: -400px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 4px solid #28a745;
            max-width: 400px;
        }
        
        .add-notification.show {
            right: 20px;
        }
        
        .add-notification i {
            color: #28a745;
            font-size: 1.5rem;
        }
        
        .add-notification span {
            flex: 1;
            color: #333;
        }
        
        .view-cart-link {
            background: var(--accent-color, #FF6B35);
            color: white !important;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            white-space: nowrap;
            transition: background 0.3s ease;
        }
        
        .view-cart-link:hover {
            background: #e55a2b;
            text-decoration: none;
        }
        
        @media (max-width: 768px) {
            .add-to-cart-btn {
                width: 40px;
                height: 40px;
                font-size: 16px;
            }
            
            .add-notification {
                left: 10px;
                right: 10px;
                top: auto;
                bottom: -200px;
                max-width: none;
                transition: bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .add-notification.show {
                right: 10px;
                bottom: 20px;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // ===== Initialize =====
    addCartButtons();
    updateCartBadge();
    
    // Re-initialize when menu sections are switched
    document.addEventListener('menuSectionChanged', function() {
        setTimeout(addCartButtons, 100);
    });
    
    // Listen for storage changes (cart updates from other pages)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cafeCart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartBadge();
        }
    });
    
    // Debug: Log current cart on load
    console.log('Menu-cart.js loaded. Current cart:', cart);
});