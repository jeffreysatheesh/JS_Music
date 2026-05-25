document.addEventListener("DOMContentLoaded", (event) => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // Navigation & Hamburger Menu
    // ==========================================
    const nav = document.querySelector('nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Hamburger toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Interactive Ambient Glow Tracker
    // ==========================================
    const ambientGlow = document.getElementById('ambient-glow');
    if (ambientGlow) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            // Smoothly interpolate the coordinates using GSAP
            gsap.to(ambientGlow, {
                left: x,
                top: y,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    }

    // ==========================================
    // Hero Animations & Piano
    // ==========================================
    const heroTl = gsap.timeline();
    
    heroTl.to(".hero h1", {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: "power4.out",
        delay: 0.2
    })
    .to(".hero p", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
    }, "-=1.0")
    .to(".hero .btn-group", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
    }, "-=1.0");

    // Generate Piano Keys
    const pianoContainer = document.getElementById('hero-piano');
    if (pianoContainer) {
        const numWhiteKeys = 52;
        const keys = [];
        
        // Pattern of black keys in an octave: C# D# - F# G# A#
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
        
        // Interactive Key Press on Mouse Hover
        keys.forEach(key => {
            key.addEventListener('mouseenter', () => {
                key.classList.add('active');
                setTimeout(() => {
                    key.classList.remove('active');
                }, 300);
            });
            key.addEventListener('mousedown', () => {
                key.classList.add('active');
            });
            key.addEventListener('mouseup', () => {
                key.classList.remove('active');
            });
        });
        
        // Ambient background autoplay logic (so it still feels alive when idle)
        setInterval(() => {
            // Only trigger idle play if mouse is not over the piano
            if (!pianoContainer.matches(':hover')) {
                const notesToPlay = Math.floor(Math.random() * 2) + 1;
                for(let i=0; i<notesToPlay; i++) {
                    const randomIdx = Math.floor(Math.random() * keys.length);
                    const key = keys[randomIdx];
                    if (key && !key.classList.contains('active')) {
                        key.classList.add('active');
                        setTimeout(() => {
                            key.classList.remove('active');
                        }, 800 + Math.random() * 400); // Keep keys lit longer
                    }
                }
            }
        }, 400); // Trigger frequently to ensure continuous animation stream
        
        // 3D Parallax & Tilt Effect based on Hero Mousemove
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const { width, height, left, top } = heroSection.getBoundingClientRect();
                const x = e.clientX - left - width / 2;
                const y = e.clientY - top - height / 2;
                
                const tiltX = (y / (height / 2)) * -6; // Tilt up/down
                const tiltY = (x / (width / 2)) * 6;  // Tilt left/right
                
                gsap.to(pianoContainer, {
                    rotateX: 60 + tiltX,
                    rotateY: tiltY,
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
            
            heroSection.addEventListener('mouseleave', () => {
                gsap.to(pianoContainer, {
                    rotateX: 60,
                    rotateY: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            });
        }
        
        // Parallax effect for piano on scroll
        gsap.to(".hero-piano-container", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // ==========================================
    // 3D Interactive Card Tilt Effect
    // ==========================================
    const tiltCards = document.querySelectorAll('.course-card, .book-card, .about-feature, .cert-card, .tutor-profile');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { width, height, left, top } = card.getBoundingClientRect();
            const x = e.clientX - left - width / 2;
            const y = e.clientY - top - height / 2;
            
            const tiltX = (y / (height / 2)) * -8;
            const tiltY = (x / (width / 2)) * 8;
            
            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                transformPerspective: 1000,
                scale: 1.015,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });

    // ==========================================
    // Smooth Apple-like Scroll animations
    // ==========================================
    // Select headers and trigger nice fade-in-up animations
    const animatedHeaders = document.querySelectorAll('.section-header, .about-text h2, .tutor-section h3, .certificates-container > h3');
    animatedHeaders.forEach(header => {
        gsap.fromTo(header, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Staggered reveal for grid items
    const grids = [
        { parent: '.about-features', items: '.about-feature' },
        { parent: '.certificates-grid', items: '.cert-card' },
        { parent: '.courses-grid', items: '.course-card' },
        { parent: '.books-grid', items: '.book-card' }
    ];

    grids.forEach(grid => {
        const parentEl = document.querySelector(grid.parent);
        if (parentEl) {
            const items = parentEl.querySelectorAll(grid.items);
            gsap.fromTo(items, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: parentEl,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    });

    // Other standalone blocks
    const standaloneScrolls = document.querySelectorAll('.about-container, .tutor-profile, .trial-container');
    standaloneScrolls.forEach(block => {
        gsap.fromTo(block,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: block,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // ==========================================
    // Interactive Elements & Toasts
    // ==========================================
    
    // Toast Functionality
    function showToast(message, duration = 3000) {
        const container = document.getElementById('toast-container');
        if(!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
                <strong style="display:block; margin-bottom: 2px;">Success</strong>
                <span style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.add('hide');
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400); // Wait for transition
        }, duration);
    }

    // CV Download Button
    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Show toast instead of alert
            showToast('Jayesh_Satheesh_CV.pdf downloading securely...');
        });
    }

    // Form submission interaction
    const trialForm = document.getElementById('trial-form');
    if(trialForm) {
        trialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = trialForm.querySelector('button');
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = '<span>Processing...</span>';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.innerHTML = '<span>Confirmed!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                btn.style.opacity = '1';
                btn.style.backgroundColor = "#4caf50";
                
                showToast("Your trial class request has been received. We will contact you shortly.");
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.backgroundColor = "";
                    trialForm.reset();
                }, 3000);
            }, 1000);
        });
    }

    // ==========================================
    // Cart System (Using LocalStorage)
    // ==========================================
    let cart = JSON.parse(localStorage.getItem('jsmusic_cart') || '[]');
    const cartNavBtn = document.getElementById('cart-nav-btn');
    const cartNavItem = document.getElementById('cart-nav-item');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutForm = document.getElementById('checkout-form');

    function updateCartUI() {
        // Sync with localStorage
        localStorage.setItem('jsmusic_cart', JSON.stringify(cart));
        
        const cartCount = document.getElementById('cart-count');
        if(cartCount) cartCount.innerText = cart.length;
        
        if(cartNavItem) {
            if (cart.length > 0) {
                cartNavItem.classList.add('has-items');
            } else {
                cartNavItem.classList.remove('has-items');
            }
        }
        
        if(!cartItemsContainer) return; // Prevent errors on pages without full cart modal HTML

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

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.book-card');
            const title = card.querySelector('.book-title').innerText;
            const priceText = card.querySelector('.book-price').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            
            cart.push({ title, price });
            updateCartUI();
            
            const originalText = btn.innerText;
            btn.innerText = "Added!";
            btn.style.backgroundColor = "#4caf50";
            btn.style.color = "#fff";
            btn.style.borderColor = "#4caf50";
            
            // Open cart to show user if not open
            if(!cartModal.classList.contains('active')) toggleCart();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.borderColor = "";
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
                    showToast("Thank you for your purchase! Your books will be shipped shortly.", 5000);
                }, 2000);
            }, 1500);
        });
    }

    // Auto-select instrument from courses section
    document.querySelectorAll('.course-book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const instrument = e.target.getAttribute('data-instrument');
            const selectElement = document.getElementById('instrument');
            if(selectElement && instrument) {
                selectElement.value = instrument;
                
                // Add a small highlight animation to the select field
                setTimeout(() => {
                    selectElement.style.transition = 'all 0.3s ease';
                    selectElement.style.boxShadow = '0 0 15px var(--accent)';
                    selectElement.style.borderColor = 'var(--accent)';
                    
                    setTimeout(() => {
                        selectElement.style.boxShadow = 'none';
                        selectElement.style.borderColor = 'rgba(255,255,255,0.2)';
                    }, 1500);
                }, 800); // Wait for scroll
            }
        });
    });

    // Initialize UI on load
    updateCartUI();
});
