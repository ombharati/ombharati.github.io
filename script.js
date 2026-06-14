/**
 * Om Bharati — Systems & Software Engineer
 * UI Control Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeTechnicalExpertise();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeThemeToggle();
    initializeBrandNameCycle();
});

// --- Portfolio Skills Database ---
const SKILLS_DATA = {
    backend: ["Python", "Advanced Python", "C", "Go", "PostgreSQL"],
    infra: ["Linux", "Networking", "Docker", "AWS", "Kubernetes"],
    design: ["System Design", "Distributed Systems"]
};

let activeSkillCategory = "all";

/**
 * Technical Expertise Section - Dynamic Skill Tag Cloud
 */
function initializeTechnicalExpertise() {
    const categoryTabs = document.querySelectorAll('.expertise-tab');
    const tagCloud = document.getElementById('dynamic-tag-cloud');

    if (!tagCloud) return;

    // Render skills initially
    renderSkills();

    // Category filter tabs handler
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeSkillCategory = tab.getAttribute('data-category');
            renderSkills();
        });
    });
}

function renderSkills() {
    const tagCloud = document.getElementById('dynamic-tag-cloud');
    if (!tagCloud) return;

    tagCloud.innerHTML = '';

    // Collect skills by selected category
    let skills = [];
    if (activeSkillCategory === 'all') {
        skills = [...SKILLS_DATA.backend, ...SKILLS_DATA.infra, ...SKILLS_DATA.design];
    } else {
        skills = SKILLS_DATA[activeSkillCategory] || [];
    }

    // Generate static skills tag elements
    skills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = skill;
        tagCloud.appendChild(span);
    });
}

/**
 * Standard interception of anchoring mechanics to allow fluid page transitions.
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navOffset = 64;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll reveal triggers adding `.in-view` to `.reveal` elements as they scroll in.
 */
function initializeScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Handles toggling between light and dark modes via a gravity-based pull cord.
 */
function initializeThemeToggle() {
    const container = document.getElementById('theme-pull-cord');
    const cordLine = document.getElementById('cord-line');
    const cordHandle = document.getElementById('cord-handle');
    const cordHandleRing = document.getElementById('cord-handle-ring');
    if (!container || !cordLine || !cordHandle) return;

    // Retrieve active theme from storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    if (initialTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Physics parameters
    const pivotX = 15;
    const pivotY = 0;
    const restingY = 120;
    
    let hx = 15;
    let hy = 120;
    let vx = 0;
    let vy = 0;
    
    let isDragging = false;
    let themeTriggered = false;
    
    const k = 0.04;        // Spring stiffness
    const damping = 0.88;  // Friction damping
    const gravity = 0.5;   // Gravity strength

    let time = 0;

    // Physics Loop
    function updatePhysics() {
        time += 0.035;
        if (!isDragging) {
            // Apply Spring physics (pulling handle back to pivot at rest length)
            const fx = -k * (hx - pivotX);
            const fy = -k * (hy - restingY);
            
            // Apply gravity
            const forceY = fy + gravity;
            
            // Add a slow, gentle continuous waving/sway force (breeze simulation)
            const sway = Math.sin(time) * 0.07;
            
            vx += fx + sway;
            vy += forceY;
            vx *= damping;
            vy *= damping;
            
            hx += vx;
            hy += vy;
        }
        
        // Render
        const dx = hx - pivotX;
        const dy = hy;
        const currentLength = Math.sqrt(dx * dx + dy * dy);
        let cx = pivotX + dx / 2;
        let cy = hy / 2;
        
        if (currentLength < restingY) {
            const slack = restingY - currentLength;
            // Bow out based on deviation direction
            cx += (dx < 0 ? 0.35 : -0.35) * slack;
            cy += slack * 0.2;
        }
        
        cordLine.setAttribute('d', `M ${pivotX} ${pivotY} Q ${cx} ${cy} ${hx} ${hy}`);
        cordHandle.setAttribute('cx', hx);
        cordHandle.setAttribute('cy', hy);
        if (cordHandleRing) {
            cordHandleRing.setAttribute('cx', hx);
            cordHandleRing.setAttribute('cy', hy);
        }
        
        requestAnimationFrame(updatePhysics);
    }
    
    // Start physics loop
    requestAnimationFrame(updatePhysics);

    // Mouse and Touch Interaction Handlers
    function startDrag(e) {
        isDragging = true;
        themeTriggered = false;
        e.preventDefault();
    }

    function dragMove(e) {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        // Calculate relative coordinates inside container
        let mx = clientX - rect.left;
        let my = clientY - rect.top;
        
        // Constraints
        hx = Math.max(-25, Math.min(55, mx));
        hy = Math.max(30, Math.min(220, my));
        
        // Check for theme trigger pull line (threshold: 165px)
        if (hy > 165 && !themeTriggered) {
            themeTriggered = true;
            toggleTheme();
            triggerPulseRing();
        }
    }

    function endDrag() {
        isDragging = false;
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    function triggerPulseRing() {
        if (!cordHandleRing) return;
        let radius = 14;
        let opacity = 0.8;
        
        function animateRing() {
            radius += 1.5;
            opacity -= 0.05;
            if (opacity > 0) {
                cordHandleRing.setAttribute('r', radius);
                cordHandleRing.setAttribute('opacity', opacity);
                requestAnimationFrame(animateRing);
            } else {
                cordHandleRing.setAttribute('opacity', '0');
                cordHandleRing.setAttribute('r', '14');
            }
        }
        requestAnimationFrame(animateRing);
    }

    // Attach listeners to handle
    cordHandle.addEventListener('mousedown', startDrag);
    cordHandle.addEventListener('touchstart', startDrag, { passive: false });

    // Attach window listeners to track movement outside handle boundary
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
}

/**
 * Loops and morphs the brand logo wordmark between clean, cute, and developer-focused titles.
 */
function initializeBrandNameCycle() {
    const brandName = document.getElementById('brand-name');
    if (!brandName) return;

    const names = [
        'Om Bharati ',
        'Om Bharati ',
        'Om Bharati ',
        'Om Bharati ',
        'Om Bharati ☕',
        'Om Bharati ',
        'Om Bharati '
    ];
    let currentIndex = 0;

    setInterval(() => {
        // Soft slide out & fade
        brandName.style.opacity = 0;
        brandName.style.transform = 'translateY(-4px)';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % names.length;
            brandName.textContent = names[currentIndex];
            
            // Soft slide back in & fade
            brandName.style.opacity = 1;
            brandName.style.transform = 'translateY(0)';
        }, 400); // match style transition duration
    }, 4500); // morphs every 4.5 seconds
}
