// ===== SPLASH SCREEN - FIXED =====
        const splashScreen = document.getElementById('splashScreen');
        const mainContent = document.getElementById('mainContent');
        const enterSiteBtn = document.getElementById('enterSite');
        const splashNavItems = document.querySelectorAll('.splash-screen .nav-item');
        
        function closeSplash(targetSection = null) {
            // Hide splash
            splashScreen.classList.add('hidden');
            
            // Show main content
            mainContent.style.display = 'block';
            
            // Small delay to ensure display is applied before opacity transition
            setTimeout(() => {
                mainContent.classList.add('visible');
                document.body.style.overflow = 'auto';
                
                // Initialize slideshow after content is visible
                initSlideshow();
                
                // Scroll to section if specified
                if (targetSection) {
                    setTimeout(() => {
                        const section = document.querySelector(targetSection);
                        if (section) {
                            const offset = 80;
                            const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
                            window.scrollTo({ top: top, behavior: 'smooth' });
                        }
                    }, 500);
                }
            }, 50);
        }
        
        // Enter site button
        enterSiteBtn.addEventListener('click', () => closeSplash('#home'));
        
        // Splash nav items
        splashNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                closeSplash(item.getAttribute('href'));
            });
        });
        
        // Prevent scroll on splash
        document.body.style.overflow = 'hidden';
        
        // Logo click to show splash again
        document.getElementById('mainLogo').addEventListener('click', () => {
            mainContent.classList.remove('visible');
            setTimeout(() => {
                mainContent.style.display = 'none';
                splashScreen.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }, 300);
        });
        
        // ===== SLIDESHOW =====
        let slides, progressBars, currentSlide = 0, slideInterval;
        const slideDuration = 6000;
        
        function initSlideshow() {
            slides = document.querySelectorAll('.slide');
            progressBars = document.querySelectorAll('.progress-bar');
            
            if (slides.length === 0) return;
            
            updateSlide(0);
            startAutoPlay();
            
            // Arrow buttons
            document.getElementById('prevSlide')?.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
            document.getElementById('nextSlide')?.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
            
            // Progress bars
            progressBars.forEach((bar, i) => {
                bar.addEventListener('click', () => {
                    if (i !== currentSlide) { updateSlide(i); startAutoPlay(); }
                });
            });
        }
        
        function updateSlide(index) {
            if (!slides) return;
            
            slides.forEach(s => s.classList.remove('active'));
            progressBars.forEach(b => {
                b.classList.remove('active');
                const fill = b.querySelector('.progress-fill');
                if (fill) {
                    fill.style.animation = 'none';
                    fill.offsetHeight;
                }
            });
            
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            progressBars[currentSlide]?.classList.add('active');
            
            const fill = progressBars[currentSlide]?.querySelector('.progress-fill');
            if (fill) fill.style.animation = `progressFill ${slideDuration}ms linear forwards`;
            
            const counter = document.querySelector('.slide-counter .current');
            if (counter) counter.textContent = String(currentSlide + 1).padStart(2, '0');
        }
        
        function nextSlide() { updateSlide((currentSlide + 1) % slides.length); }
        function prevSlide() { updateSlide((currentSlide - 1 + slides.length) % slides.length); }
        function startAutoPlay() { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, slideDuration); }
        
        // ===== PARALLAX EFFECT =====
        function handleParallax() {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const heroParallax = document.getElementById('heroParallax');
            if (heroParallax && scrolled < window.innerHeight) {
                heroParallax.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            
            // Services parallax
            const servicesParallax = document.getElementById('servicesParallax');
            const servicesSection = document.getElementById('services');
            if (servicesParallax && servicesSection) {
                const sectionTop = servicesSection.offsetTop;
                const sectionHeight = servicesSection.offsetHeight;
                if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                    const offset = (scrolled - sectionTop + window.innerHeight) * 0.3;
                    servicesParallax.style.transform = `translateY(${-offset * 0.5}px)`;
                }
            }
        }
        
        window.addEventListener('scroll', handleParallax);
        
        // ===== SCROLL ANIMATIONS =====
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Counter animation
                    entry.target.querySelectorAll('.stat-number').forEach(counter => {
                        animateCounter(counter);
                    });
                }
            });
        }, observerOptions);
        
        // Observe elements after main content is ready
        function initScrollAnimations() {
            document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up, .rotate-in, .stagger-children, .line-reveal, .stats').forEach(el => {
                scrollObserver.observe(el);
            });
        }
        
        // Call after splash closes
        setTimeout(initScrollAnimations, 100);
        
        function animateCounter(el) {
            const target = parseInt(el.dataset.count);
            if (!target || el.dataset.animated) return;
            el.dataset.animated = 'true';
            
            let current = 0;
            const step = target / 100;
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target + '+';
                    clearInterval(interval);
                } else {
                    el.textContent = Math.floor(current) + '+';
                }
            }, 20);
        }
        
        // ===== SCROLL PROGRESS =====
        window.addEventListener('scroll', () => {
            const progress = document.getElementById('scrollProgress');
            if (progress) {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                progress.style.width = (scrollTop / docHeight) * 100 + '%';
            }
        });
        
        // ===== NAVBAR =====
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar?.classList.add('scrolled');
            else navbar?.classList.remove('scrolled');
        });
        
        // ===== MOBILE MENU =====
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        menuToggle?.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle?.classList.remove('active');
                navLinks?.classList.remove('active');
            });
        });
        
        // ===== PORTFOLIO FILTER =====
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // ===== SCROLL TO TOP =====
        const scrollTopBtn = document.getElementById('scrollTop');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) scrollTopBtn?.classList.add('visible');
            else scrollTopBtn?.classList.remove('visible');
        });
        
        scrollTopBtn?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('.main-content a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });
        
        // ===== FORM =====
        document.getElementById('contactForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Message Sent! ✓';
                btn.style.background = '#27ae60';
                setTimeout(() => {
                    btn.textContent = 'Send Message';
                    btn.style.background = '';
                    btn.disabled = false;
                    e.target.reset();
                }, 2000);
            }, 1500);
        });
        // Duplicate partner items for seamless infinite scroll
        const partnersTrack = document.getElementById('partnersTrack');
        if (partnersTrack) {
            const items = partnersTrack.children;
            // Clone each item and append to the track
            Array.from(items).forEach(item => {
                const clone = item.cloneNode(true);
                partnersTrack.appendChild(clone);
            });
        }
        //about section word reveal
        function buildWordReveal(elementId, text) {
            const el = document.getElementById(elementId);
            if (!el) return;
            const words = text.split(' ');
            el.innerHTML = words.map(word =>
                `<span class="word" style="opacity:0; display:inline-block; transform:translateY(20px); filter:blur(4px); transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease; margin-right: 5px;">${word}</span>`
            ).join('');
        }

        buildWordReveal('aboutText1',
            'Swafi Films Ltd is a registered Kenyan production company with over a decade of experience creating television content that resonates with carefully targeted audiences.'
        );

        buildWordReveal('aboutText2',
            'We specialize in high-quality TV programming, event curation, personal and company branding, social media strategy, sponsorship, marketing, and talent development. Our seasoned team crafts compelling stories and media experiences that connect audiences, elevate brands, and drive measurable engagement and growth.'
        );

        // Trigger when section comes into view
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach((word, i) => {
                        setTimeout(() => {
                            word.style.opacity = '1';
                            word.style.transform = 'translateY(0)';
                            word.style.filter = 'blur(0)';
                        }, i * 60);
                    });
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const aboutSection = document.getElementById('about');
        if (aboutSection) aboutObserver.observe(aboutSection);