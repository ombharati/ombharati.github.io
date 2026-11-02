/**
 * Om Bharati - Portfolio JavaScript
 * Handles typewriter effect, contact form handling, and minimal UI interactions.
 * No em dashes used in any text or comments.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initContactForm();
});

/**
 * Typewriter effect for the homepage role subtitle
 */
function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const roles = [
        "Software Engineering Student",
        "Computer Science Undergraduate",
        "Systems & Backend Explorer"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function tick() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
            el.textContent = currentRole.substring(0, charIndex);
            typingSpeed = 40;
        } else {
            charIndex++;
            el.textContent = currentRole.substring(0, charIndex);
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at complete word
            isDeleting = true;
            typingSpeed = 1800;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(tick, typingSpeed);
    }

    tick();
}

/**
 * Contact form helper for static deployment
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        // Fallback to mailto link composition if no backend endpoint is configured
        const action = form.getAttribute('action');
        if (!action || action === '#' || action.startsWith('mailto:')) {
            e.preventDefault();
            const name = document.getElementById('sender-name')?.value || '';
            const email = document.getElementById('sender-email')?.value || '';
            const message = document.getElementById('sender-message')?.value || '';

            const subject = encodeURIComponent(`Portfolio Message from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:i.ombharati@gmail.com?subject=${subject}&body=${body}`;
        }
    });
}
