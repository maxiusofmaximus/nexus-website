/**
 * 🎮 Componente UI - Selector de Motores Gráficos
 * 
 * Interfaz de usuario para seleccionar entre diferentes motores gráficos
 */

class EngineSelectorUI {
    constructor(engineSelector) {
        this.engineSelector = engineSelector;
        this.container = null;
        this.isVisible = false;
        this.selectedEngine = null;
        
        this.init();
        this.setupEventListeners();
    }

    /**
     * 🔧 Inicializa la interfaz
     */
    init() {
        this.createContainer();
        this.render();
    }

    /**
     * 📦 Crea el contenedor principal
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'engine-selector-ui';
        this.container.innerHTML = this.getHTML();
        
        // Agregar estilos
        this.addStyles();
        
        // Agregar al DOM
        document.body.appendChild(this.container);
    }

    /**
     * 🎨 Genera el HTML de la interfaz
     */
    getHTML() {
        return `
            <div class="engine-selector-overlay">
                <div class="engine-selector-modal">
                    <div class="engine-selector-header">
                        <h2>🎮 Seleccionar Motor Gráfico</h2>
                        <button class="close-btn" data-action="close">×</button>
                    </div>
                    
                    <div class="engine-selector-content">
                        <div class="network-status">
                            <span class="status-indicator ${this.engineSelector.isOnline ? 'online' : 'offline'}"></span>
                            <span class="status-text">
                                ${this.engineSelector.isOnline ? '🌐 Conectado' : '📴 Sin conexión'}
                            </span>
                        </div>
                        
                        <div class="engines-grid">
                            ${this.renderEngines()}
                        </div>
                        
                        <div class="engine-info">
                            <div id="engine-details" class="engine-details">
                                <p>Selecciona un motor para ver más información</p>
                            </div>
                        </div>
                        
                        <div class="engine-selector-actions">
                            <button class="btn btn-secondary" data-action="cancel">Cancelar</button>
                            <button class="btn btn-primary" data-action="select" disabled>
                                Seleccionar Motor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 🎮 Renderiza la lista de motores
     */
    renderEngines() {
        const engines = this.engineSelector.getAvailableEngines();
        
        return engines.map(engine => `
            <div class="engine-card ${engine.status}" data-engine="${this.getEngineId(engine)}">
                <div class="engine-icon">
                    ${this.getEngineIcon(engine.name)}
                </div>
                <div class="engine-info-card">
                    <h3>${engine.name}</h3>
                    <p class="engine-version">v${engine.version}</p>
                    <p class="engine-description">${engine.description}</p>
                    <div class="engine-features">
                        ${engine.features.map(feature => `
                            <span class="feature-tag">${feature}</span>
                        `).join('')}
                    </div>
                    <div class="engine-status">
                        ${this.getStatusBadge(engine)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * 🎯 Obtiene ID del motor
     */
    getEngineId(engine) {
        const engineMap = {
            'Kaplay Engine': 'kaplay',
            'Motor Propio': 'custom',
            'Phaser': 'phaser',
            'PixiJS': 'pixijs'
        };
        return engineMap[engine.name] || engine.name.toLowerCase();
    }

    /**
     * 🎨 Obtiene icono del motor
     */
    getEngineIcon(engineName) {
        const icons = {
            'Kaplay Engine': '🎮',
            'Motor Propio': '⚙️',
            'Phaser': '🔥',
            'PixiJS': '✨'
        };
        return icons[engineName] || '🎯';
    }

    /**
     * 🏷️ Obtiene badge de estado
     */
    getStatusBadge(engine) {
        const badges = {
            'available': '<span class="status-badge available">✅ Disponible</span>',
            'unavailable': '<span class="status-badge unavailable">❌ No disponible</span>',
            'coming_soon': '<span class="status-badge coming-soon">🚧 Próximamente</span>'
        };
        return badges[engine.status] || '';
    }

    /**
     * 🎨 Agrega estilos CSS
     */
    addStyles() {
        if (document.getElementById('engine-selector-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'engine-selector-styles';
        styles.textContent = `
            .engine-selector-ui {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
            }

            .engine-selector-ui.visible {
                display: block;
            }

            .engine-selector-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .engine-selector-modal {
                background: #1a202c;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 900px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                animation: slideIn 0.3s ease;
            }

            .engine-selector-header {
                background: #2d3748;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #4a5568;
            }

            .engine-selector-header h2 {
                margin: 0;
                color: #ffffff;
                font-size: 1.5rem;
            }

            .close-btn {
                background: none;
                border: none;
                color: #a0aec0;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .close-btn:hover {
                background: #4a5568;
                color: #ffffff;
            }

            .engine-selector-content {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .network-status {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 20px;
                padding: 10px;
                background: #2d3748;
                border-radius: 8px;
            }

            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            .status-indicator.online {
                background: #48bb78;
            }

            .status-indicator.offline {
                background: #f56565;
            }

            .status-text {
                color: #e2e8f0;
                font-weight: 500;
            }

            .engines-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
            }

            .engine-card {
                background: #2d3748;
                border: 2px solid #4a5568;
                border-radius: 8px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .engine-card:hover {
                border-color: #63b3ed;
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            }

            .engine-card.selected {
                border-color: #4299e1;
                background: #2b6cb0;
            }

            .engine-card.unavailable {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .engine-card.coming_soon {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .engine-icon {
                font-size: 2rem;
                margin-bottom: 8px;
            }

            .engine-info-card h3 {
                margin: 0 0 4px 0;
                color: #ffffff;
                font-size: 1.2rem;
            }

            .engine-version {
                color: #a0aec0;
                font-size: 0.9rem;
                margin: 0 0 8px 0;
            }

            .engine-description {
                color: #e2e8f0;
                font-size: 0.9rem;
                margin: 0 0 12px 0;
                line-height: 1.4;
            }

            .engine-features {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 12px;
            }

            .feature-tag {
                background: #4a5568;
                color: #e2e8f0;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
            }

            .engine-status {
                position: absolute;
                top: 12px;
                right: 12px;
            }

            .status-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 500;
            }

            .status-badge.available {
                background: #48bb78;
                color: #ffffff;
            }

            .status-badge.unavailable {
                background: #f56565;
                color: #ffffff;
            }

            .status-badge.coming-soon {
                background: #ed8936;
                color: #ffffff;
            }

            .engine-details {
                background: #2d3748;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 20px;
                color: #e2e8f0;
            }

            .engine-selector-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                padding-top: 16px;
                border-top: 1px solid #4a5568;
            }

            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .btn-secondary {
                background: #4a5568;
                color: #ffffff;
            }

            .btn-secondary:hover:not(:disabled) {
                background: #2d3748;
            }

            .btn-primary {
                background: #4299e1;
                color: #ffffff;
            }

            .btn-primary:hover:not(:disabled) {
                background: #3182ce;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * 🎮 Configura event listeners
     */
    setupEventListeners() {
        // Eventos del selector de motores
        window.addEventListener('engineChanged', (e) => {
            this.handleEngineChange(e.detail);
        });

        window.addEventListener('networkChanged', (e) => {
            this.handleNetworkChange(e.detail);
        });

        // Eventos de la interfaz
        document.addEventListener('click', (e) => {
            if (e.target.closest('.engine-selector-ui')) {
                this.handleUIClick(e);
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    /**
     * 🖱️ Maneja clicks en la interfaz
     */
    handleUIClick(e) {
        const action = e.target.dataset.action;
        const engineCard = e.target.closest('.engine-card');

        if (action === 'close' || action === 'cancel') {
            this.hide();
        } else if (action === 'select') {
            this.selectEngine();
        } else if (engineCard) {
            this.selectEngineCard(engineCard);
        }
    }

    /**
     * 🎯 Selecciona una tarjeta de motor
     */
    selectEngineCard(card) {
        const engineId = card.dataset.engine;
        const engine = this.engineSelector.getEngineConfig(engineId);
        
        if (!engine || engine.status !== 'available') return;

        // Actualizar selección visual
        document.querySelectorAll('.engine-card').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');

        // Actualizar información
        this.selectedEngine = engineId;
        this.updateEngineDetails(engine);
        
        // Habilitar botón de selección
        const selectBtn = document.querySelector('[data-action="select"]');
        selectBtn.disabled = false;
    }

    /**
     * 📝 Actualiza detalles del motor seleccionado
     */
    updateEngineDetails(engine) {
        const detailsEl = document.getElementById('engine-details');
        detailsEl.innerHTML = `
            <h4>📋 ${engine.name} v${engine.version}</h4>
            <p><strong>Tipo:</strong> ${engine.type === 'online' ? '🌐 Online' : '💾 Offline'}</p>
            <p><strong>Descripción:</strong> ${engine.description}</p>
            <p><strong>Características:</strong></p>
            <ul>
                ${engine.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <p><strong>Documentación:</strong> 
                <a href="${engine.documentation}" target="_blank" style="color: #63b3ed;">
                    Ver documentación →
                </a>
            </p>
        `;
    }

    /**
     * ✅ Selecciona el motor elegido
     */
    async selectEngine() {
        if (!this.selectedEngine) return;

        try {
            // Mostrar loading
            this.showLoading();
            
            // Seleccionar motor
            await this.engineSelector.selectEngine(this.selectedEngine);
            
            // Ocultar interfaz
            this.hide();
            
            // Notificar éxito
            this.showNotification(`✅ Motor ${this.selectedEngine} cargado exitosamente`);
            
        } catch (error) {
            console.error('Error al seleccionar motor:', error);
            this.showNotification(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * ⏳ Muestra estado de carga
     */
    showLoading() {
        const selectBtn = document.querySelector('[data-action="select"]');
        selectBtn.innerHTML = '⏳ Cargando...';
        selectBtn.disabled = true;
    }

    /**
     * ✅ Oculta estado de carga
     */
    hideLoading() {
        const selectBtn = document.querySelector('[data-action="select"]');
        selectBtn.innerHTML = 'Seleccionar Motor';
        selectBtn.disabled = !this.selectedEngine;
    }

    /**
     * 📢 Muestra notificación
     */
    showNotification(message, type = 'success') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f56565' : '#48bb78'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * 🔄 Maneja cambio de motor
     */
    handleEngineChange(detail) {
        console.log('Motor cambiado:', detail);
    }

    /**
     * 🌐 Maneja cambio de conectividad
     */
    handleNetworkChange(detail) {
        if (this.isVisible) {
            this.render(); // Re-renderizar con nueva información
        }
    }

    /**
     * 👁️ Muestra la interfaz
     */
    show() {
        this.isVisible = true;
        this.container.classList.add('visible');
        this.render(); // Actualizar contenido
    }

    /**
     * 🙈 Oculta la interfaz
     */
    hide() {
        this.isVisible = false;
        this.container.classList.remove('visible');
        this.selectedEngine = null;
    }

    /**
     * 🔄 Re-renderiza la interfaz
     */
    render() {
        if (!this.container) return;
        
        const content = this.container.querySelector('.engine-selector-content');
        if (content) {
            content.innerHTML = `
                <div class="network-status">
                    <span class="status-indicator ${this.engineSelector.isOnline ? 'online' : 'offline'}"></span>
                    <span class="status-text">
                        ${this.engineSelector.isOnline ? '🌐 Conectado' : '📴 Sin conexión'}
                    </span>
                </div>
                
                <div class="engines-grid">
                    ${this.renderEngines()}
                </div>
                
                <div class="engine-info">
                    <div id="engine-details" class="engine-details">
                        <p>Selecciona un motor para ver más información</p>
                    </div>
                </div>
                
                <div class="engine-selector-actions">
                    <button class="btn btn-secondary" data-action="cancel">Cancelar</button>
                    <button class="btn btn-primary" data-action="select" disabled>
                        Seleccionar Motor
                    </button>
                </div>
            `;
        }
    }

    /**
     * 🧹 Limpia recursos
     */
    destroy() {
        if (this.container) {
            this.container.remove();
        }
        
        const styles = document.getElementById('engine-selector-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Exportar componente
window.EngineSelectorUI = EngineSelectorUI;
export default EngineSelectorUI;