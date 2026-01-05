// ===============================================
// INFINITY BOOKSTORE - JAVASCRIPT
// ===============================================

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

// Map product names to image paths for cart thumbnails
const productImages = {
    'The River and the Source': 'images/book1.jpg',
    'A Grain of Wheat': 'images/book2.jpg',
    'Petals of Blood': 'images/book3.jpg',
    'My Life in Crime': 'images/book4.jpg',
    "My Life with a Criminal: Milly's Story": 'images/book5.jpg',
    'Unbowed': 'images/book6.jpg',
    'Blossoms of the Savannah': 'images/book7.jpg',
    'Dust': 'images/book8.jpg',
    'The Dragonfly Sea': 'images/book9.jpg',
    'One Day I Will Write About This Place': 'images/book10.jpg',
    'Kill Me Quick': 'images/book11.jpg',
    'Going Down River Road': 'images/book12.jpg'
};

const placeholderImage = 'https://via.placeholder.com/80x110?text=Book';

// Create cart modal on page load
function createCartModal() {
    const modalHTML = `
        <div class="cart-modal-overlay" id="cart-overlay"></div>
        <div class="cart-modal" id="cart-modal">
            <div class="cart-header">
                <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
                <button class="cart-close" id="cart-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-body" id="cart-body">
                <!-- Cart items will be inserted here -->
            </div>
            <div class="cart-footer" id="cart-footer" style="display: none;">
                <div class="cart-total">
                    <span class="cart-total-label">Total:</span>
                    <span class="cart-total-amount" id="cart-total">KSh 0</span>
                </div>
                <div class="payment-method">
                    <label class="payment-label"><i class="fas fa-wallet"></i> Payment Method:</label>
                    <div class="payment-options">
                        <label class="payment-option mpesa-option">
                            <input type="radio" name="payment" value="mpesa" checked>
                            <span class="payment-radio"></span>
                            <img src="images/lipa-na-mpesa.png" alt="Lipa na M-Pesa" class="lipa-mpesa-logo">
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="cash">
                            <span class="payment-radio"></span>
                            <i class="fas fa-money-bill-wave cash-icon"></i>
                            <span>Cash</span>
                        </label>
                    </div>
                </div>
                <div class="cart-actions">
                    <button class="btn btn-clear" onclick="clearCart()"><i class="fas fa-trash"></i> Clear Cart</button>
                    <button class="btn btn-primary" onclick="checkout()"><i class="fas fa-check-circle"></i> Checkout</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('cart-overlay').addEventListener('click', closeCartModal);
    document.getElementById('cart-close').addEventListener('click', closeCartModal);
    
    // Add click event to cart icon
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', openCartModal);
    });
}

function openCartModal() {
    renderCartItems();
    document.getElementById('cart-modal').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCartItems() {
    const cartBody = document.getElementById('cart-body');
    const cartFooter = document.getElementById('cart-footer');
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon"><i class="fas fa-shopping-basket"></i></div>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem;">Start adding some books!</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        const itemsHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-thumb">
                    <img src="${item.image || getProductImage(item.name)}" alt="${item.name} cover">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">KSh ${item.price.toLocaleString()}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
        
        cartBody.innerHTML = `<div class="cart-items">${itemsHTML}</div>`;
        cartFooter.style.display = 'block';
        
        // Update total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cart-total').textContent = `KSh ${total.toLocaleString()}`;
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    cartCount = cart.length;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
    
    updateCartDisplay();
    renderCartItems();
    showNotification('<i class="fas fa-trash-alt"></i> Item removed from cart');
}

function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (paymentMethod === 'mpesa') {
        // Show M-Pesa payment instructions
        const mpesaMessage = `
📱 M-PESA PAYMENT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to M-Pesa on your phone
2. Select "Send Money"
3. Enter Number: 0797370221
4. Amount: KSh ${total.toLocaleString()}
5. Enter your PIN and confirm

━━━━━━━━━━━━━━━━━━━━━━━━━
Account Name: Brenda Kagure Mwangi

After payment, send screenshot to:
WhatsApp: 0797370221

Thank you for shopping at Infinity Bookstore! 📚
        `;
        alert(mpesaMessage);
        
        // Open WhatsApp with order details
        const orderItems = cart.map(item => `• ${item.name} - KSh ${item.price.toLocaleString()}`).join('%0A');
        const whatsappMessage = `🛒 *NEW ORDER - Infinity Bookstore*%0A%0A${orderItems}%0A%0A*Total: KSh ${total.toLocaleString()}*%0A*Payment: M-Pesa*%0A%0AI will send payment confirmation shortly.`;
        window.open(`https://wa.me/254797370221?text=${whatsappMessage}`, '_blank');
    } else {
        // Cash payment - send order via WhatsApp
        const cashMessage = `
💵 CASH PAYMENT SELECTED
━━━━━━━━━━━━━━━━━━━━━━━━━

Total: KSh ${total.toLocaleString()}

Please visit our store to complete your purchase:
📍 Kangema Town, Opposite Equity Bank

Or we can deliver to you!
Contact: 0797370221 (Brenda)

Thank you for shopping at Infinity Bookstore! 📚
        `;
        alert(cashMessage);
        
        // Open WhatsApp with order details
        const orderItems = cart.map(item => `• ${item.name} - KSh ${item.price.toLocaleString()}`).join('%0A');
        const whatsappMessage = `🛒 *NEW ORDER - Infinity Bookstore*%0A%0A${orderItems}%0A%0A*Total: KSh ${total.toLocaleString()}*%0A*Payment: Cash on Delivery/Pickup*%0A%0APlease confirm availability.`;
        window.open(`https://wa.me/254797370221?text=${whatsappMessage}`, '_blank');
    }
    
    clearCart();
    closeCartModal();
}

// ===============================================
// THEME TOGGLE FUNCTIONALITY
// ===============================================
function initializeTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Add event listener for theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    // Icon is now handled by CSS pseudo-elements
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
}

// ===============================================
// DYNAMIC GREETING & DATE
// ===============================================
function displayGreetingAndDate() {
    const greetingElement = document.getElementById('greeting');
    const dateElement = document.getElementById('current-date');
    
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting;
        let icon;
        
        if (hour < 12) {
            greeting = 'Good Morning!';
            icon = '<i class="fas fa-sun" style="color: #f39c12;"></i>';
        } else if (hour < 18) {
            greeting = 'Good Afternoon!';
            icon = '<i class="fas fa-cloud-sun" style="color: #e67e22;"></i>';
        } else {
            greeting = 'Good Evening!';
            icon = '<i class="fas fa-moon" style="color: #9b59b6;"></i>';
        }
        
        greetingElement.innerHTML = `${icon} ${greeting}`;
    }
    
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const today = new Date().toLocaleDateString('en-US', options);
        dateElement.innerHTML = `<i class="fas fa-calendar-alt"></i> ${today}`;
    }
}

// ===============================================
// SHOPPING CART FUNCTIONALITY
// ===============================================
function updateCartDisplay() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
        
        // Add animation effect
        element.style.transform = 'scale(1.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    });
}

function addToCart(productName, price) {
    // Add item to cart
    cart.push({
        name: productName,
        price: price,
        id: Date.now(),
        image: getProductImage(productName)
    });
    
    cartCount++;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount);
    
    // Update display
    updateCartDisplay();
    
    // Show success message
    showNotification(`<i class="fas fa-check-circle"></i> "${productName}" added to cart!`);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Source Sans 3', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===============================================
// FORM VALIDATION
// ===============================================
function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous error messages
            clearErrors();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validate name
            if (name === '') {
                showError('name-error', 'Please enter your name');
                isValid = false;
            } else if (name.length < 2) {
                showError('name-error', 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                showError('email-error', 'Please enter your email');
                isValid = false;
            } else if (!email.includes('@')) {
                showError('email-error', 'Email must contain "@" symbol');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email-error', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate subject
            if (subject === '') {
                showError('subject-error', 'Please enter a subject');
                isValid = false;
            } else if (subject.length < 3) {
                showError('subject-error', 'Subject must be at least 3 characters');
                isValid = false;
            }
            
            // Validate message
            if (message === '') {
                showError('message-error', 'Please enter your message');
                isValid = false;
            } else if (message.length < 10) {
                showError('message-error', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                // Show success message
                const successMessage = document.getElementById('form-success');
                successMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // Real-time validation for email field
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email !== '' && !email.includes('@')) {
                    showError('email-error', 'Email must contain "@" symbol');
                } else if (email !== '' && !isValidEmail(email)) {
                    showError('email-error', 'Please enter a valid email address');
                } else {
                    clearError('email-error');
                }
            });
        }
    }
}

function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add red border to input
        const inputElement = errorElement.previousElementSibling;
        if (inputElement) {
            inputElement.style.borderColor = '#e74c3c';
        }
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        
        // Remove red border from input
        const inputElement = errorElement.previousElementSibling;
        if (inputElement) {
            inputElement.style.borderColor = '';
        }
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    // Remove all red borders
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// ===============================================
// INITIALIZE ALL FUNCTIONS ON PAGE LOAD
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    // Create cart modal
    createCartModal();
    
    // Initialize theme
    initializeTheme();
    
    // Display greeting and date
    displayGreetingAndDate();
    
    // Update cart display
    updateCartDisplay();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function getProductImage(productName) {
    return productImages[productName] || placeholderImage;
}

// Function to clear cart (for testing purposes)
function clearCart() {
    cart = [];
    cartCount = 0;
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    updateCartDisplay();
    showNotification('<i class="fas fa-trash"></i> Cart cleared!');
}

// Make clearCart available in console for testing
window.clearCart = clearCart;
