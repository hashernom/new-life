/**
 * New Life — Formulario de Compromiso Legal (Registro de Mascota)
 * Disenado con tono institucional y legal.
 * Incluye declaracion de esterilizacion actual, compromiso de trazabilidad
 * y certificado digital.
 */

const PetFormView = (() => {
  'use strict';

  const ERROR_ID = 'pet-form-error';
  const BTN_ID = 'pet-form-btn';
  const LOADING_ID = 'pet-form-loading';
  const FORM_ID = 'pet-form';

  let editPetId = null;

  /**
   * Renderiza el formulario con tono legal.
   * @param {number|null} petId - ID de la mascota si es edicion.
   * @returns {string} HTML del formulario.
   */
  function render(petId = null) {
    editPetId = petId;
    const isEdit = !!petId;
    const title = isEdit ? 'Editar Registro de Mascota' : 'Formulario de Compromiso Legal';

    return `
      <div class="form-page">
        <div class="form-legal-header">
          <div class="form-legal-seal" aria-hidden="true">⚖️</div>
          <h1>${title}</h1>
          <p class="form-legal-subtitle">
            Sistema Obligatorio de Registro y Seguimiento Canino
          </p>
          <p class="form-legal-ref">
            En cumplimiento de la <strong>Ley Angel</strong> y directrices de la
            Policia Ambiental y el Centro de Zoonosis de Bucaramanga.
          </p>
        </div>

        <div class="form-card form-card--legal">
          <div id="${ERROR_ID}" class="alert alert-error" style="display: none;" role="alert"></div>

          <form id="${FORM_ID}" novalidate>
            <fieldset class="legal-fieldset">
              <legend>Datos del animal</legend>

              <div class="form-group">
                <label for="pet-name">Nombre del animal *</label>
                <input type="text" id="pet-name" placeholder="Nombre completo" required aria-required="true">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pet-age">Edad (anos) *</label>
                  <input type="number" id="pet-age" placeholder="Ej: 3" min="0" max="50" required aria-required="true">
                </div>
                <div class="form-group">
                  <label for="pet-breed">Raza *</label>
                  <input type="text" id="pet-breed" placeholder="Ej: Labrador, Criollo" required aria-required="true">
                </div>
              </div>
            </fieldset>

            <fieldset class="legal-fieldset">
              <legend>Estado de esterilizacion</legend>
              <p class="legal-fieldset-desc">
                Indique si el animal se encuentra actualmente esterilizado.
              </p>

              <label class="legal-radio">
                <input type="radio" name="pet-spayed-status" value="yes" class="legal-radio-input">
                <span class="legal-radio-mark"></span>
                <span class="legal-radio-text">
                  <strong>Ya esta esterilizado/a</strong> — Cuenta con certificado veterinario.
                </span>
              </label>

              <label class="legal-radio">
                <input type="radio" name="pet-spayed-status" value="no" class="legal-radio-input" checked>
                <span class="legal-radio-mark"></span>
                <span class="legal-radio-text">
                  <strong>Aun no esta esterilizado/a</strong> — Me comprometo a hacerlo dentro del plazo legal.
                </span>
              </label>
            </fieldset>

            <fieldset class="legal-fieldset">
              <legend>Declaraciones y compromisos</legend>

              <label class="legal-checkbox">
                <input type="checkbox" id="pet-spayed-commitment" class="legal-checkbox-input">
                <span class="legal-checkbox-mark"></span>
                <span class="legal-checkbox-text">
                  <strong>Firmo el compromiso de esterilizacion obligatoria</strong> segun los
                  parametros establecidos en la <strong>Ley Angel</strong>.
                  ${!editPetId ? '<span class="legal-required">*</span>' : ''}
                </span>
              </label>

              <label class="legal-checkbox">
                <input type="checkbox" id="pet-trazabilidad" class="legal-checkbox-input">
                <span class="legal-checkbox-mark"></span>
                <span class="legal-checkbox-text">
                  <strong>Autorizo la trazabilidad</strong> por parte de la Policia Ambiental
                  y el Centro de Zoonosis de Bucaramanga.
                </span>
              </label>
            </fieldset>

            <div class="form-actions">
              <button type="submit" id="${BTN_ID}" class="btn btn-legal">
                ${isEdit ? 'Actualizar Registro' : 'Firmar y Registrar'}
              </button>
              <button type="button" id="pet-form-cancel" class="btn btn-ghost">Cancelar</button>
            </div>
          </form>

          <div id="${LOADING_ID}" style="display:none;text-align:center;padding:1rem;">
            ${Utils.spinnerHTML(true)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa los event listeners del formulario.
   */
  function init() {
    const form = document.getElementById(FORM_ID);
    const cancelBtn = document.getElementById('pet-form-cancel');

    cancelBtn?.addEventListener('click', () => {
      App.navigate('#dashboard');
    });

    if (!form) return;

    // Si es edicion, cargar datos de la mascota
    if (editPetId) {
      loadPetData(editPetId);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      Utils.hideFormError(ERROR_ID);

      const name = document.getElementById('pet-name').value.trim();
      const age = parseInt(document.getElementById('pet-age').value, 10);
      const breed = document.getElementById('pet-breed').value.trim();

      // Estado de esterilizacion actual (radio buttons)
      const spayedRadios = document.getElementsByName('pet-spayed-status');
      let isSpayed = false;
      for (const radio of spayedRadios) {
        if (radio.checked && radio.value === 'yes') {
          isSpayed = true;
          break;
        }
      }

      // Compromiso de esterilizacion (checkbox)
      const commitmentChecked = document.getElementById('pet-spayed-commitment').checked;
      const trazabilidad = document.getElementById('pet-trazabilidad')?.checked || false;

      const validationError = Utils.validatePetFields({ name, age, breed });
      if (validationError) {
        Utils.showFormError(ERROR_ID, validationError);
        return;
      }

      // Validar compromiso de esterilizacion (solo en creacion)
      if (!commitmentChecked && !editPetId) {
        Utils.showFormError(ERROR_ID, 'Debes aceptar el compromiso de esterilizacion obligatoria para registrar una mascota.');
        return;
      }

      // Validar trazabilidad
      if (!trazabilidad && !editPetId) {
        Utils.showFormError(ERROR_ID, 'Debes autorizar la trazabilidad para registrar una mascota.');
        return;
      }

      const loadingText = editPetId ? 'Actualizando...' : 'Generando certificado...';
      const originalText = editPetId ? 'Actualizar Registro' : 'Firmar y Registrar';
      const restore = Utils.withLoadingState(BTN_ID, loadingText, originalText);

      const body = { name, age, breed, is_spayed: isSpayed };
      let result;

      if (editPetId) {
        result = await API.put(`/api/pets/${editPetId}`, body);
      } else {
        result = await API.post('/api/pets', body);
      }

      restore();

      if (result.error) {
        Utils.showFormError(ERROR_ID, result.error);
        return;
      }

      // Si es creacion, mostrar modal de certificado digital
      if (!editPetId) {
        showCertificateModal(name, breed, age);
      } else {
        Utils.showToast('Registro actualizado correctamente.', 'success');
        App.navigate('#dashboard');
      }
    });
  }

  /**
   * Muestra un modal con el "Certificado Digital" ficticio.
   * @param {string} petName
   * @param {string} breed
   * @param {number} age
   */
  function showCertificateModal(petName, breed, age) {
    const certId = 'CERT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const today = new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="certificate-modal" role="dialog" aria-modal="true" aria-label="Certificado Digital">
        <div class="certificate">
          <div class="certificate-header">
            <div class="certificate-seal">⚖️</div>
            <h2>CERTIFICADO DIGITAL</h2>
            <p class="certificate-subtitle">Sistema Obligatorio de Registro y Seguimiento Canino</p>
          </div>

          <div class="certificate-body">
            <p class="certificate-issued">La <strong>Alcaldia de Bucaramanga</strong>, en conjunto con la
            <strong>Policia Ambiental</strong> y el <strong>Centro de Zoonosis</strong>,</p>

            <p class="certificate-declares"><strong>CERTIFICA</strong></p>

            <p class="certificate-text">Que el animal de compania identificado como
            <strong>${Utils.escapeHTML(petName)}</strong>, de raza
            <strong>${Utils.escapeHTML(breed)}</strong> y edad de
            <strong>${age} ${age === 1 ? 'ano' : 'anos'}</strong>, ha sido registrado exitosamente
            en el sistema de trazabilidad obligatoria.</p>

            <div class="certificate-id">
              <span class="certificate-id-label">Codigo de Registro:</span>
              <span class="certificate-id-value">${certId}</span>
            </div>

            <div class="certificate-date">
              Fecha de expedicion: ${today}
            </div>

            <div class="certificate-signatures">
              <div class="certificate-signature">
                <div class="sig-line"></div>
                <p>Secretaria de Salud<br><small>Alcaldia de Bucaramanga</small></p>
              </div>
              <div class="certificate-signature">
                <div class="sig-line"></div>
                <p>Policia Ambiental<br><small>Centro de Zoonosis</small></p>
              </div>
            </div>
          </div>

          <div class="certificate-footer">
            <p>Este certificado es valido para efectos de control y seguimiento.
            Conservarlo como respaldo del cumplimiento de la Ley Angel.</p>
          </div>
        </div>

        <div class="certificate-actions">
          <button id="cert-close-btn" class="btn btn-legal">Aceptar y Continuar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animacion de entrada
    requestAnimationFrame(() => {
      overlay.classList.add('modal-overlay--visible');
    });

    document.getElementById('cert-close-btn')?.addEventListener('click', () => {
      overlay.classList.remove('modal-overlay--visible');
      setTimeout(() => {
        overlay.remove();
        Utils.showToast('Mascota registrada correctamente. Certificado generado.', 'success');
        App.navigate('#dashboard');
      }, 300);
    });
  }

  /**
   * Carga los datos de una mascota existente para edicion.
   * @param {number} petId
   */
  async function loadPetData(petId) {
    const loading = document.getElementById(LOADING_ID);
    const form = document.getElementById(FORM_ID);

    if (loading) loading.style.display = 'block';
    if (form) form.style.display = 'none';

    const { data, error } = await API.get(`/api/pets/${petId}`);

    if (loading) loading.style.display = 'none';
    if (form) form.style.display = 'block';

    if (error) {
      Utils.showFormError(ERROR_ID, error);
      return;
    }

    if (data) {
      document.getElementById('pet-name').value = data.name || '';
      document.getElementById('pet-age').value = data.age || '';
      document.getElementById('pet-breed').value = data.breed || '';

      // Seleccionar radio button segun is_spayed
      const spayedRadios = document.getElementsByName('pet-spayed-status');
      for (const radio of spayedRadios) {
        if ((data.is_spayed && radio.value === 'yes') || (!data.is_spayed && radio.value === 'no')) {
          radio.checked = true;
          break;
        }
      }

      // Marcar compromiso si ya estaba esterilizado
      document.getElementById('pet-spayed-commitment').checked = !!data.is_spayed;
      const trazabilidad = document.getElementById('pet-trazabilidad');
      if (trazabilidad) trazabilidad.checked = true;
    }
  }

  return { render, init };
})();
