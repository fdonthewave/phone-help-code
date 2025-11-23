/**
 * Snippet ID: 12
 * Name: Qualif Pneumo - DEMANDES ORDONNANCES/CERTIFICATS v1.0
 * Modified: 2025-11-19 17:50:47
 * Active: True
 * Source: qualif-pneumo-demandes-ordonnancescertificats-v1_0_code-snippets.json
 */

/**
 * ══════════════════════════════════════════════════════════════
 * QUALIF PNEUMO ORDONNANCES - FORMULAIRE v1.3
 * ══════════════════════════════════════════════════════════════
 * 
 * 📋 Shortcode : [qualif_pneumo_ordonnances]
 * 🥼 Service : Dr Amiot & Dr SIMION - 02.52.69.00.33
 * 📬 Types demandes : 
 *    - Ordonnance - Renouvellement
 *    - Ordonnance - Arrêt de travail
 *    - Certificat médical
 *    - URGENCE (vérifier présence médecin)
 *    - Autres
 * 
 * 💾 Sauvegarde BDD : qualif_pneumo_ordonnances
 * 📧 Email direct : vers médecins (pas scripts@)
 * 🔐 URL obscure : /pn20256
 * 🔍 Zoom : 70% par défaut
 * 
 * NOUVEAUTÉS v1.3 :
 * ⚡ 5 types de demandes (au lieu de 2)
 * ⚡ Option URGENCE avec message secrétaire
 * ⚡ Banner rouge 🚨 si URGENCE dans email
 * ⚡ Encadrement spécial si URGENCE dans notes
 * 
 * PRÉREQUIS wp-config.php :
 * - define('BREVO_API_KEY', 'ta-cle');
 * - define('BREVO_SENDER_EMAIL', 'scripts@phone-help.com');
 * - define('BREVO_SENDER_NAME', 'Qualif Pneumo Ordonnances');
 * - define('PNEUMO_DR_AMIOT_EMAIL', 'email-dr-amiot');
 * - define('PNEUMO_DR_SIMION_EMAIL', 'email-dr-simion');
 * 
 * ══════════════════════════════════════════════════════════════
 */

// ============================================
// CONFIGURATION CENTRALISÉE
// ============================================
if (!function_exists('qpo_get_config')) {
    function qpo_get_config() {
        return array(
            'service' => 'pneumo-ordonnances',
            'medecins' => 'Dr Amiot & Dr SIMION',
            'nom_service' => 'Pneumologie - Ordonnances',
            'telephone' => '02.52.69.00.33',
            'couleur_primaire' => '#0596DE',
            'couleur_secondaire' => '#004B87',
            'couleur_urgence' => '#dc2626',
            'table_bdd' => 'qualif_pneumo_ordonnances'
        );
    }
}

// ============================================
// CRÉATION TABLE BDD AU 1ER CHARGEMENT
// ============================================
if (!function_exists('qpo_create_table')) {
    function qpo_create_table() {
        global $wpdb;
        $config = qpo_get_config();
        $table = $wpdb->prefix . $config['table_bdd'];
        $charset = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            submission_hash varchar(32) NOT NULL,
            medecin varchar(50) NOT NULL,
            type_demande varchar(100) NOT NULL,
            motif_demande text NOT NULL,
            notes_doctolib text NOT NULL,
            email_sent tinyint(1) DEFAULT 0,
            email_sent_at datetime DEFAULT NULL,
            brevo_response text DEFAULT NULL,
            ip_address varchar(45) NOT NULL,
            user_agent varchar(255) NOT NULL,
            PRIMARY KEY (id),
            KEY submission_hash (submission_hash),
            KEY created_at (created_at),
            KEY medecin (medecin),
            KEY type_demande (type_demande),
            KEY email_sent (email_sent)
        ) $charset;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        error_log('✅ Qualif Pneumo Ordonnances : Table créée/vérifiée');
    }
}

// Exécuter la création de table au chargement
add_action('init', 'qpo_create_table');

// ============================================
// ENVOI EMAIL VIA BREVO + FALLBACK WP_MAIL
// ============================================
if (!function_exists('qpo_send_brevo_email')) {
    function qpo_send_brevo_email($medecin, $type, $notes) {
        $config = qpo_get_config();
        
        // Déterminer email destinataire
        $recipient_email = '';
        $medecin_nom = '';
        
        if ($medecin === 'Dr Amiot') {
            $recipient_email = defined('PNEUMO_DR_AMIOT_EMAIL') ? PNEUMO_DR_AMIOT_EMAIL : '';
            $medecin_nom = 'Dr Amiot';
        } else {
            $recipient_email = defined('PNEUMO_DR_SIMION_EMAIL') ? PNEUMO_DR_SIMION_EMAIL : '';
            $medecin_nom = 'Dr SIMION';
        }
        
        if (empty($recipient_email)) {
            error_log('❌ Qualif Pneumo Ordonnances : Email médecin non configuré');
            return array('success' => false, 'message' => 'Email médecin non configuré');
        }
        
        // Détection URGENCE
        $is_urgence = (strpos($type, 'URGENCE') !== false);
        
        // Subject avec préfixe URGENCE si nécessaire
        $subject_prefix = $is_urgence ? '🚨 URGENCE - ' : '';
        $full_subject = $subject_prefix . '[PNEUMO - Ordonnances] ' . htmlspecialchars($type);
        
        // Banner urgence si applicable
        $urgence_banner = '';
        if ($is_urgence) {
            $urgence_banner = '
            <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 4px solid #991b1b;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 900;">🚨 URGENCE - TRAITEMENT PRIORITAIRE 🚨</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Patient au cabinet ou à proximité</p>
            </div>';
        }
        
        // Tentative Brevo si clé configurée
        if (defined('BREVO_API_KEY') && BREVO_API_KEY !== '') {
            $api_key = BREVO_API_KEY;
            $sender_email = defined('BREVO_SENDER_EMAIL') ? BREVO_SENDER_EMAIL : 'noreply@phone-help.com';
            $sender_name = defined('BREVO_SENDER_NAME') ? BREVO_SENDER_NAME : 'Qualif Pneumo Ordonnances';
            
            $html_content = '
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #0596DE 0%, #004B87 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">🫁 ' . htmlspecialchars($type) . '</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; text-align: center;">Destinataire : ' . htmlspecialchars($medecin_nom) . '</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    ' . $urgence_banner . '
                    <pre style="font-family: Courier New, monospace; font-size: 14px; line-height: 1.8; background: #f8fafc; padding: 25px; border-radius: 8px; border: 2px solid ' . ($is_urgence ? '#dc2626' : '#0596DE') . '; white-space: pre-wrap; color: #1e293b;">' . htmlspecialchars($notes) . '</pre>
                </div>
                <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
                    <p>Email automatique - Phone-Help</p>
                </div>
            </div>';
            
            $response = wp_remote_post('https://api.brevo.com/v3/smtp/email', array(
                'headers' => array(
                    'api-key' => $api_key,
                    'Content-Type' => 'application/json'
                ),
                'body' => json_encode(array(
                    'sender' => array('email' => $sender_email, 'name' => $sender_name),
                    'to' => array(array('email' => $recipient_email)),
                    'subject' => $full_subject,
                    'htmlContent' => $html_content
                )),
                'timeout' => 15
            ));
            
            if (!is_wp_error($response)) {
                $status = wp_remote_retrieve_response_code($response);
                if ($status === 201) {
                    $body = json_decode(wp_remote_retrieve_body($response), true);
                    $message_id = isset($body['messageId']) ? $body['messageId'] : 'unknown';
                    error_log('✅ Qualif Pneumo Ordonnances : Email Brevo envoyé (ID: ' . $message_id . ')');
                    return array('success' => true, 'message' => 'Email envoyé via Brevo', 'message_id' => $message_id);
                } else {
                    error_log('⚠️ Qualif Pneumo Ordonnances : Brevo Status ' . $status . ' - Tentative fallback wp_mail');
                }
            } else {
                error_log('⚠️ Qualif Pneumo Ordonnances : Brevo Error - ' . $response->get_error_message() . ' - Tentative fallback wp_mail');
            }
        }
        
        // FALLBACK : wp_mail si Brevo échoue ou non configuré
        error_log('📧 Qualif Pneumo Ordonnances : Envoi fallback via wp_mail()');
        
        $headers = array('Content-Type: text/html; charset=UTF-8');
        
        $html_simple = '<html><body style="font-family: Arial, sans-serif;">';
        if ($is_urgence) {
            $html_simple .= '<div style="background: #dc2626; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">';
            $html_simple .= '<h2 style="margin: 0;">🚨 URGENCE - TRAITEMENT PRIORITAIRE 🚨</h2>';
            $html_simple .= '<p style="margin: 5px 0 0 0;">Patient au cabinet ou à proximité</p>';
            $html_simple .= '</div>';
        }
        $html_simple .= '<h2 style="color: #0596DE;">🫁 ' . htmlspecialchars($full_subject) . '</h2>';
        $html_simple .= '<p><strong>Destinataire :</strong> ' . htmlspecialchars($medecin_nom) . '</p>';
        $html_simple .= '<pre style="background: #f8fafc; padding: 20px; border: 1px solid ' . ($is_urgence ? '#dc2626' : '#cbd5e1') . '; border-radius: 5px; font-size: 13px; line-height: 1.6;">';
        $html_simple .= htmlspecialchars($notes);
        $html_simple .= '</pre>';
        $html_simple .= '<p style="color: #64748b; font-size: 12px;">Email automatique - Qualif Pneumo Ordonnances (fallback wp_mail)</p>';
        $html_simple .= '</body></html>';
        
        $wp_mail_result = wp_mail($recipient_email, $full_subject, $html_simple, $headers);
        
        if ($wp_mail_result) {
            error_log('✅ Qualif Pneumo Ordonnances : Email fallback wp_mail envoyé');
            return array('success' => true, 'message' => 'Email envoyé via wp_mail (fallback)', 'message_id' => 'wp_mail_fallback');
        } else {
            error_log('❌ Qualif Pneumo Ordonnances : Échec wp_mail - Aucun email envoyé');
            return array('success' => false, 'message' => 'Échec Brevo et wp_mail');
        }
    }
}

// ============================================
// HANDLER AJAX - Enregistrement BDD + Email
// ============================================
if (!function_exists('qpo_handle_submit')) {
    function qpo_handle_submit() {
        // Vérification nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'qualif_pneumo_ordonnances_nonce')) {
            wp_send_json_error(array('message' => 'Sécurité : nonce invalide'));
        }
        
        // Honeypot anti-spam
        if (!empty($_POST['website'])) {
            wp_send_json_error(array('message' => 'Spam détecté'));
        }
        
        // Décodage JSON SÉCURISÉ
        $json_raw = stripslashes($_POST['data']);
        $data = json_decode($json_raw, true);
        
        if (!$data || json_last_error() !== JSON_ERROR_NONE) {
            error_log('❌ Qualif Pneumo Ordonnances : JSON invalide - ' . json_last_error_msg());
            wp_send_json_error(array('message' => 'Données corrompues (JSON invalide)'));
        }
        
        // Validation basique
        $required_fields = array('medecin', 'type_demande', 'motif_demande', 'notes_doctolib');
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                wp_send_json_error(array('message' => 'Champ obligatoire manquant : ' . $field));
            }
        }
        
        global $wpdb;
        $config = qpo_get_config();
        $table = $wpdb->prefix . $config['table_bdd'];
        
        // Anti-doublon : Hash sur 5 minutes
        $hash = md5(
            $data['medecin'] . $data['type_demande'] . 
            floor(time() / 300)
        );
        
        $recent = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE submission_hash = %s LIMIT 1",
            $hash
        ));
        
        if ($recent) {
            wp_send_json_error(array('message' => 'Doublon détecté (< 5 min)'));
        }
        
        // Insertion BDD
        $inserted = $wpdb->insert($table, array(
            'created_at' => current_time('mysql'),
            'submission_hash' => $hash,
            'medecin' => sanitize_text_field($data['medecin']),
            'type_demande' => sanitize_text_field($data['type_demande']),
            'motif_demande' => sanitize_textarea_field($data['motif_demande']),
            'notes_doctolib' => sanitize_textarea_field($data['notes_doctolib']),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => substr($_SERVER['HTTP_USER_AGENT'], 0, 255)
        ));
        
        if (!$inserted) {
            error_log('❌ Qualif Pneumo Ordonnances : Erreur BDD - ' . $wpdb->last_error);
            wp_send_json_error(array('message' => 'Erreur BDD : ' . $wpdb->last_error));
        }
        
        $insert_id = $wpdb->insert_id;
        error_log('✅ Qualif Pneumo Ordonnances : Enregistrement BDD ID=' . $insert_id);
        
        // Envoi email direct au médecin
        $email_result = qpo_send_brevo_email($data['medecin'], $data['type_demande'], $data['notes_doctolib']);
        
        if ($email_result['success']) {
            $wpdb->update($table, array(
                'email_sent' => 1,
                'email_sent_at' => current_time('mysql'),
                'brevo_response' => 'Message ID: ' . $email_result['message_id']
            ), array('id' => $insert_id));
        }
        
        $message = 'Demande enregistrée !';
        if ($email_result['success']) {
            $message .= ' Email envoyé avec succès.';
        } else {
            $message .= ' (Email non envoyé : ' . $email_result['message'] . ')';
        }
        
        wp_send_json_success(array(
            'message' => $message,
            'id' => $insert_id,
            'email_sent' => $email_result['success']
        ));
    }
}
add_action('wp_ajax_qpo_submit', 'qpo_handle_submit');
add_action('wp_ajax_nopriv_qpo_submit', 'qpo_handle_submit');

// ============================================
// SHORTCODE PRINCIPAL
// ============================================
if (!function_exists('qpo_shortcode')) {
    function qpo_shortcode() {
        $config = qpo_get_config();
        $nonce = wp_create_nonce('qualif_pneumo_ordonnances_nonce');
        $ajax_url = admin_url('admin-ajax.php');
        
        ob_start();
        ?>
<style>
    * { box-sizing: border-box; }
    .qpo-wrapper { 
        max-width: 1200px; 
        margin: 20px auto; 
        padding: 20px; 
        transition: zoom 0.2s ease;
    }
    
    /* ============================================ */
    /* CONTRÔLES ZOOM */
    /* ============================================ */
    .qpo-header {
        background: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        border-left: 5px solid <?php echo $config['couleur_primaire']; ?>;
        position: relative;
    }
    
    .qpo-zoom-controls {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 100;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border: 3px solid <?php echo $config['couleur_primaire']; ?>;
    }
    
    .qpo-zoom-btn {
        width: 45px;
        height: 45px;
        border: none;
        background: linear-gradient(135deg, <?php echo $config['couleur_primaire']; ?> 0%, <?php echo $config['couleur_secondaire']; ?> 100%);
        color: white;
        font-size: 24px;
        font-weight: 900;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .qpo-zoom-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(5, 150, 222, 0.5);
    }
    
    .qpo-zoom-btn:active {
        transform: scale(0.95);
    }
    
    .qpo-zoom-value {
        text-align: center;
        font-size: 13px;
        font-weight: 800;
        color: <?php echo $config['couleur_primaire']; ?>;
        padding: 4px 0;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .qpo-zoom-value:hover {
        color: <?php echo $config['couleur_secondaire']; ?>;
        text-decoration: underline;
    }
    
    .qpo-header-title { 
        font-size: 24px; 
        font-weight: 900; 
        color: <?php echo $config['couleur_primaire']; ?>; 
        margin: 0 0 10px 0; 
    }
    
    .qpo-header-info { 
        font-size: 14px; 
        color: #64748b; 
        font-weight: 600; 
        margin: 0; 
    }
    
    /* ============================================ */
    /* SECTIONS */
    /* ============================================ */
    .qpo-section { 
        background: white; 
        padding: 20px; 
        border-radius: 12px; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
        margin-bottom: 20px;
        border-left: 5px solid <?php echo $config['couleur_primaire']; ?>;
    }
    
    .qpo-section-title { 
        font-size: 18px; 
        font-weight: 900; 
        color: <?php echo $config['couleur_primaire']; ?>; 
        margin: 0 0 20px 0; 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
    }
    
    /* ============================================ */
    /* QUESTIONS */
    /* ============================================ */
    .qpo-question { 
        margin-bottom: 20px;
    }
    
    .qpo-label { 
        font-weight: 700; 
        font-size: 14px; 
        color: #1e293b; 
        margin-bottom: 10px;
        display: block;
    }
    
    .qpo-label-required::after { 
        content: ' *'; 
        color: #dc2626; 
    }
    
    /* ============================================ */
    /* RADIO BUTTONS */
    /* ============================================ */
    .qpo-radio-group { 
        display: flex; 
        gap: 10px; 
        flex-wrap: wrap; 
    }
    
    .qpo-radio-group-vertical {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .qpo-radio-item { 
        flex: 1; 
        min-width: 150px;
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 8px; 
        padding: 12px 20px; 
        background: white; 
        border-radius: 8px; 
        cursor: pointer; 
        transition: all 0.2s; 
        border: 2px solid #e2e8f0; 
        position: relative; 
    }
    
    .qpo-radio-item-full {
        min-width: 100%;
        justify-content: flex-start;
        padding-left: 20px;
    }
    
    .qpo-radio-item:hover { 
        background: #f1f5f9; 
        border-color: #cbd5e1; 
    }
    
    .qpo-radio-item.selected { 
        background: #dbeafe; 
        border-color: <?php echo $config['couleur_primaire']; ?>; 
        box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.1); 
    }
    
    .qpo-radio-item.urgence {
        border-color: <?php echo $config['couleur_urgence']; ?>;
        background: #fee2e2;
    }
    
    .qpo-radio-item.urgence.selected {
        background: #fecaca;
        border-color: <?php echo $config['couleur_urgence']; ?>;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
    }
    
    .qpo-radio { 
        position: absolute; 
        opacity: 0; 
        width: 0; 
        height: 0; 
    }
    
    .qpo-radio-label { 
        font-weight: 700; 
        font-size: 14px; 
        cursor: pointer; 
        color: #334155; 
        margin: 0; 
        text-align: center;
    }
    
    .qpo-radio-label-left {
        text-align: left;
        width: 100%;
    }
    
    .qpo-radio-label.urgence-label {
        color: <?php echo $config['couleur_urgence']; ?>;
    }
    
    /* ============================================ */
    /* MESSAGE URGENCE SECRÉTAIRE */
    /* ============================================ */
    .qpo-urgence-warning {
        background: #fef3c7;
        border: 3px solid #f59e0b;
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
        display: none;
    }
    
    .qpo-urgence-warning-text {
        font-size: 14px;
        font-weight: 700;
        color: #92400e;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .qpo-urgence-icon {
        font-size: 24px;
    }
    
    /* ============================================ */
    /* TEXTAREA */
    /* ============================================ */
    .qpo-textarea { 
        width: 100%;
        padding: 12px; 
        border: 2px solid #cbd5e1; 
        border-radius: 8px; 
        font-size: 14px; 
        font-weight: 600; 
        color: #1e293b; 
        transition: all 0.2s;
        font-family: Arial, sans-serif;
        resize: vertical;
        min-height: 120px;
    }
    
    .qpo-textarea:focus { 
        outline: none; 
        border-color: <?php echo $config['couleur_primaire']; ?>; 
        box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.15); 
    }
    
    /* ============================================ */
    /* ACTIONS */
    /* ============================================ */
    .qpo-actions { 
        background: white; 
        padding: 20px; 
        border-radius: 12px; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
    }
    
    .qpo-buttons { 
        display: grid; 
        grid-template-columns: 2fr 1fr; 
        gap: 15px; 
    }
    
    .qpo-button { 
        padding: 16px; 
        background: linear-gradient(135deg, <?php echo $config['couleur_primaire']; ?> 0%, <?php echo $config['couleur_secondaire']; ?> 100%); 
        color: white; 
        border: none; 
        border-radius: 10px; 
        font-size: 16px; 
        font-weight: 800; 
        cursor: pointer; 
        transition: all 0.3s; 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
        box-shadow: 0 4px 12px rgba(5, 150, 222, 0.4); 
    }
    
    .qpo-button:hover:not(:disabled) { 
        transform: translateY(-2px); 
        box-shadow: 0 6px 16px rgba(5, 150, 222, 0.6); 
    }
    
    .qpo-button:disabled { 
        opacity: 0.6; 
        cursor: not-allowed; 
        transform: none; 
    }
    
    .qpo-button-reset { 
        background: linear-gradient(135deg, #64748b 0%, #475569 100%); 
        box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4); 
    }
    
    .qpo-button-reset:hover:not(:disabled) { 
        box-shadow: 0 6px 16px rgba(100, 116, 139, 0.6); 
    }
    
    /* ============================================ */
    /* RÉSULTAT */
    /* ============================================ */
    .qpo-result { 
        display: none; 
        position: fixed; 
        top: 0; 
        left: 0; 
        right: 0; 
        bottom: 0; 
        background: rgba(0, 0, 0, 0.95); 
        z-index: 9999; 
        overflow-y: auto; 
        animation: fadeIn 0.3s ease-out; 
    }
    
    @keyframes fadeIn { 
        from { opacity: 0; } 
        to { opacity: 1; } 
    }
    
    .qpo-result-content { 
        max-width: 900px; 
        margin: 40px auto; 
        padding: 40px; 
    }
    
    .qpo-type-box { 
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); 
        padding: 40px; 
        border-radius: 20px; 
        text-align: center; 
        border: 6px solid #d97706; 
        box-shadow: 0 10px 40px rgba(251, 191, 36, 0.6); 
        margin-bottom: 30px; 
    }
    
    .qpo-type-box.urgence {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        border-color: #7f1d1d;
        box-shadow: 0 10px 40px rgba(220, 38, 38, 0.6);
    }
    
    .qpo-type-label { 
        font-size: 16px; 
        font-weight: 700; 
        color: #000; 
        text-transform: uppercase; 
        letter-spacing: 2px; 
        margin-bottom: 15px; 
    }
    
    .qpo-type-label.urgence-label {
        color: white;
    }
    
    .qpo-type-value { 
        font-size: 32px; 
        font-weight: 900; 
        color: #000; 
        text-transform: uppercase; 
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2); 
        line-height: 1.3; 
    }
    
    .qpo-type-value.urgence-value {
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    
    .qpo-notes-container { 
        background: white; 
        padding: 30px; 
        border-radius: 20px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
    }
    
    .qpo-notes-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 20px; 
        padding-bottom: 15px; 
        border-bottom: 4px solid <?php echo $config['couleur_primaire']; ?>; 
    }
    
    .qpo-notes-title { 
        font-size: 22px; 
        font-weight: 900; 
        color: <?php echo $config['couleur_primaire']; ?>; 
        text-transform: uppercase; 
        margin: 0; 
    }
    
    .qpo-copy-btn { 
        padding: 15px 30px; 
        background: <?php echo $config['couleur_primaire']; ?>; 
        color: white; 
        border: none; 
        border-radius: 10px; 
        font-size: 16px; 
        font-weight: 800; 
        cursor: pointer; 
        transition: all 0.3s; 
        text-transform: uppercase; 
    }
    
    .qpo-copy-btn:hover { 
        background: <?php echo $config['couleur_secondaire']; ?>; 
        transform: translateY(-3px); 
        box-shadow: 0 6px 20px rgba(5, 150, 222, 0.5); 
    }
    
    .qpo-notes { 
        background: #f8fafc; 
        border: 3px solid #cbd5e1; 
        border-radius: 10px; 
        padding: 25px; 
        white-space: pre-wrap; 
        font-family: 'Courier New', monospace; 
        font-size: 15px; 
        line-height: 1.8; 
        color: #000; 
        font-weight: 600; 
    }
    
    .qpo-result-actions { 
        display: flex; 
        justify-content: center; 
        gap: 20px; 
        margin-top: 30px; 
    }
    
    .qpo-new-demande-btn { 
        padding: 18px 40px; 
        background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
        color: white; 
        border: none; 
        border-radius: 12px; 
        font-size: 18px; 
        font-weight: 900; 
        cursor: pointer; 
        transition: all 0.3s; 
        text-transform: uppercase; 
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); 
    }
    
    .qpo-new-demande-btn:hover { 
        transform: translateY(-3px); 
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6); 
    }
    
    /* ============================================ */
    /* ALERT */
    /* ============================================ */
    .qpo-alert { 
        padding: 12px 18px; 
        border-radius: 8px; 
        margin-top: 15px; 
        font-weight: 700; 
        font-size: 14px; 
        display: none; 
    }
    
    .qpo-alert-success { 
        background: #d1fae5; 
        color: #065f46; 
        border: 2px solid #10b981; 
    }
    
    .qpo-alert-error { 
        background: #fee2e2; 
        color: #991b1b; 
        border: 2px solid #ef4444; 
    }
    
    /* ============================================ */
    /* HONEYPOT */
    /* ============================================ */
    .qpo-honeypot { 
        position: absolute; 
        left: -9999px; 
        opacity: 0; 
    }
</style>

<div class="qpo-wrapper">
    <div class="qpo-form-container">
    <form id="qpo-form">
        <input type="text" name="website" class="qpo-honeypot" tabindex="-1" autocomplete="off">
        
        <div class="qpo-header">
            <div class="qpo-zoom-controls">
                <button type="button" class="qpo-zoom-btn" id="qpo-zoom-plus" title="Zoomer (Ctrl +)">+</button>
                <div class="qpo-zoom-value" id="qpo-zoom-display" title="Double-clic pour réinitialiser">70%</div>
                <button type="button" class="qpo-zoom-btn" id="qpo-zoom-minus" title="Dézoomer (Ctrl -)">−</button>
            </div>
            
            <h1 class="qpo-header-title">🫁 Demande Ordonnances</h1>
            <p class="qpo-header-info"><?php echo $config['medecins']; ?> - <?php echo $config['telephone']; ?></p>
        </div>
        
        <!-- SECTION MÉDECIN -->
        <div class="qpo-section">
            <h2 class="qpo-section-title">👨‍⚕️ Médecin destinataire</h2>
            
            <div class="qpo-question">
                <label class="qpo-label qpo-label-required">Sélectionner le médecin</label>
                <div class="qpo-radio-group">
                    <label class="qpo-radio-item">
                        <input type="radio" name="medecin" value="Dr Amiot" id="medecin-amiot" class="qpo-radio" required>
                        <span class="qpo-radio-label">Dr Amiot</span>
                    </label>
                    <label class="qpo-radio-item">
                        <input type="radio" name="medecin" value="Dr SIMION" id="medecin-simion" class="qpo-radio">
                        <span class="qpo-radio-label">Dr SIMION</span>
                    </label>
                </div>
            </div>
        </div>
        
        <!-- SECTION TYPE DEMANDE -->
        <div class="qpo-section">
            <h2 class="qpo-section-title">📋 Type de demande</h2>
            
            <div class="qpo-question">
                <label class="qpo-label qpo-label-required">Sélectionner le type</label>
                <div class="qpo-radio-group-vertical">
                    <label class="qpo-radio-item qpo-radio-item-full">
                        <input type="radio" name="type_demande" value="Ordonnance - Renouvellement" id="type-renouvellement" class="qpo-radio" required>
                        <span class="qpo-radio-label qpo-radio-label-left">Ordonnance - Renouvellement</span>
                    </label>
                    <label class="qpo-radio-item qpo-radio-item-full">
                        <input type="radio" name="type_demande" value="Ordonnance - Arrêt de travail" id="type-arret" class="qpo-radio">
                        <span class="qpo-radio-label qpo-radio-label-left">Ordonnance - Arrêt de travail</span>
                    </label>
                    <label class="qpo-radio-item qpo-radio-item-full">
                        <input type="radio" name="type_demande" value="Certificat médical" id="type-certificat" class="qpo-radio">
                        <span class="qpo-radio-label qpo-radio-label-left">Certificat médical</span>
                    </label>
                    <label class="qpo-radio-item qpo-radio-item-full urgence">
                        <input type="radio" name="type_demande" value="URGENCE" id="type-urgence" class="qpo-radio">
                        <span class="qpo-radio-label qpo-radio-label-left urgence-label">🚨 URGENCE</span>
                    </label>
                    <label class="qpo-radio-item qpo-radio-item-full">
                        <input type="radio" name="type_demande" value="Autres" id="type-autres" class="qpo-radio">
                        <span class="qpo-radio-label qpo-radio-label-left">Autres</span>
                    </label>
                </div>
                
                <!-- MESSAGE URGENCE POUR SECRÉTAIRES -->
                <div id="urgence-warning" class="qpo-urgence-warning">
                    <p class="qpo-urgence-warning-text">
                        <span class="qpo-urgence-icon">⚠️</span>
                        <span>Vérifier la présence du médecin au cabinet avant d'envoyer</span>
                    </p>
                </div>
            </div>
        </div>
        
        <!-- SECTION MOTIF -->
        <div class="qpo-section">
            <h2 class="qpo-section-title">💬 Motif de la demande</h2>
            
            <div class="qpo-question">
                <label class="qpo-label qpo-label-required">Préciser le motif</label>
                <textarea name="motif_demande" class="qpo-textarea" required placeholder="Ex : Patient demande renouvellement traitement Symbicort + Ventoline..."></textarea>
            </div>
        </div>
        
        <div class="qpo-actions">
            <div class="qpo-buttons">
                <button type="submit" id="qpo-submit" class="qpo-button">
                    🚀 Envoyer la demande
                </button>
                <button type="button" id="qpo-reset" class="qpo-button qpo-button-reset">
                    🔄 Reset
                </button>
            </div>
            <div id="qpo-alert" class="qpo-alert"></div>
        </div>
    </form>
    </div>
    
    <div id="qpo-result" class="qpo-result">
        <div class="qpo-result-content">
            <div id="qpo-type-box" class="qpo-type-box">
                <div id="qpo-type-label" class="qpo-type-label">📋 DEMANDE ENVOYÉE</div>
                <div id="qpo-type-value" class="qpo-type-value"></div>
            </div>
            
            <div class="qpo-notes-container">
                <div class="qpo-notes-header">
                    <h3 class="qpo-notes-title">📋 Détails envoyés</h3>
                    <button type="button" id="qpo-copy" class="qpo-copy-btn">📋 Copier</button>
                </div>
                <pre id="qpo-notes" class="qpo-notes"></pre>
            </div>
            
            <div class="qpo-result-actions">
                <button type="button" id="qpo-new-demande" class="qpo-new-demande-btn">
                    🔄 Nouvelle Demande
                </button>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    'use strict';
    const $ = jQuery;
    const config = {
        ajaxUrl: '<?php echo $ajax_url; ?>',
        nonce: '<?php echo $nonce; ?>'
    };
    
    const $form = $('#qpo-form');
    const $formContainer = $('.qpo-form-container');
    const $result = $('#qpo-result');
    const $notes = $('#qpo-notes');
    const $typeValue = $('#qpo-type-value');
    const $typeBox = $('#qpo-type-box');
    const $typeLabel = $('#qpo-type-label');
    const $alert = $('#qpo-alert');
    const $submitBtn = $('#qpo-submit');
    
    // ============================================
    // GESTION DU ZOOM - 70% PAR DÉFAUT
    // ============================================
    const STORAGE_KEY = 'qualif_pneumo_ordonnances_zoom';
    const minZoom = 0.5;
    const maxZoom = 1.5;
    const zoomStep = 0.1;
    
    let currentZoom;
    
    function getDefaultZoom() {
        return 0.7;
    }
    
    function loadZoom() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            currentZoom = parseFloat(saved);
            console.log('📊 Zoom chargé depuis localStorage:', currentZoom);
        } else {
            currentZoom = getDefaultZoom();
            console.log('📊 Zoom par défaut à 70%:', currentZoom);
        }
        updateZoom(currentZoom, false);
    }
    
    function saveZoom(zoom) {
        localStorage.setItem(STORAGE_KEY, zoom);
        console.log('💾 Zoom sauvegardé:', zoom);
    }
    
    function updateZoom(newZoom, save = true) {
        if (newZoom < minZoom) newZoom = minZoom;
        if (newZoom > maxZoom) newZoom = maxZoom;
        currentZoom = newZoom;
        $('.qpo-wrapper').css('zoom', currentZoom);
        $('#qpo-zoom-display').text(Math.round(currentZoom * 100) + '%');
        if (save) {
            saveZoom(currentZoom);
        }
    }
    
    function resetZoom() {
        const newDefault = getDefaultZoom();
        updateZoom(newDefault);
        console.log('🔄 Zoom réinitialisé à 70%');
    }
    
    $('#qpo-zoom-plus').on('click', function() {
        updateZoom(currentZoom + zoomStep);
    });
    
    $('#qpo-zoom-minus').on('click', function() {
        updateZoom(currentZoom - zoomStep);
    });
    
    $('#qpo-zoom-display').on('dblclick', function() {
        resetZoom();
    });
    
    $(document).on('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                updateZoom(currentZoom + zoomStep);
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                updateZoom(currentZoom - zoomStep);
            }
        }
    });
    
    loadZoom();
    
    // ============================================
    // INTERACTIONS FORMULAIRE
    // ============================================
    
    // Affichage message urgence pour secrétaires
    $('input[name="type_demande"]').on('change', function() {
        const val = $(this).val();
        
        if (val === 'URGENCE') {
            $('#urgence-warning').slideDown(200);
        } else {
            $('#urgence-warning').slideUp(200);
        }
    });
    
    // Style radio buttons
    $('input[type="radio"]').on('change', function() {
        const name = $(this).attr('name');
        $('input[name="' + name + '"]').closest('.qpo-radio-item').removeClass('selected');
        $(this).closest('.qpo-radio-item').addClass('selected');
    });
    
    $('input[type="radio"]:checked').each(function() {
        $(this).closest('.qpo-radio-item').addClass('selected');
    });
    
    const utils = {
        showAlert: function(msg, type) {
            $alert.removeClass('qpo-alert-success qpo-alert-error').addClass('qpo-alert-' + type).text(msg).fadeIn();
            setTimeout(() => $alert.fadeOut(), 5000);
        }
    };
    
    // ============================================
    // GÉNÉRATION NOTES
    // ============================================
    function generateNotes(data) {
        let notes = '';
        
        // Si urgence, encadrer
        if (data.type_demande === 'URGENCE') {
            notes += '🚨 ========== URGENCE ========== 🚨\n\n';
        }
        
        notes += 'MÉDECIN : ' + data.medecin + '\n';
        notes += 'TYPE : ' + data.type_demande + '\n';
        notes += 'MOTIF : ' + data.motif_demande + '\n\n';
        notes += 'Date : ' + new Date().toLocaleString('fr-FR');
        
        if (data.type_demande === 'URGENCE') {
            notes += '\n\n🚨 ========== URGENCE ========== 🚨';
        }
        
        return notes;
    }
    
    // ============================================
    // SOUMISSION FORMULAIRE
    // ============================================
    $form.on('submit', function(e) {
        e.preventDefault();
        if ($form.data('submitting')) return false;
        $form.data('submitting', true);
        
        if (!this.checkValidity()) {
            utils.showAlert('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
            $form.data('submitting', false);
            return;
        }
        
        $submitBtn.prop('disabled', true).text('⏳ Envoi en cours...');
        
        // Collecte données
        const formData = {
            medecin: $('input[name="medecin"]:checked').val(),
            type_demande: $('input[name="type_demande"]:checked').val(),
            motif_demande: $('textarea[name="motif_demande"]').val()
        };
        
        // Génération notes
        const notesDoctolib = generateNotes(formData);
        
        // Détection urgence
        const isUrgence = (formData.type_demande === 'URGENCE');
        
        // Affichage résultat
        $typeValue.text(formData.type_demande);
        $notes.text(notesDoctolib);
        
        if (isUrgence) {
            $typeBox.addClass('urgence');
            $typeLabel.addClass('urgence-label').text('🚨 URGENCE ENVOYÉE');
            $typeValue.addClass('urgence-value');
        } else {
            $typeBox.removeClass('urgence');
            $typeLabel.removeClass('urgence-label').text('📋 DEMANDE ENVOYÉE');
            $typeValue.removeClass('urgence-value');
        }
        
        $formContainer.fadeOut(300, function() {
            $result.fadeIn(400);
            $('body').css('overflow', 'hidden');
        });
        
        // Envoi AJAX
        $.ajax({
            url: config.ajaxUrl,
            type: 'POST',
            data: {
                action: 'qpo_submit',
                nonce: config.nonce,
                website: $('input[name="website"]').val(),
                data: JSON.stringify({
                    medecin: formData.medecin,
                    type_demande: formData.type_demande,
                    motif_demande: formData.motif_demande,
                    notes_doctolib: notesDoctolib
                })
            },
            success: function(response) {
                if (response.success) {
                    utils.showAlert('✅ ' + response.data.message, 'success');
                } else {
                    utils.showAlert('⚠️ ' + response.data.message, 'error');
                }
            },
            error: function() {
                utils.showAlert('⚠️ Erreur réseau (notes affichées)', 'error');
            },
            complete: function() {
                $submitBtn.prop('disabled', false).text('🚀 Envoyer la demande');
                $form.data('submitting', false);
            }
        });
    });
    
    // ============================================
    // BOUTONS RESET / NOUVELLE DEMANDE / COPIE
    // ============================================
    $('#qpo-reset').on('click', function() {
        if (confirm('Réinitialiser le formulaire ?')) {
            $form[0].reset();
            $result.fadeOut();
            $formContainer.fadeIn();
            $alert.hide();
            $('#urgence-warning').hide();
            $('.qpo-radio-item').removeClass('selected');
            $('body').css('overflow', '');
            $('html, body').animate({ scrollTop: 0 }, 500);
            utils.showAlert('✅ Prêt pour nouvelle demande', 'success');
        }
    });
    
    $('#qpo-new-demande').on('click', function() {
        $result.fadeOut(300, function() {
            $form[0].reset();
            $('.qpo-radio-item').removeClass('selected');
            $('#urgence-warning').hide();
            $alert.hide();
            $formContainer.fadeIn(400);
            $('body').css('overflow', '');
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    });
    
    $('#qpo-copy').on('click', function() {
        const text = $notes.text();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                $('#qpo-copy').text('✓ Copié !');
                setTimeout(function() { $('#qpo-copy').text('📋 Copier'); }, 2500);
            });
        } else {
            alert('Copie automatique non supportée');
        }
    });
})();
</script>
        <?php
        return ob_get_clean();
    }
}

add_shortcode('qualif_pneumo_ordonnances', 'qpo_shortcode');