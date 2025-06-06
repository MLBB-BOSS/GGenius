/**
 * GGenius Website Enhancement Script
 * Handles accordion functionality, smooth scrolling, and visual effects
 */

class GGeniusEnhancements {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.handleInitialLoad();
    }

    /**
     * Initialize all interactive components
     */
    initializeComponents() {
        this.accordions = document.querySelectorAll('.accordion-header');
        this.navLinks = document.querySelectorAll('.main-navigation a');
        this.header = document.querySelector('.site-header');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.logo = document.getElementById('ggeniusAnimatedLogo');
        
        // Initialize intersection observer for animations
        this.initializeIntersectionObserver();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Accordion functionality
        this.accordions.forEach(header => {
            header.addEventListener('click', this.handleAccordionClick.bind(this));
            header.addEventListener('keydown', this.handleAccordionKeydown.bind(this));
        });

        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Resize events
        window.addEventListener('resize', this.handleResize.bind(this));

        // Logo hover effects
        if (this.logo) {
            this.logo.addEventListener('mouseenter', this.handleLogoHover.bind(this));
            this.logo.addEventListener('mouseleave', this.handleLogoLeave.bind(this));
        }

        // Page visibility
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    /**
     * Handle accordion clicks
     */
    handleAccordionClick(event) {
        const header = event.currentTarget;
        const content = header.nextElementSibling;
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Close other accordions (optional - remove for multiple open)
        this.accordions.forEach(otherHeader => {
            if (otherHeader !== header) {
                this.closeAccordion(otherHeader);
            }
        });

        // Toggle current accordion
        if (isExpanded) {
            this.closeAccordion(header);
        } else {
            this.openAccordion(header);
        }
    }

    /**
     * Handle keyboard navigation for accordions
     */
    handleAccordionKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleAccordionClick(event);
        }
    }

    /**
     * Open accordion
     */
    openAccordion(header) {
        const content = header.nextElementSibling;
        const inner = content.querySelector('.accordion-content-inner');
        
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = inner.scrollHeight + 'px';
        
        // Add animation class
        header.parentElement.classList.add('accordion-open');
    }

    /**
     * Close accordion
     */
    closeAccordion(header) {
        const content = header.nextElementSibling;
        
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
        
        // Remove animation class
        header.parentElement.classList.remove('accordion-open');
    }

    /**
     * Handle navigation clicks with smooth scrolling
     */
    handleNavClick(event) {
        const href = event.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Update active nav link
                this.updateActiveNavLink(event.currentTarget);
                
                // Smooth scroll to target
                const headerHeight = this.header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Header scroll effect
        if (scrollTop > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Update active nav based on scroll position
        this.updateNavOnScroll();
    }

    /**
     * Update navigation based on scroll position
     */
    updateNavOnScroll() {
        const sections = ['home', 'features', 'about', 'contact'];
        const scrollPosition = window.pageYOffset + this.header.offsetHeight + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && scrollPosition >= section.offsetTop) {
                const activeLink = document.querySelector(`[href="#${sections[i]}"]`);
                if (activeLink && !activeLink.classList.contains('active')) {
                    this.updateActiveNavLink(activeLink);
                }
                break;
            }
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate accordion heights if open
        const openAccordions = document.querySelectorAll('.accordion-header[aria-expanded="true"]');
        openAccordions.forEach(header => {
            const content = header.nextElementSibling;
            const inner = content.querySelector('.accordion-content-inner');
            content.style.maxHeight = inner.scrollHeight + 'px';
        });
    }

    /**
     * Handle logo hover effects
     */
    handleLogoHover() {
        if (this.logo) {
            this.logo.style.animationPlayState = 'paused';
            this.logo.style.transform = 'scale(1.05)';
        }
    }

    /**
     * Handle logo leave effects
     */
    handleLogoLeave() {
        if (this.logo) {
            this.logo.style.animationPlayState = 'running';
            this.logo.style.transform = 'scale(1)';
        }
    }

    /**
     * Handle page visibility changes
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when page is hidden
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when page is visible
            document.body.style.animationPlayState = 'running';
        }
    }

    /**
     * Initialize intersection observer for scroll animations
     */
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card-iui');
        featureCards.forEach(card => {
            this.observer.observe(card);
        });

        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    /**
     * Handle initial page load
     */
    handleInitialLoad() {
        // Hide loading indicator
        setTimeout(() => {
            if (this.loadingIndicator) {
                this.loadingIndicator.classList.add('loading-hidden');
            }
        }, 500);

        // Initialize any hash-based navigation
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }

        // Trigger initial scroll check
        this.handleScroll();
    }

    /**
     * Utility method to add CSS classes with animation delays
     */
    addStaggeredAnimation(elements, baseClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(baseClass);
            }, index * delay);
        });
    }

    /**
     * Debounce utility for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ggeniusApp = new GGeniusEnhancements();
});

// Add error handling
window.addEventListener('error', (event) => {
    console.error('GGenius App Error:', event.error);
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}