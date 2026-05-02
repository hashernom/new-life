/**
 * New Life — Manejo de Autenticación
 * Gestiona tokens JWT y datos del usuario en localStorage.
 */

const Auth = (() => {
  'use strict';

  const TOKEN_KEY = 'nl_token';
  const USER_KEY = 'nl_user';
  const ADMIN_ROLE = 'admin';

  /**
   * Guarda el token y los datos del usuario tras login/registro.
   * @param {string} token - JWT token.
   * @param {object} user - Datos del usuario { id, name, email, role }.
   */
  function login(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Elimina token y datos del usuario (cierre de sesión).
   */
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Obtiene el token JWT.
   * @returns {string|null}
   */
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Obtiene los datos del usuario almacenados.
   * @returns {object|null}
   */
  function getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Verifica si hay un token almacenado.
   * @returns {boolean}
   */
  function isAuthenticated() {
    return !!getToken();
  }

  /**
   * Verifica si el usuario tiene rol admin.
   * @returns {boolean}
   */
  function isAdmin() {
    const user = getUser();
    return user && user.role === ADMIN_ROLE;
  }

  return { login, logout, getToken, getUser, isAuthenticated, isAdmin };
})();
