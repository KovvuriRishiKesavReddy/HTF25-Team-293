document.addEventListener("DOMContentLoaded", () => {
    // --- Auth & Data Helper Functions ---
    // User data is still used for pre-filling, but not strictly required
    function getCurrentUser() {
        const u = localStorage.getItem('currentUser');
        // Basic error handling for potentially invalid JSON
        try {
            return u ? JSON.parse(u) : null;
        } catch(e) {
            console.error("Error parsing currentUser from localStorage:", e);
            localStorage.removeItem('currentUser'); // Clear invalid data
            return null;
        }
    }

    // THIS FUNCTION IS NO LONGER USED TO BLOCK ACCESS
    // function ensureLoggedIn() { ... } // Keep it or remove it, it won't be called to block

    function prefillUserInfo() {
        const user = getCurrentUser();
        // Only prefill if user data exists, otherwise leave fields blank
        if (user) {
            const nameInput = document.getElementById('user-name');
            const emailInput = document.getElementById('user-email');
            const phoneInput = document.getElementById('user-phone');
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '';

            if (nameInput) nameInput.value = fullName;
            if (emailInput) emailInput.value = user.email || '';
            if (phoneInput) phoneInput.value = user.phoneNumber || '';
        }
    }

    function updateHeaderBadges() {
        // This function remains the same as before
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');

        const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const wishlistCount = wishlist.length;
        // Correctly filter orders before accessing status
        const activeOrdersCount = Array.isArray(orders) ? orders.filter(o => o && o.status !== 'delivered').length : 0;


        const cartCountBadge = document.getElementById('cart-count-badge');
        const wishlistCountBadge = document.getElementById('wishlist-count-badge');
        const ordersCountBadge = document.getElementById('orders-count-badge');
        const wishlistIcon = document.getElementById('wishlist-icon');

        // Check if elements exist before accessing properties
        if (cartCountBadge) {
            if (cartItemCount > 0) {
                cartCountBadge.textContent = cartItemCount;
                cartCountBadge.classList.remove('hidden');
            } else {
                cartCountBadge.classList.add('hidden');
            }
        }

        if (wishlistCountBadge && wishlistIcon) {
            if (wishlistCount > 0) {
                wishlistCountBadge.textContent = wishlistCount;
                wishlistCountBadge.classList.remove('hidden');
                wishlistIcon.classList.add('filled');
            } else {
                wishlistCountBadge.classList.add('hidden');
                wishlistIcon.classList.remove('filled');
            }
        }

         if (ordersCountBadge) {
            if (activeOrdersCount > 0) {
                ordersCountBadge.textContent = activeOrdersCount;
                ordersCountBadge.classList.remove('hidden');
            } else {
                ordersCountBadge.classList.add('hidden');
            }
        }
    }

    // --- Main Payment Page Logic ---
    function renderPaymentPage() {
        // **REMOVED LOGIN CHECK HERE**
        // if (!ensureLoggedIn()) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const contentContainer = document.getElementById('payment-page-content');

        if (!contentContainer) {
            console.error("Payment content container not found!");
            return;
        }

        if (cart.length === 0) {
            contentContainer.innerHTML = `
                <div class="payment-header" style="padding: 4rem 0;">
                    <h1>Your Cart is Empty</h1>
                    <p>There is nothing to pay for. Please add items to your cart first.</p>
                    <a href="customer.html?view=cart" class="checkout-btn" style="max-width: 300px; margin: 1rem auto 0; text-decoration: none; display: block;">
                        Back to Cart
                    </a>
                </div>
            `;
             lucide.createIcons(); // Render icons even on empty cart page
            return;
        }

        // --- Calculate Totals (using discount) ---
        const subtotal = cart.reduce((acc, item) => {
            const price = item.price || 0;
            const discount = item.discount || 0;
            const quantity = item.quantity || 1;
            const discountedPrice = price * (1 - discount / 100);
            return acc + (discountedPrice * quantity);
        }, 0);
        const shippingFee = subtotal > 1000 ? 0 : 50;
        const gstAmount = Math.round((subtotal + shippingFee) * 0.18);
        const finalTotal = subtotal + shippingFee + gstAmount;

        // --- Generate Order Summary Items HTML ---
        let orderItemsHtml = '';
        cart.forEach(item => {
             const price = item.price || 0;
             const discount = item.discount || 0;
             const quantity = item.quantity || 1;
             const discountedPrice = price * (1 - discount / 100);
             const itemTotalPrice = discountedPrice * quantity;
            orderItemsHtml += `
                <div class="order-summary-item">
                    <div class="order-summary-item-details">
                        <p>${item.name || 'Unknown Item'} (x${quantity})</p>
                        <p>Price: ₹${Math.round(discountedPrice).toLocaleString()}</p>
                    </div>
                    <span class="order-summary-item-price">₹${Math.round(itemTotalPrice).toLocaleString()}</span>
                </div>
            `;
        });

        // --- Main HTML Template (Unchanged from previous version) ---
        const paymentHtml = `
            <div>
                <div class="payment-header animate-slide-up">
                   <h1>Complete Your Payment</h1>
                   <p>Secure payment for your order</p>
                    <div class="secure-badge">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        <span>SSL Secured Payment</span>
                    </div>
                </div>

                <div class="payment-layout-grid">
                    <div class="payment-layout-main">
                        <div class="order-summary-card animate-slide-up">
                            <h2 class="payment-section-title">
                                <svg data-lucide="file-text"></svg>
                                <span>Order Summary</span>
                            </h2>
                            <div class="order-summary-items-container">
                                ${orderItemsHtml}
                            </div>
                        </div>
                        <div class="payment-card animate-slide-up">
                           <h3 class="payment-section-title">
                               <svg data-lucide="credit-card"></svg>
                               <span>Choose Payment Method</span>
                           </h3>
                           <div class="payment-method-grid">
                                <div class="payment-method-card" data-method="card">
                                   <input type="radio" name="paymentMethod" value="card" id="pm-card" checked />
                                   <label for="pm-card" class="payment-method-card-details">
                                       <p>Credit/Debit Card</p>
                                       <p>Visa, MasterCard, Rupay</p>
                                   </label>
                               </div>
                               <div class="payment-method-card" data-method="upi">
                                   <input type="radio" name="paymentMethod" value="upi" id="pm-upi" />
                                   <label for="pm-upi" class="payment-method-card-details">
                                       <p>UPI Payment</p>
                                       <p>Google Pay, PhonePe, Paytm</p>
                                   </label>
                               </div>
                               <div class="payment-method-card" data-method="netbanking">
                                    <input type="radio" name="paymentMethod" value="netbanking" id="pm-netbanking" />
                                    <label for="pm-netbanking" class="payment-method-card-details">
                                        <p>Net Banking</p>
                                        <p>All major banks</p>
                                    </label>
                                </div>
                                <div class="payment-method-card" data-method="wallet">
                                    <input type="radio" name="paymentMethod" value="wallet" id="pm-wallet" />
                                    <label for="pm-wallet" class="payment-method-card-details">
                                        <p>Digital Wallet</p>
                                        <p>Paytm, Amazon Pay</p>
                                    </label>
                                </div>
                           </div>
                           <form id="payment-form">
                               <div class="form-group">
                                   <h4 class="payment-section-title" style="font-size: 1.125rem; margin-bottom: 1rem;">Billing Information</h4>
                                   <div class="personal-info-grid">
                                       <div>
                                           <label for="user-name" class="form-label">Full Name *</label>
                                           <input type="text" id="user-name" class="payment-form-input" required />
                                       </div>
                                       <div>
                                           <label for="user-email" class="form-label">Email Address *</label>
                                           <input type="email" id="user-email" class="payment-form-input" required />
                                       </div>
                                       <div>
                                            <label for="user-phone" class="form-label">Phone Number *</label>
                                            <input type="tel" id="user-phone" class="payment-form-input" required />
                                        </div>
                                   </div>
                               </div>
                               <div id="card-details" class="payment-form-section active form-group">
                                    <h4 class="payment-section-title" style="font-size: 1.125rem; margin-bottom: 1rem;">Card Details</h4>
                                    <div class="form-group">
                                        <label for="card-number" class="form-label">Card Number *</label>
                                        <input type="text" id="card-number" maxlength="19" placeholder="1234 5678 9012 3456" class="payment-form-input" />
                                    </div>
                                    <div class="card-details-grid">
                                        <div>
                                            <label for="card-expiry" class="form-label">Expiry Date *</LabeL>
                                            <input type="text" id="card-expiry" maxlength="5" placeholder="MM/YY" class="payment-form-input" />
                                        </div>
                                        <div>
                                            <label for="card-cvv" class="form-label">CVV *</label>
                                            <input type="password" id="card-cvv" maxlength="4" placeholder="123" class="payment-form-input" />
                                        </div>
                                    </div>
                                </div>
                               <div id="upi-details" class="payment-form-section form-group">
                                    <h4 class="payment-section-title" style="font-size: 1.125rem; margin-bottom: 1rem;">UPI Details</h4>
                                    <label for="upi-id" class="form-label">UPI ID *</label>
                                    <input type="text" id="upi-id" placeholder="example@paytm" class="payment-form-input" />
                                </div>
                                <div id="netbanking-details" class="payment-form-section form-group">
                                     <h4 class="payment-section-title" style="font-size: 1.125rem; margin-bottom: 1rem;">Select Your Bank</h4>
                                     <label for="bank-select" class="form-label">Bank Name *</label>
                                     <select id="bank-select" class="payment-form-select">
                                         <option value="">Choose your bank</option>
                                         <option value="sbi">State Bank of India</option>
                                         <option value="hdfc">HDFC Bank</option>
                                         <option value="icici">ICICI Bank</option>
                                     </select>
                                </div>
                                <div id="wallet-details" class="payment-form-section form-group">
                                    <h4 class="payment-section-title" style="font-size: 1.125rem; margin-bottom: 1rem;">Select Wallet</h4>
                                    <div class="wallet-grid">
                                        <label for="wallet-paytm" class="wallet-option">
                                            <input type="radio" name="wallet-type" value="paytm" id="wallet-paytm" class="form-radio" />
                                            <span>Paytm</span>
                                        </label>
                                        <label for="wallet-amazonpay" class="wallet-option">
                                            <input type="radio" name="wallet-type" value="amazonpay" id="wallet-amazonpay" class="form-radio" />
                                            <span>Amazon Pay</span>
                                        </label>
                                    </div>
                                </div>
                               <button type="submit" id="pay-now-btn" class="pay-now-btn">
                                   <svg data-lucide="lock"></svg>
                                   <span>Pay Now - ₹${Math.round(finalTotal).toLocaleString()}</span>
                               </button>
                           </form>
                       </div>
                   </div>
                   <div class="payment-layout-sidebar">
                       <div class="amount-card animate-slide-up">
                           <h3 class="payment-section-title">
                               <svg data-lucide="receipt" style="color: var(--green-600);"></svg>
                               <span>Price Details</span>
                           </h3>
                           <div class="amount-card-body">
                               <div class="amount-card-row">
                                   <span>Subtotal</span>
                                   <span>₹${Math.round(subtotal).toLocaleString()}</span>
                               </div>
                               <div class="amount-card-row">
                                   <span>Shipping Fee</span>
                                   <span>₹${shippingFee.toLocaleString()}</span>
                               </div>
                               <div class="amount-card-row">
                                   <span>GST (18%)</span>
                                   <span>₹${gstAmount.toLocaleString()}</span>
                               </div>
                               <hr class="amount-card-divider">
                               <div class="amount-card-total">
                                   <span>Total Amount</span>
                                   <span>₹${Math.round(finalTotal).toLocaleString()}</span>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        `;

        // --- Inject HTML and Add Event Listeners ---
        contentContainer.innerHTML = paymentHtml;
        lucide.createIcons(); // Render icons

        // Prefill user info (if available)
        prefillUserInfo();

        // Get form elements
        const paymentForm = document.getElementById("payment-form");
        const cardDetails = document.getElementById("card-details");
        const upiDetails = document.getElementById("upi-details");
        const netbankingDetails = document.getElementById("netbanking-details");
        const walletDetails = document.getElementById("wallet-details");
        const paymentCards = document.querySelectorAll('.payment-method-card');
        const paymentInputs = document.querySelectorAll('input[name="paymentMethod"]');

        function showPaymentForm(method) {
            [cardDetails, upiDetails, netbankingDetails, walletDetails].forEach(el => {
                if(el) el.classList.remove("active"); // Add check if element exists
            });

            const elementToShow = document.getElementById(`${method}-details`);
            if (elementToShow) {
                 elementToShow.classList.add("active");
            }
        }

        paymentCards.forEach((card) => {
            card.addEventListener('click', () => {
                paymentCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const method = card.dataset.method;
                const radioInput = document.getElementById(`pm-${method}`);
                if (radioInput) radioInput.checked = true;
                showPaymentForm(method);
            });
        });

        paymentInputs.forEach((radio) => {
            radio.addEventListener("change", (e) => showPaymentForm(e.target.value));
        });

        const initialSelectedCard = document.querySelector('.payment-method-card[data-method="card"]');
        if (initialSelectedCard) initialSelectedCard.classList.add('selected');
        showPaymentForm('card'); // Show card form by default

        // --- Handle Form Submission ---
        if (paymentForm) { // Check if form exists before adding listener
            paymentForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                // **REMOVED LOGIN CHECK HERE**
                // if (!ensureLoggedIn()) return;

                const payBtn = e.target.querySelector('button[type="submit"]');
                const originalContent = payBtn ? payBtn.innerHTML : ''; // Handle if button not found

                if (payBtn) {
                    payBtn.disabled = true;
                    payBtn.innerHTML = `
                        <svg class="spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing Payment...</span>
                    `;
                }

                try {
                    // --- SIMULATE API CALL ---
                    const orderData = {
                        orderId: 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                        date: new Date().toISOString(),
                        items: cart, // The cart data from localStorage
                        total: finalTotal, // Use the calculated finalTotal
                        status: 'processing', // Initial status
                        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'N/A' // Safely get value
                    };

                    const walletTypeInput = document.querySelector('input[name="wallet-type"]:checked');
                    if (orderData.paymentMethod === 'wallet' && walletTypeInput) {
                        orderData.walletType = walletTypeInput.value;
                    }

                    console.log("Submitting Order:", orderData);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

                    // --- Handle Simulated Success ---
                    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                    orders.unshift(orderData); // Add new order to the beginning
                    localStorage.setItem('orders', JSON.stringify(orders));

                    localStorage.removeItem("cart"); // Clear the cart
                    localStorage.setItem('redirectTo', 'orders'); // Set flag for customer.js

                    // Show success overlay
                    const overlay = document.createElement("div");
                    overlay.className = "payment-success-overlay";
                    overlay.innerHTML = `
                        <p class="success-message">✅ Payment Successful!</p>
                        <p class="redirect-message">Your order has been confirmed.</p>
                        <p class="redirect-message">🔄 Redirecting to My Orders...</p>
                        <div class="loader-spinner"></div>
                    `;
                    document.body.appendChild(overlay);

                    // Redirect back to customer.html after 3 seconds
                    setTimeout(() => {
                        window.location.href = "customer.html";
                    }, 3000);

                } catch (error) {
                    console.error('Payment error:', error);
                    if (payBtn) { // Restore button only if it exists
                        payBtn.disabled = false;
                        payBtn.innerHTML = originalContent;
                        lucide.createIcons(); // Re-render icon if needed
                    }
                    alert('Payment failed: ' + error.message);
                }
            });
        }
    }

    // --- Initial Load ---
    updateHeaderBadges(); // Update header badges on load
    renderPaymentPage();  // Render the main content
    lucide.createIcons(); // Render all icons on the page
});