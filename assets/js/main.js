// ===== MAGIC CORNER WEBSITE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Magic Corner website loaded successfully!');
    
    // ===== NAVIGATION FUNCTIONALITY =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Add haptic feedback for mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active link management
    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveLink();
    
    // ===== SMOOTH SCROLLING =====
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

// only smooth-scroll *clicks*, not the initial arrival
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
}

document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  })
);

window.addEventListener('load', () => {
    document.querySelector('.hero-container')?.classList.add('loaded');
  });

  // Menu Filtering (for menu.html)
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        menuItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Add smooth scrolling for better UX
document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.menu-container').offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// Add loading animation for menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

/* ===== MOBILE SUB-MENU ACCORDION ===== */
const subParents = document.querySelectorAll('.nav-menu li:has(.sub-menu-1)');

subParents.forEach(li => {
  const topLink = li.querySelector('.nav-link');
  const subMenu = li.querySelector('.sub-menu-1');

  topLink?.addEventListener('click', e => {
    if (window.innerWidth > 768) return;          // desktop = hover, ignore click
    e.preventDefault();                           // stop page jump
    const open = subMenu.classList.toggle('open');
    topLink.classList.toggle('open', open);
    topLink.setAttribute('aria-expanded', open);

    /* close siblings (optional) */
    subParents.forEach(sib => {
      if (sib === li) return;
      sib.querySelector('.sub-menu-1').classList.remove('open');
      sib.querySelector('.nav-link').classList.remove('open');
      sib.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
    });
  });
});