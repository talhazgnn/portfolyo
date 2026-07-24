document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lenis for buttery smooth global scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing function
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Smooth scrolling for navigation links using Lenis
    const navLinks = document.querySelectorAll('.nav-links a, .hero-cta a, .logo');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                // Immediately set active class visually for snappiness
                document.querySelectorAll('.nav-links a').forEach(n => n.classList.remove('active'));
                this.classList.add('active');

                // Use Lenis to scroll smoothly to the target, with an offset for the navbar
                lenis.scrollTo(targetId, {
                    offset: -90,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // 3. Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 4. Scroll Spy (Highlight active section in navbar)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -49% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navItems.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
                
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 5. Interactive Terminal Logic
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const termCard = document.getElementById('interactive-terminal');
    const termBody = document.getElementById('terminal-body-scroll');
    
    if (termInput && termOutput) {
        // ASCII Welcome Boot Sequence
        const asciiArt = `
 __      __   _                    
 \\ \\    / /__| |__ ___ _ __  ___ 
  \\ \\/\\/ / -_) / _/ _ \\ '  \\/ -_)
   \\_/\\_/\\___|_\\__\\___/_|_|_\\___|
`;
        termInput.disabled = true;
        termInput.placeholder = "Booting...";
        
        setTimeout(() => {
            termOutput.innerHTML = `<pre class="term-ascii">${asciiArt}</pre>`;
            termBody.scrollTop = termBody.scrollHeight;
            
            setTimeout(() => {
                termOutput.innerHTML += `<div class="term-line"><span class="term-prompt">talha@server:~$</span> <span class="term-cmd">./initialize_system.sh</span></div>`;
                termBody.scrollTop = termBody.scrollHeight;
                
                setTimeout(() => {
                    termOutput.innerHTML += `<div class="term-line term-success">[OK] System architecture loaded.</div>`;
                    termBody.scrollTop = termBody.scrollHeight;
                    
                    setTimeout(() => {
                        termOutput.innerHTML += `<div class="term-line term-success">[OK] Ready for commands. Type 'help' to start.</div>`;
                        termBody.scrollTop = termBody.scrollHeight;
                        termInput.placeholder = "";
                        termInput.disabled = false;
                        termInput.focus();
                    }, 400);
                }, 500);
            }, 600);
        }, 400);

        // Auto focus when clicking on the terminal
        termCard.addEventListener('click', () => {
            termInput.focus();
        });

        termInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const cmd = this.value.trim();
                
                // Echo command
                if (cmd) {
                    const cmdLine = document.createElement('div');
                    cmdLine.className = 'term-line';
                    cmdLine.innerHTML = `<span class="term-prompt">talha@server:~$</span> <span class="term-cmd">${cmd}</span>`;
                    termOutput.appendChild(cmdLine);
                } else {
                    const emptyLine = document.createElement('div');
                    emptyLine.className = 'term-line';
                    emptyLine.innerHTML = `<span class="term-prompt">talha@server:~$</span>`;
                    termOutput.appendChild(emptyLine);
                    termBody.scrollTop = termBody.scrollHeight;
                    return;
                }
                
                // Process command
                const responseLine = document.createElement('div');
                responseLine.className = 'term-line';
                const lowerCmd = cmd.toLowerCase();
                
                if (lowerCmd === 'help') {
                    responseLine.innerHTML = `Available commands:<br>&nbsp;&nbsp;<b>about</b>&nbsp;&nbsp;&nbsp;&nbsp;Display developer info<br>&nbsp;&nbsp;<b>skills</b>&nbsp;&nbsp;&nbsp;List core competencies<br>&nbsp;&nbsp;<b>projects</b>&nbsp;Navigate to projects module<br>&nbsp;&nbsp;<b>clear</b>&nbsp;&nbsp;&nbsp;&nbsp;Clear terminal output`;
                } else if (lowerCmd === 'about') {
                    responseLine.innerHTML = `> Talha Zengin | Software Engineer<br>> Focus: Robust architecture & striking design.<br>> Mission: Delivering zero-compromise digital experiences.`;
                } else if (lowerCmd === 'skills') {
                    responseLine.innerHTML = `[+] Python (Backend & GUI)<br>[+] Java, C Programming<br>[+] Network Systems (VLAN, DHCP)<br>[+] Cybersecurity & Pentesting<br>[+] HTML5, CSS3, JS, SQL/NoSQL`;
                } else if (lowerCmd === 'projects') {
                    responseLine.className = 'term-line term-success';
                    responseLine.innerHTML = `[OK] Initializing project module...`;
                    const projLink = document.querySelector('a[href="#projects"]');
                    if(projLink) setTimeout(() => projLink.click(), 500);
                } else if (lowerCmd === 'clear') {
                    termOutput.innerHTML = '';
                    this.value = '';
                    return;
                } else {
                    responseLine.className = 'term-line term-error';
                    responseLine.innerHTML = `Command not found: ${cmd}. Type 'help' for available commands.`;
                }
                
                termOutput.appendChild(responseLine);
                this.value = '';
                
                // Scroll to bottom
                setTimeout(() => {
                    termBody.scrollTop = termBody.scrollHeight;
                }, 10);
            }
        });
    }

    // 6. Mobile Projects Load More
    const loadMoreBtn = document.getElementById('load-more-projects');
    const projectGrid = document.getElementById('project-grid');
    if (loadMoreBtn && projectGrid) {
        loadMoreBtn.addEventListener('click', () => {
            projectGrid.classList.toggle('show-all');
            
            if (projectGrid.classList.contains('show-all')) {
                loadMoreBtn.innerHTML = 'Daha azını göster <i class="fa-solid fa-chevron-up" style="margin-left: 5px;"></i>';
            } else {
                loadMoreBtn.innerHTML = 'Daha fazlasını görmek için tıkla <i class="fa-solid fa-chevron-down" style="margin-left: 5px;"></i>';
                
                // Scroll back up slightly so the user doesn't lose their place
                const y = projectGrid.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    }

    // 7. Mobile Skills Accordion
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // If this is already active, close it
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    // Open it
                    this.classList.add('active');
                }
            }
        });
    });
});
