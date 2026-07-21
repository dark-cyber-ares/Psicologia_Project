/* 
========================================================================
   Dra. Clarice Medeiros - Landing Page de Psicologia Clínica
   Lógica e Interações Interativas (Vanilla JS)
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Menu Hambúrguer Mobile ---
    const menuToggle = document.getElementById('menu-toggle-btn');
    const navMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Fecha o menu ao clicar em qualquer link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 2. Efeito Scroll no Header ---
    const header = document.getElementById('header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Executa ao carregar para caso de recarregamento no meio da página

    // --- 3. Efeito de Revelação ao Scroll (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Remove o observer daquele elemento depois que ele foi revelado
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Ativa um pouco antes do elemento aparecer totalmente
    };

    const observer = new IntersectionObserver(revealCallback, revealOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });

    // --- 4. Navegação Ativa (Scrollspy) ---
    const sections = document.querySelectorAll('section[id]');
    
    const scrollspyHandler = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Ajusta compensando o header
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', scrollspyHandler);

    // --- 5. Validação e Envio do Formulário via Web3Forms ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status-msg');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o redirecionamento da página

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const phoneInput = document.getElementById('form-phone');
            const messageInput = document.getElementById('form-message');
            const submitBtn = document.getElementById('form-submit-btn');

            // Validação simples dos campos na própria página
            if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim() || !messageInput.value.trim()) {
                formStatus.className = 'form-status-msg error';
                formStatus.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                return;
            }

            const formData = new FormData(contactForm);

            // Desabilita o botão e exibe estado de envio
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formStatus.className = 'form-status-msg';
            formStatus.textContent = '';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Exibe mensagem de sucesso na própria página sem redirecionar
                    formStatus.className = 'form-status-msg success';
                    formStatus.textContent = ' Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status-msg error';
                    formStatus.textContent = data.message || 'Ocorreu um erro ao enviar. Tente novamente.';
                }
            } catch (error) {
                formStatus.className = 'form-status-msg error';
                formStatus.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';

                // Oculta a mensagem após 7 segundos
                setTimeout(() => {
                    formStatus.className = 'form-status-msg';
                    formStatus.textContent = '';
                }, 7000);
            }
        });
    }
});
