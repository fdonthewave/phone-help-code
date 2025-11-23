/**
 * Snippet ID: 10
 * Name: Qualif Pneumo Formulaire v1.0
 * Modified: 2025-11-10 21:17:20
 * Active: True
 * Source: qualif-pneumo-formulaire-v1_0_code-snippets.json
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * QUALIF PNEUMO - FORMULAIRE v1.0
 * ═══════════════════════════════════════════════════════════════
 * 
 * 📋 Shortcode : [qualif_pneumo]
 * 🏥 Service : Dr Amiot & Dr SIMION - 02.52.69.00.33
 * 🔬 Types RDV : 
 *    - 1ère consultation pneumologie
 *    - Consultation de suivi
 *    - 1ère consultation troubles sommeil
 *    - 1ère consultation allergologie (Dr SIMION uniquement)
 * 
 * 💾 Sauvegarde BDD : qualif_pneumo
 * 📧 Email auto : scripts@phone-help.com avec subject [PNEUMO - Médecins]
 * 🔍 Zoom : 70% par défaut (interface téléphonique)
 * 
 * PRÉREQUIS wp-config.php :
 * - define('BREVO_API_KEY', 'ta-cle');
 * - define('BREVO_SENDER_EMAIL', 'scripts@phone-help.com');
 * - define('BREVO_SENDER_NAME', 'Qualif Pneumo');
 * - define('BREVO_RECIPIENT_EMAIL', 'scripts@phone-help.com');
 * 
 * ═══════════════════════════════════════════════════════════════
 */

// ============================================
// CONFIGURATION CENTRALISÉE
// ============================================
if (!function_exists('qp_get_config')) {
    function qp_get_config() {
        return array(
            'service' => 'pneumo',
            'medecins' => 'Dr Amiot & Dr SIMION',
            'nom_service' => 'Pneumologie',
            'telephone' => '02.52.69.00.33',
            'couleur_primaire' => '#0596DE',
            'couleur_secondaire' => '#004B87',
            'table_bdd' => 'qualif_pneumo',
            'email_subject_prefix' => '[PNEUMO - Médecins]'
        );
    }
}

// ============================================
// CRÉATION TABLE BDD AU 1ER CHARGEMENT
// ============================================
if (!function_exists('qp_create_table')) {
    function qp_create_table() {
        global $wpdb;
        $config = qp_get_config();
        $table = $wpdb->prefix . $config['table_bdd'];
        $charset = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            submission_hash varchar(32) NOT NULL,
            type_rdv varchar(100) NOT NULL,
            medecin_affecte varchar(50) DEFAULT NULL,
            toux varchar(3) NOT NULL,
            crachats varchar(3) NOT NULL,
            age int(3) NOT NULL,
            fumeur varchar(3) NOT NULL,
            fumeur_pa decimal(5,2) DEFAULT NULL,
            notes_doctolib text NOT NULL,
            email_sent tinyint(1) DEFAULT 0,
            email_sent_at datetime DEFAULT NULL,
            brevo_response text DEFAULT NULL,
            ip_address varchar(45) NOT NULL,
            user_agent varchar(255) NOT NULL,
            PRIMARY KEY (id),
            KEY submission_hash (submission_hash),
            KEY created_at (created_at),
            KEY type_rdv (type_rdv),
            KEY email_sent (email_sent)
        ) $charset;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        error_log('✅ Qualif Pneumo : Table créée/vérifiée');
    }
}

// Exécuter la création de table au chargement
add_action('init', 'qp_create_table');

// ============================================
// ENVOI EMAIL VIA BREVO + FALLBACK WP_MAIL
// ============================================
if (!function_exists('qp_send_brevo_email')) {
    function qp_send_brevo_email($subject, $notes) {
        $config = qp_get_config();
        $full_subject = $config['email_subject_prefix'] . ' ' . htmlspecialchars($subject);
        
        // Tentative Brevo si clé configurée
        if (defined('BREVO_API_KEY') && BREVO_API_KEY !== '') {
            $api_key = BREVO_API_KEY;
            $sender_email = defined('BREVO_SENDER_EMAIL') ? BREVO_SENDER_EMAIL : 'noreply@phone-help.com';
            $sender_name = defined('BREVO_SENDER_NAME') ? BREVO_SENDER_NAME : 'Qualif Pneumo';
            $recipient_email = defined('BREVO_RECIPIENT_EMAIL') ? BREVO_RECIPIENT_EMAIL : 'scripts@phone-help.com';
            
            $html_content = '
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #0596DE 0%, #004B87 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">🫁 Qualif Pneumo</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; text-align: center;">' . htmlspecialchars($config['nom_service']) . '</p>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    <div style="background: #0596DE; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                        <h2 style="margin: 0;">' . htmlspecialchars($subject) . '</h2>
                    </div>
                    <pre style="font-family: Courier New, monospace; font-size: 14px; line-height: 1.8; background: #f8fafc; padding: 25px; border-radius: 8px; border: 2px solid #0596DE; white-space: pre-wrap; color: #1e293b;">' . htmlspecialchars($notes) . '</pre>
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
                    error_log('✅ Qualif Pneumo : Email Brevo envoyé (ID: ' . $message_id . ')');
                    return array('success' => true, 'message' => 'Email envoyé via Brevo', 'message_id' => $message_id);
                } else {
                    error_log('⚠️ Qualif Pneumo : Brevo Status ' . $status . ' - Tentative fallback wp_mail');
                }
            } else {
                error_log('⚠️ Qualif Pneumo : Brevo Error - ' . $response->get_error_message() . ' - Tentative fallback wp_mail');
            }
        }
        
        // FALLBACK : wp_mail si Brevo échoue ou non configuré
        error_log('📧 Qualif Pneumo : Envoi fallback via wp_mail()');
        
        $recipient_email = defined('BREVO_RECIPIENT_EMAIL') ? BREVO_RECIPIENT_EMAIL : get_option('admin_email');
        $headers = array('Content-Type: text/html; charset=UTF-8');
        
        $html_simple = '<html><body style="font-family: Arial, sans-serif;">';
        $html_simple .= '<h2 style="color: #0596DE;">🫁 ' . htmlspecialchars($full_subject) . '</h2>';
        $html_simple .= '<pre style="background: #f8fafc; padding: 20px; border: 1px solid #cbd5e1; border-radius: 5px; font-size: 13px; line-height: 1.6;">';
        $html_simple .= htmlspecialchars($notes);
        $html_simple .= '</pre>';
        $html_simple .= '<p style="color: #64748b; font-size: 12px;">Email automatique - Qualif Pneumo (fallback wp_mail)</p>';
        $html_simple .= '</body></html>';
        
        $wp_mail_result = wp_mail($recipient_email, $full_subject, $html_simple, $headers);
        
        if ($wp_mail_result) {
            error_log('✅ Qualif Pneumo : Email fallback wp_mail envoyé');
            return array('success' => true, 'message' => 'Email envoyé via wp_mail (fallback)', 'message_id' => 'wp_mail_fallback');
        } else {
            error_log('❌ Qualif Pneumo : Échec wp_mail - Aucun email envoyé');
            return array('success' => false, 'message' => 'Échec Brevo et wp_mail');
        }
    }
}

// ============================================
// HANDLER AJAX - Enregistrement BDD + Email
// ============================================
if (!function_exists('qp_handle_submit')) {
    function qp_handle_submit() {
        // Vérification nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'qualif_pneumo_nonce')) {
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
            error_log('❌ Qualif Pneumo : JSON invalide - ' . json_last_error_msg());
            wp_send_json_error(array('message' => 'Données corrompues (JSON invalide)'));
        }
        
        // Validation basique
        $required_fields = array('type_rdv', 'toux', 'crachats', 'age', 'fumeur', 'notes_doctolib');
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                wp_send_json_error(array('message' => 'Champ obligatoire manquant : ' . $field));
            }
        }
        
        global $wpdb;
        $config = qp_get_config();
        $table = $wpdb->prefix . $config['table_bdd'];
        
        // Anti-doublon : Hash sur 5 minutes
        $hash = md5(
            $data['type_rdv'] . $data['age'] . 
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
            'type_rdv' => sanitize_text_field($data['type_rdv']),
            'medecin_affecte' => isset($data['medecin_affecte']) ? sanitize_text_field($data['medecin_affecte']) : null,
            'toux' => sanitize_text_field($data['toux']),
            'crachats' => sanitize_text_field($data['crachats']),
            'age' => intval($data['age']),
            'fumeur' => sanitize_text_field($data['fumeur']),
            'fumeur_pa' => !empty($data['fumeur_pa']) ? floatval($data['fumeur_pa']) : null,
            'notes_doctolib' => sanitize_textarea_field($data['notes_doctolib']),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => substr($_SERVER['HTTP_USER_AGENT'], 0, 255)
        ));
        
        if (!$inserted) {
            error_log('❌ Qualif Pneumo : Erreur BDD - ' . $wpdb->last_error);
            wp_send_json_error(array('message' => 'Erreur BDD : ' . $wpdb->last_error));
        }
        
        $insert_id = $wpdb->insert_id;
        error_log('✅ Qualif Pneumo : Enregistrement BDD ID=' . $insert_id);
        
        // Envoi email
        $email_result = qp_send_brevo_email($data['type_rdv'], $data['notes_doctolib']);
        
        if ($email_result['success']) {
            $wpdb->update($table, array(
                'email_sent' => 1,
                'email_sent_at' => current_time('mysql'),
                'brevo_response' => 'Message ID: ' . $email_result['message_id']
            ), array('id' => $insert_id));
        }
        
        $message = 'Qualification enregistrée !';
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
add_action('wp_ajax_qp_submit', 'qp_handle_submit');
add_action('wp_ajax_nopriv_qp_submit', 'qp_handle_submit');

// ============================================
// SHORTCODE PRINCIPAL
// ============================================
if (!function_exists('qp_shortcode')) {
    function qp_shortcode() {
        $config = qp_get_config();
        $nonce = wp_create_nonce('qualif_pneumo_nonce');
        $ajax_url = admin_url('admin-ajax.php');
        
        ob_start();
        ?>
<style>
    * { box-sizing: border-box; }
    .qp-wrapper { 
        max-width: 1600px; 
        margin: 20px auto; 
        padding: 20px; 
        transition: zoom 0.2s ease;
    }
    
    /* ============================================ */
    /* CONTRÔLES ZOOM */
    /* ============================================ */
    .qp-header {
        background: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        border-left: 5px solid <?php echo $config['couleur_primaire']; ?>;
        position: relative;
    }
    
    .qp-zoom-controls {
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
    
    .qp-zoom-btn {
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
    
    .qp-zoom-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(5, 150, 222, 0.5);
    }
    
    .qp-zoom-btn:active {
        transform: scale(0.95);
    }
    
    .qp-zoom-value {
        text-align: center;
        font-size: 13px;
        font-weight: 800;
        color: <?php echo $config['couleur_primaire']; ?>;
        padding: 4px 0;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .qp-zoom-value:hover {
        color: <?php echo $config['couleur_secondaire']; ?>;
        text-decoration: underline;
    }
    
    .qp-header-title { 
        font-size: 24px; 
        font-weight: 900; 
        color: <?php echo $config['couleur_primaire']; ?>; 
        margin: 0 0 10px 0; 
    }
    
    .qp-header-info { 
        font-size: 14px; 
        color: #64748b; 
        font-weight: 600; 
        margin: 0; 
    }
    
    /* ============================================ */
    /* LAYOUT 2 COLONNES */
    /* ============================================ */
    .qp-main-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 20px; 
        margin-bottom: 20px; 
    }
    
    /* ============================================ */
    /* COLONNES */
    /* ============================================ */
    .qp-section { 
        background: white; 
        padding: 20px; 
        border-radius: 12px; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
        display: flex; 
        flex-direction: column;
    }
    
    .qp-section-rdv { border-left: 5px solid #f59e0b; }
    .qp-section-questions { border-left: 5px solid #10b981; }
    
    .qp-section-header { 
        display: flex; 
        align-items: center; 
        gap: 10px; 
        margin-bottom: 15px; 
        padding-bottom: 12px; 
        border-bottom: 3px solid #e2e8f0; 
    }
    
    .qp-section-icon { font-size: 28px; }
    
    .qp-section-title { 
        font-size: 16px; 
        font-weight: 900; 
        color: #1e293b; 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
        margin: 0; 
    }
    
    /* ============================================ */
    /* QUESTIONS */
    /* ============================================ */
    .qp-question { 
        background: #f8fafc; 
        padding: 12px; 
        border-radius: 8px; 
        margin-bottom: 12px; 
        border: 2px solid #e2e8f0; 
        transition: all 0.2s; 
    }
    
    .qp-question:hover { 
        border-color: #cbd5e1; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
    }
    
    .qp-question-text { 
        font-size: 14px; 
        font-weight: 700; 
        color: #1e293b; 
        margin-bottom: 10px; 
    }
    
    .qp-label { 
        font-weight: 700; 
        font-size: 13px; 
        color: #1e293b; 
        margin-bottom: 8px;
        display: block;
    }
    
    .qp-label-required::after { 
        content: ' *'; 
        color: #dc2626; 
    }
    
    /* ============================================ */
    /* RADIO BUTTONS */
    /* ============================================ */
    .qp-radio-group { 
        display: flex; 
        gap: 8px; 
        flex-wrap: wrap; 
    }
    
    .qp-radio-group-vertical {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .qp-radio-item { 
        flex: 1; 
        min-width: 70px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 6px; 
        padding: 10px 16px; 
        background: white; 
        border-radius: 6px; 
        cursor: pointer; 
        transition: all 0.2s; 
        border: 2px solid #e2e8f0; 
        position: relative; 
    }
    
    .qp-radio-item-full {
        flex: 1;
        min-width: 100%;
        justify-content: flex-start;
        padding-left: 16px;
    }
    
    .qp-radio-item:hover { 
        background: #f1f5f9; 
        border-color: #cbd5e1; 
    }
    
    .qp-radio-item.selected { 
        background: #dbeafe; 
        border-color: <?php echo $config['couleur_primaire']; ?>; 
        box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.1); 
    }
    
    .qp-radio { 
        position: absolute; 
        opacity: 0; 
        width: 0; 
        height: 0; 
    }
    
    .qp-radio-label { 
        font-weight: 700; 
        font-size: 14px; 
        cursor: pointer; 
        color: #334155; 
        margin: 0; 
        width: 100%; 
        text-align: center; 
    }
    
    .qp-radio-label-left {
        text-align: left;
    }
    
    /* ============================================ */
    /* INPUT */
    /* ============================================ */
    .qp-input { 
        padding: 10px 12px; 
        border: 2px solid #cbd5e1; 
        border-radius: 6px; 
        font-size: 14px; 
        font-weight: 600; 
        color: #1e293b; 
        transition: all 0.2s; 
        width: 100%;
    }
    
    .qp-input:focus { 
        outline: none; 
        border-color: <?php echo $config['couleur_primaire']; ?>; 
        box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.15); 
    }
    
    /* ============================================ */
    /* PANEL CONDITIONNEL */
    /* ============================================ */
    .qp-panel { 
        margin-top: 10px; 
        padding: 12px; 
        background: #fef3c7; 
        border: 2px solid #f59e0b; 
        border-radius: 8px; 
        display: none; 
    }
    
    .qp-panel-title { 
        font-weight: 700; 
        font-size: 12px; 
        color: #92400e; 
        margin-bottom: 8px; 
    }
    
    .qp-pa-result {
        background: white;
        padding: 10px;
        border-radius: 6px;
        text-align: center;
        font-size: 16px;
        font-weight: 800;
        color: #92400e;
        margin-top: 10px;
        display: none;
    }
    
    /* ============================================ */
    /* MESSAGE MÉDECIN */
    /* ============================================ */
    .qp-medecin-info {
        background: #dbeafe;
        border: 2px solid <?php echo $config['couleur_primaire']; ?>;
        border-radius: 8px;
        padding: 12px 16px;
        margin-top: 10px;
        display: none;
    }
    
    .qp-medecin-text {
        font-size: 14px;
        font-weight: 700;
        color: #1e40af;
        margin: 0;
    }
    
    /* ============================================ */
    /* ACTIONS */
    /* ============================================ */
    .qp-actions { 
        background: white; 
        padding: 20px; 
        border-radius: 12px; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
    }
    
    .qp-buttons { 
        display: grid; 
        grid-template-columns: 2fr 1fr; 
        gap: 15px; 
    }
    
    .qp-button { 
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
    
    .qp-button:hover:not(:disabled) { 
        transform: translateY(-2px); 
        box-shadow: 0 6px 16px rgba(5, 150, 222, 0.6); 
    }
    
    .qp-button:disabled { 
        opacity: 0.6; 
        cursor: not-allowed; 
        transform: none; 
    }
    
    .qp-button-reset { 
        background: linear-gradient(135deg, #64748b 0%, #475569 100%); 
        box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4); 
    }
    
    .qp-button-reset:hover:not(:disabled) { 
        box-shadow: 0 6px 16px rgba(100, 116, 139, 0.6); 
    }
    
    /* ============================================ */
    /* RÉSULTAT */
    /* ============================================ */
    .qp-result { 
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
    
    .qp-result-content { 
        max-width: 900px; 
        margin: 40px auto; 
        padding: 40px; 
    }
    
    .qp-rdv-box { 
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); 
        padding: 50px; 
        border-radius: 20px; 
        text-align: center; 
        border: 6px solid #d97706; 
        box-shadow: 0 10px 40px rgba(251, 191, 36, 0.6); 
        margin-bottom: 30px; 
    }
    
    .qp-rdv-label { 
        font-size: 18px; 
        font-weight: 700; 
        color: #000; 
        text-transform: uppercase; 
        letter-spacing: 2px; 
        margin-bottom: 20px; 
    }
    
    .qp-rdv-value { 
        font-size: 42px; 
        font-weight: 900; 
        color: #000; 
        text-transform: uppercase; 
        text-shadow: 3px 3px 6px rgba(0,0,0,0.2); 
        line-height: 1.3; 
    }
    
    .qp-notes-container { 
        background: white; 
        padding: 30px; 
        border-radius: 20px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
    }
    
    .qp-notes-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 20px; 
        padding-bottom: 15px; 
        border-bottom: 4px solid <?php echo $config['couleur_primaire']; ?>; 
    }
    
    .qp-notes-title { 
        font-size: 22px; 
        font-weight: 900; 
        color: <?php echo $config['couleur_primaire']; ?>; 
        text-transform: uppercase; 
        margin: 0; 
    }
    
    .qp-copy-btn { 
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
    
    .qp-copy-btn:hover { 
        background: <?php echo $config['couleur_secondaire']; ?>; 
        transform: translateY(-3px); 
        box-shadow: 0 6px 20px rgba(5, 150, 222, 0.5); 
    }
    
    .qp-notes { 
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
    
    .qp-result-actions { 
        display: flex; 
        justify-content: center; 
        gap: 20px; 
        margin-top: 30px; 
    }
    
    .qp-new-qualif-btn { 
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
    
    .qp-new-qualif-btn:hover { 
        transform: translateY(-3px); 
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6); 
    }
    
    /* ============================================ */
    /* ALERT */
    /* ============================================ */
    .qp-alert { 
        padding: 12px 18px; 
        border-radius: 8px; 
        margin-top: 15px; 
        font-weight: 700; 
        font-size: 14px; 
        display: none; 
    }
    
    .qp-alert-success { 
        background: #d1fae5; 
        color: #065f46; 
        border: 2px solid #10b981; 
    }
    
    .qp-alert-error { 
        background: #fee2e2; 
        color: #991b1b; 
        border: 2px solid #ef4444; 
    }
    
    /* ============================================ */
    /* HONEYPOT */
    /* ============================================ */
    .qp-honeypot { 
        position: absolute; 
        left: -9999px; 
        opacity: 0; 
    }
</style>

<div class="qp-wrapper">
    <div class="qp-form-container">
    <form id="qp-form">
        <input type="text" name="website" class="qp-honeypot" tabindex="-1" autocomplete="off">
        
        <div class="qp-header">
            <div class="qp-zoom-controls">
                <button type="button" class="qp-zoom-btn" id="qp-zoom-plus" title="Zoomer (Ctrl +)">+</button>
                <div class="qp-zoom-value" id="qp-zoom-display" title="Double-clic pour réinitialiser">70%</div>
                <button type="button" class="qp-zoom-btn" id="qp-zoom-minus" title="Dézoomer (Ctrl -)">−</button>
            </div>
            
            <h1 class="qp-header-title">🫁 Qualification Pneumologie</h1>
            <p class="qp-header-info"><?php echo $config['medecins']; ?> - <?php echo $config['telephone']; ?></p>
        </div>
        
        <div class="qp-main-grid">
            <!-- COLONNE 1 : TYPE RDV -->
            <div class="qp-section qp-section-rdv">
                <div class="qp-section-header">
                    <span class="qp-section-icon">📅</span>
                    <h2 class="qp-section-title">Type de RDV</h2>
                </div>
                
                <div class="qp-question">
                    <label class="qp-label qp-label-required">Sélectionner le type de rendez-vous</label>
                    <div class="qp-radio-group-vertical">
                        <label class="qp-radio-item qp-radio-item-full">
                            <input type="radio" name="type_rdv" value="1ère consultation pneumologie" id="rdv-pneumo" class="qp-radio" required>
                            <span class="qp-radio-label qp-radio-label-left">1ère consultation pneumologie</span>
                        </label>
                        <label class="qp-radio-item qp-radio-item-full">
                            <input type="radio" name="type_rdv" value="Consultation de suivi" id="rdv-suivi" class="qp-radio">
                            <span class="qp-radio-label qp-radio-label-left">Consultation de suivi</span>
                        </label>
                        <label class="qp-radio-item qp-radio-item-full">
                            <input type="radio" name="type_rdv" value="1ère consultation troubles sommeil" id="rdv-sommeil" class="qp-radio">
                            <span class="qp-radio-label qp-radio-label-left">1ère consultation troubles sommeil</span>
                        </label>
                        <label class="qp-radio-item qp-radio-item-full">
                            <input type="radio" name="type_rdv" value="1ère consultation allergologie" id="rdv-allergo" class="qp-radio">
                            <span class="qp-radio-label qp-radio-label-left">1ère consultation allergologie</span>
                        </label>
                    </div>
                    
                    <div id="allergo-info" class="qp-medecin-info">
                        <p class="qp-medecin-text">👨‍⚕️ RDV avec Dr SIMION uniquement (allergologie respiratoire)</p>
                    </div>
                    
                    <div id="standard-info" class="qp-medecin-info">
                        <p class="qp-medecin-text">👨‍⚕️ RDV avec Dr Amiot ou Dr SIMION selon disponibilités</p>
                    </div>
                </div>
            </div>
            
            <!-- COLONNE 2 : QUESTIONS -->
            <div class="qp-section qp-section-questions">
                <div class="qp-section-header">
                    <span class="qp-section-icon">📝</span>
                    <h2 class="qp-section-title">Questions</h2>
                </div>
                
                <div class="qp-question">
                    <div class="qp-question-text">Toux ?</div>
                    <div class="qp-radio-group">
                        <label class="qp-radio-item">
                            <input type="radio" name="toux" value="NON" id="toux-non" class="qp-radio" required>
                            <span class="qp-radio-label">NON</span>
                        </label>
                        <label class="qp-radio-item">
                            <input type="radio" name="toux" value="OUI" id="toux-oui" class="qp-radio">
                            <span class="qp-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                
                <div class="qp-question">
                    <div class="qp-question-text">Crachats ?</div>
                    <div class="qp-radio-group">
                        <label class="qp-radio-item">
                            <input type="radio" name="crachats" value="NON" id="crachats-non" class="qp-radio" required>
                            <span class="qp-radio-label">NON</span>
                        </label>
                        <label class="qp-radio-item">
                            <input type="radio" name="crachats" value="OUI" id="crachats-oui" class="qp-radio">
                            <span class="qp-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                
                <div class="qp-question">
                    <label class="qp-label qp-label-required">Âge</label>
                    <input type="number" name="age" class="qp-input" min="0" max="120" required placeholder="Ex : 45">
                </div>
                
                <div class="qp-question">
                    <div class="qp-question-text">Fumeur actif ou arrêt < 2 ans ?</div>
                    <div class="qp-radio-group">
                        <label class="qp-radio-item">
                            <input type="radio" name="fumeur" value="NON" id="fumeur-non" class="qp-radio" required>
                            <span class="qp-radio-label">NON</span>
                        </label>
                        <label class="qp-radio-item">
                            <input type="radio" name="fumeur" value="OUI" id="fumeur-oui" class="qp-radio">
                            <span class="qp-radio-label">OUI</span>
                        </label>
                    </div>
                    <div id="fumeur-panel" class="qp-panel">
                        <div class="qp-panel-title">Nombre de paquets-années (PA) :</div>
                        <input type="number" name="fumeur_pa" id="fumeur-pa" class="qp-input" min="0" step="0.1" placeholder="Ex : 20">
                        <div id="pa-result" class="qp-pa-result">
                            📊 <span id="pa-value">0</span> PA
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="qp-actions">
            <div class="qp-buttons">
                <button type="submit" id="qp-submit" class="qp-button">
                    🚀 Générer les notes Doctolib
                </button>
                <button type="button" id="qp-reset" class="qp-button qp-button-reset">
                    🔄 Reset
                </button>
            </div>
            <div id="qp-alert" class="qp-alert"></div>
        </div>
    </form>
    </div>
    
    <div id="qp-result" class="qp-result">
        <div class="qp-result-content">
            <div class="qp-rdv-box">
                <div class="qp-rdv-label">⏰ TYPE RDV DOCTOLIB</div>
                <div id="qp-rdv-value" class="qp-rdv-value"></div>
            </div>
            
            <div class="qp-notes-container">
                <div class="qp-notes-header">
                    <h3 class="qp-notes-title">📋 Notes Doctolib</h3>
                    <button type="button" id="qp-copy" class="qp-copy-btn">📋 Copier</button>
                </div>
                <pre id="qp-notes" class="qp-notes"></pre>
            </div>
            
            <div class="qp-result-actions">
                <button type="button" id="qp-new-qualif" class="qp-new-qualif-btn">
                    🔄 Nouvelle Qualification
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
    
    const $form = $('#qp-form');
    const $formContainer = $('.qp-form-container');
    const $result = $('#qp-result');
    const $notes = $('#qp-notes');
    const $rdvValue = $('#qp-rdv-value');
    const $alert = $('#qp-alert');
    const $submitBtn = $('#qp-submit');
    
    // ============================================
    // GESTION DU ZOOM - 70% PAR DÉFAUT
    // ============================================
    const STORAGE_KEY = 'qualif_pneumo_zoom';
    const minZoom = 0.5;
    const maxZoom = 1.5;
    const zoomStep = 0.1;
    
    let currentZoom;
    let defaultZoom;
    
    function getDefaultZoom() {
        return 0.7;
    }
    
    function loadZoom() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            currentZoom = parseFloat(saved);
            console.log('📊 Zoom chargé depuis localStorage:', currentZoom);
        } else {
            defaultZoom = getDefaultZoom();
            currentZoom = defaultZoom;
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
        $('.qp-wrapper').css('zoom', currentZoom);
        $('#qp-zoom-display').text(Math.round(currentZoom * 100) + '%');
        if (save) {
            saveZoom(currentZoom);
        }
    }
    
    function resetZoom() {
        const newDefault = getDefaultZoom();
        updateZoom(newDefault);
        console.log('🔄 Zoom réinitialisé à 70%');
    }
    
    $('#qp-zoom-plus').on('click', function() {
        updateZoom(currentZoom + zoomStep);
    });
    
    $('#qp-zoom-minus').on('click', function() {
        updateZoom(currentZoom - zoomStep);
    });
    
    $('#qp-zoom-display').on('dblclick', function() {
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
    
    // Affichage info médecin selon type RDV
    $('input[name="type_rdv"]').on('change', function() {
        const val = $(this).val();
        $('#allergo-info, #standard-info').hide();
        
        if (val === '1ère consultation allergologie') {
            $('#allergo-info').slideDown(200);
        } else {
            $('#standard-info').slideDown(200);
        }
    });
    
    // Panel fumeur
    $('#fumeur-oui').on('change', function() { 
        $('#fumeur-panel').slideDown(200); 
    });
    
    $('#fumeur-non').on('change', function() { 
        $('#fumeur-panel').slideUp(200);
        $('#fumeur-pa').val('');
        $('#pa-result').hide();
    });
    
    // Affichage PA
    $('#fumeur-pa').on('input', function() {
        const pa = parseFloat($(this).val()) || 0;
        if (pa > 0) {
            $('#pa-value').text(pa);
            $('#pa-result').slideDown(200);
        } else {
            $('#pa-result').slideUp(200);
        }
    });
    
    // Style radio buttons
    $('input[type="radio"]').on('change', function() {
        const name = $(this).attr('name');
        $('input[name="' + name + '"]').closest('.qp-radio-item').removeClass('selected');
        $(this).closest('.qp-radio-item').addClass('selected');
    });
    
    $('input[type="radio"]:checked').each(function() {
        $(this).closest('.qp-radio-item').addClass('selected');
    });
    
    const utils = {
        showAlert: function(msg, type) {
            $alert.removeClass('qp-alert-success qp-alert-error').addClass('qp-alert-' + type).text(msg).fadeIn();
            setTimeout(() => $alert.fadeOut(), 5000);
        }
    };
    
    // ============================================
    // GÉNÉRATION NOTES DOCTOLIB
    // ============================================
    function generateNotes(data) {
        let notes = '';
        
        notes += 'TYPE RDV : ' + data.type_rdv + '\n';
        if (data.medecin_affecte) {
            notes += 'Médecin : ' + data.medecin_affecte + '\n';
        }
        notes += '\n';
        
        notes += 'QUESTIONS :\n';
        notes += 'Toux : ' + data.toux + '\n';
        notes += 'Crachats : ' + data.crachats + '\n';
        notes += 'Âge : ' + data.age + ' ans\n';
        notes += 'Fumeur actif ou arrêt < 2 ans : ' + data.fumeur;
        if (data.fumeur === 'OUI' && data.fumeur_pa) {
            notes += ' (' + data.fumeur_pa + ' PA)';
        }
        notes += '\n';
        
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
        
        $submitBtn.prop('disabled', true).text('⏳ Génération en cours...');
        
        // Collecte données
        const formData = {
            type_rdv: $('input[name="type_rdv"]:checked').val(),
            medecin_affecte: null,
            toux: $('input[name="toux"]:checked').val(),
            crachats: $('input[name="crachats"]:checked').val(),
            age: $('input[name="age"]').val(),
            fumeur: $('input[name="fumeur"]:checked').val(),
            fumeur_pa: null
        };
        
        // Médecin affecté
        if (formData.type_rdv === '1ère consultation allergologie') {
            formData.medecin_affecte = 'Dr SIMION';
        } else {
            formData.medecin_affecte = 'Dr Amiot ou Dr SIMION';
        }
        
        // PA fumeur
        if (formData.fumeur === 'OUI') {
            const pa = parseFloat($('#fumeur-pa').val()) || 0;
            if (pa > 0) {
                formData.fumeur_pa = pa;
            }
        }
        
        // Génération notes
        const notesDoctolib = generateNotes(formData);
        
        // Affichage résultat
        $rdvValue.text(formData.type_rdv);
        $notes.text(notesDoctolib);
        
        $formContainer.fadeOut(300, function() {
            $result.fadeIn(400);
            $('body').css('overflow', 'hidden');
        });
        
        // Envoi AJAX
        $.ajax({
            url: config.ajaxUrl,
            type: 'POST',
            data: {
                action: 'qp_submit',
                nonce: config.nonce,
                website: $('input[name="website"]').val(),
                data: JSON.stringify({
                    type_rdv: formData.type_rdv,
                    medecin_affecte: formData.medecin_affecte,
                    toux: formData.toux,
                    crachats: formData.crachats,
                    age: formData.age,
                    fumeur: formData.fumeur,
                    fumeur_pa: formData.fumeur_pa,
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
                $submitBtn.prop('disabled', false).text('🚀 Générer les notes Doctolib');
                $form.data('submitting', false);
            }
        });
    });
    
    // ============================================
    // BOUTONS RESET / NOUVELLE QUALIF / COPIE
    // ============================================
    $('#qp-reset').on('click', function() {
        if (confirm('Réinitialiser le formulaire ?')) {
            $form[0].reset();
            $result.fadeOut();
            $formContainer.fadeIn();
            $alert.hide();
            $('#fumeur-panel, #allergo-info, #standard-info').hide();
            $('#pa-result').hide();
            $('.qp-radio-item').removeClass('selected');
            $('body').css('overflow', '');
            $('html, body').animate({ scrollTop: 0 }, 500);
            utils.showAlert('✅ Prêt pour nouvelle qualification', 'success');
        }
    });
    
    $('#qp-new-qualif').on('click', function() {
        $result.fadeOut(300, function() {
            $form[0].reset();
            $('#fumeur-panel, #allergo-info, #standard-info').hide();
            $('#pa-result').hide();
            $('.qp-radio-item').removeClass('selected');
            $alert.hide();
            $formContainer.fadeIn(400);
            $('body').css('overflow', '');
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    });
    
    $('#qp-copy').on('click', function() {
        const text = $notes.text();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                $('#qp-copy').text('✓ Copié !');
                setTimeout(function() { $('#qp-copy').text('📋 Copier'); }, 2500);
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

add_shortcode('qualif_pneumo', 'qp_shortcode');