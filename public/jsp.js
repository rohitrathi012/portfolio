// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Navbar Scroll Effect & Active Link --- */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Glass Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - window.innerHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init on load


    /* --- 2. Mobile Menu Toggle --- */
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-btn i');

    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        if (navLinksContainer.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
        });
    });


    /* --- 3. Typing Effect --- */
    const typeTarget = document.querySelector('.typing-text');
    if (typeTarget) {
        const words = ['Student', 'Engineer', 'Developer', 'Analyst'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeTarget.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typeTarget.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 400; // Pause before typing new word
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1000);
    }


    /* --- 4. Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal, .fade-in');

    const observeReveal = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observeReveal.observe(el));


    /* --- 5. Custom 3D Tilt Effect on Cards --- */
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });


    /* --- 6. REAL Form Submission via Fetch API --- */
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalBtnContent = btn.innerHTML;
            
            // UI Feedback: Loading
            btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';
            if(formStatus) formStatus.innerHTML = '';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success
                    btn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
                    btn.style.background = '#10b981';
                    btn.style.color = '#fff';
                    if(formStatus) {
                        formStatus.innerHTML = `<span style="color: #10b981;">${result.message}</span>`;
                    }
                    form.reset();
                } else {
                    // Server Error
                    throw new Error(result.message || 'Something went wrong.');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                btn.innerHTML = '<span>Error Occurred</span> <i class="fas fa-exclamation-triangle"></i>';
                btn.style.background = '#ef4444';
                btn.style.color = '#fff';
                if(formStatus) {
                    formStatus.innerHTML = `<span style="color: #ef4444;">${error.message}</span>`;
                }
            } finally {
                // Reset button after a delay
                setTimeout(() => {
                    btn.innerHTML = originalBtnContent;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }, 4000);
            }
        });
    }

    /* --- 7. Update Footer Year --- */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
