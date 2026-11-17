document.addEventListener('DOMContentLoaded', () => {
  // 1. Año actual dinámico en el Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Navegación entre Portafolio completo y vista Blog (En construcción)
  const mainContent = document.getElementById('mainContent');
  const blogView = document.getElementById('blogView');
  const btnBlog = document.getElementById('btnBlog');
  const btnVolverPortafolio = document.getElementById('btnVolverPortafolio');
  const sectionLinks = document.querySelectorAll('.nav-link-section');
  const navbarCollapse = document.getElementById('navbarMain');

  // Función para cerrar el menú hamburguesa en móviles al hacer clic
  function closeMobileMenu() {
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  }

  // Mostrar solo Navbar + Anuncio Blog + Footer
  btnBlog.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.classList.add('d-none');
    blogView.classList.remove('d-none');

    // Actualizar estado activo en navbar
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => link.classList.remove('active'));
    btnBlog.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
  });

  // Volver a las secciones del portafolio desde cualquier enlace del menú
  sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      const isBlogVisible = !blogView.classList.contains('d-none');

      if (isBlogVisible) {
        e.preventDefault();
        blogView.classList.add('d-none');
        mainContent.classList.remove('d-none');

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }

      document.querySelectorAll('.navbar-nav .nav-link').forEach(nav => nav.classList.remove('active'));
      if (link.classList.contains('nav-link')) {
        link.classList.add('active');
      }
      closeMobileMenu();
    });
  });

  // Botón dentro de la tarjeta de Blog para regresar al inicio
  if (btnVolverPortafolio) {
    btnVolverPortafolio.addEventListener('click', () => {
      blogView.classList.add('d-none');
      mainContent.classList.remove('d-none');

      document.querySelectorAll('.navbar-nav .nav-link').forEach(nav => nav.classList.remove('active'));
      const inicioLink = document.querySelector('.nav-link[data-target="inicio"]');
      if (inicioLink) inicioLink.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Resaltar enlace activo según el scroll en el portafolio
  const sections = document.querySelectorAll('#mainContent section');
  window.addEventListener('scroll', () => {
    if (!blogView.classList.contains('d-none')) return;

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === currentSection) {
          link.classList.add('active');
        }
      });
    }
  });

  // 4. Validación y envío de formulario de contacto vía cliente de correo
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('correo').value.trim();
      const asunto = document.getElementById('asunto').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      const destinatario = 'marco.vaz.pro@gmail.com';
      const subjectEncoded = encodeURIComponent(`[Portafolio Web] ${asunto}`);
      const bodyEncoded = encodeURIComponent(
        `Hola Marco,\n\n` +
        `Mi nombre es: ${nombre}\n` +
        `Correo de contacto: ${correo}\n\n` +
        `Mensaje:\n${mensaje}`
      );

      // Mostrar confirmación visual y abrir gestor de correo
      formFeedback.classList.remove('d-none');
      window.location.href = `mailto:${destinatario}?subject=${subjectEncoded}&body=${bodyEncoded}`;

      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }
});