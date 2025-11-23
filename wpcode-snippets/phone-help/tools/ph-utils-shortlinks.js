/**
 * WPCode 2489 : PH-UTILS-ShortLinks
 * Décodage codes courts pour liens visio
 * Type: PHP Snippet | Location: __phonehelp-uniquement__ | Priority: 10
 * Version 2.1 - Décodage codes courts
 * Dernière modification: 23 septembre 2025 20:39
 * Site: tele-consultation.com
 */

date_default_timezone_set('Europe/Paris');

// Récupération du code court
$code = isset($_GET['c']) ? sanitize_text_field(strtoupper($_GET['c'])) : '';

if(!$code) {
    ?>
    <style>
    .short-link-error {
        max-width: 600px;
        margin: 100px auto;
        padding: 60px 40px;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        color: white;
    }
    
    .error-icon {
        font-size: 80px;
        margin-bottom: 20px;
    }
    
    .error-title {
        font-size: 32px;
        margin-bottom: 20px;
        font-weight: bold;
    }
    
    .error-message {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 30px;
        line-height: 1.6;
    }
    
    .btn-home {
        display: inline-block;
        padding: 15px 40px;
        background: white;
        color: #764ba2;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        font-size: 16px;
        transition: all 0.3s;
    }
    
    .btn-home:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }
    </style>
    
    <div class="short-link-error">
        <div class="error-icon">🔗</div>
        <h1 class="error-title">Lien invalide</h1>
        <p class="error-message">
            Ce lien de réunion n'est pas valide ou a expiré.<br>
            Veuillez vérifier le lien reçu ou contacter votre conseiller.
        </p>
        <a href="/" class="btn-home">← Retour à l'accueil</a>
    </div>
    <?php
    return;
}

// DÉCODER LE CODE COURT en ROOM CODE
// Exemple: DUP01021430 → DUPONT-0102-1430
function decodeShortCode($code) {
    // Le code contient: CLIENTMMJJHHmm
    // On doit reconstruire: CLIENT-MMJJ-HHmm
    
    $len = strlen($code);
    
    if($len < 9) {
        return false; // Code trop court
    }
    
    // Les 8 derniers caractères sont toujours: MMJJHHmm
    $datePart = substr($code, -8); // 01021430
    
    // Le reste est le nom du client
    $clientPart = substr($code, 0, $len - 8); // DUP
    
    // Reconstruction du room code
    $mm = substr($datePart, 0, 2);
    $jj = substr($datePart, 2, 2);
    $hh = substr($datePart, 4, 2);
    $mm_time = substr($datePart, 6, 2);
    
    $roomCode = $clientPart . '-' . $mm . $jj . '-' . $hh . $mm_time;
    
    return $roomCode;
}

$roomCode = decodeShortCode($code);

if(!$roomCode) {
    ?>
    <style>
    .short-link-error {
        max-width: 600px;
        margin: 100px auto;
        padding: 60px 40px;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        color: white;
    }
    
    .error-icon {
        font-size: 80px;
        margin-bottom: 20px;
    }
    
    .error-title {
        font-size: 32px;
        margin-bottom: 20px;
        font-weight: bold;
    }
    
    .error-message {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 30px;
        line-height: 1.6;
    }
    
    .btn-home {
        display: inline-block;
        padding: 15px 40px;
        background: white;
        color: #764ba2;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
        font-size: 16px;
        transition: all 0.3s;
    }
    
    .btn-home:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }
    </style>
    
    <div class="short-link-error">
        <div class="error-icon">❌</div>
        <h1 class="error-title">Code invalide</h1>
        <p class="error-message">
            Le code <strong><?php echo esc_html($code); ?></strong> n'est pas valide.<br>
            Format incorrect. Contactez votre conseiller.
        </p>
        <a href="/" class="btn-home">← Retour à l'accueil</a>
    </div>
    <?php
    return;
}

// URL de redirection
$targetUrl = home_url('/rdv-visio-phonehelp/') . '?room=' . urlencode($roomCode);

?>
<style>
.redirect-container {
    max-width: 600px;
    margin: 100px auto;
    padding: 40px;
    text-align: center;
}

.redirect-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 40px;
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
}

.redirect-card::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    transform: translate(-50%, -50%);
    animation: pulse-bg 2s ease-in-out infinite;
}

@keyframes pulse-bg {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
}

.loading-icon {
    font-size: 80px;
    margin-bottom: 30px;
    animation: rotate-icon 2s linear infinite;
}

@keyframes rotate-icon {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.redirect-title {
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    position: relative;
    z-index: 1;
}

.redirect-message {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;
}

.redirect-code {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: monospace;
    position: relative;
    z-index: 1;
}

.countdown {
    font-size: 48px;
    font-weight: bold;
    margin: 20px 0;
    position: relative;
    z-index: 1;
}

.manual-link {
    display: inline-block;
    margin-top: 20px;
    padding: 15px 30px;
    background: white;
    color: #764ba2;
    text-decoration: none;
    border-radius: 50px;
    font-weight: bold;
    transition: all 0.3s;
    position: relative;
    z-index: 1;
}

.manual-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
    overflow: hidden;
    margin: 30px 0;
}

.progress-fill {
    height: 100%;
    background: white;
    border-radius: 3px;
    animation: progress 3s linear;
}

@keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
}
</style>

<div class="redirect-container">
    <div class="redirect-card">
        <div class="loading-icon">⏳</div>
        <h1 class="redirect-title">Redirection en cours...</h1>
        <p class="redirect-message">Vous allez être redirigé vers votre réunion</p>
        <div class="redirect-code">Code : <?php echo esc_html($code); ?></div>
        <div class="countdown" id="countdown">3</div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <a href="<?php echo esc_url($targetUrl); ?>" id="manual-redirect" class="manual-link">
            Cliquez ici si la redirection ne fonctionne pas
        </a>
    </div>
</div>

<script>
const targetUrl = '<?php echo esc_js($targetUrl); ?>';
const roomCode = '<?php echo esc_js($roomCode); ?>';

console.log('Redirection vers:', {
    code: '<?php echo esc_js($code); ?>',
    room: roomCode,
    target: targetUrl
});

// Countdown
let count = 3;
const countdownInterval = setInterval(() => {
    count--;
    document.getElementById('countdown').textContent = count;
    
    if(count <= 0) {
        clearInterval(countdownInterval);
        window.location.href = targetUrl;
    }
}, 1000);
</script>

<?php
// Log de tentative d'accès
$log_file = wp_upload_dir()['basedir'] . '/phonehelp-shortlinks-' . date('Y-m') . '.txt';
$log_entry = date('d/m/Y H:i:s') . ' - Code: ' . $code . ' - Room: ' . $roomCode . ' - IP: ' . $_SERVER['REMOTE_ADDR'] . PHP_EOL;
@file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
