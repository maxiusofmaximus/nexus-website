/**
 * 🤖 AI Chat Component - Barra de chat flotante estilo Atlas
 * Soporta múltiples proveedores de IA y modos Ask/Agent
 */

export default class AIChat {
    constructor() {
        this.isVisible = false;
        this.isMinimized = true;
        this.currentMode = 'ask'; // 'ask' | 'agent' | 'hybrid'
        this.currentProvider = 'local'; // 'local' | 'deepseek' | 'ollama' | 'chatgpt' | 'claude'
        this.chatHistory = [];
        this.isProcessing = false;
        
        this.providers = {
            local: { name: 'Local AI', icon: '🏠', available: true },
            deepseek: { name: 'DeepSeek', icon: '🔍', available: navigator.onLine },
            ollama: { name: 'Ollama', icon: '🦙', available: navigator.onLine },
            chatgpt: { name: 'ChatGPT', icon: '🤖', available: navigator.onLine },
            claude: { name: 'Claude Sonnet', icon: '🎭', available: navigator.onLine }
        };

        this.init();
    }

    init() {
        this.createChatInterface();
        this.setupEventListeners();
        this.loadChatHistory();
        
        // Auto-hide initially
        setTimeout(() => {
            if (this.isVisible) {
                this.hide();
            }
        }, 3000);
    }

    createChatInterface() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'ai-chat-container';
        this.container.innerHTML = this.getHTML();
        
        // Add styles
        this.addStyles();
        
        // Append to body
        document.body.appendChild(this.container);
        
        // Get references
        this.chatPanel = this.container.querySelector('.ai-chat-panel');
        this.toggleBtn = this.container.querySelector('.ai-chat-toggle');
        this.minimizeBtn = this.container.querySelector('.minimize-btn');
        this.closeBtn = this.container.querySelector('.close-btn');
        this.messagesContainer = this.container.querySelector('.chat-messages');
        this.inputField = this.container.querySelector('.chat-input');
        this.sendBtn = this.container.querySelector('.send-btn');
        this.modeSelector = this.container.querySelector('.mode-selector');
        this.providerSelector = this.container.querySelector('.provider-selector');
    }

    getHTML() {
        return `
            <!-- Toggle Button -->
            <button class="ai-chat-toggle" title="Abrir Chat IA">
                <i class="fas fa-robot"></i>
                <span class="chat-badge">IA</span>
            </button>

            <!-- Chat Panel -->
            <div class="ai-chat-panel">
                <!-- Header -->
                <div class="chat-header">
                    <div class="chat-title">
                        <i class="fas fa-robot"></i>
                        <span>Asistente IA</span>
                        <span class="mode-indicator">${this.currentMode.toUpperCase()}</span>
                    </div>
                    <div class="chat-controls">
                        <button class="minimize-btn" title="Minimizar">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="close-btn" title="Ocultar">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Mode & Provider Selection -->
                <div class="chat-options">
                    <div class="mode-selection">
                        <label>Modo:</label>
                        <select class="mode-selector">
                            <option value="ask">🤔 Ask - Preguntar</option>
                            <option value="agent">🎯 Agent - Ejecutar</option>
                            <option value="hybrid">🔄 Híbrido</option>
                        </select>
                    </div>
                    <div class="provider-selection">
                        <label>IA:</label>
                        <select class="provider-selector">
                            ${Object.entries(this.providers).map(([key, provider]) => 
                                `<option value="${key}" ${!provider.available ? 'disabled' : ''}>
                                    ${provider.icon} ${provider.name}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                </div>

                <!-- Messages -->
                <div class="chat-messages">
                    <div class="welcome-message">
                        <div class="message ai-message">
                            <div class="message-content">
                                <p>👋 ¡Hola! Soy tu asistente IA para desarrollo de juegos.</p>
                                <div class="mode-explanation">
                                    <strong>Modos disponibles:</strong>
                                    <ul>
                                        <li><strong>Ask:</strong> Pregúntame sobre comandos, sintaxis o conceptos</li>
                                        <li><strong>Agent:</strong> Te ayudo a crear y modificar tu juego</li>
                                        <li><strong>Híbrido:</strong> Combino ambos modos según tu necesidad</li>
                                    </ul>
                                </div>
                                <div class="quick-actions">
                                    <button class="quick-btn" data-text="¿Cómo creo un jugador?">
                                        🎮 Crear jugador
                                    </button>
                                    <button class="quick-btn" data-text="Explica los comandos de física">
                                        ⚡ Comandos física
                                    </button>
                                    <button class="quick-btn" data-text="Crea un juego de plataformas básico">
                                        🏗️ Juego plataformas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="chat-input-area">
                    <div class="input-container">
                        <input 
                            type="text" 
                            class="chat-input" 
                            placeholder="Escribe tu mensaje o comando..."
                            autocomplete="off"
                        >
                        <button class="send-btn" title="Enviar">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="input-hints">
                        <span class="hint-text">
                            💡 Tip: Usa "crear jugador en 100,200" o pregunta "¿cómo funciona la física?"
                        </span>
                    </div>
                </div>

                <!-- Status Bar -->
                <div class="chat-status">
                    <span class="status-indicator">
                        <span class="status-dot online"></span>
                        <span class="status-text">Conectado</span>
                    </span>
                    <span class="message-count">0 mensajes</span>
                </div>
            </div>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Toggle Button */
            .ai-chat-toggle {
                position: relative;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4299e1, #63b3ed);
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(66, 153, 225, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }

            .ai-chat-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(66, 153, 225, 0.6);
            }

            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #48bb78;
                color: white;
                font-size: 0.7rem;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 10px;
                border: 2px solid white;
            }

            /* Chat Panel */
            .ai-chat-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 400px;
                max-height: 600px;
                background: #2d3748;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                border: 1px solid #4a5568;
                display: none;
                flex-direction: column;
                overflow: hidden;
                backdrop-filter: blur(10px);
            }

            .ai-chat-panel.visible {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            .ai-chat-panel.minimized {
                max-height: 60px;
            }

            /* Header */
            .chat-header {
                background: #4a5568;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #718096;
            }

            .chat-title {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: white;
                font-weight: 600;
            }

            .mode-indicator {
                background: #4299e1;
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 500;
            }

            .chat-controls {
                display: flex;
                gap: 0.5rem;
            }

            .chat-controls button {
                background: none;
                border: none;
                color: #a0aec0;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .chat-controls button:hover {
                color: white;
                background: rgba(255, 255, 255, 0.1);
            }

            /* Options */
            .chat-options {
                padding: 1rem;
                background: #4a5568;
                border-bottom: 1px solid #718096;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .chat-options label {
                color: #e2e8f0;
                font-size: 0.8rem;
                font-weight: 500;
                margin-bottom: 0.25rem;
                display: block;
            }

            .chat-options select {
                width: 100%;
                background: #2d3748;
                border: 1px solid #718096;
                color: white;
                padding: 0.5rem;
                border-radius: 6px;
                font-size: 0.8rem;
            }

            .chat-options select:focus {
                outline: none;
                border-color: #4299e1;
            }

            /* Messages */
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                max-height: 300px;
                background: #1a202c;
            }

            .message {
                margin-bottom: 1rem;
                animation: fadeIn 0.3s ease;
            }

            .message-content {
                background: #2d3748;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                color: #e2e8f0;
                line-height: 1.5;
                position: relative;
            }

            .ai-message .message-content {
                background: #4a5568;
                margin-right: 2rem;
            }

            .user-message .message-content {
                background: #4299e1;
                margin-left: 2rem;
                color: white;
            }

            .mode-explanation {
                margin: 0.5rem 0;
                font-size: 0.9rem;
            }

            .mode-explanation ul {
                margin: 0.5rem 0;
                padding-left: 1rem;
            }

            .mode-explanation li {
                margin-bottom: 0.25rem;
            }

            .quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 1rem;
            }

            .quick-btn {
                background: #4299e1;
                color: white;
                border: none;
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .quick-btn:hover {
                background: #3182ce;
                transform: translateY(-1px);
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #a0aec0;
                font-style: italic;
            }

            .typing-dots {
                display: flex;
                gap: 2px;
            }

            .typing-dot {
                width: 4px;
                height: 4px;
                background: #4299e1;
                border-radius: 50%;
                animation: typingPulse 1.4s infinite;
            }

            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }

            /* Input Area */
            .chat-input-area {
                background: #2d3748;
                border-top: 1px solid #4a5568;
            }

            .input-container {
                display: flex;
                padding: 1rem;
                gap: 0.5rem;
            }

            .chat-input {
                flex: 1;
                background: #1a202c;
                border: 1px solid #4a5568;
                color: white;
                padding: 0.75rem;
                border-radius: 8px;
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.2s ease;
            }

            .chat-input:focus {
                border-color: #4299e1;
            }

            .chat-input::placeholder {
                color: #a0aec0;
            }

            .send-btn {
                background: #4299e1;
                border: none;
                color: white;
                padding: 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 44px;
            }

            .send-btn:hover:not(:disabled) {
                background: #3182ce;
                transform: translateY(-1px);
            }

            .send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .input-hints {
                padding: 0.5rem 1rem;
                border-top: 1px solid #4a5568;
                background: #4a5568;
            }

            .hint-text {
                color: #a0aec0;
                font-size: 0.8rem;
            }

            /* Status Bar */
            .chat-status {
                background: #4a5568;
                padding: 0.5rem 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.8rem;
                color: #a0aec0;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #48bb78;
                animation: pulse 2s infinite;
            }

            .status-dot.offline {
                background: #f56565;
                animation: none;
            }

            /* Animations */
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes typingPulse {
                0%, 60%, 100% { transform: scale(1); }
                30% { transform: scale(1.4); }
            }

            /* Responsive */
            @media (max-width: 480px) {
                .ai-chat-panel {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }

                .chat-options {
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }
            }

            /* Scrollbar */
            .chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chat-messages::-webkit-scrollbar-track {
                background: #2d3748;
            }

            .chat-messages::-webkit-scrollbar-thumb {
                background: #4a5568;
                border-radius: 3px;
            }

            .chat-messages::-webkit-scrollbar-thumb:hover {
                background: #718096;
            }
        `;
        
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Toggle chat
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Minimize/Close
        this.minimizeBtn.addEventListener('click', () => this.minimize());
        this.closeBtn.addEventListener('click', () => this.hide());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Mode and provider changes
        this.modeSelector.addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            this.updateModeIndicator();
        });

        this.providerSelector.addEventListener('change', (e) => {
            this.currentProvider = e.target.value;
            this.updateProviderStatus();
        });

        // Quick actions
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const text = e.target.dataset.text;
                this.inputField.value = text;
                this.sendMessage();
            }
        });

        // Network status
        window.addEventListener('online', () => this.updateNetworkStatus());
        window.addEventListener('offline', () => this.updateNetworkStatus());

        // Auto-hide on outside click
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && this.isVisible && !this.isMinimized) {
                this.minimize();
            }
        });
    }

    show() {
        this.isVisible = true;
        this.chatPanel.classList.add('visible');
        this.toggleBtn.style.display = 'none';
        this.inputField.focus();
    }

    hide() {
        this.isVisible = false;
        this.chatPanel.classList.remove('visible');
        this.toggleBtn.style.display = 'flex';
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    minimize() {
        this.isMinimized = !this.isMinimized;
        this.chatPanel.classList.toggle('minimized', this.isMinimized);
        
        if (!this.isMinimized) {
            this.inputField.focus();
        }
    }

    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isProcessing) return;

        this.isProcessing = true;
        this.inputField.value = '';
        this.sendBtn.disabled = true;

        // Add user message
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            let response;
            
            // Process message based on current mode
            if (this.currentMode === 'ask') {
                response = await this.processAskMode(message);
            } else if (this.currentMode === 'agent') {
                response = await this.processAgentMode(message);
            } else { // hybrid mode
                response = await this.processHybridMode(message);
            }
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage(response, 'ai');
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('❌ Error al procesar el mensaje. Intenta de nuevo.', 'ai');
            console.error('Error processing message:', error);
        }

        this.isProcessing = false;
        this.sendBtn.disabled = false;
        this.updateMessageCount();
        this.saveChatHistory();
    }

    async processAskMode(message) {
        // Ask mode: Only provide information, no code execution
        const context = this.buildAskContext(message);
        
        if (this.currentProvider !== 'local') {
            return await this.callAIProvider(context);
        } else {
            return this.generateAskResponse(message);
        }
    }

    async processAgentMode(message) {
        // Agent mode: Can execute commands and generate code
        const context = this.buildAgentContext(message);
        
        let response;
        if (this.currentProvider !== 'local') {
            response = await this.callAIProvider(context);
        } else {
            response = this.generateAgentResponse(message);
        }

        // Try to execute any commands found in the response
        await this.executeCommands(response);
        
        return response;
    }

    async processHybridMode(message) {
        // Hybrid mode: Intelligent decision between ask and agent
        const isQuestion = this.isQuestionMessage(message);
        
        if (isQuestion) {
            return await this.processAskMode(message);
        } else {
            return await this.processAgentMode(message);
        }
    }

    buildAskContext(message) {
        const engineInfo = window.engineSelector ? window.engineSelector.getCurrentEngine() : null;
        const availableCommands = window.keywordSystem ? window.keywordSystem.getAvailableCommands() : [];
        
        return `
MODO ASK - Solo proporcionar información, NO ejecutar código.

Motor gráfico actual: ${engineInfo ? engineInfo.name : 'Ninguno'}
Comandos disponibles: ${availableCommands.join(', ')}

Pregunta del usuario: ${message}

Instrucciones:
- Solo proporciona información y explicaciones
- No generes código ejecutable
- Explica comandos y conceptos
- Sugiere comandos pero no los ejecutes
- Usa ejemplos para clarificar
`;
    }

    buildAgentContext(message) {
        const engineInfo = window.engineSelector ? window.engineSelector.getCurrentEngine() : null;
        const availableCommands = window.keywordSystem ? window.keywordSystem.getAvailableCommands() : [];
        
        return `
MODO AGENT - Puedes ejecutar comandos y generar código.

Motor gráfico actual: ${engineInfo ? engineInfo.name : 'Ninguno'}
Comandos disponibles: ${availableCommands.join(', ')}

Solicitud del usuario: ${message}

Instrucciones:
- Puedes generar y ejecutar código
- Usa comandos humanizados cuando sea apropiado
- Ejecuta acciones solicitadas
- Proporciona feedback sobre las acciones realizadas
- Si generas comandos, márcalos con [COMANDO]: al inicio
`;
    }

    isQuestionMessage(message) {
        const questionWords = ['qué', 'cómo', 'cuál', 'cuándo', 'dónde', 'por qué', 'para qué', '?'];
        const lowerMessage = message.toLowerCase();
        
        return questionWords.some(word => lowerMessage.includes(word));
    }

    async executeCommands(response) {
        // Extract commands from AI response
        const commandRegex = /\[COMANDO\]:\s*(.+)/g;
        const commands = [];
        let match;
        
        while ((match = commandRegex.exec(response)) !== null) {
            commands.push(match[1].trim());
        }
        
        // Execute each command using the keyword system
        for (const command of commands) {
            try {
                if (window.keywordSystem) {
                    const code = window.keywordSystem.processCommand(command);
                    console.log(`Ejecutando comando: ${command}`);
                    console.log(`Código generado: ${code}`);
                    
                    // Here you would execute the generated code
                    // This depends on your game engine integration
                    this.executeGeneratedCode(code);
                }
            } catch (error) {
                console.error(`Error ejecutando comando "${command}":`, error);
            }
        }
    }

    executeGeneratedCode(code) {
        // This method would integrate with your game engine
        // For now, we'll just log it
        console.log('Código a ejecutar:', code);
        
        // In a real implementation, you might:
        // - Send code to the active game engine
        // - Update the game state
        // - Refresh the game canvas
        
        // Example for Kaplay:
        // if (window.currentEngine === 'kaplay') {
        //     eval(code); // Be careful with eval in production!
        // }
    }

    async callAIProvider(context) {
        // Mock implementation for external AI providers
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // In a real implementation, this would call the actual AI API
        return `🤖 Respuesta del proveedor ${this.providers[this.currentProvider].name}:\n\n${context.includes('ASK') ? this.generateAskResponse(context) : this.generateAgentResponse(context)}`;
    }



    generateAskResponse(message) {
        const askResponses = {
            'jugador': '🎮 Para crear un jugador, usa: `crear jugador en 100,200`. Esto crea un sprite en las coordenadas especificadas.',
            'física': '⚡ Comandos de física disponibles:\n• `gravedad jugador` - Aplica gravedad\n• `velocidad jugador 200` - Establece velocidad\n• `colisión jugador con suelo` - Detecta colisiones',
            'escena': '🎬 Las escenas organizan tu juego. Usa `ir a menu_principal` para cambiar entre escenas.',
            'sonido': '🔊 Para sonidos usa: `sonido explosion` o `música fondo loop`',
            'default': '🤔 Puedo ayudarte con comandos, sintaxis y conceptos del motor de juegos. ¿Qué te gustaría saber?'
        };

        for (const [key, response] of Object.entries(askResponses)) {
            if (message.toLowerCase().includes(key)) {
                return response;
            }
        }

        return askResponses.default;
    }

    generateAgentResponse(message) {
        if (message.toLowerCase().includes('crear') && message.toLowerCase().includes('juego')) {
            return '🏗️ ¡Perfecto! Voy a crear un juego básico para ti:\n\n```\n// Creando escena principal\nir a juego_principal\n\n// Creando jugador\ncrear jugador en 100,400\ngravedad jugador\ncolor jugador azul\n\n// Creando suelo\ncrear suelo en 0,500\ncolor suelo verde\n\n// Controles\ntecla espacio hacer saltar jugador\n```\n\n✅ ¡Juego básico creado! Prueba las teclas de flecha y espacio.';
        }

        if (message.toLowerCase().includes('física')) {
            return '⚡ Aplicando física al juego:\n\n```\n// Configurando física\ngravedad mundo 800\nfricción suelo 0.8\nrebote jugador 0.3\n\n// Colisiones\ncuando jugador toca enemigo hacer\n  vida jugador -1\n  sonido golpe\nfin\n```\n\n✅ Sistema de física configurado.';
        }

        return '🎯 Entendido. Ejecutando la acción solicitada... ¿Podrías ser más específico sobre qué quieres que haga?';
    }

    generateHybridResponse(message) {
        if (message.includes('?') || message.toLowerCase().includes('cómo') || message.toLowerCase().includes('qué')) {
            return this.generateAskResponse(message);
        } else {
            return this.generateAgentResponse(message);
        }
    }

    addMessage(content, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        
        messageEl.innerHTML = `
            <div class="message-content">
                ${this.formatMessage(content)}
            </div>
        `;

        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        
        // Add to history
        this.chatHistory.push({ content, type, timestamp: Date.now() });
    }

    formatMessage(content) {
        // Format code blocks
        content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Format inline code
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Format line breaks
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }

    showTypingIndicator() {
        const typingEl = document.createElement('div');
        typingEl.className = 'message ai-message typing-indicator';
        typingEl.innerHTML = `
            <div class="message-content">
                <span>🤖 Procesando</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingEl = this.messagesContainer.querySelector('.typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    updateModeIndicator() {
        const indicator = this.container.querySelector('.mode-indicator');
        indicator.textContent = this.currentMode.toUpperCase();
        
        // Update placeholder
        const placeholders = {
            ask: 'Pregunta sobre comandos, sintaxis...',
            agent: 'Describe qué quieres crear...',
            hybrid: 'Pregunta o solicita una acción...'
        };
        
        this.inputField.placeholder = placeholders[this.currentMode];
    }

    updateProviderStatus() {
        const provider = this.providers[this.currentProvider];
        const statusText = this.container.querySelector('.status-text');
        const statusDot = this.container.querySelector('.status-dot');
        
        if (provider.available) {
            statusText.textContent = `Conectado - ${provider.name}`;
            statusDot.className = 'status-dot online';
        } else {
            statusText.textContent = 'Sin conexión';
            statusDot.className = 'status-dot offline';
        }
    }

    updateNetworkStatus() {
        const isOnline = navigator.onLine;
        
        // Update provider availability
        Object.keys(this.providers).forEach(key => {
            if (key !== 'local') {
                this.providers[key].available = isOnline;
            }
        });

        // Update provider selector
        const options = this.providerSelector.querySelectorAll('option');
        options.forEach(option => {
            const provider = this.providers[option.value];
            option.disabled = !provider.available;
        });

        // Switch to local if current provider is unavailable
        if (!isOnline && this.currentProvider !== 'local') {
            this.currentProvider = 'local';
            this.providerSelector.value = 'local';
        }

        this.updateProviderStatus();
    }

    updateMessageCount() {
        const count = this.chatHistory.length;
        const countEl = this.container.querySelector('.message-count');
        countEl.textContent = `${count} mensaje${count !== 1 ? 's' : ''}`;
    }

    saveChatHistory() {
        try {
            localStorage.setItem('ai-chat-history', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('No se pudo guardar el historial del chat:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('ai-chat-history');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                
                // Restore recent messages (last 10)
                const recentMessages = this.chatHistory.slice(-10);
                recentMessages.forEach(msg => {
                    if (msg.type !== 'system') {
                        this.addMessage(msg.content, msg.type);
                    }
                });
                
                this.updateMessageCount();
            }
        } catch (error) {
            console.warn('No se pudo cargar el historial del chat:', error);
        }
    }

    clearHistory() {
        this.chatHistory = [];
        this.messagesContainer.innerHTML = '';
        this.saveChatHistory();
        this.updateMessageCount();
        
        // Re-add welcome message
        this.addMessage('🔄 Historial limpiado. ¿En qué puedo ayudarte?', 'ai');
    }

    // Public API
    sendCommand(command) {
        this.inputField.value = command;
        this.sendMessage();
    }

    setMode(mode) {
        this.currentMode = mode;
        this.modeSelector.value = mode;
        this.updateModeIndicator();
    }

    setProvider(provider) {
        if (this.providers[provider] && this.providers[provider].available) {
            this.currentProvider = provider;
            this.providerSelector.value = provider;
            this.updateProviderStatus();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChat();
});

// Export for module usage
export { AIChat };