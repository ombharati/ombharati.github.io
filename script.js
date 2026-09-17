document.addEventListener('DOMContentLoaded', () => {
    initializeTechnicalExpertise();
    initializeFeaturedProjects();
    initializeSmoothScrolling();
    initializeScrollAnimations();
});

const EXPLORING_DATA = {
    systems: [
        "Operating Systems",
        "Computer Networking",
        "Linux",
        "Concurrency"
    ],
    architecture: [
        "Database Internals",
        "System Design",
        "Backend Concepts"
    ],
    workflows: [
        "Command-Line Tools",
        "CI/CD Pipelines",
        "Automation",
        "Git & GitHub"
    ]
};

const PROJECTS_DATA = [
    {
        title: "Liftoff Protocol",
        description: "A C++ command-line launch simulation built to practice language fundamentals, pre-flight parameter validation, and sequential control flow.",
        tags: ["C++", "CLI", "Simulation"],
        repoUrl: "https://github.com/ombharati/liftoff-protocol",
        status: "Completed",
        statusClass: "status-complete"
    },
    {
        title: "Spreadsheet Engine",
        description: "A lightweight spreadsheet computation engine in Python built to explore AST-based formula parsing, cell dependency tracking, and cycle detection.",
        tags: ["Python", "Algorithms", "CLI"],
        repoUrl: "https://github.com/ombharati/spreadsheet-engine",
        status: "Completed",
        statusClass: "status-complete"
    },
    {
        title: "Budget Guardian",
        description: "A Python CLI tool for evaluating expense decisions against monthly savings goals, built to practice input validation, conditional logic, and program structure.",
        tags: ["Python", "CLI", "Validation"],
        repoUrl: "https://github.com/ombharati/Budget-Guardian",
        status: "Completed",
        statusClass: "status-complete"
    },
    {
        title: "Linux System Info",
        description: "A lightweight Python CLI utility that displays core Linux system metrics—including CPU core count, memory usage, disk utilization, and uptime.",
        tags: ["Python", "Linux", "CLI"],
        repoUrl: "https://github.com/ombharati/Linux-System-Info",
        status: "Completed",
        statusClass: "status-complete"
    }
];

let activeSkillCategory = "all";

function initializeTechnicalExpertise() {
    const categoryTabs = document.querySelectorAll('.expertise-tab');
    const tagCloud = document.getElementById('dynamic-tag-cloud');

    if (!tagCloud) return;

    renderSkills();

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
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

    let topics = [];
    if (activeSkillCategory === 'all') {
        topics = Array.from(new Set([
            ...EXPLORING_DATA.systems,
            ...EXPLORING_DATA.architecture,
            ...EXPLORING_DATA.workflows
        ]));
    } else {
        topics = EXPLORING_DATA[activeSkillCategory] || [];
    }

    topics.forEach(topic => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = topic;
        tagCloud.appendChild(span);
    });
}

function initializeFeaturedProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';
    PROJECTS_DATA.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-dashboard-card';
        
        card.innerHTML = `
            <div class="project-card-inner">
                <div class="project-card-header">
                    <h4 class="project-card-title">${project.title}</h4>
                    <div class="project-card-header-actions">
                        <span class="project-card-status-badge ${project.statusClass || 'status-complete'}">${project.status || 'Completed'}</span>
                        <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="project-card-link-badge" aria-label="View ${project.title} on GitHub">
                            GitHub ↗
                        </a>
                    </div>
                </div>
                <div class="project-card-body">
                    <p class="project-card-description">${project.description}</p>
                </div>
            </div>
            <div class="project-card-footer">
                <div class="project-card-tags">
                    ${project.tags.map(tag => `<span class="project-card-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                window.open(project.repoUrl, '_blank', 'noopener,noreferrer');
            }
        });

        projectsGrid.appendChild(card);
    });
}

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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}
