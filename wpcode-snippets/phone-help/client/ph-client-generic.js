/**
 * WPCode 2455 : PH-CLIENT-Generic
 * Interface client générique pour visioconférence PhoneHelp
 * Type: PHP Snippet | Location: Site-wide (sauf admin) | Priority: 10
 * Version 2.1 - Interface client responsive avec switch serveur Jitsi
 * Dernière modification: 22 septembre 2025 17:24
 * Site: tele-consultation.com
 * 
 * Dépendances:
 * - WPCode 2506 (PH-CONFIG-Global) doit être chargé AVANT
 */

// Vérifier que la config globale est chargée
if(!defined('PHONEHELP_VERSION')) {
    echo '<div style="padding:40px;background:#fee;color:#c00;text-align:center;border-radius:10px;">';
    echo '⚠️ <strong>Erreur</strong> : Configuration PhoneHelp non chargée. Activez le snippet 2506 (PH-CONFIG-Global)';
    echo '</div>';
    return;
}

// Récupérer le code room depuis l'URL
$room = isset($_GET['room']) ? sanitize_text_field(strtoupper($_GET['room'])) : '';

if(!$room) {
    ?>
    <style>
    .ph-no-room {
        max-width: 600px;
        margin: 100px auto;
        padding: 60px 40px;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        color: white;
    }
    
    .ph-no-room-icon {
        font-size: 80px;
        margin-bottom: 20px;
    }
    
    .ph-no-room-title {
        font-size: 32px;
        margin-bottom: 20px;
        font-weight: bold;
    }
    
    .ph-no-room-message {
        font-size: 18px;
        opacity: 0.9;
        line-height: 1.6;
    }
    </style>
    
    <div class="ph-no-room">
        <div class="ph-no-room-icon">🎥</div>
        <h1 class="ph-no-room-title">Code réunion requis</h1>
        <p class="ph-no-room-message">
            Cette page nécessite un code de réunion valide.<br>
            Veuillez utiliser le lien envoyé par votre conseiller.
        </p>
    </div>
    <?php
    return;
}

// Récupérer les serveurs Jitsi depuis la config globale
$jitsi_servers = phonehelp_get_jitsi_servers();
$primary_server = $jitsi_servers['primary'];
$backup_server = $jitsi_servers['backup'];

?>
<style>
/* PhoneHelp Client Interface - Style Global */
.ph-client-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
}

.ph-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 20px;
    text-align: center;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.ph-header h2 {
    font-size: 28px;
    margin: 0 0 10px 0;
    font-weight: 700;
}

.ph-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 16px;
}

.ph-info-banner {
    background: #f0f8ff;
    padding: 20px;
    border-left: 5px solid #667eea;
    margin: 20px 0;
    border-radius: 10px;
}

.ph-info-banner ul {
    margin: 10px 0 0 0;
    padding-left: 25px;
}

.ph-info-banner li {
    margin: 8px 0;
    line-height: 1.6;
}

/* Iframe Jitsi */
.ph-video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    background: #000;
}

.ph-video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

/* Switch serveur Jitsi */
.ph-server-switch {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    margin: 25px 0;
    padding: 20px;
    background: #f7fafc;
    border-radius: 15px;
    flex-wrap: wrap;
}

.ph-server-label {
    font-weight: 600;
    color: #4a5568;
    font-size: 14px;
}

.ph-server-btn {
    padding: 12px 24px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.ph-server-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    border-color: #cbd5e0;
}

.ph-server-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
    box-shadow: 0 4px 15px rgba(102,126,234,0.3);
}

.ph-server-btn.active:hover {
    background: #5a67d8;
    border-color: #5a67d8;
}

/* Boutons flottants d'aide */
.ph-floating-btns {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 99999;
}

.ph-float-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    transition: all 0.3s;
    text-decoration: none;
}

.ph-float-btn:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 12px 35px rgba(102,126,234,0.5);
}

/* Panel d'aide */
.ph-help-panel {
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -5px 0 30px rgba(0,0,0,0.3);
    z-index: 999999;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
}

.ph-help-panel.active {
    right: 0;
}

.ph-help-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ph-help-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s;
}

.ph-help-close:hover {
    background: rgba(255,255,255,0.3);
    transform: rotate(90deg);
}

.ph-help-content {
    padding: 30px 20px;
}

.ph-help-section {
    margin-bottom: 30px;
}

.ph-help-section h4 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 18px;
}

.ph-help-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.ph-help-section li {
    padding: 12px 15px;
    background: #f7fafc;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 3px solid #667eea;
}

/* Overlay background */
.ph-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999998;
    display: none;
    opacity: 0;
    transition: opacity 0.3s;
}

.ph-overlay.active {
    display: block;
    opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
    .ph-header h2 {
        font-size: 22px;
    }
    
    .ph-server-switch {
        flex-direction: column;
    }
    
    .ph-help-panel {
        width: 100%;
        right: -100%;
    }
    
    .ph-floating-btns {
        bottom: 20px;
        right: 20px;
    }
    
    .ph-float-btn {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
}
</style>

<div class="ph-client-container">
    <!-- Header -->
    <div class="ph-header">
        <h2>📞 PhoneHelp - Visioconférence</h2>
        <p>Code réunion : <strong><?php echo esc_html($room); ?></strong></p>
    </div>
    
    <!-- Bannière d'info -->
    <div class="ph-info-banner">
        <strong>✓ Tout est prêt !</strong>
        <ul>
            <li>Votre conseiller va vous rejoindre</li>
            <li>Autorisez caméra et micro quand demandé</li>
            <li>En cas de problème, changez de serveur ci-dessous</li>
        </ul>
    </div>
    
    <!-- Switch serveur -->
    <div class="ph-server-switch">
        <span class="ph-server-label">Serveur visio :</span>
        <button class="ph-server-btn active" data-server="primary">
            <span><?php echo $primary_server['icon']; ?></span>
            <span><?php echo $primary_server['name']; ?></span>
        </button>
        <button class="ph-server-btn" data-server="backup">
            <span><?php echo $backup_server['icon']; ?></span>
            <span><?php echo $backup_server['name']; ?></span>
        </button>
    </div>
    
    <!-- Iframe Jitsi -->
    <div class="ph-video-container">
        <iframe 
            id="jitsi-iframe"
            src="<?php echo esc_url($primary_server['url'] . $room); ?>"
            allow="camera *;microphone *;display-capture *;fullscreen *"
            allowfullscreen="true">
        </iframe>
    </div>
</div>

<!-- Boutons flottants -->
<div class="ph-floating-btns">
    <div class="ph-float-btn" id="help-btn" title="Aide">❓</div>
    <a href="tel:+33183750235" class="ph-float-btn" title="Appeler PhoneHelp">📞</a>
</div>

<!-- Panel d'aide -->
<div class="ph-help-panel" id="help-panel">
    <div class="ph-help-header">
        <h3 style="margin:0;font-size:20px;">💡 Aide</h3>
        <button class="ph-help-close" id="help-close">✕</button>
    </div>
    <div class="ph-help-content">
        <div class="ph-help-section">
            <h4>🎥 Problème de vidéo ?</h4>
            <ul>
                <li>Autorisez caméra et micro dans votre navigateur</li>
                <li>Essayez l'autre serveur (boutons ci-dessus)</li>
                <li>Vérifiez que votre webcam fonctionne</li>
            </ul>
        </div>
        
        <div class="ph-help-section">
            <h4>🔊 Pas de son ?</h4>
            <ul>
                <li>Augmentez le volume de votre appareil</li>
                <li>Vérifiez que votre micro n'est pas coupé</li>
                <li>Testez dans une autre application</li>
            </ul>
        </div>
        
        <div class="ph-help-section">
            <h4>📱 Sur mobile ?</h4>
            <ul>
                <li>L'app Jitsi Meet offre une meilleure expérience</li>
                <li>Utilisez Chrome ou Safari</li>
                <li>Évitez les VPN si possible</li>
            </ul>
        </div>
        
        <div class="ph-help-section">
            <h4>☎️ Besoin d'aide ?</h4>
            <ul>
                <li><strong>Téléphone :</strong> 01 83 75 02 35</li>
                <li><strong>Email :</strong> support@phone-help.net</li>
            </ul>
        </div>
    </div>
</div>

<!-- Overlay -->
<div class="ph-overlay" id="overlay"></div>

<script>
// Configuration serveurs depuis PHP
const servers = {
    primary: {
        url: '<?php echo esc_js($primary_server['url']); ?>',
        name: '<?php echo esc_js($primary_server['name']); ?>'
    },
    backup: {
        url: '<?php echo esc_js($backup_server['url']); ?>',
        name: '<?php echo esc_js($backup_server['name']); ?>'
    }
};

const room = '<?php echo esc_js($room); ?>';
let currentServer = 'primary';

// Switch serveur Jitsi
document.querySelectorAll('.ph-server-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const server = this.dataset.server;
        
        // Update UI
        document.querySelectorAll('.ph-server-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update iframe
        const iframe = document.getElementById('jitsi-iframe');
        iframe.src = servers[server].url + room;
        currentServer = server;
        
        console.log('✅ Serveur changé vers:', servers[server].name);
    });
});

// Panel d'aide
const helpBtn = document.getElementById('help-btn');
const helpPanel = document.getElementById('help-panel');
const helpClose = document.getElementById('help-close');
const overlay = document.getElementById('overlay');

helpBtn.addEventListener('click', () => {
    helpPanel.classList.add('active');
    overlay.classList.add('active');
});

helpClose.addEventListener('click', () => {
    helpPanel.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    helpPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// Log de chargement
console.log('PhoneHelp Client Generic v2.1');
console.log('Room:', room);
console.log('Serveur actif:', servers[currentServer].name);
</script>

<?php
// Log activité
if(function_exists('phonehelp_log_activity')) {
    phonehelp_log_activity('visio_access', 'client', $room, 'Interface générique chargée');
}
?>
