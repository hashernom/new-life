/**
 * New Life — Formulario de Mascota
 * Reutilizable para crear y editar mascotas.
 */

const PetFormView = (() => {
  'use strict';

  const ERROR_ID = 'pet-form-error';
  const BTN_ID = 'pet-form-btn';
  const LOADING_ID = 'pet-form-loading';
  const FORM_ID = 'pet-form';

  let editPetId = null;

  /**
   * Renderiza el formulario de mascota.
   * @param {number|null} petId - ID de la mascota si es edición.
   * @returns {string} HTML del formulario.
   */
  function render(petId = null) {
    editPetId = petId;
    const isEdit = !!petId;
    const title = isEdit ? 'Editar Mascota' : 'Registrar Nueva Mascota';

    return `
      <div class="form-page">
        <h1>${title}</h1>
        <div class="form-card">
          <div id="${ERROR_ID}" class="alert alert-error" style="display: none;" role="alert"></div>
          <form id="${FORM_ID}" novalidate>
            <div class="form-group">
              <label for="pet-name">Nombre *</label>
              <input type="text" id="pet-name" placeholder="Nombre de la mascota" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="pet-age">Edad (años) *</label>
              <input type="number" id="pet-age" placeholder="Ej: 3" min="0" max="50" required aria-required="true">
            </div>
            <div class="form-group">
              <label for="pet-breed">Raza *</label>
              <input type="text" id="pet-breed" placeholder="Ej: Labrador, Criollo, etc." required aria-required="true">
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="pet-spayed">
                ¿Está esterilizado?
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" id="${BTN_ID}" class="btn btn-primary">
                ${isEdit ? 'Actualizar' : 'Guardar'}
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

    // Si es edición, cargar datos de la mascota
    if (editPetId) {
      loadPetData(editPetId);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      Utils.hideFormError(ERROR_ID);

      const name = document.getElementById('pet-name').value.trim();
      const age = parseInt(document.getElementById('pet-age').value, 10);
      const breed = document.getElementById('pet-breed').value.trim();
      const isSpayed = document.getElementById('pet-spayed').checked;

      const validationError = Utils.validatePetFields({ name, age, breed });
      if (validationError) {
        Utils.showFormError(ERROR_ID, validationError);
        return;
      }

      const loadingText = editPetId ? 'Actualizando...' : 'Guardando...';
      const originalText = editPetId ? 'Actualizar' : 'Guardar';
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

      Utils.showToast(
        editPetId ? 'Mascota actualizada correctamente.' : 'Mascota registrada correctamente.',
        'success'
      );
      App.navigate('#dashboard');
    });
  }

  /**
   * Carga los datos de una mascota existente para edición.
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
      document.getElementById('pet-spayed').checked = !!data.is_spayed;
    }
  }

  return { render, init };
})();
