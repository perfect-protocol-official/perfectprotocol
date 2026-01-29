document.addEventListener('DOMContentLoaded', () => {

    // --- Splash Screen Handling ---
    const splashScreen = document.getElementById('splash-screen');
    const body = document.body;

    if (splashScreen) {
        body.classList.add('loading');

        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            body.classList.remove('loading');
        }, 3500); // 3.5 seconds to accommodate new animation
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        });
    });

    // --- Netlify Form Submission ---
    const bookingForm = document.getElementById('bookingForm');
    const successOverlay = document.getElementById('success-overlay');
    const submitBtn = bookingForm ? bookingForm.querySelector('button[type="submit"]') : null;

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Loading State on Button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending...';
                submitBtn.style.opacity = '0.7';
            }

            const formData = new FormData(bookingForm);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData)),
            })
                .then(() => {
                    // Show Success Overlay
                    if (successOverlay) {
                        successOverlay.classList.add('active');

                        // After 4.5 seconds, hide overlay, reset form and scroll to top
                        setTimeout(() => {
                            if (successOverlay) successOverlay.classList.remove('active');
                            if (bookingForm) bookingForm.reset();
                            window.scrollTo({ top: 0, behavior: 'smooth' });

                            // Reset Button
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = 'Submit Request';
                                submitBtn.style.opacity = '1';
                            }
                        }, 4500);
                    }
                })
                .catch((error) => {
                    console.error('Form submission error:', error);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Error. Try Again';
                        submitBtn.style.opacity = '1';
                    }
                });
        });
    }

    // --- Smart Navbar (Hide on Scroll Down) ---
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    const scrollThreshold = 50; // Minimum scroll to trigger hide/show

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Don't do anything for very small scrolls
            if (Math.abs(currentScrollY - lastScrollY) < 5) return;

            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                // Scrolling Down - Hide
                navbar.classList.add('nav-hidden');
            } else {
                // Scrolling Up - Show
                navbar.classList.remove('nav-hidden');
            }

            // Always show at the very top
            if (currentScrollY <= 0) {
                navbar.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
        });
    }

    // --- Team Slideshow (Simple Auto-Play) ---
    const teamSlides = document.querySelectorAll('.team-simple-slide');
    let currentTeamSlide = 0;
    const teamIntervalTime = 3000; // 3 seconds per slide

    if (teamSlides.length > 0) {
        setInterval(() => {
            // Remove active from current
            teamSlides[currentTeamSlide].classList.remove('active');

            // Move to next
            currentTeamSlide = (currentTeamSlide + 1) % teamSlides.length;

            // Add active to next
            teamSlides[currentTeamSlide].classList.add('active');
        }, teamIntervalTime);
    }


    // --- Service Description Modal ---
    const serviceCards = document.querySelectorAll('.service-card');
    const modalOverlay = document.getElementById('service-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalIconContainer = document.getElementById('modal-icon-container');

    if (modalOverlay) {
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const description = card.getAttribute('data-description');
                const iconHTML = card.querySelector('.service-icon').innerHTML;

                // Populate Modal
                modalTitle.textContent = title;
                modalDescription.textContent = description;
                modalIconContainer.innerHTML = iconHTML;

                // Show Modal
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close Modal Function
        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        };

        // Close on Button Click
        modalCloseBtn.addEventListener('click', closeModal);

        // Close on Overlay Click (Outside Box)
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
