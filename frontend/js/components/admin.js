/**
 * New Life — Panel de las Autoridades
 * Solo accesible para usuarios con role 'admin'.
 * Tabla tipo semáforo con datos obtenidos de la API.
 * Incluye botón de decomiso que persiste en la base de datos.
 */

const AdminView = (() => {
  'use strict';

  /** Cache local de datos para evitar re-fetch innecesario */
  let petsCache = [];

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
            <h1>Panel de las Autoridades</h1>
            <p>Sistema de trazabilidad — ${Utils.escapeHTML(user?.name || 'Admin')}</p>
          </div>
          <button id="btn-admin-back" class="btn btn-ghost" aria-label="Volver al dashboard">← Volver al Dashboard</button>
        </div>

        <section class="admin-section" aria-labelledby="registry-section-title">
          <h2 id="registry-section-title">Registro de Cumplimiento — Semáforo</h2>
          <div id="admin-registry-container" aria-live="polite">
            <div style="text-align:center;padding:2rem;">${Utils.spinnerHTML()}</div>
          </div>
        </section>
      </div>
    `;
  }

  /**
   * Obtiene los datos de mascotas desde la API.
   * @returns {Promise<Array>}
   */
  async function fetchPets() {
    const { data, error } = await API.get('/api/admin/pets');
    if (error) {
      Utils.showToast(error, 'error');
      return [];
    }
    return data?.pets || [];
  }

  /**
   * Renderiza la tabla semáforo con datos de la API.
   * @returns {string} HTML de la tabla.
   */
  function renderRegistryTable() {
    const pets = petsCache;

    if (pets.length === 0) {
      return `
        <div class="empty-state">
          <span class="empty-icon" aria-hidden="true">📋</span>
          <h3>No hay registros en el sistema</h3>
          <p>Los ciudadanos comenzarán a registrar sus mascotas conforme entre en vigencia la Ley Ángel.</p>
        </div>
      `;
    }

    const rows = pets.map(item => {
      const statusClass = `semaforo-${item.status}`;
      const canSeize = item.status === 'incumplimiento' && item.adopted;
      const isSeized = !item.adopted;  // decomisado = no adoptable
      const statusEmoji = item.status === 'certificado' ? '🟢' : item.status === 'gracia' ? '🟠' : '🔴';

      let actionHtml = '';
      if (canSeize) {
        actionHtml = `<button class="btn btn-danger btn-sm btn-seize" data-id="${item.id}" aria-label="Decomisar ${Utils.escapeHTML(item.name)}">
                        🚨 Decomisar
                      </button>`;
      } else if (isSeized) {
        actionHtml = `<button class="btn btn-success btn-sm btn-rehabilitate" data-id="${item.id}" aria-label="Rehabilitar ${Utils.escapeHTML(item.name)}">
                        ✅ Rehabilitar
                      </button>`;
      } else {
        actionHtml = `<span class="semaforo-inhabilitado">—</span>`;
      }

      return `
        <tr class="semaforo-row semaforo-row--${item.status}" data-id="${item.id}">
          <td>${item.id}</td>
          <td><strong>${Utils.escapeHTML(item.owner_name || 'Desconocido')}</strong></td>
          <td>${Utils.escapeHTML(item.owner_email || '—')}</td>
          <td>${Utils.escapeHTML(item.name)}</td>
          <td>${Utils.escapeHTML(item.breed)}</td>
          <td>${item.age} ${item.age === 1 ? 'año' : 'años'}</td>
          <td>
            <span class="semaforo-badge ${statusClass}">
              ${statusEmoji}
              ${item.status_label || item.status}
            </span>
          </td>
          <td>${actionHtml}</td>
        </tr>
      `;
    }).join('');

    const certified = pets.filter(d => d.status === 'certificado').length;
    const gracia = pets.filter(d => d.status === 'gracia').length;
    const incumplimiento = pets.filter(d => d.status === 'incumplimiento').length;

    return `
      <div class="semaforo-summary">
        <div class="semaforo-summary-item semaforo-summary--verde">
          <span class="semaforo-summary-count">${certified}</span>
          <span class="semaforo-summary-label">Certificados</span>
        </div>
        <div class="semaforo-summary-item semaforo-summary--naranja">
          <span class="semaforo-summary-count">${gracia}</span>
          <span class="semaforo-summary-label">Periodo de gracia</span>
        </div>
        <div class="semaforo-summary-item semaforo-summary--rojo">
          <span class="semaforo-summary-count">${incumplimiento}</span>
          <span class="semaforo-summary-label">Incumplimiento</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table role="table" aria-label="Registro de cumplimiento">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Propietario</th>
              <th scope="col">Email</th>
              <th scope="col">Mascota</th>
              <th scope="col">Raza</th>
              <th scope="col">Edad</th>
              <th scope="col">Estado</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners y carga datos.
   */
  async function init() {
    document.getElementById('btn-admin-back')?.addEventListener('click', () => {
      App.navigate('#dashboard');
    });

    // Cargar datos desde la API
    petsCache = await fetchPets();
    refreshTable();
  }

  /**
   * Refresca la tabla y re-asigna eventos.
   */
  function refreshTable() {
    const container = document.getElementById('admin-registry-container');
    if (!container) return;

    container.innerHTML = renderRegistryTable();

    // Asignar eventos a botones de decomiso
    document.querySelectorAll('.btn-seize').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        const item = petsCache.find(d => d.id === id);
        if (!item) return;

        if (confirm(`¿Está seguro de emitir la orden de decomiso para "${item.name}" de ${item.owner_name}?\n\nEsta acción inhabilitará al animal para adopción.`)) {
          const { data, error } = await API.put(`/api/admin/pets/${id}/seize`);
          if (error) {
            Utils.showToast(error, 'error');
            return;
          }
          Utils.showToast(`🚨 Orden de decomiso ejecutada: ${item.name} ha sido inhabilitado para adopción.`, 'error');
          // Recargar datos desde la API
          petsCache = await fetchPets();
          refreshTable();
        }
      });
    });

    // Asignar eventos a botones de rehabilitación
    document.querySelectorAll('.btn-rehabilitate').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        const item = petsCache.find(d => d.id === id);
        if (!item) return;

        if (confirm(`¿Está seguro de rehabilitar a "${item.name}" de ${item.owner_name}?\n\nEl animal volverá a estar disponible para adopción.`)) {
          const { data, error } = await API.put(`/api/admin/pets/${id}/rehabilitate`);
          if (error) {
            Utils.showToast(error, 'error');
            return;
          }
          Utils.showToast(`✅ ${item.name} ha sido rehabilitado exitosamente.`, 'success');
          // Recargar datos desde la API
          petsCache = await fetchPets();
          refreshTable();
        }
      });
    });
  }

  return { render, init };
})();
