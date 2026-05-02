/**
 * New Life — Cliente HTTP
 * Capa de comunicación con la API REST del backend.
 * Incluye automáticamente el token JWT y maneja errores HTTP.
 *
 * Patrón DRY: Delega la gestión del token a Auth.getToken()
 * en lugar de duplicar constantes TOKEN_KEY/USER_KEY.
 */

const API = (() => {
  'use strict';

  // Ahora el frontend se sirve desde el mismo servidor Flask
  const BASE_URL = '';
  const CONNECTION_ERROR = 'Error de conexión con el servidor.';

  /**
   * Limpia la sesión del usuario (token expirado).
   */
  function clearSession() {
    Auth.logout();
    window.location.hash = '#login';
  }

  /**
   * Construye los headers para una petición.
   * @param {boolean} authRequired - Si se debe incluir el token.
   * @param {object} extraHeaders - Headers adicionales.
   * @returns {object}
   */
  function buildHeaders(authRequired = true, extraHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    if (authRequired) {
      const token = Auth.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Maneja la respuesta HTTP, parsea JSON y gestiona errores.
   * @param {Response} response - Objeto Response de fetch.
   * @returns {Promise<object>} { data, error, status }
   */
  async function handleResponse(response) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      // 401 → token inválido/expirado, redirigir a login
      if (response.status === 401) {
        clearSession();
        return { data: null, error: 'Sesión expirada. Inicia sesión nuevamente.', status: 401 };
      }

      // 403 → acceso denegado
      if (response.status === 403) {
        return { data: null, error: data?.error || 'Acceso denegado.', status: 403 };
      }

      const errorMsg = data?.error || `Error ${response.status}`;
      return { data: null, error: errorMsg, status: response.status };
    }

    return { data, error: null, status: response.status };
  }

  /**
   * Ejecuta una petición HTTP genérica.
   * @param {string} method - Método HTTP (GET, POST, PUT, DELETE).
   * @param {string} endpoint - Ruta (ej: /api/pets).
   * @param {object|null} body - Cuerpo de la petición (para POST/PUT).
   * @param {boolean} authRequired
   * @returns {Promise<object>}
   */
  async function request(method, endpoint, body = null, authRequired = true) {
    try {
      const options = {
        method,
        headers: buildHeaders(authRequired),
      };
      if (body !== null) {
        options.body = JSON.stringify(body);
      }
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      return handleResponse(response);
    } catch {
      return { data: null, error: CONNECTION_ERROR, status: 0 };
    }
  }

  /**
   * Petición GET.
   * @param {string} endpoint - Ruta (ej: /api/pets).
   * @param {boolean} authRequired
   * @returns {Promise<object>}
   */
  function get(endpoint, authRequired = true) {
    return request('GET', endpoint, null, authRequired);
  }

  /**
   * Petición POST.
   * @param {string} endpoint
   * @param {object} body
   * @param {boolean} authRequired
   * @returns {Promise<object>}
   */
  function post(endpoint, body = {}, authRequired = true) {
    return request('POST', endpoint, body, authRequired);
  }

  /**
   * Petición PUT.
   * @param {string} endpoint
   * @param {object} body
   * @param {boolean} authRequired
   * @returns {Promise<object>}
   */
  function put(endpoint, body = {}, authRequired = true) {
    return request('PUT', endpoint, body, authRequired);
  }

  /**
   * Petición DELETE.
   * @param {string} endpoint
   * @param {boolean} authRequired
   * @returns {Promise<object>}
   */
  function del(endpoint, authRequired = true) {
    return request('DELETE', endpoint, null, authRequired);
  }

  return { get, post, put, del };
})();
