/**
 * New Life — Dashboard del Usuario
 * Muestra la lista de mascotas del usuario autenticado con estadísticas.
 */

const DashboardView = (() => {
  'use strict';

  /**
   * Renderiza el dashboard.
   * @returns {string} HTML de la vista.
   */
  function render() {
    const user = Auth.getUser();
    const isAdmin = Auth.isAdmin();

    return `
      <div class="dashboard-page">
        <div class="dashboard-header">
          <div class="user-info">
            <h1>Mis Mascotas</h1>
            <p>Bienvenido, ${Utils.escapeHTML(user?.name || 'Usuario')}</p>
          </div>
          <div class="header-actions">
            <button id="btn-new-pet" class="btn btn-primary" aria-label="Registrar nueva mascota">
              + Registrar Mascota
            </button>
            ${isAdmin ? '<button id="btn-admin" class="btn btn-outline" aria-label="Abrir panel de administración">Panel Admin</button>' : ''}
            <button id="btn-logout" class="btn btn-ghost" aria-label="Cerrar sesión">Cerrar Sesión</button>
          </div>
        </div>
        <div id="pets-container" aria-live="polite" aria-label="Lista de mascotas">
          <div style="text-align:center;padding:2rem;">${Utils.spinnerHTML()}</div>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners y carga las mascotas.
   */
  function init() {
    document.getElementById('btn-new-pet')?.addEventListener('click', () => {
      App.navigate('#pet/new');
    });

    document.getElementById('btn-admin')?.addEventListener('click', () => {
      App.navigate('#admin');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      Auth.logout();
      Utils.showToast('Sesión cerrada.', 'info');
      App.navigate('#home');
    });

    loadPets();
  }

  /**
   * Carga la lista de mascotas desde la API.
   */
  async function loadPets() {
    const container = document.getElementById('pets-container');
    if (!container) return;

    const { data, error } = await API.get('/api/pets');

    if (error) {
      container.innerHTML = `
        <div class="empty-state" role="alert">
          <p style="color:var(--red-500);">${Utils.escapeHTML(error)}</p>
        </div>
      `;
      return;
    }

    const pets = data?.pets || [];

    if (pets.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon" aria-hidden="true">🐶</span>
          <h3>No tienes mascotas registradas</h3>
          <p>Registra tu primera mascota para comenzar.</p>
          <button id="btn-empty-new" class="btn btn-primary">+ Registrar Mascota</button>
        </div>
      `;
      document.getElementById('btn-empty-new')?.addEventListener('click', () => {
        App.navigate('#pet/new');
      });
      return;
    }

    // Calcular estadísticas
    const total = pets.length;
    const spayed = pets.filter(p => p.is_spayed).length;
    const complianceRate = Math.round((spayed / total) * 100);

    // Construir HTML de las cards
    const cardsHtml = pets.map(pet => renderPetCard(pet)).join('');

    container.innerHTML = `
      <div class="stats-bar" aria-label="Estadísticas">
        <div class="stat-card">
          <div class="stat-number">${total}</div>
          <div class="stat-label">Total Mascotas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${spayed}</div>
          <div class="stat-label">Esterilizadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${complianceRate}%</div>
          <div class="stat-label">Cumplimiento</div>
        </div>
      </div>
      <div class="pets-grid" role="list">
        ${cardsHtml}
      </div>
    `;

    // Asignar eventos a los botones de cada card
    pets.forEach(pet => {
      document.getElementById(`edit-pet-${pet.id}`)?.addEventListener('click', () => {
        App.navigate(`#pet/edit/${pet.id}`);
      });

      document.getElementById(`delete-pet-${pet.id}`)?.addEventListener('click', async () => {
        if (confirm(`¿Estás seguro de eliminar a "${pet.name}"?`)) {
          await deletePet(pet.id);
        }
      });
    });
  }

  /**
   * Renderiza una card de mascota.
   * @param {object} pet - Datos de la mascota.
   * @returns {string} HTML de la card.
   */
  function renderPetCard(pet) {
    const isCompliant = pet.is_spayed;
    const badgeClass = isCompliant ? 'cumple' : 'no-cumple';
    const badgeText = isCompliant ? 'Esterilizado' : 'No esterilizado';
    const badgeIcon = isCompliant ? '🟢' : '🔴';
    const ageLabel = pet.age === 1 ? 'año' : 'años';

    return `
      <div class="pet-card" role="listitem" aria-label="Mascota: ${Utils.escapeHTML(pet.name)}">
        <div class="pet-name">${Utils.escapeHTML(pet.name)}</div>
        <div class="pet-details">
          <span><strong>Edad:</strong> ${pet.age} ${ageLabel}</span>
          <span><strong>Raza:</strong> ${Utils.escapeHTML(pet.breed)}</span>
        </div>
        <div class="compliance-badge ${badgeClass}" aria-label="Estado de esterilización: ${badgeText}">
          ${badgeIcon} ${badgeText}
        </div>
        <div class="card-actions">
          <button id="edit-pet-${pet.id}" class="btn btn-outline btn-sm" aria-label="Editar ${Utils.escapeHTML(pet.name)}">Editar</button>
          <button id="delete-pet-${pet.id}" class="btn btn-danger btn-sm" aria-label="Eliminar ${Utils.escapeHTML(pet.name)}">Eliminar</button>
        </div>
      </div>
    `;
  }

  /**
   * Elimina una mascota por ID.
   * @param {number} petId
   */
  async function deletePet(petId) {
    const { error } = await API.del(`/api/pets/${petId}`);

    if (error) {
      Utils.showToast(error, 'error');
      return;
    }

    Utils.showToast('Mascota eliminada correctamente.', 'success');
    await loadPets();
  }

  return { render, init };
})();
