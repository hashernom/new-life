/**
 * New Life — Vista de Registro
 */

const RegisterView = (() => {
  'use strict';

  const ERROR_ID = 'register-error';
  const BTN_ID = 'register-btn';

  /**
   * Renderiza el formulario de registro.
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
          <h2>Crear Cuenta</h2>
          <div id="${ERROR_ID}" class="alert alert-error" style="display: none;" role="alert"></div>
          <form id="register-form" novalidate>
            <div class="form-group">
              <label for="reg-name">Nombre completo</label>
              <input type="text" id="reg-name" placeholder="Tu nombre" required autocomplete="name" aria-required="true">
            </div>
            <div class="form-group">
              <label for="reg-email">Correo electrónico</label>
              <input type="email" id="reg-email" placeholder="tu@correo.com" required autocomplete="email" aria-required="true">
            </div>
            <div class="form-group">
              <label for="reg-password">Contraseña</label>
              <input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required autocomplete="new-password" aria-required="true">
            </div>
            <div class="form-group">
              <label for="reg-confirm">Confirmar contraseña</label>
              <input type="password" id="reg-confirm" placeholder="Repite la contraseña" required autocomplete="new-password" aria-required="true">
            </div>
            <button type="submit" id="${BTN_ID}" class="btn btn-primary btn-block">
              Crear Cuenta
            </button>
          </form>
          <p class="auth-link">
            ¿Ya tienes cuenta? <a href="#login">Inicia sesión</a>
          </p>
          <p class="auth-link" style="margin-top:0.5rem;">
            <a href="#home">← Volver al inicio</a>
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners del registro.
   */
  function init() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      Utils.hideFormError(ERROR_ID);

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;

      const validationError = Utils.validateRegisterFields({ name, email, password, confirm });
      if (validationError) {
        Utils.showFormError(ERROR_ID, validationError);
        return;
      }

      const restore = Utils.withLoadingState(BTN_ID, 'Creando cuenta...', 'Crear Cuenta');

      const { data, error } = await API.post('/api/auth/register', { name, email, password }, false);

      restore();

      if (error) {
        Utils.showFormError(ERROR_ID, error);
        return;
      }

      if (data && data.token) {
        Auth.login(data.token, data.user);
        Utils.showToast('Cuenta creada correctamente.', 'success');
        App.navigate('#dashboard');
      } else {
        Utils.showToast('Cuenta creada. Ahora inicia sesión.', 'success');
        App.navigate('#login');
      }
    });
  }

  return { render, init };
})();
