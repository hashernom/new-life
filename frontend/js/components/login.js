/**
 * New Life — Vista de Login
 */

const LoginView = (() => {
  'use strict';

  const ERROR_ID = 'login-error';
  const BTN_ID = 'login-btn';

  /**
   * Renderiza el formulario de inicio de sesión.
   * @returns {string} HTML de la vista.
   */
  function render() {
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="logo">
            <h1>New Life</h1>
            <p>Registro de Mascotas</p>
          </div>
          <h2>Iniciar Sesión</h2>
          <div id="${ERROR_ID}" class="alert alert-error" style="display: none;" role="alert"></div>
          <form id="login-form" novalidate>
            <div class="form-group">
              <label for="login-email">Correo electrónico</label>
              <input type="email" id="login-email" placeholder="tu@correo.com" required autocomplete="email" aria-required="true">
            </div>
            <div class="form-group">
              <label for="login-password">Contraseña</label>
              <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password" aria-required="true">
            </div>
            <button type="submit" id="${BTN_ID}" class="btn btn-primary btn-block">
              Iniciar Sesión
            </button>
          </form>
          <p class="auth-link">
            ¿No tienes cuenta? <a href="#register">Regístrate</a>
          </p>
          <p class="auth-link" style="margin-top:0.5rem;">
            <a href="#home">← Volver al inicio</a>
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners del login.
   */
  function init() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      Utils.hideFormError(ERROR_ID);

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const validationError = Utils.validateLoginFields({ email, password });
      if (validationError) {
        Utils.showFormError(ERROR_ID, validationError);
        return;
      }

      const restore = Utils.withLoadingState(BTN_ID, 'Iniciando sesión...', 'Iniciar Sesión');

      const { data, error } = await API.post('/api/auth/login', { email, password }, false);

      restore();

      if (error) {
        Utils.showFormError(ERROR_ID, error);
        return;
      }

      if (data && data.token) {
        Auth.login(data.token, data.user);
        Utils.showToast('Sesión iniciada correctamente.', 'success');
        App.navigate('#dashboard');
      }
    });
  }

  return { render, init };
})();
