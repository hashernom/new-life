/**
 * New Life — Router SPA y Lógica Principal
 * Maneja la navegación hash-based, la inicialización de vistas y la navegación.
 */

const App = (() => {
  'use strict';

  // --- Constantes de rutas ---
  const ROUTES = {
    HOME: '#home',
    LOGIN: '#login',
    REGISTER: '#register',
    DASHBOARD: '#dashboard',
    PET_NEW: '#pet/new',
    ADMIN: '#admin',
  };

  /**
   * Inicializa la aplicación.
   */
  function init() {
    // Ocultar pantalla de carga
    Utils.showLoading(false);

    // Handler global de promesas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promesa no capturada:', event.reason);
      Utils.showToast('Ocurrió un error inesperado.', 'error');
    });

    // Inicializar navegación
    initNav();

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleRoute);

    // Manejar la ruta inicial
    handleRoute();
  }

  /**
   * Inicializa los event listeners de la navegación principal.
   */
  function initNav() {
    // Botón de logout
    document.getElementById('nav-btn-logout')?.addEventListener('click', () => {
      Auth.logout();
      Utils.showToast('Sesión cerrada.', 'info');
      navigate(ROUTES.HOME);
      closeMobileMenu();
    });

    // Botón de dashboard
    document.getElementById('nav-btn-dashboard')?.addEventListener('click', () => {
      navigate(ROUTES.DASHBOARD);
      closeMobileMenu();
    });

    // Botón de admin
    document.getElementById('nav-btn-admin')?.addEventListener('click', () => {
      navigate(ROUTES.ADMIN);
      closeMobileMenu();
    });

    // Toggle menú mobile
    document.getElementById('nav-toggle')?.addEventListener('click', () => {
      const nav = document.getElementById('nav-links');
      const toggle = document.getElementById('nav-toggle');
      if (nav && toggle) {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
      }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      const nav = document.getElementById('nav-links');
      const toggle = document.getElementById('nav-toggle');
      if (nav && toggle && nav.classList.contains('open')) {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });
  }

  /**
   * Cierra el menú mobile si está abierto.
   */
  function closeMobileMenu() {
    const nav = document.getElementById('nav-links');
    const toggle = document.getElementById('nav-toggle');
    if (nav && toggle) {
      nav.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Actualiza la navegación según el estado de autenticación.
   */
  function updateNav() {
    const nav = document.getElementById('main-nav');
    const greeting = document.getElementById('nav-user-greeting');
    const dashboardBtn = document.getElementById('nav-btn-dashboard');
    const adminBtn = document.getElementById('nav-btn-admin');
    const logoutBtn = document.getElementById('nav-btn-logout');
    const mainContent = document.getElementById('main-content');

    const isAuth = Auth.isAuthenticated();
    const user = Auth.getUser();

    if (isAuth && user) {
      if (nav) nav.style.display = 'block';
      if (mainContent) mainContent.classList.add('has-nav');
      if (greeting) greeting.textContent = `Hola, ${Utils.escapeHTML(user.name || 'Usuario')}`;
      if (dashboardBtn) dashboardBtn.style.display = 'inline-flex';
      if (logoutBtn) logoutBtn.style.display = 'inline-flex';
      if (adminBtn) {
        adminBtn.style.display = Auth.isAdmin() ? 'inline-flex' : 'none';
      }
    } else {
      if (nav) nav.style.display = 'none';
      if (mainContent) mainContent.classList.remove('has-nav');
    }
  }

  /**
   * Maneja la ruta actual basada en window.location.hash.
   */
  function handleRoute() {
    const hash = window.location.hash || '#';
    const mainContent = document.getElementById('main-content');

    if (!mainContent) return;

    // Extraer ruta base
    const path = hash.split('?')[0];
    const isAuthenticated = Auth.isAuthenticated();

    // Actualizar navegación
    updateNav();

    // Redirecciones automáticas
    if (!isAuthenticated && [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.HOME, '', '#'].includes(path)) {
      // Permitir acceso a home, login y register sin autenticación
      if (path === ROUTES.HOME || path === '' || path === '#') {
        renderView('home');
        return;
      }
    }

    if (isAuthenticated && [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.HOME, '', '#'].includes(path)) {
      navigate(ROUTES.DASHBOARD, false);
      return;
    }

    // Enrutamiento
    switch (true) {
      case path === ROUTES.HOME || path === '' || path === '#':
        renderView('home');
        break;

      case path === ROUTES.LOGIN:
        renderView('login');
        break;

      case path === ROUTES.REGISTER:
        renderView('register');
        break;

      case path === ROUTES.DASHBOARD:
        renderView('dashboard');
        break;

      case path === ROUTES.PET_NEW:
        if (Auth.isAdmin()) {
          Utils.showToast('Los administradores no pueden registrar mascotas.', 'error');
          navigate(ROUTES.DASHBOARD, false);
          return;
        }
        renderView('pet-new');
        break;

      case path.startsWith('#pet/edit/'):
        if (Auth.isAdmin()) {
          Utils.showToast('Los administradores no pueden editar mascotas.', 'error');
          navigate(ROUTES.DASHBOARD, false);
          return;
        }
        renderView('pet-edit', path);
        break;

      case path === ROUTES.ADMIN:
        if (!Auth.isAdmin()) {
          Utils.showToast('Acceso denegado. Se requieren permisos de administrador.', 'error');
          navigate(ROUTES.DASHBOARD, false);
          return;
        }
        renderView('admin');
        break;

      default:
        // Ruta no encontrada → redirigir
        navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME, false);
        break;
    }
  }

  /**
   * Renderiza una vista en el main content.
   * @param {string} viewName - Nombre de la vista.
   * @param {string} [path] - Hash completo (para rutas con parámetros).
   */
  function renderView(viewName, path = '') {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Enfocar el main content después de renderizar para accesibilidad
    const renderAndFocus = (html) => {
      mainContent.innerHTML = html;
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus({ preventScroll: true });
    };

    switch (viewName) {
      case 'home':
        renderAndFocus(HomeView.render());
        HomeView.init();
        break;

      case 'login':
        renderAndFocus(LoginView.render());
        LoginView.init();
        break;

      case 'register':
        renderAndFocus(RegisterView.render());
        RegisterView.init();
        break;

      case 'dashboard':
        renderAndFocus(DashboardView.render());
        DashboardView.init();
        break;

      case 'pet-new':
        renderAndFocus(PetFormView.render());
        PetFormView.init();
        break;

      case 'pet-edit': {
        const parts = path.split('/');
        const petId = parts.length >= 3 ? parseInt(parts[2], 10) : null;
        if (!petId || isNaN(petId)) {
          Utils.showToast('ID de mascota inválido.', 'error');
          navigate(ROUTES.DASHBOARD, false);
          return;
        }
        renderAndFocus(PetFormView.render(petId));
        PetFormView.init();
        break;
      }

      case 'admin':
        renderAndFocus(AdminView.render());
        AdminView.init();
        break;

      default:
        mainContent.innerHTML = '<p>Vista no encontrada.</p>';
        break;
    }
  }

  /**
   * Navega a una ruta específica.
   * @param {string} hash - Ruta hash (ej: '#dashboard').
   * @param {boolean} [pushState=true] - Si debe agregarse al historial.
   */
  function navigate(hash, pushState = true) {
    const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`;
    if (pushState) {
      window.location.hash = normalizedHash;
    } else {
      window.location.replace(normalizedHash);
    }
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { navigate };
})();
