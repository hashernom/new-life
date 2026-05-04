/**
 * New Life — Landing Page Institucional
 * Copywriting con datos duros de Bucaramanga.
 * Incluye sección de Aliados Estratégicos (Alcaldía, Policía, Zoonosis).
 */

const HomeView = (() => {
  'use strict';

  /**
   * Renderiza la landing page completa.
   * @returns {string} HTML de la vista.
   */
  function render() {
    return `
      <div class="home-page">
        <section class="hero" aria-label="Sección principal">
          <div class="hero-content">
            <div class="hero-text">
              <div class="hero-badge" aria-hidden="true">
                <span>🐾</span> Ley Ángel — Bucaramanga
              </div>
              <h1 class="hero-title">
                Protejamos a quienes <br><em>no tienen voz</em>
              </h1>
              <p class="hero-stat">
                <strong>Entre 15 y 20 casos</strong> de maltrato y abandono <strong>cada día</strong> en Bucaramanga.
              </p>
              <p class="hero-subtitle">
                Somos el sistema obligatorio de registro y seguimiento canino.
                Un esfuerzo conjunto entre la ciudadanía y las autoridades para
                garantizar la tenencia responsable y erradicar el abandono animal.
              </p>
              <div class="hero-actions">
                <a href="#register" class="btn btn-primary btn-lg" aria-label="Crear cuenta gratuita">
                  Crear Cuenta Gratis
                </a>
                <a href="#login" class="btn btn-ghost btn-lg" aria-label="Iniciar sesión">
                  Iniciar Sesión
                </a>
              </div>
            </div>
            <div class="hero-illustration" aria-hidden="true">
              <div class="hero-image-wrapper">
                <img class="hero-photo" src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Perrito rescatado en Bucaramanga" />
              </div>
            </div>
          </div>
        </section>

        <section class="features" aria-label="Características">
          <div class="features-inner">
            <h2 class="features-title">¿Por qué es necesario este sistema?</h2>
            <p class="features-subtitle">Datos que exigen acción inmediata</p>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">📋</div>
                <h3>Registro Obligatorio</h3>
                <p>Cada mascota debe ser registrada en el sistema de trazabilidad.
                Es el primer paso para garantizar su bienestar y el cumplimiento de la Ley Ángel.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">⚖️</div>
                <h3>Compromiso Legal</h3>
                <p>Al registrar, firmas un compromiso de esterilización obligatoria.
                Las autoridades tienen la facultad de hacer cumplir la ley.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">🛡️</div>
                <h3>Trazabilidad Total</h3>
                <p>La Policía Ambiental y el Centro de Zoonosis de Bucaramanga
                tienen acceso al sistema para vigilancia y control.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Aliados Estratégicos -->
        <section class="allies" aria-label="Aliados estratégicos">
          <div class="allies-inner">
            <h2 class="allies-title">Aliados Estratégicos</h2>
            <p class="allies-subtitle">Trabajando juntos por el bienestar animal</p>
            <div class="allies-grid">
              <div class="ally-card">
                <div class="ally-shield" aria-hidden="true">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="36" stroke="#065f46" stroke-width="2" fill="#ecfdf5"/>
                    <path d="M40 16c-8 0-16 4-20 10v8c0 16 8 28 20 32 12-4 20-16 20-32v-8c-4-6-12-10-20-10z" fill="#059669" opacity="0.15"/>
                    <text x="40" y="46" text-anchor="middle" font-size="14" font-weight="bold" fill="#065f46">A</text>
                  </svg>
                </div>
                <h3>Alcaldía de Bucaramanga</h3>
                <p>Secretaría de Salud</p>
              </div>
              <div class="ally-card">
                <div class="ally-shield" aria-hidden="true">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="36" stroke="#065f46" stroke-width="2" fill="#ecfdf5"/>
                    <path d="M40 16c-8 0-16 4-20 10v8c0 16 8 28 20 32 12-4 20-16 20-32v-8c-4-6-12-10-20-10z" fill="#059669" opacity="0.15"/>
                    <text x="40" y="46" text-anchor="middle" font-size="14" font-weight="bold" fill="#065f46">PN</text>
                  </svg>
                </div>
                <h3>Policía Nacional</h3>
                <p>Policía Ambiental</p>
              </div>
              <div class="ally-card">
                <div class="ally-shield" aria-hidden="true">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="36" stroke="#065f46" stroke-width="2" fill="#ecfdf5"/>
                    <path d="M40 16c-8 0-16 4-20 10v8c0 16 8 28 20 32 12-4 20-16 20-32v-8c-4-6-12-10-20-10z" fill="#059669" opacity="0.15"/>
                    <text x="40" y="46" text-anchor="middle" font-size="12" font-weight="bold" fill="#065f46">CZ</text>
                  </svg>
                </div>
                <h3>Centro de Zoonosis</h3>
                <p>Bucaramanga</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="home-footer">
          <p>New Life &copy; ${new Date().getFullYear()} — Sistema de Registro y Trazabilidad Canina</p>
          <p class="home-footer-legal">En cumplimiento de la Ley Ángel. Bucaramanga, Colombia.</p>
        </footer>
      </div>
    `;
  }

  /**
   * Inicializa la vista de inicio.
   */
  function init() {
    // No se necesita lógica adicional para la landing page
  }

  return { render, init };
})();
