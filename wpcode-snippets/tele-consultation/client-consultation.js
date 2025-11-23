/**
 * Snippet: FURGE-CLIENT-Consultation
 * ID WPCode: 10
 * Dernière modification: 2025-10-01 20:14:04
 * Active: True
 * Révision: 1
 * 
 * Site: tele-consultation.com
 * Projet: Furge - Téléconsultation
 */


/**
 * Page Consultation Dr Furgé - Version avec Chrono dans Bandeau + Paiement
 * Design fond blanc, cards modernes
 * Shortcode: [consultation_furge]
 */

add_shortcode('consultation_furge', 'display_consultation_furge_modern');

function display_consultation_furge_modern() {
    ob_start();
    ?>
    
    <style>
        /* Reset et base */
        .cf-consultation * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .cf-consultation {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f8f9fa;
            min-height: 100vh;
            padding: 20px;
            margin: -20px;
        }

        .cf-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Header moderne - COMPACT */
        .cf-header {
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            text-align: center;
        }

        .cf-header h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 5px !important;
            font-weight: 700;
        }

        .cf-header .subtitle {
            color: #666;
            font-size: 14px;
        }

        .cf-header .badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 11px;
            margin-top: 8px;
        }

        /* Card de connexion */
        .cf-access-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 500px;
            margin: 0 auto 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .cf-access-card h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px !important;
            text-align: center;
        }

        .cf-access-card .desc {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
        }

        .cf-input-group {
            margin-bottom: 20px;
        }

        .cf-input {
            width: 100%;
            padding: 15px;
            font-size: 18px;
            text-align: center;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s;
            background: #f8f9fa;
        }

        .cf-input:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
        }

        .cf-btn-primary {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .cf-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102,126,234,0.3);
        }

        /* Notice paiement patient */
        .cf-payment-notice {
            background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
            border: 2px solid #ffc107;
            color: #856404;
            padding: 12px 20px;
            margin: 15px auto;
            max-width: 500px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(255,193,7,0.2);
            display: none;
            cursor: pointer;
            transition: all 0.3s;
        }

        .cf-payment-notice:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255,193,7,0.3);
        }

        .cf-payment-notice.show {
            display: block;
        }

        .cf-payment-notice strong {
            display: block;
            font-size: 16px;
            margin-bottom: 5px;
        }

        .cf-payment-notice span {
            font-size: 13px;
            opacity: 0.9;
        }

        /* Zone consultation */
        .cf-consultation-zone {
            display: none;
        }

        .cf-consultation-zone.active {
            display: block;
        }

        /* Zone vidéo */
        .cf-video-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        /* Header vidéo avec gradient violet */
        .cf-video-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
        }

        .cf-video-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .cf-video-left {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .cf-info-mini {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
        }

        .cf-info-mini span {
            opacity: 0.9;
        }

        .cf-info-mini strong {
            font-weight: 600;
        }

        /* Chronomètre intégré dans le bandeau - Médecin uniquement */
        .cf-timer {
            display: none;
            align-items: center;
            gap: 10px;
            background: rgba(255,255,255,0.2);
            padding: 8px 15px;
            border-radius: 8px;
            margin-left: auto;
            margin-right: 15px;
        }
        
        .cf-doctor-mode .cf-timer {
            display: flex;
        }
        
        .cf-timer-display {
            font-size: 18px;
            font-weight: bold;
            color: white;
            min-width: 80px;
            text-align: center;
            font-family: monospace;
        }
        
        .cf-timer-btn {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: none;
            background: #28a745;
            color: white;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .cf-timer-btn:hover {
            transform: scale(1.1);
        }
        
        .cf-timer-btn.pause {
            background: #ffc107;
        }
        
        .cf-timer-btn.stop {
            background: #dc3545;
        }
        
        .cf-timer.active .cf-timer-display {
            color: #4caf50;
            text-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
        }

        .cf-status {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
        }

        .cf-status-dot {
            width: 6px;
            height: 6px;
            background: #4caf50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .cf-status.warning .cf-status-dot {
            background: #ff9800;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
        }

        /* Salle d'attente moderne COMPACTE */
        .cf-waiting {
            padding: 60px 20px;
            text-align: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .cf-waiting-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .cf-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #e0e0e0;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .cf-waiting h3 {
            color: #333;
            font-size: 22px;
            margin-bottom: 8px !important;
        }

        .cf-waiting p {
            color: #666;
            font-size: 15px;
            margin-bottom: 8px;
        }

        /* Container vidéo OPTIMISÉ PLEIN ÉCRAN */
        .cf-video-container {
            position: relative;
            height: calc(100vh - 120px);
            min-height: 400px;
            max-height: 900px;
            background: #000;
            display: none;
        }

        .cf-video-container.active {
            display: block;
        }

        .cf-video-container iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        /* Bandeau sécurité FIXE en bas */
        .cf-security-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255,255,255,0.95);
            padding: 8px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #e0e0e0;
            z-index: 50;
            backdrop-filter: blur(10px);
        }
        
        .cf-security-bar span {
            margin: 0 10px;
        }
        
        /* Mode consultation active = maximiser l'espace */
        .cf-consultation-zone.active .cf-video-card {
            height: calc(100vh - 30px);
            max-height: calc(100vh - 30px);
            border-radius: 0;
        }

        .cf-consultation-zone.active .cf-video-container {
            height: calc(100vh - 50px - 30px);
            max-height: none;
        }

        /* Contrôles FLOTTANTS pour gagner de l'espace */
        .cf-controls {
            position: fixed;
            bottom: 40px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 100;
        }

        .cf-btn {
            padding: 12px;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .cf-btn:hover {
            transform: scale(1.1);
        }

        .cf-btn-end {
            background: #dc3545;
            color: white;
        }

        .cf-btn-backup {
            background: #ff9800;
            color: white;
        }

        .cf-btn-help {
            background: #17a2b8;
            color: white;
        }

        /* Bouton paiement médecin */
        .cf-btn-payment {
            background: #667eea;
            color: white;
        }

        /* Tooltip au survol */
        .cf-btn::after {
            content: attr(data-tooltip);
            position: absolute;
            right: 60px;
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }

        .cf-btn:hover::after {
            opacity: 1;
        }

        /* Panel d'aide en MODAL */
        .cf-help {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
            z-index: 1000;
            display: none;
        }

        .cf-help.active {
            display: block;
        }

        .cf-help-grid {
            display: grid;
            gap: 15px;
            margin-top: 15px;
        }

        .cf-help-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            border-left: 3px solid #17a2b8;
            font-size: 14px;
        }

        .cf-help-item strong {
            color: #17a2b8;
            display: block;
            margin-bottom: 5px;
        }

        /* Overlay pour la modal */
        .cf-help.active::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: -1;
        }

        /* Footer ULTRA COMPACT */
        .cf-footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
        }

        .cf-footer .security {
            background: white;
            border-radius: 10px;
            padding: 12px;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .cf-footer .lock {
            font-size: 16px;
        }

        /* Message toast MOBILE-FRIENDLY */
        .cf-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            opacity: 0;
            transition: all 0.3s;
            z-index: 10000;
            font-size: 14px;
            max-width: 90%;
            text-align: center;
        }

        .cf-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        /* Responsive MOBILE FIRST */
        @media (max-width: 768px) {
            .cf-consultation {
                padding: 10px;
                margin: -10px;
            }
            
            .cf-header {
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .cf-header h1 {
                font-size: 20px;
            }
            
            .cf-access-card {
                padding: 25px 20px;
                margin-bottom: 20px;
            }
            
            /* Vidéo PLEIN ÉCRAN sur mobile avec bandeau */
            .cf-consultation-zone.active .cf-consultation {
                padding: 0;
            }
            
            .cf-consultation-zone.active .cf-video-container {
                height: calc(100vh - 45px - 25px);
            }
            
            .cf-video-header {
                padding: 10px;
            }
            
            .cf-video-info {
                font-size: 12px;
            }
            
            /* Chrono mobile */
            .cf-timer {
                margin-right: 5px;
                padding: 5px 8px;
            }
            
            .cf-timer-display {
                font-size: 14px;
                min-width: 60px;
            }
            
            .cf-timer-btn {
                width: 28px;
                height: 28px;
                font-size: 14px;
            }
            
            .cf-controls {
                bottom: 35px;
                right: 10px;
                flex-direction: row;
                gap: 8px;
            }
            
            .cf-btn {
                width: 42px;
                height: 42px;
                font-size: 16px;
            }
            
            .cf-waiting {
                padding: 40px 20px;
            }
            
            .cf-waiting h3 {
                font-size: 18px;
            }
            
            .cf-waiting p {
                font-size: 14px;
            }
            
            /* Bandeau sécurité mobile */
            .cf-security-bar {
                font-size: 10px;
                padding: 6px;
                height: 25px;
            }
            
            .cf-security-bar span {
                margin: 0 5px;
            }
            
            /* Sur mobile, masquer les détails */
            .cf-security-detail {
                display: none;
            }
            
            @media (min-width: 480px) {
                .cf-security-detail {
                    display: inline;
                }
            }
            
            /* Masquer tooltips sur mobile */
            .cf-btn::after {
                display: none;
            }
            
            /* Footer plus compact */
            .cf-footer {
                padding: 15px 10px;
                margin-bottom: 30px;
            }
            
            .cf-footer .security {
                padding: 10px;
                font-size: 11px;
            }
            
            /* Modal aide adaptée */
            .cf-help {
                width: 95%;
                padding: 20px;
                max-height: 80vh;
                overflow-y: auto;
            }
        }
        
        /* Mode paysage mobile */
        @media (max-width: 812px) and (orientation: landscape) {
            .cf-consultation-zone.active .cf-video-container {
                height: calc(100vh - 40px - 20px);
            }
            
            .cf-video-header {
                padding: 8px 15px;
                font-size: 12px;
            }
            
            .cf-controls {
                bottom: 25px;
                right: 50%;
                transform: translateX(50%);
                flex-direction: row;
            }
            
            .cf-btn {
                width: 40px;
                height: 40px;
            }
            
            .cf-security-bar {
                height: 20px;
                font-size: 9px;
                padding: 4px;
            }
        }
    </style>

    <div class="cf-consultation">
        <div class="cf-container">
            <!-- Header COMPACT (masqué en mode consultation) -->
            <div class="cf-header" id="cfHeader">
                <h1>Dr Camille FURGÉ</h1>
                <div class="subtitle">Médecin Généraliste - Téléconsultation</div>
                <span class="badge">🔒 Sécurisé</span>
            </div>

            <!-- Zone d'accès -->
            <div class="cf-access-card" id="cfAccessZone">
                <h2>Accéder à votre consultation</h2>
                <p class="desc">
                    Entrez le code reçu par email ou SMS
                </p>
                
                <div class="cf-input-group">
                    <input 
                        type="text" 
                        id="cfCode" 
                        class="cf-input" 
                        placeholder="CODE PATIENT"
                        maxlength="30"
                        autocomplete="off"
                    >
                </div>
                
                <button class="cf-btn-primary" onclick="cfVerifyCode()">
                    Entrer en consultation →
                </button>
            </div>

            <!-- Notice paiement pour patient -->
            <div class="cf-payment-notice" id="cfPaymentNotice" onclick="cfGoToPayment()">
                <strong>💳 Consultation non réglée ?</strong>
                <span>Cliquez ici pour accéder au paiement sécurisé</span>
            </div>

            <!-- Zone consultation -->
            <div class="cf-consultation-zone" id="cfConsultationZone">
                <!-- Zone vidéo -->
                <div class="cf-video-card">
                    <div class="cf-video-header">
                        <div class="cf-video-info">
                            <div class="cf-video-left">
                                <div class="cf-info-mini">
                                    <span>👤</span>
                                    <strong id="cfPatientName">-</strong>
                                </div>
                                <div class="cf-info-mini">
                                    <span>📅</span>
                                    <strong id="cfDateTime">-</strong>
                                </div>
                            </div>
                            
                            <!-- Chronomètre intégré ici pour médecin -->
                            <div class="cf-timer" id="cfTimer">
                                <div class="cf-timer-display" id="cfTimerDisplay">00:00</div>
                                <button class="cf-timer-btn" id="cfTimerBtn" onclick="cfToggleTimer()" data-state="stopped">
                                    ▶
                                </button>
                                <button class="cf-timer-btn stop" onclick="cfResetTimer()" title="Réinitialiser">
                                    ■
                                </button>
                            </div>
                            
                            <div class="cf-status" id="cfStatus">
                                <span class="cf-status-dot"></span>
                                <span id="cfStatusText">En ligne</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Salle d'attente -->
                    <div class="cf-waiting" id="cfWaiting">
                        <div class="cf-waiting-icon">
                            <div class="cf-spinner"></div>
                        </div>
                        <h3>Connexion en cours...</h3>
                        <p>Votre praticien va vous rejoindre</p>
                        <p style="font-size: 14px; color: #999;">
                            Autorisez caméra et microphone
                        </p>
                    </div>
                    
                    <!-- Container vidéo -->
                    <div class="cf-video-container" id="cfVideoContainer">
                        <iframe 
                            id="cfJitsiFrame"
                            allow="camera;microphone;display-capture;fullscreen"
                            allowfullscreen="true"
                        ></iframe>
                    </div>
                </div>
                
                <!-- Contrôles FLOTTANTS -->
                <div class="cf-controls">
                    <!-- Bouton paiement médecin uniquement -->
                    <button class="cf-btn cf-btn-payment" id="cfPaymentBtn" onclick="cfCopyPaymentLink()" data-tooltip="Lien paiement" style="display: none;">
                        💳
                    </button>
                    <button class="cf-btn cf-btn-help" onclick="cfToggleHelp()" data-tooltip="Aide">
                        ❓
                    </button>
                    <button class="cf-btn cf-btn-backup" id="cfBackupBtn" onclick="cfTrySwitch()" data-tooltip="Problème connexion">
                        ⚠️
                    </button>
                    <button class="cf-btn cf-btn-end" onclick="cfEndConsultation()" data-tooltip="Terminer">
                        ✖
                    </button>
                </div>

                <!-- Panel d'aide (modal) -->
                <div class="cf-help" id="cfHelp">
                    <button onclick="cfToggleHelp()" style="float: right; background: none; border: none; font-size: 20px; cursor: pointer;">✖</button>
                    <h3 style="color: #333; margin-bottom: 15px;">💡 Aide rapide</h3>
                    <div class="cf-help-grid">
                        <div class="cf-help-item">
                            <strong>🔇 Pas de son ?</strong>
                            Vérifiez que votre micro est autorisé
                        </div>
                        <div class="cf-help-item">
                            <strong>📹 Pas d'image ?</strong>
                            Autorisez l'accès à la caméra
                        </div>
                        <div class="cf-help-item" style="border-left-color: #ffc107;">
                            <strong style="color: #ffc107;">⚠️ Connexion lente ?</strong>
                            <span id="cfHelpConnection">Informez votre praticien. Il vous demandera de cliquer sur ⚠️ si nécessaire</span>
                        </div>
                        <div class="cf-help-item">
                            <strong>📱 Mobile ?</strong>
                            Utilisez Chrome ou Safari
                        </div>
                    </div>
                    <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 15px; font-size: 13px; color: #856404;">
                        <strong>⚠️ Important :</strong> Ne changez PAS de serveur sans demande du médecin. 
                        Vous devez TOUS LES DEUX être sur le même serveur pour vous voir.
                    </div>
                </div>
            </div>

            <!-- Footer ULTRA COMPACT (uniquement sur la page d'accueil) -->
            <div class="cf-footer" id="cfFooter">
                <div class="security">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span class="lock">🔒</span>
                        <span><strong>Consultation sécurisée</strong> • Chiffrée • Conforme RGPD</span>
                    </div>
                </div>
            </div>
            
            <!-- Bandeau sécurité permanent (masqué au début) -->
            <div class="cf-security-bar" id="cfSecurityBar" style="display: none;">
                <span class="cf-security-main">🔒 Consultation sécurisée</span>
                <span class="cf-security-detail">• Chiffrement E2E</span>
                <span class="cf-security-detail">• Serveurs EU</span>
                <span class="cf-security-detail">• RGPD</span>
            </div>
        </div>
    </div>

    <!-- Toast message -->
    <div id="cfToast" class="cf-toast"></div>

    <script>
        // Configuration
        const CF_CONFIG = {
            servers: {
                main: 'https://meet.ffmuc.net',
                backup: 'https://visio.chapril.org'
            },
            prefix: 'FURGE-',
            currentServer: 'main'
        };

        // État
        let cfCurrentCode = '';
        let cfIsDoctor = false;
        
        // Chronomètre
        let cfTimerInterval = null;
        let cfTimerSeconds = 0;
        let cfTimerStartTime = null;

        // Vérification du code
        function cfVerifyCode() {
            const input = document.getElementById('cfCode');
            const code = input.value.trim().toUpperCase();
            
            if (!code) {
                cfShowToast('⚠️ Veuillez entrer votre code');
                return;
            }
            
            // Détection MÉDECIN vs PATIENT
            const urlParams = new URLSearchParams(window.location.search);
            cfIsDoctor = urlParams.get('doctor') === '1';
            
            // Formatage du code
            let roomCode = code;
            let displayName = 'Patient';
            
            if (!code.includes('FURGE')) {
                roomCode = CF_CONFIG.prefix + code;
                displayName = code;
            } else {
                const parts = code.split('-');
                if (parts.length >= 2) {
                    displayName = parts[1];
                }
            }
            
            // ADAPTATION UX selon le rôle
            if (cfIsDoctor) {
                // Interface MÉDECIN
                document.querySelector('.cf-consultation').classList.add('cf-doctor-mode');
                document.getElementById('cfPatientName').textContent = 'Dr Furgé';
                document.getElementById('cfPatientName').style.fontWeight = 'bold';
                
                // Modifier les textes
                document.querySelector('.cf-waiting h3').textContent = 'Connexion à la consultation...';
                document.querySelector('.cf-waiting p').textContent = 'Patient : ' + displayName;
                
                // Adapter le texte d'aide pour le médecin
                document.getElementById('cfHelpConnection').textContent = 
                    'Cliquez sur le bouton vert 🔄 puis demandez au patient de cliquer sur son bouton orange ⚠️';
                
                // Bouton médecin vert avec icône différente
                const backupBtn = document.getElementById('cfBackupBtn');
                if (backupBtn) {
                    backupBtn.style.background = '#28a745';
                    backupBtn.innerHTML = '🔄';
                    backupBtn.setAttribute('data-tooltip', 'Changer de serveur');
                }
                
                // Afficher le bouton paiement pour le médecin
                document.getElementById('cfPaymentBtn').style.display = 'flex';
                // Masquer la notice paiement
                document.getElementById('cfPaymentNotice').classList.remove('show');
                
                // Message médecin
                cfShowToast('👨‍⚕️ Mode médecin activé');
                
                // Charger le chronomètre si existant
                setTimeout(() => {
                    cfLoadTimerState();
                }, 1000);
                
            } else {
                // Interface PATIENT
                document.getElementById('cfPatientName').textContent = displayName;
                
                // Textes patient  
                document.querySelector('.cf-waiting h3').textContent = 'Salle d\'attente';
                document.querySelector('.cf-waiting p').textContent = 'Votre praticien va vous rejoindre';
                
                // Adapter le texte d'aide pour le patient
                document.getElementById('cfHelpConnection').textContent = 
                    'Informez votre praticien. Il vous demandera de cliquer sur ⚠️ si nécessaire';
                
                // Bouton patient orange
                const backupBtn = document.getElementById('cfBackupBtn');
                if (backupBtn) {
                    backupBtn.style.background = '#ff9800';
                    backupBtn.innerHTML = '⚠️';
                    backupBtn.setAttribute('data-tooltip', 'Problème connexion');
                }
                
                // Masquer le bouton paiement médecin
                document.getElementById('cfPaymentBtn').style.display = 'none';
                // Afficher la notice paiement pour le patient
                document.getElementById('cfPaymentNotice').classList.add('show');
            }
            
            // Date/heure
            const now = new Date();
            const dateTime = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            document.getElementById('cfDateTime').textContent = dateTime;
            
            cfCurrentCode = roomCode;
            cfStartConsultation();
        }

        // Copier lien paiement (médecin)
        function cfCopyPaymentLink() {
            if (!cfCurrentCode) return;
            
            // Extraire le code patient du code de la room
            let patientCode = cfCurrentCode;
            if (patientCode.startsWith('FURGE-')) {
                patientCode = patientCode.replace('FURGE-', '');
            }
            
            const paymentUrl = 'https://tele-consultation.com/paiement-consultation/?code=' + patientCode;
            navigator.clipboard.writeText(paymentUrl);
            cfShowToast('💳 Lien paiement copié : ' + paymentUrl);
        }

        // Aller au paiement (patient)
        function cfGoToPayment() {
            const code = document.getElementById('cfCode').value || cfCurrentCode;
            if (code) {
                let patientCode = code;
                if (patientCode.startsWith('FURGE-')) {
                    patientCode = patientCode.replace('FURGE-', '');
                }
                window.open('/paiement-consultation/?code=' + patientCode, '_blank');
            } else {
                window.location.href = '/paiement-consultation/';
            }
        }

        // Démarrer la consultation
        function cfStartConsultation() {
            // Masquer l'accès, le header et le footer pour maximiser l'espace
            document.getElementById('cfAccessZone').style.display = 'none';
            document.getElementById('cfHeader').style.display = 'none';
            document.getElementById('cfFooter').style.display = 'none';
            document.getElementById('cfPaymentNotice').style.display = 'none';
            
            // Afficher le bandeau sécurité
            document.getElementById('cfSecurityBar').style.display = 'block';
            
            // Afficher la consultation
            document.getElementById('cfConsultationZone').classList.add('active');
            
            // Charger Jitsi après 2 secondes
            setTimeout(() => {
                cfLoadJitsi();
            }, 2000);
            
            cfShowToast('✅ Connexion en cours...');
        }

        // Charger Jitsi
        function cfLoadJitsi() {
            // Vérifier d'abord si backup demandé dans l'URL
            const params = new URLSearchParams(window.location.search);
            const needBackup = params.get('backup') === '1';
            
            if (needBackup && CF_CONFIG.currentServer === 'main') {
                // Auto-basculer sur backup si demandé
                CF_CONFIG.currentServer = 'backup';
                const statusText = document.getElementById('cfStatusText');
                const statusDiv = document.getElementById('cfStatus');
                statusText.textContent = 'Serveur 2';
                statusDiv.classList.add('warning');
                cfShowToast('⚠️ Utilisation du serveur de secours');
            }
            
            const server = CF_CONFIG.servers[CF_CONFIG.currentServer];
            
            // Configuration Jitsi
            const config = [
                'config.prejoinPageEnabled=false',
                'config.defaultLanguage="fr"',
                'interfaceConfig.SHOW_CHROME_EXTENSION_BANNER=false',
                'interfaceConfig.MOBILE_APP_PROMO=false'
            ];
            
            const jitsiUrl = `${server}/${cfCurrentCode}#${config.join('&')}`;
            
            // Masquer attente et afficher vidéo
            document.getElementById('cfWaiting').style.display = 'none';
            document.getElementById('cfVideoContainer').classList.add('active');
            document.getElementById('cfJitsiFrame').src = jitsiUrl;
        }

        // Tentative de changement de serveur (UX différente médecin/patient)
        function cfTrySwitch() {
            const urlParams = new URLSearchParams(window.location.search);
            const isDoctor = urlParams.get('doctor') === '1';
            
            if (isDoctor) {
                // MÉDECIN : Accès direct avec instructions
                const message = '🔄 BASCULER SUR SERVEUR DE SECOURS\n\n' +
                               'Si la connexion est mauvaise, vous pouvez basculer.\n\n' +
                               '⚠️ PROCÉDURE :\n' +
                               '1. Cliquez OK pour basculer\n' +
                               '2. Dites au patient : "Cliquez sur le bouton orange ⚠️"\n' +
                               '3. Attendez sa confirmation\n\n' +
                               'Continuer ?';
                
                if (confirm(message)) {
                    cfSwitchServer();
                    // Message spécial médecin
                    setTimeout(() => {
                        cfShowToast('📢 Demandez au patient de cliquer sur ⚠️');
                    }, 2000);
                }
            } else {
                // PATIENT : Demande de confirmation
                const message = '⚠️ PROBLÈME DE CONNEXION\n\n' +
                               'Votre praticien vous demande-t-il de cliquer sur ce bouton ?\n\n' +
                               '✅ OUI → Cliquez OK\n' +
                               '❌ NON → Cliquez Annuler\n\n' +
                               'Ne changez QUE si le médecin vous le demande !';
                
                if (confirm(message)) {
                    cfSwitchServer();
                    cfShowToast('✅ Changement effectué');
                } else {
                    cfShowToast('💡 Informez votre praticien du problème');
                }
            }
        }
        
        // Basculer serveur (fonction interne)
        function cfSwitchServer() {
            CF_CONFIG.currentServer = CF_CONFIG.currentServer === 'main' ? 'backup' : 'main';
            
            // Mettre à jour le texte et le style de statut
            const statusText = document.getElementById('cfStatusText');
            const statusDiv = document.getElementById('cfStatus');
            
            if (CF_CONFIG.currentServer === 'backup') {
                statusText.textContent = 'Serveur 2';
                statusDiv.classList.add('warning');
            } else {
                statusText.textContent = 'En ligne';
                statusDiv.classList.remove('warning');
            }
            
            if (cfCurrentCode) {
                // Recharger avec nouveau serveur
                document.getElementById('cfJitsiFrame').src = '';
                document.getElementById('cfVideoContainer').classList.remove('active');
                document.getElementById('cfWaiting').style.display = 'block';
                
                setTimeout(() => {
                    cfLoadJitsi();
                }, 1000);
                
                const serverName = CF_CONFIG.currentServer === 'main' ? 'principal' : 'de secours';
                cfShowToast('🔄 Connexion au serveur ' + serverName);
            }
        }

        // Afficher/masquer l'aide
        function cfToggleHelp() {
            const help = document.getElementById('cfHelp');
            help.classList.toggle('active');
        }

        // Terminer la consultation
        function cfEndConsultation() {
            if (!confirm('Êtes-vous sûr de vouloir terminer la consultation ?')) {
                return;
            }
            
            // Arrêter et sauvegarder le chronomètre si médecin
            if (cfIsDoctor && cfTimerInterval) {
                cfPauseTimer();
                
                // Afficher le temps total
                const minutes = Math.floor(cfTimerSeconds / 60);
                const seconds = cfTimerSeconds % 60;
                const duration = minutes + ' min ' + seconds + ' sec';
                
                if (confirm('Durée de consultation : ' + duration + '\n\nSauvegarder cette durée ?')) {
                    // Sauvegarder dans l'historique des consultations
                    const consultData = {
                        code: cfCurrentCode,
                        duration: cfTimerSeconds,
                        date: new Date().toISOString()
                    };
                    
                    let history = JSON.parse(localStorage.getItem('cfConsultHistory') || '[]');
                    history.push(consultData);
                    localStorage.setItem('cfConsultHistory', JSON.stringify(history));
                    
                    cfShowToast('✅ Durée sauvegardée : ' + duration);
                }
            }
            
            // Recharger la page
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        // Toast message
        function cfShowToast(message) {
            const toast = document.getElementById('cfToast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // === FONCTIONS CHRONOMÈTRE (MÉDECIN) ===
        
        // Basculer start/pause chronomètre
        function cfToggleTimer() {
            const btn = document.getElementById('cfTimerBtn');
            const timer = document.getElementById('cfTimer');
            const state = btn.getAttribute('data-state');
            
            if (state === 'stopped' || state === 'paused') {
                // Démarrer
                cfStartTimer();
                btn.innerHTML = '⏸';
                btn.setAttribute('data-state', 'running');
                btn.classList.add('pause');
                timer.classList.add('active');
                cfShowToast('⏱️ Chronomètre démarré');
            } else {
                // Pause
                cfPauseTimer();
                btn.innerHTML = '▶';
                btn.setAttribute('data-state', 'paused');
                btn.classList.remove('pause');
                timer.classList.remove('active');
                cfShowToast('⏸️ Chronomètre en pause');
            }
        }
        
        // Démarrer le chronomètre
        function cfStartTimer() {
            if (!cfTimerStartTime) {
                cfTimerStartTime = Date.now();
            }
            
            cfTimerInterval = setInterval(() => {
                cfTimerSeconds++;
                cfUpdateTimerDisplay();
                
                // Sauvegarder toutes les 10 secondes
                if (cfTimerSeconds % 10 === 0) {
                    cfSaveTimerState();
                }
            }, 1000);
        }
        
        // Pause du chronomètre
        function cfPauseTimer() {
            if (cfTimerInterval) {
                clearInterval(cfTimerInterval);
                cfTimerInterval = null;
                cfSaveTimerState();
            }
        }
        
        // Réinitialiser le chronomètre
        function cfResetTimer() {
            if (confirm('Réinitialiser le chronomètre ?')) {
                cfPauseTimer();
                cfTimerSeconds = 0;
                cfTimerStartTime = null;
                cfUpdateTimerDisplay();
                
                const btn = document.getElementById('cfTimerBtn');
                btn.innerHTML = '▶';
                btn.setAttribute('data-state', 'stopped');
                btn.classList.remove('pause');
                document.getElementById('cfTimer').classList.remove('active');
                
                // Effacer la sauvegarde
                if (cfCurrentCode) {
                    localStorage.removeItem('cfTimer_' + cfCurrentCode);
                }
                
                cfShowToast('🔄 Chronomètre réinitialisé');
            }
        }
        
        // Mise à jour affichage
        function cfUpdateTimerDisplay() {
            const minutes = Math.floor(cfTimerSeconds / 60);
            const seconds = cfTimerSeconds % 60;
            const display = minutes.toString().padStart(2, '0') + ':' + 
                           seconds.toString().padStart(2, '0');
            document.getElementById('cfTimerDisplay').textContent = display;
        }
        
        // Sauvegarder l'état du chronomètre
        function cfSaveTimerState() {
            if (cfCurrentCode && cfIsDoctor) {
                const timerData = {
                    seconds: cfTimerSeconds,
                    startTime: cfTimerStartTime,
                    code: cfCurrentCode,
                    date: new Date().toISOString()
                };
                localStorage.setItem('cfTimer_' + cfCurrentCode, JSON.stringify(timerData));
            }
        }
        
        // Charger l'état du chronomètre
        function cfLoadTimerState() {
            if (cfCurrentCode && cfIsDoctor) {
                const saved = localStorage.getItem('cfTimer_' + cfCurrentCode);
                if (saved) {
                    const timerData = JSON.parse(saved);
                    cfTimerSeconds = timerData.seconds || 0;
                    cfUpdateTimerDisplay();
                    cfShowToast('⏱️ Chronomètre restauré');
                }
            }
        }

        // Gestion Enter sur le champ
        document.addEventListener('DOMContentLoaded', function() {
            const input = document.getElementById('cfCode');
            
            // Enter pour valider
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    cfVerifyCode();
                }
            });
            
            // Focus automatique
            input.focus();
            
            // Vérifier si un code est passé en paramètre URL
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            const isDoctor = urlParams.get('doctor') === '1';
            
            // Adapter le titre selon le rôle
            if (isDoctor) {
                document.querySelector('.cf-access-card h2').textContent = 'Accès médecin';
                document.querySelector('.cf-access-card .desc').textContent = 'Entrez le code de la consultation';
                document.querySelector('.cf-btn-primary').textContent = 'Démarrer la consultation →';
            }
            
            if (refCode) {
                input.value = refCode.toUpperCase();
                // Auto-connexion si code présent
                setTimeout(() => {
                    cfVerifyCode();
                }, 500);
            }
        });

        // Détection problème connexion
        let cfConnectionCheck = setTimeout(() => {
            const frame = document.getElementById('cfJitsiFrame');
            if (frame && frame.src && !frame.contentWindow) {
                cfShowToast('⚠️ Problème détecté, essayez le serveur de secours');
            }
        }, 15000);
    </script>
    
    <?php
    return ob_get_clean();
}