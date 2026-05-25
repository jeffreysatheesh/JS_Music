document.addEventListener("DOMContentLoaded", (event) => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Navigation Background on Scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Initial Hero Animation
    const heroTl = gsap.timeline();
    
    heroTl.to(".hero h1", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
    })
    .to(".hero p", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .to(".hero .btn-group", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");

    // Generate Piano Keys
    const pianoContainer = document.getElementById('hero-piano');
    if (pianoContainer) {
        const numWhiteKeys = 52;
        const keys = [];
        
        // Pattern of black keys in an octave: C# D# - F# G# A#
        // Indices of white keys that have a black key after them:
        // C(0), D(1), E(2), F(3), G(4), A(5), B(6)
        // Black keys are after: 0, 1, 3, 4, 5
        const hasBlackKeyAfter = [true, true, false, true, true, true, false];
        
        for (let i = 0; i < numWhiteKeys; i++) {
            // Create white key
            const whiteKey = document.createElement('div');
            whiteKey.classList.add('piano-key', 'white');
            pianoContainer.appendChild(whiteKey);
            keys.push(whiteKey);
            
            // Check if we need a black key
            if (hasBlackKeyAfter[i % 7] && i < numWhiteKeys - 1) {
                const blackKey = document.createElement('div');
                blackKey.classList.add('piano-key', 'black');
                pianoContainer.appendChild(blackKey);
                keys.push(blackKey);
            }
        }
        
        // Auto-play random keys
        setInterval(() => {
            // Pick 1 to 3 random keys to play at once for a chord effect
            const notesToPlay = Math.floor(Math.random() * 3) + 1;
            
            for(let i=0; i<notesToPlay; i++) {
                const randomIdx = Math.floor(Math.random() * keys.length);
                const key = keys[randomIdx];
                
                // Press key
                key.classList.add('active');
                
                // Release key after short duration
                setTimeout(() => {
                    key.classList.remove('active');
                }, 150 + Math.random() * 200);
            }
        }, 200); 
        
        // Parallax effect for piano
        gsap.to(".hero-piano-container", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Apple-like Text Reveal Animations
    const splitTypes = document.querySelectorAll('.reveal-text');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // About Section Animation
    gsap.from(".about-text h2", {
        scrollTrigger: {
            trigger: ".about-container",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".about-text p", {
        scrollTrigger: {
            trigger: ".about-container",
            start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from(".about-image-wrapper", {
        scrollTrigger: {
            trigger: ".about-container",
            start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    });

    // Books Grid Animation
    gsap.from(".section-header", {
        scrollTrigger: {
            trigger: ".books-section",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".book-card", {
        scrollTrigger: {
            trigger: ".books-grid",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

    // Contact/Trial Section Animation
    gsap.from(".trial-container", {
        scrollTrigger: {
            trigger: ".trial-section",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    });

    gsap.from(".form-group", {
        scrollTrigger: {
            trigger: ".contact-form",
            start: "top 85%",
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
    
    // Add to cart interaction
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const originalText = btn.innerText;
            btn.innerText = "Added!";
            btn.style.backgroundColor = "#4caf50";
            btn.style.color = "#fff";
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
            }, 2000);
        });
    });
    
    // Form submission interaction
    const trialForm = document.getElementById('trial-form');
    if(trialForm) {
        trialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = trialForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Booking Confirmed!";
            btn.style.backgroundColor = "#4caf50";
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                trialForm.reset();
            }, 3000);
        });
    }

    // Cart Logic
    let cart = [];
    const cartNavBtn = document.getElementById('cart-nav-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.getElementById('cart-count');
    const checkoutForm = document.getElementById('checkout-form');

    function updateCartUI() {
        cartCount.innerText = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            cartSummary.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                total += item.price;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div>
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
            
            cartTotalAmount.innerText = total.toFixed(2);
            cartSummary.style.display = 'block';
            
            // Add remove event listeners
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-index');
                    cart.splice(idx, 1);
                    updateCartUI();
                });
            });
        }
    }

    // Toggle Cart
    function toggleCart(e) {
        if(e) e.preventDefault();
        cartModal.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    if (cartNavBtn) cartNavBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Override existing add to cart interaction
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        // Remove old listener by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            const card = e.target.closest('.book-card');
            const title = card.querySelector('.book-title').innerText;
            const priceText = card.querySelector('.book-price').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            
            cart.push({ title, price });
            updateCartUI();
            
            const originalText = newBtn.innerText;
            newBtn.innerText = "Added!";
            newBtn.style.backgroundColor = "#4caf50";
            newBtn.style.color = "#fff";
            
            // Open cart to show user
            if(!cartModal.classList.contains('active')) toggleCart();
            
            setTimeout(() => {
                newBtn.innerText = originalText;
                newBtn.style.backgroundColor = "";
                newBtn.style.color = "";
            }, 1000);
        });
    });

    // Checkout Form
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = checkoutForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = "Processing...";
            
            setTimeout(() => {
                btn.innerText = "Payment Successful!";
                btn.style.backgroundColor = "#4caf50";
                
                setTimeout(() => {
                    cart = [];
                    updateCartUI();
                    checkoutForm.reset();
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "";
                    toggleCart();
                    alert("Thank you for your purchase! Your books will be shipped shortly.");
                }, 2000);
            }, 1500);
        });
    }
});
