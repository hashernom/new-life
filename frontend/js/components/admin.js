/**
 * New Life — Panel de Administración
 * Solo accesible para usuarios con role 'admin'.
 * Muestra tablas de usuarios y mascotas del sistema.
 */

const AdminView = (() => {
  'use strict';

  /**
   * Renderiza el panel de administración.
   * @returns {string} HTML de la vista.
   */
  function render() {
    const user = Auth.getUser();

    return `
      <div class="admin-page">
        <div class="admin-header">
          <div>
            <h1>Panel de Administración</h1>
            <p>Bienvenido, ${Utils.escapeHTML(user?.name || 'Admin')}</p>
          </div>
          <button id="btn-admin-back" class="btn btn-ghost" aria-label="Volver al dashboard">← Volver al Dashboard</button>
        </div>

        <section class="admin-section" aria-labelledby="users-section-title">
          <h2 id="users-section-title">Usuarios</h2>
          <div id="admin-users-container" aria-live="polite">
            <div style="text-align:center;padding:2rem;">${Utils.spinnerHTML()}</div>
          </div>
        </section>

        <section class="admin-section" aria-labelledby="pets-section-title">
          <h2 id="pets-section-title">Mascotas</h2>
          <div id="admin-pets-container" aria-live="polite">
            <div style="text-align:center;padding:2rem;">${Utils.spinnerHTML()}</div>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners y carga los datos.
   */
  function init() {
    document.getElementById('btn-admin-back')?.addEventListener('click', () => {
      App.navigate('#dashboard');
    });

    loadUsers();
    loadPets();
  }

  /**
   * Carga la lista de usuarios desde la API.
   */
  async function loadUsers() {
    const container = document.getElementById('admin-users-container');
    if (!container) return;

    const { data, error } = await API.get('/api/admin/users');

    if (error) {
      container.innerHTML = `
        <div class="table-wrapper" role="alert">
          <p style="padding:1rem;color:var(--red-500);">${Utils.escapeHTML(error)}</p>
        </div>
      `;
      return;
    }

    const users = data?.users || [];

    if (users.length === 0) {
      container.innerHTML = `<p style="color:var(--gray-500);">No hay usuarios registrados.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="table-wrapper">
        <table role="table" aria-label="Lista de usuarios del sistema">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Email</th>
              <th scope="col">Rol</th>
              <th scope="col">Registro</th>
              <th scope="col">Mascotas</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr>
                <td>${user.id}</td>
                <td>${Utils.escapeHTML(user.name)}</td>
                <td>${Utils.escapeHTML(user.email)}</td>
                <td>${user.role === 'admin' ? '🔑 Admin' : '👤 Usuario'}</td>
                <td>${formatDate(user.created_at)}</td>
                <td>${user.pet_count ?? 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Carga la lista de mascotas desde la API (admin).
   */
  async function loadPets() {
    const container = document.getElementById('admin-pets-container');
    if (!container) return;

    const { data, error } = await API.get('/api/admin/pets');

    if (error) {
      container.innerHTML = `
        <div class="table-wrapper" role="alert">
          <p style="padding:1rem;color:var(--red-500);">${Utils.escapeHTML(error)}</p>
        </div>
      `;
      return;
    }

    const pets = data?.pets || [];
    const complianceRate = data?.compliance_rate ?? 0;

    if (pets.length === 0) {
      container.innerHTML = `<p style="color:var(--gray-500);">No hay mascotas registradas.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="compliance-rate" aria-label="Tasa de cumplimiento">
        <span aria-hidden="true">📊</span> Tasa de cumplimiento: <strong>${complianceRate}%</strong>
      </div>
      <div class="table-wrapper">
        <table role="table" aria-label="Lista de mascotas del sistema">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Dueño</th>
              <th scope="col">Edad</th>
              <th scope="col">Raza</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${pets.map(pet => `
              <tr>
                <td>${pet.id}</td>
                <td>${Utils.escapeHTML(pet.name)}</td>
                <td>${Utils.escapeHTML(pet.owner_name || '—')}</td>
                <td>${pet.age} ${pet.age === 1 ? 'año' : 'años'}</td>
                <td>${Utils.escapeHTML(pet.breed)}</td>
                <td>
                  <span class="compliance-badge ${pet.is_spayed ? 'cumple' : 'no-cumple'}" aria-label="${pet.is_spayed ? 'Cumple con esterilización' : 'No cumple con esterilización'}">
                    ${pet.is_spayed ? '🟢 Cumple' : '🔴 No cumple'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Formatea una fecha ISO a formato legible.
   * @param {string} isoString
   * @returns {string}
   */
  function formatDate(isoString) {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  }

  return { render, init };
})();
