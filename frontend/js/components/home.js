/**
 * New Life — Vista de Inicio (Landing Page)
 * Hero section con ilustración, features y call-to-action.
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
                <span>🐾</span> Bienestar Animal
              </div>
              <h1 class="hero-title">
                Cuida a tu <br><em>mejor amigo</em>
              </h1>
              <p class="hero-subtitle">
                Registra a tu mascota, lleva el control de su esterilización 
                y contribuye a una tenencia responsable.
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
              <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Círculo decorativo de fondo -->
                <circle cx="160" cy="160" r="140" fill="#d1fae5" opacity="0.5"/>
                <circle cx="160" cy="160" r="110" fill="#a7f3d0" opacity="0.3"/>
                
                <!-- Huella grande -->
                <path d="M160 200c-22 0-40-18-40-40s18-40 40-40 40 18 40 40-18 40-40 40z" fill="#059669" opacity="0.15"/>
                
                <!-- Cuerpo del perro (silueta estilizada) -->
                <ellipse cx="160" cy="180" rx="55" ry="40" fill="#065f46" opacity="0.12"/>
                <circle cx="160" cy="130" r="30" fill="#065f46" opacity="0.12"/>
                
                <!-- Orejas -->
                <ellipse cx="138" cy="108" rx="12" ry="18" fill="#065f46" opacity="0.12" transform="rotate(-15 138 108)"/>
                <ellipse cx="182" cy="108" rx="12" ry="18" fill="#065f46" opacity="0.12" transform="rotate(15 182 108)"/>
                
                <!-- Ojos -->
                <circle cx="150" cy="128" r="4" fill="#065f46" opacity="0.2"/>
                <circle cx="170" cy="128" r="4" fill="#065f46" opacity="0.2"/>
                
                <!-- Nariz -->
                <ellipse cx="160" cy="138" rx="5" ry="3.5" fill="#065f46" opacity="0.2"/>
                
                <!-- Patas -->
                <ellipse cx="130" cy="210" rx="10" ry="6" fill="#065f46" opacity="0.1"/>
                <ellipse cx="190" cy="210" rx="10" ry="6" fill="#065f46" opacity="0.1"/>
                
                <!-- Corazón flotante -->
                <path d="M220 100c0-8 6-14 14-14s14 6 14 14c0 8-14 20-14 20s-14-12-14-20z" fill="#059669" opacity="0.2">
                  <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
                  <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="2s" repeatCount="indefinite"/>
                </path>
                
                <!-- Estrella decorativa -->
                <text x="100" y="90" font-size="16" fill="#34d399" opacity="0.3">
                  ✦
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/>
                </text>
                <text x="230" y="180" font-size="12" fill="#34d399" opacity="0.2">
                  ✦
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite"/>
                </text>
              </svg>
            </div>
          </div>
        </section>

        <section class="features" aria-label="Características">
          <div class="features-inner">
            <h2 class="features-title">¿Por qué New Life?</h2>
            <p class="features-subtitle">Todo lo que necesitas para el cuidado responsable de tu mascota</p>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">📋</div>
                <h3>Registro Simple</h3>
                <p>Registra a tus mascotas en segundos. Solo necesitas nombre, edad y raza.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">✅</div>
                <h3>Control de Esterilización</h3>
                <p>Lleva el seguimiento del estado de esterilización de cada mascota.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon" aria-hidden="true">📊</div>
                <h3>Panel de Administración</h3>
                <p>Los administradores pueden ver estadísticas globales y gestionar el sistema.</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="home-footer">
          <p>New Life &copy; ${new Date().getFullYear()} — Registro de Mascotas</p>
        </footer>
      </div>
    `;
  }

  /**
   * Inicializa la vista de inicio (no necesita event listeners complejos).
   */
  function init() {
    // No se necesita lógica adicional para la landing page
  }

  return { render, init };
})();
