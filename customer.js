document.addEventListener('DOMContentLoaded', () => {

    // --- Simulate user and load state ---
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify({
            firstName: 'ShopZone',
            lastName: 'User',
            email: 'user@shopzone.com',
            phoneNumber: '+91 98765 43210'
        }));
    }
    const getInitialState = (key, defaultValue) => {
        const storedValue = localStorage.getItem(key);
        try {
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            localStorage.removeItem(key);
            return defaultValue;
        }
    };

    // --- CONSTANTS (Data) ---
    const HARDCODED_PRODUCTS = [
      { id: 1, name: 'iPhone 15 Pro', category: 'mobiles', price: 129999, rating: 4.8, reviews: 2453, image: '📱', description: '256GB, Titanium Blue', stock: 15, discount: 10 },
      { id: 2, name: 'Samsung Galaxy S24', category: 'mobiles', price: 89999, rating: 4.6, reviews: 1876, image: '📱', description: '128GB, Phantom Black', stock: 20, discount: 15 },
      { id: 3, name: 'OnePlus 12', category: 'mobiles', price: 64999, rating: 4.5, reviews: 1234, image: '📱', description: '256GB, Glacial White', stock: 25, discount: 20 },
      { id: 4, name: 'MacBook Pro M3', category: 'laptops', price: 199999, rating: 4.9, reviews: 987, image: '💻', description: '14-inch, 16GB RAM', stock: 8, discount: 5 },
      { id: 5, name: 'Dell XPS 15', category: 'laptops', price: 145999, rating: 4.7, reviews: 756, image: '💻', description: 'Intel i7, 16GB RAM', stock: 12, discount: 12 },
      { id: 6, name: 'HP Pavilion', category: 'laptops', price: 65999, rating: 4.4, reviews: 1543, image: '💻', description: 'Ryzen 5, 8GB RAM', stock: 18, discount: 18 },
      { id: 7, name: 'Apple Watch Ultra 2', category: 'watches', price: 89900, rating: 4.8, reviews: 654, image: '⌚', description: 'Titanium, GPS + Cellular', stock: 10, discount: 8 },
      { id: 8, name: 'Samsung Galaxy Watch 6', category: 'watches', price: 32999, rating: 4.5, reviews: 432, image: '⌚', description: '44mm, Bluetooth', stock: 22, discount: 25 },
      { id: 9, name: 'Fossil Gen 6', category: 'watches', price: 21999, rating: 4.3, reviews: 876, image: '⌚', description: 'Stainless Steel', stock: 30, discount: 30 },
      { id: 10, name: 'Sony WH-1000XM5', category: 'headphones', price: 29990, rating: 4.9, reviews: 3421, image: '🎧', description: 'Noise Cancelling', stock: 35, discount: 15 },
      { id: 11, name: 'AirPods Pro 2', category: 'headphones', price: 24900, rating: 4.7, reviews: 2987, image: '🎧', description: 'USB-C, Active Noise Cancellation', stock: 40, discount: 10 },
      { id: 12, name: 'JBL Tune 770NC', category: 'headphones', price: 7999, rating: 4.4, reviews: 1654, image: '🎧', description: 'Wireless, Over-Ear', stock: 50, discount: 35 },
      { id: 13, name: 'iPad Pro 12.9"', category: 'tablets', price: 112900, rating: 4.8, reviews: 543, image: '📱', description: 'M2 Chip, 256GB', stock: 14, discount: 7 },
      { id: 14, name: 'Samsung Tab S9', category: 'tablets', price: 76999, rating: 4.6, reviews: 432, image: '📱', description: '11-inch, 128GB', stock: 19, discount: 12 },
      { id: 15, name: 'Canon EOS R6', category: 'cameras', price: 234999, rating: 4.9, reviews: 234, image: '📷', description: 'Mirrorless, 20MP', stock: 6, discount: 5 },
      { id: 16, name: 'Sony A7 IV', category: 'cameras', price: 249999, rating: 4.9, reviews: 198, image: '📷', description: '33MP, 4K Video', stock: 5, discount: 6 },
    ];

    // --- Load vendor products and merge with hardcoded products ---
    const loadAllProducts = () => {
        const vendorProducts = getInitialState('vendorProducts', []);
        return [...HARDCODED_PRODUCTS, ...vendorProducts];
    };

    let PRODUCTS = loadAllProducts();

    const CATEGORIES = [
        { id: 'all', name: 'All Products', icon: '🛍️' },
        { id: 'mobiles', name: 'Mobiles', icon: '📱' },
        { id: 'laptops', name: 'Laptops', icon: '💻' },
        { id: 'watches', name: 'Watches', icon: '⌚' },
        { id: 'headphones', name: 'Headphones', icon: '🎧' },
        { id: 'tablets', name: 'Tablets', icon: '📱' },
        { id: 'cameras', name: 'Cameras', icon: '📷' },
    ];

    const ORDER_STATUSES = [
        { status: 'processing', label: 'Order Processing', icon: 'package', color: 'blue' },
        { status: 'shipped', label: 'Shipped', icon: 'truck', color: 'orange' },
        { status: 'delivered', label: 'Delivered', icon: 'check-circle', color: 'green' },
    ];
    const SORT_OPTIONS = {
        'relevance': 'Relevance',
        'price-low': 'Price: Low to High',
        'price-high': 'Price: High to Low',
        'rating': 'Customer Rating',
        'name': 'Name: A to Z'
    };

    // --- APPLICATION STATE ---
    let selectedCategory = 'all';
    let searchQuery = '';
    let sortBy = 'relevance';
    let cart = getInitialState('cart', []);
    let wishlist = getInitialState('wishlist', []);
    let orders = getInitialState('orders', []);
    let view = 'products';
    let showCategoryMenu = false;
    let showSortMenu = false;

    // --- DOM ELEMENT REFERENCES ---
    const productsView = document.getElementById('products-view');
    const cartView = document.getElementById('cart-view');
    const wishlistView = document.getElementById('wishlist-view');
    const ordersView = document.getElementById('orders-view');
    const searchInputDesktop = document.getElementById('search-input-desktop');
    const searchInputMobile = document.getElementById('search-input-mobile');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const wishlistCountBadge = document.getElementById('wishlist-count-badge');
    const ordersCountBadge = document.getElementById('orders-count-badge');
    const wishlistIcon = document.getElementById('wishlist-icon');

    // --- NEW: Sync orders with seller dashboard ---
    const syncOrdersWithSeller = () => {
        // Get seller orders
        const sellerOrders = getInitialState('allOrders', []);
        
        // Update customer orders based on seller order status
        let ordersUpdated = false;
        orders = orders.map(customerOrder => {
            // Find matching seller order by orderId
            const sellerOrder = sellerOrders.find(so => so.id === customerOrder.orderId);
            
            if (sellerOrder) {
                // Map seller status to customer status
                let newStatus = customerOrder.status;
                
                if (sellerOrder.status === 'pending' || sellerOrder.status === 'processing') {
                    newStatus = 'processing';
                } else if (sellerOrder.status === 'out_for_delivery') {
                    newStatus = 'shipped';
                } else if (sellerOrder.status === 'delivered') {
                    newStatus = 'delivered';
                }
                
                if (newStatus !== customerOrder.status) {
                    ordersUpdated = true;
                    return { ...customerOrder, status: newStatus };
                }
            }
            return customerOrder;
        });
        
        if (ordersUpdated) {
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    };

    // --- STATE MANAGEMENT & LOGIC FUNCTIONS ---

    const saveStateToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        localStorage.setItem('orders', JSON.stringify(orders));
    };

    const refreshProducts = () => {
        PRODUCTS = loadAllProducts();
    };

    const getFilteredAndSortedProducts = () => {
        refreshProducts();
        let filtered = PRODUCTS;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const sorted = [...filtered];
        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => (a.price * (1 - a.discount / 100)) - (b.price * (1 - b.discount / 100)));
                break;
            case 'price-high':
                sorted.sort((a, b) => (b.price * (1 - b.discount / 100)) - (a.price * (1 - a.discount / 100)));
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }
        return sorted;
    };

    const addToCart = (productId) => {
        refreshProducts();
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existing = cart.find(item => item.id === productId);
        if (existing) {
            cart = cart.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            cart = [...cart, { ...product, quantity: 1 }];
        }
        saveStateToLocalStorage();
        renderApp();
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveStateToLocalStorage();
        renderApp();
    };

    const updateQuantity = (productId, change) => {
        cart = cart.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter(item => item !== null);
        saveStateToLocalStorage();
        renderApp();
    };

    const toggleWishlist = (productId) => {
        refreshProducts();
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const exists = wishlist.some(item => item.id === productId);
        if (exists) {
            wishlist = wishlist.filter(item => item.id !== productId);
        } else {
            wishlist = [...wishlist, product];
        }
        saveStateToLocalStorage();
        renderApp();
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    const getCartTotal = () => cart.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        return sum + discountedPrice * item.quantity;
    }, 0);

    const getCartItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        saveStateToLocalStorage();
        if (!localStorage.getItem('currentUser')) {
             alert("Please log in to check out.");
             return;
        }
        window.location.href = 'payment.html';
    };

    const getCategoryName = (id) => CATEGORIES.find(c => c.id === id)?.name || 'All Products';
    const getSortName = (id) => SORT_OPTIONS[id] || 'Sort';

    // --- RENDER FUNCTIONS ---

    const renderApp = () => {
        // Sync orders before rendering
        syncOrdersWithSeller();
        
        productsView.classList.toggle('hidden', view !== 'products');
        cartView.classList.toggle('hidden', view !== 'cart');
        wishlistView.classList.toggle('hidden', view !== 'wishlist');
        ordersView.classList.toggle('hidden', view !== 'orders');

        updateHeaderBadges();

        switch (view) {
            case 'products':
                renderProductsView();
                break;
            case 'cart':
                renderCartView();
                break;
            case 'wishlist':
                renderWishlistView();
                break;
            case 'orders':
                renderOrdersView();
                break;
        }

        lucide.createIcons();
    };

    const updateHeaderBadges = () => {
        const cartItemCount = getCartItemCount();
        const wishlistCount = wishlist.length;
        const activeOrdersCount = orders ? orders.filter(o => o && o.status !== 'delivered').length : 0;

        if (cartItemCount > 0) {
            cartCountBadge.textContent = cartItemCount;
            cartCountBadge.classList.remove('hidden');
        } else {
            cartCountBadge.classList.add('hidden');
        }

        if (wishlistCount > 0) {
            wishlistCountBadge.textContent = wishlistCount;
            wishlistCountBadge.classList.remove('hidden');
            if (wishlistIcon) wishlistIcon.classList.add('filled');
        } else {
            wishlistCountBadge.classList.add('hidden');
            if (wishlistIcon) wishlistIcon.classList.remove('filled');
        }

        if (activeOrdersCount > 0) {
            ordersCountBadge.textContent = activeOrdersCount;
            ordersCountBadge.classList.remove('hidden');
        } else {
            ordersCountBadge.classList.add('hidden');
        }
    };

    const renderProductsView = () => {
        const products = getFilteredAndSortedProducts();

        const headerHTML = `
            <div class="filter-sort-header">
                <div class="filter-sort-container">
                    <div class="product-count">
                        <i data-lucide="trending-up"></i>
                        <span>${products.length} Products</span>
                    </div>
                    <div class="dropdown-controls">
                        <div class="dropdown-container" id="category-dropdown-container">
                            <button class="dropdown-button" data-action="toggle-category-menu">
                                <span>
                                    <i data-lucide="filter"></i>
                                    ${getCategoryName(selectedCategory)}
                                </span>
                                <i data-lucide="chevron-down" class="${showCategoryMenu ? 'rotate' : ''}"></i>
                            </button>
                            <div class="dropdown-menu ${!showCategoryMenu ? 'hidden' : ''}">
                                ${CATEGORIES.map(cat => `
                                    <button
                                        class="dropdown-item ${selectedCategory === cat.id ? 'active' : ''}"
                                        data-action="select-category"
                                        data-category-id="${cat.id}"
                                    >
                                        <span class="icon">${cat.icon}</span>
                                        <span>${cat.name}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="dropdown-container" id="sort-dropdown-container">
                            <button class="dropdown-button" data-action="toggle-sort-menu">
                                <span>
                                    <i data-lucide="arrow-up-down"></i>
                                    ${getSortName(sortBy)}
                                </span>
                                <i data-lucide="chevron-down" class="${showSortMenu ? 'rotate' : ''}"></i>
                            </button>
                            <div class="dropdown-menu ${!showSortMenu ? 'hidden' : ''}">
                                ${Object.entries(SORT_OPTIONS).map(([id, label]) => `
                                    <button
                                        class="dropdown-item ${sortBy === id ? 'active' : ''}"
                                        data-action="select-sort"
                                        data-sort-id="${id}"
                                    >
                                        ${label}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        let gridHTML = '';
        if (products.length === 0) {
            gridHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <div class="empty-state-title">No products found</div>
                    <div class="empty-state-subtitle">Try adjusting your search or filters</div>
                </div>
            `;
        } else {
            gridHTML = `
                <div class="product-grid">
                    ${products.map(product => {
                        const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                        const productInWishlist = isInWishlist(product.id);
                        return `
                            <div class="product-card">
                                <div class="product-card-content">
                                    ${product.discount > 0 ? `
                                        <div class="product-discount-badge">
                                            <i data-lucide="zap" fill="white"></i>
                                            ${product.discount}% OFF
                                        </div>
                                    ` : ''}
                                    <div class="product-card-top">
                                        <div class="product-image">${product.image}</div>
                                        <button
                                            class="product-wishlist-btn ${productInWishlist ? 'wished' : ''}"
                                            data-action="toggle-wishlist"
                                            data-product-id="${product.id}"
                                        >
                                            <i data-lucide="heart"></i>
                                        </button>
                                    </div>
                                    <h3 class="product-name">${product.name}</h3>
                                    <p class="product-description">${product.description}</p>
                                    <div class="product-rating">
                                        <div class="product-rating-badge">
                                            ${product.rating} <i data-lucide="star" fill="white"></i>
                                        </div>
                                        <span class="product-rating-reviews">(${product.reviews.toLocaleString()})</span>
                                    </div>
                                    <div class="product-price-container">
                                        ${product.discount > 0 ? `
                                            <div class="product-price-wrapper">
                                                <div class="product-price-current">
                                                    ₹${Math.round(discountedPrice).toLocaleString()}
                                                </div>
                                                <div class="product-price-original">
                                                    ₹${product.price.toLocaleString()}
                                                </div>
                                            </div>
                                        ` : `
                                            <div class="product-price-current">
                                                ₹${product.price.toLocaleString()}
                                            </div>
                                        `}
                                    </div>
                                    <div class="product-stock ${product.stock <= 10 ? 'low' : ''}">
                                        ${product.stock > 10 ? '✓ In Stock' : `⚡ Only ${product.stock} left!`}
                                    </div>
                                    <button
                                        class="product-add-to-cart-btn"
                                        data-action="add-to-cart"
                                        data-product-id="${product.id}"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        productsView.innerHTML = headerHTML + gridHTML;
    };

    const renderCartView = () => {
        const cartItemCount = getCartItemCount();
        const cartTotal = getCartTotal();
        let contentHTML = '';

        if (cart.length === 0) {
            contentHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛒</div>
                    <div class="empty-state-title">Your cart is empty</div>
                    <p class="empty-state-subtitle">Add items to get started!</p>
                    <button
                        class="empty-state-action-btn"
                        data-action="change-view"
                        data-view="products"
                    >
                        Continue Shopping
                    </button>
                </div>
            `;
        } else {
            contentHTML = `
                <div class="cart-items-container">
                    ${cart.map(item => {
                        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
                        const itemTotalPrice = discountedPrice * item.quantity;
                        return `
                            <div class="cart-item">
                                <div class="cart-item-image">${item.image}</div>
                                <div class="cart-item-details">
                                    <h3 class="cart-item-name">${item.name}</h3>
                                    <p class="cart-item-description">${item.description}</p>
                                    <p class="cart-item-price">
                                        ₹${Math.round(discountedPrice).toLocaleString()}
                                        ${item.discount > 0 ? `<span class="product-price-original" style="font-size: 0.9em; margin-left: 5px;">₹${item.price.toLocaleString()}</span>` : ''}
                                    </p>
                                </div>
                                <div class="quantity-control">
                                    <button
                                        class="quantity-btn"
                                        data-action="update-quantity"
                                        data-product-id="${item.id}"
                                        data-change="-1"
                                    >
                                        -
                                    </button>
                                    <span class="quantity-display">${item.quantity}</span>
                                    <button
                                        class="quantity-btn"
                                        data-action="update-quantity"
                                        data-product-id="${item.id}"
                                        data-change="1"
                                    >
                                        +
                                    </button>
                                </div>
                                <div class="cart-item-total">
                                    <div class="cart-item-total-price">₹${Math.round(itemTotalPrice).toLocaleString()}</div>
                                    <button
                                        class="cart-item-remove-btn"
                                        data-action="remove-from-cart"
                                        data-product-id="${item.id}"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        `}).join('')}
                </div>
                <div class="cart-summary">
                    <div class="cart-total-amount">
                        <span>Total Amount:</span>
                        <span class="cart-total-amount-value">₹${Math.round(cartTotal).toLocaleString()}</span>
                    </div>
                    <button class="checkout-btn" data-action="checkout">
                        Proceed to Checkout
                    </button>
                </div>
            `;
        }

        cartView.innerHTML = `
            <div class="view-container">
                <h2 class="view-title">
                    <i data-lucide="shopping-cart"></i>
                    Shopping Cart (${cartItemCount} items)
                </h2>
                ${contentHTML}
            </div>
        `;
    };

    const renderWishlistView = () => {
        let contentHTML = '';

        if (wishlist.length === 0) {
            contentHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💝</div>
                    <div class="empty-state-title">Your wishlist is empty</div>
                    <p class="empty-state-subtitle">Save your favorite items here!</p>
                    <button
                        class="empty-state-action-btn"
                        data-action="change-view"
                        data-view="products"
                    >
                        Browse Products
                    </button>
                </div>
            `;
        } else {
            contentHTML = `
                <div class="wishlist-grid">
                    ${wishlist.map(product => {
                         const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                         return `
                            <div class="wishlist-item">
                                <div class="wishlist-item-top">
                                    <div class="wishlist-item-image">${product.image}</div>
                                    <button
                                        class="wishlist-item-remove-btn"
                                        data-action="toggle-wishlist"
                                        data-product-id="${product.id}"
                                    >
                                        <i data-lucide="heart"></i>
                                    </button>
                                </div>
                                <h3 class="wishlist-item-name">${product.name}</h3>
                                <p class="wishlist-item-description">${product.description}</p>
                                <div class="wishlist-item-price">
                                     ${product.discount > 0 ? `
                                        <span style="font-size: 1.1em;">₹${Math.round(discountedPrice).toLocaleString()}</span>
                                        <span class="product-price-original" style="font-size: 0.9em; margin-left: 5px;">₹${product.price.toLocaleString()}</span>
                                    ` : `
                                        <span>₹${product.price.toLocaleString()}</span>
                                    `}
                                </div>
                                <button
                                    class="wishlist-move-to-cart-btn"
                                    data-action="move-to-cart"
                                    data-product-id="${product.id}"
                                >
                                    Move to Cart
                                </button>
                            </div>
                        `}).join('')}
                </div>
            `;
        }

        wishlistView.innerHTML = `
            <div class="view-container">
                <h2 class="view-title">
                    <i data-lucide="heart"></i>
                    My Wishlist (${wishlist.length} items)
                </h2>
                ${contentHTML}
            </div>
        `;
    };

    const renderOrdersView = () => {
         const safeOrders = Array.isArray(orders) ? orders : [];
         const activeOrders = safeOrders.filter(o => o && o.status !== 'delivered');
         const pastOrders = safeOrders.filter(o => o && o.status === 'delivered');
        let contentHTML = '';

        if (safeOrders.length === 0) {
            contentHTML = `
                <div class="view-container">
                    <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <div class="empty-state-title">No orders yet</div>
                        <p class="empty-state-subtitle">Start shopping to see your orders here!</p>
                        <button
                            class="empty-state-action-btn"
                            data-action="change-view"
                            data-view="products"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            `;
        } else {
            if (activeOrders.length > 0) {
                contentHTML += `
                    <div class="orders-section">
                        <h3 class="orders-section-title">
                            <i data-lucide="truck"></i>
                            Active Orders (${activeOrders.length})
                        </h3>
                        <div class="orders-container">
                            ${activeOrders.map(order => renderOrderCard(order, true)).join('')}
                        </div>
                    </div>
                `;
            }
            if (pastOrders.length > 0) {
                contentHTML += `
                    <div class="orders-section">
                        <h3 class="orders-section-title">
                            <i data-lucide="check-circle"></i>
                            Past Orders (${pastOrders.length})
                        </h3>
                        <div class="orders-container">
                            ${pastOrders.map(order => renderOrderCard(order, false)).join('')}
                        </div>
                    </div>
                `;
            }
        }

        ordersView.innerHTML = `
            <h2 class="view-title" style="margin-bottom: 2rem;">
                <i data-lucide="package"></i>
                My Orders
            </h2>
            ${contentHTML}
        `;
    };

    const renderOrderCard = (order, isActive) => {
         if (!order || !order.status || !order.orderId || !order.items || typeof order.total === 'undefined') {
            console.warn("Skipping rendering invalid order:", order);
            return '';
         }
        const statusInfo = ORDER_STATUSES.find(s => s.status === order.status) || ORDER_STATUSES[0];

        const renderOrderItems = (items) => (items || []).map(item => {
             const discountedPrice = (item.price || 0) * (1 - (item.discount || 0) / 100);
             const itemTotalPrice = discountedPrice * (item.quantity || 1);
             return `
                <div class="order-details-item ${isActive ? 'active-order' : 'past-order'}">
                    <div class="order-details-item-image">${item.image || '?'}</div>
                    <div class="order-details-item-details">
                        <div class="order-details-item-name">${item.name || 'Unknown Item'}</div>
                        <div class="order-details-item-description">${item.description || ''}</div>
                        <div class="order-details-item-quantity">
                            Quantity: <span>${item.quantity || 1}</span>
                        </div>
                    </div>
                    <div class="order-details-item-price">
                        ₹${Math.round(itemTotalPrice).toLocaleString()}
                    </div>
                </div>
            `}).join('');

        return `
            <div class="order-card">
                <div class="order-card-header">
                    <div>
                        <div class="order-card-id">Order ID</div>
                        <div class="order-card-id-value">${order.orderId}</div>
                        <div class="order-card-date">
                            ${isActive ? 'Placed on' : 'Delivered on'}
                            ${order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                            ${isActive && order.date ? `at ${new Date(order.date).toLocaleTimeString()}` : ''}
                        </div>
                    </div>
                    <div class="order-status-badge ${order.status}">
                        <i data-lucide="${statusInfo.icon}"></i>
                        <span>${statusInfo.label}</span>
                    </div>
                </div>

                <div class="order-card-footer-wrapper">
                     ${isActive && order.estimatedDelivery ? `
                        <div class="order-delivery-estimate">
                            <span>Estimated Delivery:</span>
                            <span>${order.estimatedDelivery}</span>
                        </div>
                    ` : ''}
                    <div class="order-card-footer">
                        <div>
                            <div class="order-card-total-items">${order.items.length} item(s)</div>
                            <div class="order-card-total-price">₹${order.total.toLocaleString()}</div>
                        </div>
                        <button
                            class="order-details-btn"
                            data-action="toggle-order-details"
                            data-order-id="${order.orderId}"
                        >
                            View Details
                        </button>
                    </div>
                </div>

                <div id="order-details-${order.orderId}" class="order-details-content hidden">
                     ${renderOrderItems(order.items)}
                </div>
            </div>
        `;
    };

    // --- EVENT LISTENERS ---
    const setupEventListeners = () => {
        document.body.addEventListener('click', (event) => {
            const target = event.target;
            const actionTarget = target.closest('[data-action]');

            if (!actionTarget) return;

            if (actionTarget.tagName === 'A') {
                event.preventDefault();
            }

            const { action, productId, view: targetView, categoryId, sortId, change, orderId } = actionTarget.dataset;

            switch (action) {
                case 'change-view':
                    if (targetView === 'products' && actionTarget.classList.contains('logo')) {
                        selectedCategory = 'all';
                        searchQuery = '';
                        sortBy = 'relevance';
                        searchInputDesktop.value = '';
                        searchInputMobile.value = '';
                    }
                    view = targetView;
                    renderApp();
                    break;
                case 'add-to-cart':
                    addToCart(parseInt(productId, 10));
                    break;
                case 'toggle-wishlist':
                    toggleWishlist(parseInt(productId, 10));
                    break;
                case 'move-to-cart':
                    addToCart(parseInt(productId, 10));
                    toggleWishlist(parseInt(productId, 10));
                    break;
                case 'remove-from-cart':
                    removeFromCart(parseInt(productId, 10));
                    break;
                case 'update-quantity':
                    updateQuantity(parseInt(productId, 10), parseInt(change, 10));
                    break;
                case 'checkout':
                    handleCheckout();
                    break;
                case 'toggle-category-menu':
                    showCategoryMenu = !showCategoryMenu;
                    showSortMenu = false;
                    renderApp();
                    break;
                case 'toggle-sort-menu':
                    showSortMenu = !showSortMenu;
                    showCategoryMenu = false;
                    renderApp();
                    break;
                case 'select-category':
                    selectedCategory = categoryId;
                    showCategoryMenu = false;
                    renderApp();
                    break;
                case 'select-sort':
                    sortBy = sortId;
                    showSortMenu = false;
                    renderApp();
                    break;
                case 'toggle-order-details':
                    const detailsEl = document.getElementById(`order-details-${orderId}`);
                    if (detailsEl) {
                        detailsEl.classList.toggle('hidden');
                        actionTarget.textContent = detailsEl.classList.contains('hidden') ? 'View Details' : 'Hide Details';
                    }
                    break;
            }
        });

        const handleSearch = (event) => {
            searchQuery = event.target.value;
            if (event.target.id === 'search-input-desktop') {
                searchInputMobile.value = searchQuery;
            } else {
                searchInputDesktop.value = searchQuery;
            }
            if (view !== 'products') {
                view = 'products';
            }
            renderApp();
        };
        searchInputDesktop.addEventListener('input', handleSearch);
        searchInputMobile.addEventListener('input', handleSearch);

        window.addEventListener('click', (event) => {
             if ((showCategoryMenu || showSortMenu) &&
                 !event.target.closest('#category-dropdown-container') &&
                 !event.target.closest('#sort-dropdown-container'))
             {
                showCategoryMenu = false;
                showSortMenu = false;
                if (view === 'products') renderApp();
            }
        });
    };

    // --- INITIALIZATION ---
    setupEventListeners();

    const redirectTo = localStorage.getItem('redirectTo');
    if (redirectTo) {
        view = redirectTo;
        localStorage.removeItem('redirectTo');
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const urlView = urlParams.get('view');
        if (urlView && ['products', 'cart', 'wishlist', 'orders'].includes(urlView)) {
            view = urlView;
        } else {
             view = 'products';
        }
    }

    renderApp();

});