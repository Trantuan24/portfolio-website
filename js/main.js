/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

navLink.forEach(n => n.addEventListener('click', () => {
    document.getElementById('nav-menu').classList.remove('show-menu')
}))

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
      skillsHeader = document.querySelectorAll('.skills__header')

skillsHeader.forEach((el) => {
    el.addEventListener('click', function() {
        const itemClass = this.parentNode.className;

        // Close all skills sections
        for(let i = 0; i < skillsContent.length; i++){
            skillsContent[i].className = 'skills__content skills__close';
        }

        // Open clicked section if it was closed
        if(itemClass === 'skills__content skills__close'){
            this.parentNode.className = 'skills__content skills__open';
        }
    });
})

/*==================== QUALIFICATION TABS ====================*/
const qualificationTabs = document.querySelectorAll('.qualification__tab[role="tab"]')
const qualificationPanels = document.querySelectorAll('.qualification__panel[role="tabpanel"]')

// Function to switch tabs
function switchQualificationTab(targetTab) {
    const targetId = targetTab.dataset.target
    const targetPanel = document.getElementById(targetId + '-panel')

    // Remove active state from all tabs
    qualificationTabs.forEach(tab => {
        tab.classList.remove('qualification__tab--active')
        tab.setAttribute('aria-selected', 'false')
        tab.setAttribute('tabindex', '-1')
    })

    // Remove active state from all panels
    qualificationPanels.forEach(panel => {
        panel.classList.remove('qualification__panel--active')
    })

    // Activate target tab and panel
    targetTab.classList.add('qualification__tab--active')
    targetTab.setAttribute('aria-selected', 'true')
    targetTab.setAttribute('tabindex', '0')
    targetTab.focus()

    if (targetPanel) {
        targetPanel.classList.add('qualification__panel--active')
    }

    // Only update URL hash if user explicitly clicked a tab
    // Don't update hash during initialization to prevent auto-scrolling
    if (targetTab && targetTab.getAttribute('data-clicked') === 'true') {
        window.history.replaceState(null, null, '#' + targetId)
        targetTab.removeAttribute('data-clicked')
    }
}

// Add click event listeners
qualificationTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault()
        tab.setAttribute('data-clicked', 'true')
        switchQualificationTab(tab)
    })

    // Add keyboard navigation
    tab.addEventListener('keydown', (e) => {
        const currentIndex = Array.from(qualificationTabs).indexOf(tab)
        let targetTab = null

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault()
                switchQualificationTab(tab)
                break
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault()
                const prevIndex = currentIndex === 0 ? qualificationTabs.length - 1 : currentIndex - 1
                targetTab = qualificationTabs[prevIndex]
                switchQualificationTab(targetTab)
                break
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault()
                const nextIndex = currentIndex === qualificationTabs.length - 1 ? 0 : currentIndex + 1
                targetTab = qualificationTabs[nextIndex]
                switchQualificationTab(targetTab)
                break
        }
    })
})

// Initialize on page load
function initializeQualificationTabs() {
    const hash = window.location.hash.replace('#', '')
    let targetTab = null

    // Only switch tabs if there's a specific hash for education or experience
    if (hash === 'education' || hash === 'experience') {
        targetTab = document.querySelector(`[data-target="${hash}"]`)
        if (targetTab) {
            switchQualificationTab(targetTab)
        }
    }
    // Don't auto-switch to education tab if no hash is present
    // The default active state is already set in HTML
}

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'education' || hash === 'experience') {
        const targetTab = document.querySelector(`[data-target="${hash}"]`)
        if (targetTab) {
            switchQualificationTab(targetTab)
        }
    }
})

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeQualificationTabs)



/*==================== PROJECTS CAROUSEL ====================*/
class ProjectsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.projects__slide');
        this.dots = document.querySelectorAll('.projects__dot');
        this.prevBtn = document.getElementById('projects-prev');
        this.nextBtn = document.getElementById('projects-next');
        this.totalSlides = this.slides.length;

        this.init();
    }

    init() {
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Add event listeners for pagination dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-play functionality (optional)
        this.startAutoPlay();

        // Pause auto-play on hover
        const carousel = document.querySelector('.projects__carousel');
        carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    goToSlide(slideIndex) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('projects__slide--active');
        this.dots[this.currentSlide].classList.remove('projects__dot--active');

        // Update current slide index
        this.currentSlide = slideIndex;

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('projects__slide--active');
        this.dots[this.currentSlide].classList.add('projects__dot--active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize the carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsCarousel();
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')




// Combined scroll event handler for better performance
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header scroll effect
    const nav = document.getElementById('header');
    if(scrollY >= 80) nav.classList.add('scroll-header');
    else nav.classList.remove('scroll-header');

    // Scroll up button
    const scrollUp = document.getElementById('scroll-up');
    if(scrollY >= 560) scrollUp.classList.add('show-scroll');
    else scrollUp.classList.remove('show-scroll');

    // Active navigation link
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
})

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'fa-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains('fa-sun') ? 'fa-sun' : 'fa-moon'

// Initialize theme based on saved preference or default to light
if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  // Set correct icon based on theme
  if (selectedTheme === 'dark') {
    themeButton.classList.remove('fa-moon')
    themeButton.classList.add('fa-sun')
  } else {
    themeButton.classList.remove('fa-sun')
    themeButton.classList.add('fa-moon')
  }
} else {
  // Default to light theme with moon icon
  themeButton.classList.remove('fa-sun')
  themeButton.classList.add('fa-moon')
}

// Activate / deactivate the theme manually with the button
if (themeButton) {
    themeButton.addEventListener('click', () => {
        // Toggle theme
        document.body.classList.toggle(darkTheme)

        // Change icon based on current theme
        if (document.body.classList.contains(darkTheme)) {
            // Dark theme active - show sun icon
            themeButton.classList.remove('fa-moon')
            themeButton.classList.add('fa-sun')
        } else {
            // Light theme active - show moon icon
            themeButton.classList.remove('fa-sun')
            themeButton.classList.add('fa-moon')
        }

        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })
}

/*==================== SMOOTH SCROLLING ====================*/
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

/*==================== CONTACT FORM ====================*/
// Logic tạm thời được lược bỏ theo yêu cầu. Chỉ giữ UI, không xử lý submit/validate.

/*==================== WAVE BUTTON ANIMATION ====================*/
// Logic animation tạm thời lược bỏ
