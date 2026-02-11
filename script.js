/**
 * Dr. Zahra Ahmad Afia - Pediatrician Portfolio Website
 * Main JavaScript File
 * Contains all interactive functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // Global Variables
    // ==========================================================================
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    const hamburgerBtn = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop();
    
    // ==========================================================================
    // Theme Toggle Functionality
    // ==========================================================================
    function initTheme() {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Apply the saved theme
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        }
        
        // Theme toggle button click event
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    function toggleTheme() {
        // Toggle dark mode class on body
        body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Add animation to toggle button
        themeToggleBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 300);
    }
    
    // ==========================================================================
    // Back to Top Button
    // ==========================================================================
    function initBackToTop() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', toggleBackToTop);
        
        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    function initMobileNav() {
        // Toggle mobile navigation menu
        hamburgerBtn.addEventListener('click', toggleMobileNav);
        
        // Close mobile menu when clicking on a link
        navItems.forEach(item => {
            item.addEventListener('click', closeMobileNav);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target) || hamburgerBtn.contains(event.target);
            if (!isClickInsideNav && navLinks.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }
    
    function toggleMobileNav() {
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    function closeMobileNav() {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
    
    // ==========================================================================
    // Active Navigation Link Highlighting
    // ==========================================================================
    function initActiveNav() {
        // Only run on index.html (not 404 page)
        if (currentPage !== 'index.html' && currentPage !== '') return;
        
        // Get all sections
        const sections = document.querySelectorAll('section[id]');
        
        // Function to update active nav link
        function updateActiveNav() {
            let scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });
        }
        
        // Update on scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Also update on page load
        updateActiveNav();
    }
    
    // ==========================================================================
    // Form Handling
    // ==========================================================================
    function initForms() {
        // Appointment form
        const appointmentForm = document.getElementById('appointment-form');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', handleAppointmentForm);
        }
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterForm);
        }
        
        // Add focus effects to form inputs
        const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        formInputs.forEach(input => {
            // Add focus effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            // Remove focus effect
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on page load
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });
    }
    
    function handleAppointmentForm(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const formProps = Object.fromEntries(formData);
        
        // In a real application, you would send this data to a server
        // For this demo, we'll just show a success message
        showNotification('Appointment request sent successfully! We will contact you soon.', 'success');
        
        // Reset form
        e.target.reset();
        
        // Remove focus classes
        const formGroups = e.target.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('focused');
        });
    }
    
    function handleNewsletterForm(e) {
        e.preventDefault();
        
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Simple email validation
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For this demo, we'll just show a success message
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        
        // Reset form
        e.target.reset();
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ==========================================================================
    // Notification System
    // ==========================================================================
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Allow manual dismissal
        notification.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // ==========================================================================
    // Ripple Effect for Buttons
    // ==========================================================================
    function initRippleEffect() {
        // Add ripple effect to all buttons with .ripple-effect class
        const buttons = document.querySelectorAll('.ripple-effect');
        
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
    }
    
    function createRipple(e) {
        const button = e.currentTarget;
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        // Create ripple element
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        // Calculate position
        const rect = button.getBoundingClientRect();
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');
        
        // Add to button
        button.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // ==========================================================================
    // Smooth Scrolling for Anchor Links
    // ==========================================================================
    function initSmoothScrolling() {
        // Only run on index.html (not 404 page)
        if (currentPage !== 'index.html' && currentPage !== '') return;
        
        // Select all links with hashes
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Skip if it's just "#" or empty
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Calculate offset (considering fixed navbar)
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ==========================================================================
    // Tooltip Initialization
    // ==========================================================================
    function initTooltips() {
        // Add tooltips to social media icons
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            const ariaLabel = link.getAttribute('aria-label');
            if (ariaLabel) {
                // Create tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = ariaLabel;
                
                // Add to link
                link.appendChild(tooltip);
                
                // Show/hide tooltip on hover
                link.addEventListener('mouseenter', function() {
                    tooltip.classList.add('show');
                });
                
                link.addEventListener('mouseleave', function() {
                    tooltip.classList.remove('show');
                });
            }
        });
    }
    
    // ==========================================================================
    // 404 Page Specific Functionality
    // ==========================================================================
    function init404Page() {
        // Only run on 404 page
        if (currentPage !== '404.html') return;
        
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.search-box button');
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', function() {
                performSearch(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch(searchInput.value);
                }
            });
        }
    }
    
    function performSearch(query) {
        if (query.trim() === '') {
            showNotification('Please enter a search term.', 'error');
            return;
        }
        
        // In a real application, this would perform an actual search
        // For this demo, we'll just show a notification
        showNotification(`Searching for "${query}". In a real site, this would show search results.`, 'info');
    }
    
    // ==========================================================================
    // Initialize All Functions
    // ==========================================================================
    function init() {
        initTheme();
        initBackToTop();
        initMobileNav();
        initActiveNav();
        initForms();
        initRippleEffect();
        initSmoothScrolling();
        initTooltips();
        init404Page();
        
        // Initialize AOS (if not already initialized by inline script)
        if (typeof AOS !== 'undefined' && !AOS.initialized) {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }
        
        // Add CSS for notifications and tooltips
        addDynamicStyles();
        
        console.log('Dr. Zahra Afia Portfolio Website initialized successfully.');
    }
    
    // ==========================================================================
    // Dynamic CSS Styles for JS-generated elements
    // ==========================================================================
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Notification Styles */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                background-color: var(--card-bg);
                color: var(--text-color);
                box-shadow: var(--shadow-hover);
                transform: translateX(150%);
                transition: transform 0.3s ease;
                z-index: 9999;
                cursor: pointer;
                max-width: 350px;
                font-weight: 500;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #4CAF50;
            }
            
            .notification-error {
                border-left: 4px solid #F44336;
            }
            
            .notification-info {
                border-left: 4px solid var(--primary-color);
            }
            
            /* Ripple Effect Styles */
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Tooltip Styles */
            .tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--dark-color);
                color: white;
                padding: 0.5rem 0.8rem;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
                z-index: 100;
                margin-bottom: 8px;
            }
            
            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-width: 5px;
                border-style: solid;
                border-color: var(--dark-color) transparent transparent transparent;
            }
            
            .tooltip.show {
                opacity: 1;
                visibility: visible;
            }
            
            /* Form Focus State */
            .form-group.focused i {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ==========================================================================
    // Initialize the website when DOM is loaded
    // ==========================================================================
    init();
});

// Set current year in footer
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('#currentYear');
yearElements.forEach(el => {
    if (el) el.textContent = currentYear;
});