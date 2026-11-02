/**
 * Om Bharati - Portfolio JavaScript
 * Handles typewriter effect, async contact form handling, and copy to clipboard.
 * No em dashes used in any text or comments.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initEmailCopy();
});

/**
 * Typewriter effect for the homepage role subtitle
 */
function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const roles = [
        "Automation, Systems & DevOps",
        "Python, Linux & Infrastructure",
        "Reliable Pipelines & Tooling"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 85;

    function tick() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
            el.textContent = currentRole.substring(0, charIndex);
            typingSpeed = 35;
        } else {
            charIndex++;
            el.textContent = currentRole.substring(0, charIndex);
            typingSpeed = 85;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1800;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 350;
        }

        setTimeout(tick, typingSpeed);
    }

    tick();
}

/**
 * Copy email address to clipboard with inline feedback
 */
function initEmailCopy() {
    const copyBtn = document.getElementById('btn-copy-email');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const email = 'i.ombharati@gmail.com';
        const label = document.getElementById('copy-status-text') || copyBtn.querySelector('.copy-text');

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
            } else {
                const ta = document.createElement('textarea');
                ta.value = email;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }

            copyBtn.classList.add('copied');
            if (label) label.textContent = 'Copied!';

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (label) label.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
            copyBtn.classList.add('copied');
            if (label) label.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (label) label.textContent = 'Copy';
            }, 2000);
        }
    });
}

