/**
 * New Life — Utilidades
 * Funciones de formateo, validación y helpers generales.
 */

const Utils = (() => {
  'use strict';

  // --- Constantes de validación ---
  const NAME_MIN_LENGTH = 2;
  const NAME_MAX_LENGTH = 100;
  const PASSWORD_MIN_LENGTH = 6;
  const PET_AGE_MIN = 0;
  const PET_AGE_MAX = 50;
  const PET_NAME_MAX_LENGTH = 100;
  const PET_BREED_MAX_LENGTH = 100;

  // --- Iconos para toasts ---
  const TOAST_ICONS = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  // --- Mensajes de error reutilizables ---
  const ERROR_MESSAGES = {
    REQUIRED_FIELDS: 'Todos los campos son obligatorios.',
    INVALID_EMAIL: 'Ingresa un correo electrónico válido.',
    PASSWORD_LENGTH: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    PASSWORDS_MISMATCH: 'Las contraseñas no coinciden.',
    NAME_REQUIRED: 'El nombre es obligatorio.',
    PET_NAME_REQUIRED: 'El nombre de la mascota es obligatorio.',
    PET_AGE_INVALID: `Ingresa una edad válida (${PET_AGE_MIN}-${PET_AGE_MAX} años).`,
    PET_BREED_REQUIRED: 'La raza es obligatoria.',
  };

  /**
   * Muestra un toast notification con icono.
   * @param {string} message - Mensaje a mostrar.
   * @param {'success'|'error'|'info'} type - Tipo de toast.
   * @param {number} duration - Duración en ms (default: 3500).
   */
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const icon = TOAST_ICONS[type] || TOAST_ICONS.info;
    toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${icon}</span>${escapeHTML(message)}`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Valida un email.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Muestra u oculta el spinner de carga global.
   * @param {boolean} show
   */
  function showLoading(show = true) {
    const screen = document.getElementById('loading-screen');
    if (screen) {
      screen.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Renderiza un spinner inline.
   * @param {boolean} small - Si es true, muestra un spinner pequeño.
   * @returns {string} HTML del spinner.
   */
  function spinnerHTML(small = false) {
    return `<div class="spinner ${small ? 'spinner-sm' : ''}" role="status" aria-label="Cargando"></div>`;
  }

  /**
   * Escapa texto para prevenir XSS.
   * @param {string} text
   * @returns {string}
   */
  function escapeHTML(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  /**
   * Obtiene el valor de un query param del hash.
   * @param {string} param
   * @returns {string|null}
   */
  function getHashParam(param) {
    const hash = window.location.hash;
    const idx = hash.indexOf('?');
    if (idx === -1) return null;
    const params = new URLSearchParams(hash.slice(idx));
    return params.get(param);
  }

  /**
   * Muestra un mensaje de error en un contenedor de error.
   * @param {string} elementId - ID del elemento donde mostrar el error.
   * @param {string} message - Mensaje de error.
   */
  function showFormError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      errorDiv.setAttribute('role', 'alert');
    }
  }

  /**
   * Oculta un contenedor de error.
   * @param {string} elementId - ID del elemento a ocultar.
   */
  function hideFormError(elementId) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
      errorDiv.style.display = 'none';
      errorDiv.removeAttribute('role');
    }
  }

  /**
   * Valida los campos de registro de usuario.
   * @param {object} fields - { name, email, password, confirm }
   * @returns {string|null} Mensaje de error o null si es válido.
   */
  function validateRegisterFields({ name, email, password, confirm }) {
    if (!name || !email || !password || !confirm) {
      return ERROR_MESSAGES.REQUIRED_FIELDS;
    }
    if (!isValidEmail(email)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD_LENGTH;
    }
    if (password !== confirm) {
      return ERROR_MESSAGES.PASSWORDS_MISMATCH;
    }
    return null;
  }

  /**
   * Valida los campos de login.
   * @param {object} fields - { email, password }
   * @returns {string|null} Mensaje de error o null si es válido.
   */
  function validateLoginFields({ email, password }) {
    if (!email || !password) {
      return ERROR_MESSAGES.REQUIRED_FIELDS;
    }
    if (!isValidEmail(email)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    return null;
  }

  /**
   * Valida los campos del formulario de mascota.
   * @param {object} fields - { name, age, breed }
   * @returns {string|null} Mensaje de error o null si es válido.
   */
  function validatePetFields({ name, age, breed }) {
    if (!name) {
      return ERROR_MESSAGES.PET_NAME_REQUIRED;
    }
    if (isNaN(age) || age < PET_AGE_MIN || age > PET_AGE_MAX) {
      return ERROR_MESSAGES.PET_AGE_INVALID;
    }
    if (!breed) {
      return ERROR_MESSAGES.PET_BREED_REQUIRED;
    }
    return null;
  }

  /**
   * Deshabilita un botón y cambia su texto durante una operación async.
   * @param {string} buttonId - ID del botón.
   * @param {string} loadingText - Texto a mostrar mientras carga.
   * @param {string} originalText - Texto original a restaurar.
   * @returns {Function} Función para restaurar el estado original.
   */
  function withLoadingState(buttonId, loadingText, originalText) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.disabled = true;
      btn.textContent = loadingText;
    }
    return () => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    };
  }

  return {
    showToast,
    isValidEmail,
    showLoading,
    spinnerHTML,
    escapeHTML,
    getHashParam,
    showFormError,
    hideFormError,
    validateRegisterFields,
    validateLoginFields,
    validatePetFields,
    withLoadingState,
    ERROR_MESSAGES,
  };
})();
