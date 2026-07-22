document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll with Lenis
    window.lenis = null;
    if (typeof Lenis !== 'undefined') {
        window.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            window.lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .code-snippet-window, .project-card');

    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });
    } else {
        // Hide custom cursor on mobile
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Simple smooth reveal for project cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, box-shadow 0.3s ease`;
        observer.observe(card);
    });

    // Typewriter Effect for Logo
    const logoTextElement = document.querySelector('.logo-text');
    const word = 'Talha Zengin.';
    let isDeleting = false;
    let textIndex = 0;
    
    function typeWriter() {
        if (!logoTextElement) return;
        const currentText = word.substring(0, textIndex);
        
        if (currentText.length > 6) {
            const firstPart = currentText.substring(0, 6);
            const secondPart = currentText.substring(6, 12);
            const thirdPart = currentText.length > 12 ? currentText.substring(12) : "";
            logoTextElement.innerHTML = `${firstPart}<span style="color: var(--accent)">${secondPart}</span>${thirdPart}`;
        } else {
            logoTextElement.textContent = currentText;
        }
        
        let typeSpeed = 150;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && currentText === word) {
            typeSpeed = 5000; // Pause at end (longer)
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            typeSpeed = 500; // Pause before typing again
        }
        
        if (isDeleting) {
            textIndex--;
        } else {
            textIndex++;
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    setTimeout(typeWriter, 1000);

    // Creative Realistic Tear/Glitch Effect
    function triggerRealisticGlitch(element) {
        if (element.querySelector('.glitch-clone')) return; // Prevent infinite cloning
        
        const isCodeWindow = element.classList.contains('code-snippet-window');
        
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        // Helper to create a single glitch slice
        const createSlice = (color, shiftX, skewY, scale) => {
            const clone = element.cloneNode(true);
            clone.classList.add('glitch-clone');
            clone.style.pointerEvents = 'none';
            clone.style.position = 'absolute';
            clone.style.top = '0';
            clone.style.left = '0';
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.margin = '0';
            clone.style.padding = '0';
            clone.style.boxSizing = 'border-box';
            clone.style.mixBlendMode = 'exclusion';
            
            const clipTop = Math.random() * 80;
            const sliceHeight = isCodeWindow ? (Math.random() * 40 + 10) : (Math.random() * 20 + 5);
            const clipBottom = 100 - clipTop - sliceHeight;
            clone.style.clipPath = `inset(${clipTop}% -20% ${clipBottom}% -20%)`;
            
            clone.style.transform = `translateX(${shiftX}px) skewY(${skewY}deg) scale(${scale})`;
            clone.style.filter = `drop-shadow(4px 0 0 ${color})`;
            clone.style.backgroundColor = isCodeWindow ? 'rgba(255,255,255,0.05)' : 'transparent';
            
            element.appendChild(clone);
            
            const duration = isCodeWindow ? (Math.random() * 100 + 50) : (Math.random() * 60 + 20);
            setTimeout(() => clone.remove(), duration);
        };

        const intensity = isCodeWindow ? 100 : 30;
        
        // Red/Magenta slice
        createSlice('#ff003c', (Math.random() - 0.5) * intensity, Math.random() * 2 - 1, 1.02);
        // Cyan/Blue slice
        createSlice('#00f0ff', (Math.random() - 0.5) * intensity, Math.random() * -2 + 1, 0.98);
        
        // Extra intense slice for code window occasionally
        if (isCodeWindow && Math.random() > 0.3) {
            createSlice('var(--accent)', (Math.random() - 0.5) * intensity * 1.5, Math.random() * 5 - 2.5, 1.05);
        }
    }

    // Floating Shapes (About section)
    const shapes = document.querySelectorAll('.geometric-circle, .geometric-rectangle, .geometric-square');
    shapes.forEach(shape => {
        let x = 0, y = 0;
        
        setInterval(() => {
            x = (Math.random() - 0.5) * 40; // Random movement range
            y = (Math.random() - 0.5) * 40;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        }, 1000);

        shape.addEventListener('mouseenter', () => {
            x = (Math.random() - 0.5) * 200; // Aggressive scatter
            y = (Math.random() - 0.5) * 200;
            shape.style.transform = `translate(${x}px, ${y}px) scale(1.2) rotate(${Math.random() * 45}deg)`;
            shape.style.backgroundColor = '#9d00ff';
        });

        shape.addEventListener('mouseleave', () => {
            shape.style.backgroundColor = ''; // Revert color
        });
    });

    // Trigger Realistic Glitches for Text (Occasional)
    const textTargets = document.querySelectorAll('.glitch-text');
    setInterval(() => {
        const target = textTargets[Math.floor(Math.random() * textTargets.length)];
        if (target) {
            const tears = Math.floor(Math.random() * 3) + 2; // 2 to 4 rapid tears
            for(let i=0; i<tears; i++) {
                setTimeout(() => triggerRealisticGlitch(target), i * 50);
            }
        }
    }, 2000);

    // Trigger Continuous Glitch for Code Snippet
    const codeSnippet = document.querySelector('.code-snippet-window');
    if (codeSnippet) {
        setInterval(() => {
            triggerRealisticGlitch(codeSnippet);
        }, 2000);
    }
    
    // Aggressive Glitch for whoami
    const whoami = document.getElementById('whoami-title');
    if (whoami) {
        setInterval(() => {
            const tears = Math.floor(Math.random() * 4) + 3; // 3 to 6 rapid tears
            for(let i=0; i<tears; i++) {
                setTimeout(() => triggerRealisticGlitch(whoami), i * 30);
            }
        }, 1200); // Triggers more frequently
    }
    
    // Active Section Observer
    let currentActiveSection = '';
    
    function updateNavbarActive(activeId) {
        currentActiveSection = activeId;
        document.querySelectorAll('.nav-link').forEach(nav => {
            if (nav.getAttribute('href') === activeId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    // Robust Scroll Spy for Active Section
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section, footer');
        
        sections.forEach(section => {
            if (section.id) {
                const sectionTop = section.offsetTop;
                // Activate section when it reaches the top 1/3 of the screen
                if (window.scrollY >= sectionTop - window.innerHeight / 3) {
                    current = '#' + section.id;
                }
            }
        });

        // Fallback: Force #contact to be active if scrolled to the absolute bottom
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
            current = '#contact';
        }

        if (current && current !== currentActiveSection) {
            updateNavbarActive(current);
        }
    });

    // Tear Navigation Effect
    const navLinks = document.querySelectorAll('.nav-link, .footer-link, .btn-primary, .project-link, .logo-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHref = link.getAttribute('href');
            if (!targetHref || targetHref === '#') return;

            e.preventDefault();
            
            // Prevent transition if already in the target section
            if (targetHref === currentActiveSection) {
                return;
            }

            // Add Tear Off class
            document.body.classList.add('page-tearing-out');
            
            // Wait for the chaos to finish (400ms)
            setTimeout(() => {
                if (targetHref.startsWith('#')) {
                    // Same page anchor
                    const targetEl = document.querySelector(targetHref);
                    if (targetEl) {
                        if (window.lenis) {
                            window.lenis.scrollTo(targetEl, { immediate: true });
                        } else {
                            targetEl.scrollIntoView();
                        }
                    }
                    
                    // Switch to Tear In phase
                    document.body.classList.remove('page-tearing-out');
                    document.body.classList.add('page-tearing-in');
                    
                    // Remove all classes after the turn-on animation completes (400ms)
                    setTimeout(() => {
                        document.body.classList.remove('page-tearing-in');
                    }, 400);
                } else {
                    // Different page URL
                    window.location.href = targetHref;
                }
            }, 400); // Trigger turn on after 400ms
        });
    });

    // Random Teleport Effect for HATA text
    const errorText = document.querySelector('.status-error');
    if (errorText) {
        const teleportRandomly = () => {
            // Only teleport occasionally (every 2-5 seconds)
            const nextTeleport = Math.random() * 3000 + 2000; 
            
            setTimeout(() => {
                // Number of jumps in this burst (1 to 3)
                const jumps = Math.floor(Math.random() * 3) + 1;
                let currentJump = 0;
                
                const jumpInterval = setInterval(() => {
                    if (currentJump >= jumps) {
                        // Reset to normal
                        errorText.style.transform = `translate(0px, 0px)`;
                        errorText.style.opacity = 1;
                        clearInterval(jumpInterval);
                        teleportRandomly(); // Schedule next teleport
                    } else {
                        // Random coordinates between -15 and +15
                        const x = (Math.random() - 0.5) * 30;
                        const y = (Math.random() - 0.5) * 20;
                        // Random opacity drop (30% chance to blink out)
                        const opacity = Math.random() > 0.7 ? 0 : (Math.random() * 0.5 + 0.5);
                        
                        errorText.style.transform = `translate(${x}px, ${y}px)`;
                        errorText.style.opacity = opacity;
                        currentJump++;
                    }
                }, 100); // 100ms per jump frame
            }, nextTeleport);
        };
        teleportRandomly();
    }
});
