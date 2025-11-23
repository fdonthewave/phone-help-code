/**
 * WPCode [ID inconnu] : Consultation Patient avec Référence
 * Système d'accès consultation Dr FURGE avec code patient
 * Type: PHP Snippet | Location: Page consultation-furge | Priority: 10
 * Version: 1.0
 * Dernière modification: Inconnue
 * Site: tele-consultation.com
 * 
 * Fonctionnement:
 * - Sans paramètre ?ref= : Formulaire d'accès avec code patient
 * - Avec paramètre ?ref=CODE : Affichage iframe Jitsi meet.ffmuc.net/FURGE-{CODE}
 * - Redirection HTTPS si formulaire soumis avec ?go=CODE
 */

// Gestion du paramètre ref dans l'URL
$reference = isset($_GET['ref']) ? sanitize_text_field(strtoupper($_GET['ref'])) : '';

// Si le formulaire est soumis avec go, rediriger vers ?ref= EN HTTPS
if(isset($_GET['go'])) {
    $code = sanitize_text_field(strtoupper($_GET['go']));
    wp_redirect('https://tele-consultation.com/consultation-furge/?ref=' . $code);
    exit;
}

if($reference) {
    // AVEC RÉFÉRENCE : Affichage de la consultation
    ?>
    <div style="background:#4dc26b;color:white;padding:20px;text-align:center;border-radius:10px;margin-bottom:20px;">
        <h2 style="font-size:24px;margin:0;">Consultation Dr Camille FURGE</h2>
        <p style="margin:10px 0 0 0;font-size:18px;">Patient : <strong><?php echo $reference; ?></strong></p>
    </div>
    
    <div style="background:#f0f8f4;padding:15px;border-left:4px solid #4dc26b;margin-bottom:20px;">
        <p style="margin:0;">✓ Le médecin va vous rejoindre</p>
        <p style="margin:5px 0 0 0;">✓ Autorisez caméra et microphone quand demandé</p>
    </div>
    
    <!-- Iframe Jitsi via meet.ffmuc.net -->
    <div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;">
        <iframe 
            src="https://meet.ffmuc.net/FURGE-<?php echo $reference; ?>" 
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" 
            allow="camera *;microphone *;display-capture *;fullscreen *" 
            allowfullscreen="true">
        </iframe>
    </div>
    
    <!-- Lien de secours -->
    <div style="text-align:center;margin-top:20px;padding:20px;background:#f9f9f9;border-radius:10px;">
        <p style="margin:0 0 15px 0;color:#666;">Problème d'affichage ou sur mobile ?</p>
        <a href="https://meet.ffmuc.net/FURGE-<?php echo $reference; ?>" 
           target="_blank" 
           style="display:inline-block;padding:15px 30px;background:#4dc26b;color:white;text-decoration:none;border-radius:5px;font-size:16px;">
            Ouvrir dans une nouvelle fenêtre
        </a>
        <p style="margin:15px 0 0 0;font-size:13px;color:#999;">
            Sur mobile, l'app Jitsi Meet offre une meilleure expérience
        </p>
    </div>
    <?php
    
} else {
    // SANS RÉFÉRENCE : Formulaire d'accès
    ?>
    <div style="max-width:450px;margin:50px auto;padding:30px;background:#f9f9f9;border-radius:10px;text-align:center;">
        <h3>Accès Consultation</h3>
        <p>Entrez votre code patient :</p>
        <form method="get">
            <input 
                type="text" 
                name="go" 
                style="width:100%;padding:15px;font-size:16px;text-transform:uppercase;margin:10px 0;border:2px solid #ddd;border-radius:5px;box-sizing:border-box;" 
                placeholder="CODE PATIENT" 
                required>
            <button 
                type="submit" 
                style="width:100%;padding:15px;background:#4dc26b;color:white;border:none;border-radius:5px;font-size:16px;cursor:pointer;">
                Accéder →
            </button>
        </form>
    </div>
    <?php
}
