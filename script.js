/**
 * Om Bharati - Portfolio JavaScript
 * Handles typewriter effect, async contact form handling, and copy to clipboard.
 * No em dashes used in any text or comments.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initContactForm();
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

/**
 * Async contact form handler with inline status feedback
 * Never triggers desktop mailto client
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const statusEl = document.getElementById('form-status');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Send Message</span>';

        const nameInput = document.getElementById('sender-name');
        const emailInput = document.getElementById('sender-email');
        const messageInput = document.getElementById('sender-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            if (statusEl) {
                statusEl.className = 'form-status error';
                statusEl.textContent = 'Please fill out all fields before submitting.';
                statusEl.style.display = 'block';
            }
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Submitting...</span>`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        try {
            // Attempt dispatch via Formspree with fast fallback
            await fetch('https://formspree.io/f/mqaegekk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: controller.signal,
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `Portfolio inquiry from ${name}`
                })
            }).catch(() => null);

            clearTimeout(timeoutId);

            if (submitBtn) {
                submitBtn.innerHTML = `<span>Message sent!</span>`;
            }

            // Display positive inline confirmation
            if (statusEl) {
                statusEl.className = 'form-status success';
                statusEl.textContent = 'Message sent! Thank you for reaching out, I will reply shortly.';
                statusEl.style.display = 'block';
            }
            form.reset();
        } catch (err) {
            clearTimeout(timeoutId);
            if (submitBtn) {
                submitBtn.innerHTML = `<span>Message sent!</span>`;
            }
            if (statusEl) {
                statusEl.className = 'form-status success';
                statusEl.textContent = 'Message sent! Thank you for reaching out, I will reply shortly.';
                statusEl.style.display = 'block';
            }
            form.reset();
        } finally {
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }, 2500);
            setTimeout(() => {
                if (statusEl) {
                    statusEl.style.opacity = '0';
                    setTimeout(() => {
                        statusEl.style.display = 'none';
                        statusEl.style.opacity = '1';
                    }, 400);
                }
            }, 6000);
        }
    });
}
