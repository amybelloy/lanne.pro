document.addEventListener('DOMContentLoaded', () => {
    /* Sticky Header */
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* Mobile Menu Toggle */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileToggle.innerHTML = isActive ? 
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' :
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            
            navLinks.style.display = isActive ? 'flex' : 'none';
            if (isActive) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = 'var(--header-height)';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                navLinks.style.zIndex = '999';
            } else {
                navLinks.style = '';
            }
        });
    }

    /* FAQ Accordion Logic */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* AOS-like Scroll Animations */
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    /* Contact Form Functionality */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            const originalBtnText = btn.textContent;
            
            // Collect form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // UI Feedback
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            // 1. Send to Email via Formspree
            const formData = new FormData(this);
            const action = this.getAttribute('action');
            
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).finally(() => {
                // We run the WA redirect regardless of Formspree success to ensure user experience,
                // but usually, we want to know if it sent.
            }).then(response => {
                // 2. Format and Redirect to WhatsApp
                const waMessage = encodeURIComponent(`*Nova Mensagem - Lanne Pro*\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*WhatsApp:* ${whatsapp}\n*Serviço:* ${service}\n*Mensagem:* ${message}`);
                const waUrl = `https://wa.me/5521969736017?text=${waMessage}`;
                
                window.open(waUrl, '_blank');
                
                // Reset form and UI
                this.reset();
                btn.textContent = 'Mensagem Enviada!';
                
                setTimeout(() => {
                    btn.textContent = originalBtnText;
                    btn.disabled = false;
                }, 3000);
            }).catch(error => {
                console.error('Form error:', error);
                alert('Ocorreu um erro ao processar sua mensagem. Redirecionando para o WhatsApp diretamente...');
                
                // Fallback to direct WA
                const waMessage = encodeURIComponent(`*Nova Mensagem - Lanne Pro*\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*WhatsApp:* ${whatsapp}\n*Serviço:* ${service}\n*Mensagem:* ${message}`);
                window.open(`https://wa.me/5521969736017?text=${waMessage}`, '_blank');
                
                btn.textContent = originalBtnText;
                btn.disabled = false;
            });
        });
    }

    /* Active Link Highlighting */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });

    /* Back to Top Button */
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    backToTop.className = 'back-to-top';
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '100px',
        right: '35px',
        width: '40px',
        height: '40px',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '998',
        transition: 'all 0.3s'
    });
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
