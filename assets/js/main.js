document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode Toggle
    const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle, #drawer-theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
        updateThemeIcons(true);
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const isDark = htmlElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
        });
    });

    function updateThemeIcons(isDark) {
        themeToggleBtns.forEach(btn => {
            if (isDark) {
                btn.innerHTML = '<i class="fa-solid fa-sun"></i>' + (btn.id.includes('drawer') ? ' Light' : '');
            } else {
                btn.innerHTML = '<i class="fa-solid fa-moon"></i>' + (btn.id.includes('drawer') ? ' Dark' : '');
            }
        });
    }

    // 2. RTL Toggle
    const rtlToggleBtns = document.querySelectorAll('#rtl-toggle, #mobile-rtl-toggle, #drawer-rtl-toggle-btn');
    let isRtl = false;

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            isRtl = !isRtl;
            htmlElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
        });
    });

    // 3. Mobile/Tablet Drawer Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerMenu = document.getElementById('drawer-menu');
    const drawerOverlay = document.getElementById('drawer-overlay');

    function openDrawer() {
        drawerOverlay.classList.remove('hidden');
        // Small delay to allow display block to apply before opacity transition
        setTimeout(() => drawerOverlay.classList.remove('opacity-0'), 10);
        
        // Remove the negative translation so it slides in
        drawerMenu.classList.remove('-translate-x-full', 'rtl:translate-x-full');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeDrawer() {
        drawerOverlay.classList.add('opacity-0');
        drawerMenu.classList.add('-translate-x-full', 'rtl:translate-x-full');
        
        // Wait for opacity transition to finish before hiding
        setTimeout(() => {
            drawerOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore body scroll
        }, 300);
    }

    if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // 3b. Drawer Accordion Logic (Home Dropdown)
    const drawerHomeBtn = document.getElementById('drawer-home-btn');
    const drawerHomeMenu = document.getElementById('drawer-home-menu');
    const drawerHomeIcon = document.getElementById('drawer-home-icon');

    if(drawerHomeBtn) {
        drawerHomeBtn.addEventListener('click', () => {
            drawerHomeMenu.classList.toggle('hidden');
            drawerHomeIcon.classList.toggle('rotate-180');
        });
    }

    // 4. Sticky Navbar Shadow on Scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
        });
    }

    // 5. Countdown Timer for Flash Sale
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        // Set a dummy end time 2 days from now
        const endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
        
        setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) return;
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    // 6. Active Nav Link Highlighting for All Pages
    function highlightActiveNav() {
        const rawPath = window.location.pathname;
        let currentFile = rawPath.substring(rawPath.lastIndexOf('/') + 1);
        if (!currentFile || currentFile === '' || currentFile === '/') {
            currentFile = 'index.html';
        }

        // Desktop nav links
        const desktopNavLinks = document.querySelectorAll('#main-nav-links a');
        const desktopHomeBtn = document.querySelector('#main-nav-links > div > button');

        // Reset desktop Home button
        if (desktopHomeBtn) {
            desktopHomeBtn.classList.remove('text-primary-custom', 'text-primary', 'font-bold', 'active');
            desktopHomeBtn.classList.add('text-gray-800', 'dark:text-gray-200');
        }

        desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('text-primary-custom', 'text-primary', 'font-bold', 'active');
            link.classList.add('text-gray-800', 'dark:text-gray-200');

            if (href === currentFile) {
                link.classList.remove('text-gray-800', 'dark:text-gray-200');
                link.classList.add('text-primary', 'font-bold', 'active');

                // Highlight Home dropdown button if on Home 1 or Home 2
                if (currentFile === 'index.html' || currentFile === 'home2.html') {
                    if (desktopHomeBtn) {
                        desktopHomeBtn.classList.remove('text-gray-800', 'dark:text-gray-200');
                        desktopHomeBtn.classList.add('text-primary', 'font-bold', 'active');
                    }
                }
            }
        });

        // Mobile drawer nav links
        const drawerNavLinks = document.querySelectorAll('#drawer-menu a');
        const drawerHomeBtn = document.getElementById('drawer-home-btn');

        if (drawerHomeBtn) {
            drawerHomeBtn.classList.remove('text-primary', 'font-bold');
            drawerHomeBtn.classList.add('text-gray-700', 'dark:text-gray-200');
        }

        drawerNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Do not override CTA styling on login button in drawer
            if (href === 'login.html' && link.classList.contains('bg-primary')) {
                return;
            }

            link.classList.remove('text-primary', 'font-bold', 'active');
            if (!link.closest('#drawer-home-menu')) {
                link.classList.add('text-gray-700', 'dark:text-gray-200');
            } else {
                link.classList.add('text-gray-600', 'dark:text-gray-400');
            }

            if (href === currentFile) {
                link.classList.remove('text-gray-700', 'dark:text-gray-200', 'text-gray-600', 'dark:text-gray-400');
                link.classList.add('text-primary', 'font-bold', 'active');

                if (currentFile === 'index.html' || currentFile === 'home2.html') {
                    if (drawerHomeBtn) {
                        drawerHomeBtn.classList.remove('text-gray-700', 'dark:text-gray-200');
                        drawerHomeBtn.classList.add('text-primary', 'font-bold');
                    }
                }
            }
        });
    }

    highlightActiveNav();
});

