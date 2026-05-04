/**
 * New Life — Dashboard del Usuario
 * Muestra la lista de mascotas del usuario autenticado con estadísticas.
 * Incluye "botones trampa" para simular estados en vivo (Efecto Guau).
 */

const DashboardView = (() => {
  'use strict';

  /** Estado actual de la simulación: 'felicidad' | 'alerta' | 'sancion' */
  let demoState = 'felicidad';

  /**
   * Renderiza el dashboard.
   * @returns {string} HTML de la vista.
   */
  function render() {
    const user = Auth.getUser();
    const isAdmin = Auth.isAdmin();

    if (isAdmin) {
      return `
        <div class="dashboard-page">
          <div class="dashboard-header">
            <div class="user-info">
              <h1>Panel de Monitoreo — Ley Ángel</h1>
              <p>Bienvenido, ${Utils.escapeHTML(user?.name || 'Administrador')}</p>
            </div>
            <div class="header-actions">
              <button id="btn-admin" class="btn btn-outline" aria-label="Abrir panel de administración">Panel de Autoridades</button>
              <button id="btn-logout" class="btn btn-ghost" aria-label="Cerrar sesión">Cerrar Sesión</button>
            </div>
          </div>

          <!-- BANNER DE ESTADO SIMULADO (Efecto Guau) -->
          <div id="demo-banner" class="demo-banner demo-banner--felicidad" role="alert">
            <span class="demo-banner-icon">✅</span>
            <span class="demo-banner-text">En regla — Todos los registros cumplen con la normativa vigente.</span>
          </div>

          <!-- TARJETAS DE RESUMEN INSTITUCIONAL -->
          <div id="admin-summary" class="admin-summary">
            <div class="summary-card summary-card--total">
              <div class="summary-icon">📋</div>
              <div class="summary-number" id="summary-total">0</div>
              <div class="summary-label">Registros Totales</div>
            </div>
            <div class="summary-card summary-card--cumplen">
              <div class="summary-icon">✅</div>
              <div class="summary-number" id="summary-cumplen">0</div>
              <div class="summary-label">En Cumplimiento</div>
            </div>
            <div class="summary-card summary-card--alerta">
              <div class="summary-icon">⚠️</div>
              <div class="summary-number" id="summary-alerta">0</div>
              <div class="summary-label">En Alerta</div>
            </div>
            <div class="summary-card summary-card--sancion">
              <div class="summary-icon">🚨</div>
              <div class="summary-number" id="summary-sancion">0</div>
              <div class="summary-label">Incumplimientos</div>
            </div>
          </div>

          <!-- ESTADÍSTICAS CLAVE -->
          <div class="admin-stats">
            <div class="stat-block">
              <h3>📊 Indicadores de Trazabilidad</h3>
              <div class="stat-row">
                <span>Tasa de Esterilización</span>
                <span class="stat-value" id="stat-esterilizacion">0%</span>
              </div>
              <div class="stat-row">
                <span>Casos en Proceso de Regularización</span>
                <span class="stat-value" id="stat-regularizacion">0</span>
              </div>
              <div class="stat-row">
                <span>Órdenes de Decomiso Activas</span>
                <span class="stat-value stat-value--danger" id="stat-decomiso">0</span>
              </div>
            </div>
            <div class="stat-block">
              <h3>🏛️ Marco Legal Aplicable</h3>
              <ul class="legal-refs">
                <li><strong>Ley Ángel</strong> — Registro obligatorio de animales de compañía</li>
                <li><strong>Acuerdo Municipal 015</strong> — Tenencia responsable en Bucaramanga</li>
                <li><strong>Ley 1774 de 2016</strong> — Protección animal como derecho</li>
              </ul>
            </div>
          </div>

          <div id="pets-container" aria-live="polite" aria-label="Lista de mascotas">
            <div style="text-align:center;padding:2rem;">${Utils.spinnerHTML()}</div>
          </div>

          <!-- Botones trampa (esquina inferior derecha) -->
          <div class="demo-controls" aria-label="Controles de demostración">
            <button class="demo-btn demo-btn--felicidad" data-state="felicidad" title="Estado: Felicidad (En regla)">😊</button>
            <button class="demo-btn demo-btn--alerta" data-state="alerta" title="Estado: Alerta preventiva">⚠️</button>
            <button class="demo-btn demo-btn--sancion" data-state="sancion" title="Estado: Sanción / Multa">🚨</button>
          </div>
        </div>
      `;
    }

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
            <button id="btn-logout" class="btn btn-ghost" aria-label="Cerrar sesión">Cerrar Sesión</button>
          </div>
        </div>

        <!-- BANNER DE ESTADO SIMULADO (Efecto Guau) -->
        <div id="demo-banner" class="demo-banner demo-banner--felicidad" role="alert">
          <span class="demo-banner-icon">✅</span>
          <span class="demo-banner-text">En regla — Tu mascota cumple con todos los requisitos legales.</span>
        </div>

        <div id="pets-container" aria-live="polite" aria-label="Lista de mascotas">
          <div style="text-align:center;padding:2rem;">${Utils.spinnerHTML()}</div>
        </div>

        <!-- Botones trampa (esquina inferior derecha) -->
        <div class="demo-controls" aria-label="Controles de demostración">
          <button class="demo-btn demo-btn--felicidad" data-state="felicidad" title="Estado: Felicidad (En regla)">😊</button>
          <button class="demo-btn demo-btn--alerta" data-state="alerta" title="Estado: Alerta preventiva">⚠️</button>
          <button class="demo-btn demo-btn--sancion" data-state="sancion" title="Estado: Sanción / Multa">🚨</button>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners y carga las mascotas.
   */
  function init() {
    const isAdmin = Auth.isAdmin();

    if (!isAdmin) {
      document.getElementById('btn-new-pet')?.addEventListener('click', () => {
        App.navigate('#pet/new');
      });
    }

    document.getElementById('btn-admin')?.addEventListener('click', () => {
      App.navigate('#admin');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      Auth.logout();
      Utils.showToast('Sesión cerrada.', 'info');
      App.navigate('#home');
    });

    // Botones trampa
    document.querySelectorAll('.demo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.dataset.state;
        setDemoState(state);
      });
    });

    loadPets();
  }

  /**
   * Cambia el estado de la simulación (Efecto Guau).
   * @param {'felicidad'|'alerta'|'sancion'} state
   */
  function setDemoState(state) {
    demoState = state;
    const banner = document.getElementById('demo-banner');
    if (!banner) return;

    // Reset clases
    banner.className = 'demo-banner';

    const icon = banner.querySelector('.demo-banner-icon');
    const text = banner.querySelector('.demo-banner-text');

    switch (state) {
      case 'felicidad':
        banner.classList.add('demo-banner--felicidad');
        icon.textContent = '✅';
        text.textContent = 'En regla — Tu mascota cumple con todos los requisitos legales.';
        break;
      case 'alerta':
        banner.classList.add('demo-banner--alerta');
        icon.textContent = '⚠️';
        text.textContent = 'Faltan 15 días para la esterilización recomendada.';
        break;
      case 'sancion':
        banner.classList.add('demo-banner--sancion');
        icon.textContent = '🚨';
        text.innerHTML = `
          <strong>MULTA EQUIVALENTE A 3 SALARIOS MÍNIMOS LEGALES VIGENTES</strong><br>
          Se notificará a la Policía Ambiental y al Centro de Zoonosis de Bucaramanga.
        `;
        break;
    }

    // Animación de entrada
    banner.style.animation = 'none';
    banner.offsetHeight; // reflow
    banner.style.animation = 'bannerSlideIn 0.4s ease';
  }

  /**
   * Carga la lista de mascotas desde la API.
   */
  async function loadPets() {
    const container = document.getElementById('pets-container');
    if (!container) return;

    const isAdmin = Auth.isAdmin();

    const endpoint = isAdmin ? '/api/admin/pets' : '/api/pets';
    const { data, error } = await API.get(endpoint);

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
      if (isAdmin) {
        container.innerHTML = `
          <div class="empty-state">
            <span class="empty-icon" aria-hidden="true">📋</span>
            <h3>No hay registros en el sistema</h3>
            <p>Los ciudadanos comenzarán a registrar sus mascotas conforme entre en vigencia la Ley Ángel.</p>
          </div>
        `;
      } else {
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
      }
      return;
    }

    // Calcular estadísticas
    const total = pets.length;
    const spayed = pets.filter(p => p.is_spayed).length;
    const complianceRate = Math.round((spayed / total) * 100);

    if (isAdmin) {
      // Actualizar tarjetas de resumen
      const certificados = pets.filter(p => p.status === 'certificado').length;
      const alertaCount = pets.filter(p => p.status === 'gracia').length;
      const sancionCount = pets.filter(p => p.status === 'incumplimiento').length;
      const decomisados = pets.filter(p => !p.adopted).length;
      document.getElementById('summary-total').textContent = total;
      document.getElementById('summary-cumplen').textContent = certificados;
      document.getElementById('summary-alerta').textContent = alertaCount;
      document.getElementById('summary-sancion').textContent = sancionCount;
      document.getElementById('stat-esterilizacion').textContent = `${complianceRate}%`;
      document.getElementById('stat-regularizacion').textContent = alertaCount;
      document.getElementById('stat-decomiso').textContent = decomisados;

      // Mostrar tabla simple de todas las mascotas
      const rowsHtml = pets.map(pet => {
        const statusEmoji = pet.status === 'certificado' ? '🟢' : pet.status === 'gracia' ? '🟠' : '🔴';
        const statusLabel = pet.status_label || pet.status;
        return `
          <tr>
            <td>${Utils.escapeHTML(pet.owner_name || '—')}</td>
            <td>${Utils.escapeHTML(pet.name)}</td>
            <td>${Utils.escapeHTML(pet.breed)}</td>
            <td>${pet.age} ${pet.age === 1 ? 'año' : 'años'}</td>
            <td>${statusEmoji} ${Utils.escapeHTML(statusLabel)}</td>
          </tr>
        `;
      }).join('');

      container.innerHTML = `
        <h3 style="margin-top:2rem;margin-bottom:1rem;">Registros de Ciudadanos</h3>
        <div style="overflow-x:auto;">
          <table class="admin-pets-table">
            <thead>
              <tr>
                <th>Propietario</th>
                <th>Mascota</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `;
      return;
    }

    // Vista para usuario normal
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
