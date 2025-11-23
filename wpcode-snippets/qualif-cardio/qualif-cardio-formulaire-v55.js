/**
 * Snippet ID: 6
 * Name: Qualif Cardio Formulaire v5.5
 * Modified: 2025-10-21 09:38:10
 * Active: True
 * Source: qualif-cardio-formulaire-v5_5_code-snippets__1_.json
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * QUALIF CARDIO - FORMULAIRE COMPLET v5.3 AVEC CORRECTIONS
 * ═══════════════════════════════════════════════════════════════
 * 
 * 📋 Shortcode : [qualif_cardio]
 * 🏥 Types RDV : "1ère consultation prioritaire" / "risque faible"
 * 💾 Sauvegarde COMPLÈTE en BDD
 * 📧 Email auto via Brevo + fallback wp_mail
 * 🚫 Anti-doublons (hash unique)
 * 🔍 Contrôle ZOOM : 70% par défaut
 * 
 * NOUVEAUTÉS v5.3 :
 * ⚡ Tabac : Facteur de risque uniquement si PA >= 1
 * ⚡ JSON decode sécurisé avec vérification d'erreur
 * ⚡ Création automatique table BDD
 * ⚡ Fallback email wp_mail() si Brevo échoue
 * ⚡ Commentaires métier pour maintenance
 * 
 * PRÉREQUIS wp-config.php :
 * - define('BREVO_API_KEY', 'ta-cle');
 * - define('BREVO_SENDER_EMAIL', 'scripts@phone-help.com');
 * - define('BREVO_SENDER_NAME', 'Qualif Cardio');
 * - define('BREVO_RECIPIENT_EMAIL', 'scripts@phone-help.com');
 * 
 * ═══════════════════════════════════════════════════════════════
 */

// ============================================
// CRÉATION TABLE BDD AU 1ER CHARGEMENT
// ============================================
if (!function_exists('qc_create_table')) {
    function qc_create_table() {
        global $wpdb;
        $table = $wpdb->prefix . 'qualif_cardio_complete';
        $charset = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            submission_hash varchar(32) NOT NULL,
            age int(3) NOT NULL,
            sexe varchar(10) NOT NULL,
            taille int(3) NOT NULL,
            poids decimal(5,2) NOT NULL,
            imc decimal(4,2) NOT NULL,
            medecin_adresseur varchar(255) NOT NULL,
            commune varchar(255) NOT NULL,
            suivi_cardio varchar(3) NOT NULL,
            nom_cardiologue varchar(255) DEFAULT NULL,
            q1_atcd varchar(3) NOT NULL,
            q1_atcd_details text DEFAULT NULL,
            q2_douleur_thoracique varchar(3) NOT NULL,
            q3_essoufflement varchar(3) NOT NULL,
            q4_claudication varchar(3) NOT NULL,
            q5_diabete varchar(3) NOT NULL,
            q6_hta varchar(3) NOT NULL,
            q7_tabac varchar(3) NOT NULL,
            q7_tabac_cigarettes int(3) DEFAULT NULL,
            q7_tabac_annees int(3) DEFAULT NULL,
            q7_tabac_pa decimal(5,2) DEFAULT NULL,
            q8_cholesterol varchar(3) NOT NULL,
            nb_facteurs_risque int(1) NOT NULL,
            type_rdv varchar(100) NOT NULL,
            notes_doctolib text NOT NULL,
            email_sent tinyint(1) DEFAULT 0,
            email_sent_at datetime DEFAULT NULL,
            brevo_response text DEFAULT NULL,
            ip_address varchar(45) NOT NULL,
            user_agent varchar(255) NOT NULL,
            PRIMARY KEY (id),
            KEY submission_hash (submission_hash),
            KEY created_at (created_at),
            KEY email_sent (email_sent)
        ) $charset;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        error_log('✅ Qualif Cardio : Table créée/vérifiée');
    }
}

// Exécuter la création de table au chargement du plugin
add_action('init', 'qc_create_table');

// ============================================
// CONFIGURATION CABINET
// ============================================
if (!function_exists('qc_get_config')) {
    function qc_get_config() {
        return array(
            'nom_cabinet' => 'SMR Cardio Blois',
            'couleur_primaire' => '#0596DE',
            'couleur_secondaire' => '#004B87'
        );
    }
}

// ============================================
// ENVOI EMAIL VIA BREVO + FALLBACK WP_MAIL
// ============================================
if (!function_exists('qc_send_brevo_email')) {
    function qc_send_brevo_email($subject, $notes) {
        $config = qc_get_config();
        $full_subject = '[Qualif Cardio - ' . htmlspecialchars($config['nom_cabinet']) . '] ' . htmlspecialchars($subject);
        
        // Tentative Brevo si clé configurée
        if (defined('BREVO_API_KEY') && BREVO_API_KEY !== '') {
            $api_key = BREVO_API_KEY;
            $sender_email = defined('BREVO_SENDER_EMAIL') ? BREVO_SENDER_EMAIL : 'noreply@phone-help.com';
            $sender_name = defined('BREVO_SENDER_NAME') ? BREVO_SENDER_NAME : 'Qualif Cardio';
            $recipient_email = defined('BREVO_RECIPIENT_EMAIL') ? BREVO_RECIPIENT_EMAIL : 'scripts@phone-help.com';
            
            $html_content = '
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #0596DE 0%, #004B87 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">🫀 Qualif Cardio</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; text-align: center;">' . htmlspecialchars($config['nom_cabinet']) . '</p>
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
                    error_log('✅ Qualif Cardio : Email Brevo envoyé (ID: ' . $message_id . ')');
                    return array('success' => true, 'message' => 'Email envoyé via Brevo', 'message_id' => $message_id);
                } else {
                    error_log('⚠️ Qualif Cardio : Brevo Status ' . $status . ' - Tentative fallback wp_mail');
                }
            } else {
                error_log('⚠️ Qualif Cardio : Brevo Error - ' . $response->get_error_message() . ' - Tentative fallback wp_mail');
            }
        }
        
        // FALLBACK : wp_mail si Brevo échoue ou non configuré
        error_log('📧 Qualif Cardio : Envoi fallback via wp_mail()');
        
        $recipient_email = defined('BREVO_RECIPIENT_EMAIL') ? BREVO_RECIPIENT_EMAIL : get_option('admin_email');
        $headers = array('Content-Type: text/html; charset=UTF-8');
        
        $html_simple = '<html><body style="font-family: Arial, sans-serif;">';
        $html_simple .= '<h2 style="color: #0596DE;">🫀 ' . htmlspecialchars($full_subject) . '</h2>';
        $html_simple .= '<pre style="background: #f8fafc; padding: 20px; border: 1px solid #cbd5e1; border-radius: 5px; font-size: 13px; line-height: 1.6;">';
        $html_simple .= htmlspecialchars($notes);
        $html_simple .= '</pre>';
        $html_simple .= '<p style="color: #64748b; font-size: 12px;">Email automatique - Qualif Cardio (fallback wp_mail)</p>';
        $html_simple .= '</body></html>';
        
        $wp_mail_result = wp_mail($recipient_email, $full_subject, $html_simple, $headers);
        
        if ($wp_mail_result) {
            error_log('✅ Qualif Cardio : Email fallback wp_mail envoyé');
            return array('success' => true, 'message' => 'Email envoyé via wp_mail (fallback)', 'message_id' => 'wp_mail_fallback');
        } else {
            error_log('❌ Qualif Cardio : Échec wp_mail - Aucun email envoyé');
            return array('success' => false, 'message' => 'Échec Brevo et wp_mail');
        }
    }
}

// ============================================
// HANDLER AJAX - Enregistrement BDD + Email
// ============================================
if (!function_exists('qc_handle_submit')) {
    function qc_handle_submit() {
        // Vérification nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'qualif_cardio_nonce')) {
            wp_send_json_error(array('message' => 'Sécurité : nonce invalide'));
        }
        
        // Honeypot anti-spam
        if (!empty($_POST['website'])) {
            wp_send_json_error(array('message' => 'Spam détecté'));
        }
        
        // Décodage JSON SÉCURISÉ avec vérification
        $json_raw = stripslashes($_POST['data']);
        $data = json_decode($json_raw, true);
        
        if (!$data || json_last_error() !== JSON_ERROR_NONE) {
            error_log('❌ Qualif Cardio : JSON invalide - ' . json_last_error_msg());
            wp_send_json_error(array('message' => 'Données corrompues (JSON invalide)'));
        }
        
        // Validation basique des champs obligatoires
        $required_fields = array('age', 'sexe', 'taille', 'poids', 'commune', 'type_rdv', 'notes_doctolib');
        foreach ($required_fields as $field) {
            if (empty($data[$field])) {
                wp_send_json_error(array('message' => 'Champ obligatoire manquant : ' . $field));
            }
        }
        
        global $wpdb;
        $table = $wpdb->prefix . 'qualif_cardio_complete';
        
        // Anti-doublon : Hash sur 5 minutes (acceptable car rare selon retour utilisateur)
        $hash = md5(
            $data['age'] . $data['sexe'] . $data['poids'] . $data['taille'] . 
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
            'age' => intval($data['age']),
            'sexe' => sanitize_text_field($data['sexe']),
            'taille' => intval($data['taille']),
            'poids' => floatval($data['poids']),
            'imc' => floatval($data['imc']),
            'medecin_adresseur' => sanitize_text_field($data['medecin_adresseur']),
            'commune' => sanitize_text_field($data['commune']),
            'suivi_cardio' => sanitize_text_field($data['suivi_cardio']),
            'nom_cardiologue' => sanitize_text_field($data['nom_cardiologue']),
            'q1_atcd' => sanitize_text_field($data['q1_atcd']),
            'q1_atcd_details' => sanitize_textarea_field($data['q1_atcd_details']),
            'q2_douleur_thoracique' => sanitize_text_field($data['q2_dt']),
            'q3_essoufflement' => sanitize_text_field($data['q3_esso']),
            'q4_claudication' => sanitize_text_field($data['q4_claud']),
            'q5_diabete' => sanitize_text_field($data['q5_diab']),
            'q6_hta' => sanitize_text_field($data['q6_hta']),
            'q7_tabac' => sanitize_text_field($data['q7_tabac']),
            'q7_tabac_cigarettes' => !empty($data['q7_tabac_cigarettes']) ? intval($data['q7_tabac_cigarettes']) : null,
            'q7_tabac_annees' => !empty($data['q7_tabac_annees']) ? intval($data['q7_tabac_annees']) : null,
            'q7_tabac_pa' => !empty($data['q7_tabac_pa']) ? floatval($data['q7_tabac_pa']) : null,
            'q8_cholesterol' => sanitize_text_field($data['q8_chol']),
            'nb_facteurs_risque' => intval($data['nb_facteurs']),
            'type_rdv' => sanitize_text_field($data['type_rdv']),
            'notes_doctolib' => sanitize_textarea_field($data['notes_doctolib']),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => substr($_SERVER['HTTP_USER_AGENT'], 0, 255)
        ));
        
        if (!$inserted) {
            error_log('❌ Qualif Cardio : Erreur BDD - ' . $wpdb->last_error);
            wp_send_json_error(array('message' => 'Erreur BDD : ' . $wpdb->last_error));
        }
        
        $insert_id = $wpdb->insert_id;
        error_log('✅ Qualif Cardio : Enregistrement BDD ID=' . $insert_id);
        
        // Envoi email (Brevo + fallback wp_mail)
        $email_result = qc_send_brevo_email($data['type_rdv'], $data['notes_doctolib']);
        
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
add_action('wp_ajax_qc_submit', 'qc_handle_submit');
add_action('wp_ajax_nopriv_qc_submit', 'qc_handle_submit');

// ============================================
// SHORTCODE PRINCIPAL
// ============================================
if (!function_exists('qc_shortcode')) {
    function qc_shortcode() {
        $config = qc_get_config();
        $nonce = wp_create_nonce('qualif_cardio_nonce');
        $ajax_url = admin_url('admin-ajax.php');
        
        ob_start();
        ?>
<style>
    * { box-sizing: border-box; }
    .qc-wrapper { 
        max-width: 1600px; 
        margin: 20px auto; 
        padding: 20px; 
        transition: zoom 0.2s ease;
    }
    
    /* ============================================ */
    /* CONTRÔLES ZOOM - DANS LE BLOC PATIENT */
    /* ============================================ */
    .qc-patient { 
        background: white; 
        padding: 20px; 
        border-radius: 12px; 
        margin-bottom: 20px; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
        border-left: 5px solid <?php echo $config['couleur_primaire']; ?>;
        position: relative;
    }
    
    .qc-zoom-controls {
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
    
    .qc-zoom-btn {
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
    
    .qc-zoom-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(5, 150, 222, 0.5);
    }
    
    .qc-zoom-btn:active {
        transform: scale(0.95);
    }
    
    .qc-zoom-value {
        text-align: center;
        font-size: 13px;
        font-weight: 800;
        color: <?php echo $config['couleur_primaire']; ?>;
        padding: 4px 0;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .qc-zoom-value:hover {
        color: <?php echo $config['couleur_secondaire']; ?>;
        text-decoration: underline;
    }
    
    .qc-patient-title { font-size: 16px; font-weight: 800; color: <?php echo $config['couleur_primaire']; ?>; margin-bottom: 15px; text-transform: uppercase; }
    .qc-patient-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .qc-patient-grid .qc-field-full { grid-column: span 4; }
    .qc-patient-grid .qc-field-half { grid-column: span 2; }
    .qc-field { display: flex; flex-direction: column; gap: 5px; }
    .qc-label { font-weight: 700; font-size: 13px; color: #1e293b; }
    .qc-label-required::after { content: ' *'; color: #dc2626; }
    .qc-input, .qc-select { padding: 8px 10px; border: 2px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-weight: 600; color: #1e293b; transition: all 0.2s; }
    .qc-input:focus, .qc-select:focus { outline: none; border-color: <?php echo $config['couleur_primaire']; ?>; box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.15); }
    .qc-main-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .qc-section { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); display: flex; flex-direction: column; min-height: 520px; }
    .qc-section-atcd { border-left: 5px solid #dc2626; }
    .qc-section-symptomes { border-left: 5px solid #f59e0b; }
    .qc-section-fdr { border-left: 5px solid #10b981; }
    .qc-section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 3px solid #e2e8f0; }
    .qc-section-icon { font-size: 28px; }
    .qc-section-title { font-size: 16px; font-weight: 900; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
    .qc-question { background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 2px solid #e2e8f0; transition: all 0.2s; }
    .qc-question:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .qc-question-text { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
    .qc-q-number { display: inline-flex; align-items: center; justify-content: center; background: <?php echo $config['couleur_primaire']; ?>; color: white; width: 24px; height: 24px; border-radius: 50%; font-weight: 900; font-size: 13px; flex-shrink: 0; }
    .qc-radio-group { display: flex; gap: 8px; flex-wrap: wrap; }
    .qc-radio-item { flex: 1; min-width: 70px; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; background: white; border-radius: 6px; cursor: pointer; transition: all 0.2s; border: 2px solid #e2e8f0; position: relative; }
    .qc-radio-item:hover { background: #f1f5f9; border-color: #cbd5e1; }
    .qc-radio-item.selected { background: #dbeafe; border-color: <?php echo $config['couleur_primaire']; ?>; box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.1); }
    .qc-radio { position: absolute; opacity: 0; width: 0; height: 0; }
    .qc-radio-label { font-weight: 700; font-size: 14px; cursor: pointer; color: #334155; margin: 0; width: 100%; text-align: center; }
    .qc-panel { margin-top: 8px; padding: 12px; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; display: none; }
    .qc-panel-title { font-weight: 700; font-size: 12px; color: #92400e; margin-bottom: 8px; }
    .qc-checkbox-list { display: flex; flex-direction: column; gap: 6px; }
    .qc-checkbox-item { display: flex; align-items: center; gap: 8px; padding: 6px; background: white; border-radius: 4px; cursor: pointer; transition: all 0.2s; font-size: 13px; font-weight: 600; }
    .qc-checkbox-item:hover { background: #fef9c3; }
    .qc-checkbox-item input[type="checkbox"] { cursor: pointer; accent-color: #dc2626; }
    .qc-input-inline { flex: 1; padding: 4px 8px; border: 1px solid #d4d4d8; border-radius: 4px; font-size: 12px; margin-left: 6px; }
    .qc-tabac-profiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; }
    .qc-profile-item { cursor: pointer; }
    .qc-profile-item input[type="radio"] { display: none; }
    .qc-profile-box { background: white; padding: 10px; border-radius: 6px; border: 2px solid #e2e8f0; text-align: center; transition: all 0.2s; }
    .qc-profile-item input:checked + .qc-profile-box { background: #dbeafe; border-color: <?php echo $config['couleur_primaire']; ?>; box-shadow: 0 0 0 3px rgba(5, 150, 222, 0.1); }
    .qc-profile-label { font-weight: 800; font-size: 13px; color: #1e293b; margin-bottom: 4px; }
    .qc-profile-detail { font-size: 11px; color: #64748b; margin-bottom: 4px; }
    .qc-profile-pa { font-size: 13px; font-weight: 700; color: #0596DE; }
    .qc-tabac-perso { display: block; }
    .qc-panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .qc-pa-result { background: white; padding: 8px; border-radius: 6px; text-align: center; font-size: 15px; font-weight: 800; color: #92400e; margin-top: 8px; display: none; }
    .qc-actions { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .qc-buttons { display: grid; grid-template-columns: 2fr 1fr; gap: 15px; }
    .qc-button { padding: 16px; background: linear-gradient(135deg, <?php echo $config['couleur_primaire']; ?> 0%, <?php echo $config['couleur_secondaire']; ?> 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(5, 150, 222, 0.4); }
    .qc-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(5, 150, 222, 0.6); }
    .qc-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .qc-button-reset { background: linear-gradient(135deg, #64748b 0%, #475569 100%); box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4); }
    .qc-button-reset:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(100, 116, 139, 0.6); }
    .qc-result { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.95); z-index: 9999; overflow-y: auto; animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .qc-result-content { max-width: 900px; margin: 40px auto; padding: 40px; }
    .qc-result-grid { display: flex; flex-direction: column; gap: 30px; }
    .qc-rdv-box { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 50px; border-radius: 20px; text-align: center; border: 6px solid #d97706; box-shadow: 0 10px 40px rgba(251, 191, 36, 0.6); margin-bottom: 30px; }
    .qc-rdv-label { font-size: 18px; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .qc-rdv-value { font-size: 42px; font-weight: 900; color: #000; text-transform: uppercase; text-shadow: 3px 3px 6px rgba(0,0,0,0.2); line-height: 1.3; }
    .qc-notes-container { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .qc-notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 4px solid <?php echo $config['couleur_primaire']; ?>; }
    .qc-notes-title { font-size: 22px; font-weight: 900; color: <?php echo $config['couleur_primaire']; ?>; text-transform: uppercase; margin: 0; }
    .qc-copy-btn { padding: 15px 30px; background: <?php echo $config['couleur_primaire']; ?>; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.3s; text-transform: uppercase; }
    .qc-copy-btn:hover { background: <?php echo $config['couleur_secondaire']; ?>; transform: translateY(-3px); box-shadow: 0 6px 20px rgba(5, 150, 222, 0.5); }
    .qc-notes { background: #f8fafc; border: 3px solid #cbd5e1; border-radius: 10px; padding: 25px; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 15px; line-height: 1.8; color: #000; font-weight: 600; }
    .qc-result-actions { display: flex; justify-content: center; gap: 20px; margin-top: 30px; }
    .qc-new-qualif-btn { padding: 18px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: 900; cursor: pointer; transition: all 0.3s; text-transform: uppercase; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); }
    .qc-new-qualif-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6); }
    .qc-alert { padding: 12px 18px; border-radius: 8px; margin-top: 15px; font-weight: 700; font-size: 14px; display: none; }
    .qc-alert-success { background: #d1fae5; color: #065f46; border: 2px solid #10b981; }
    .qc-alert-error { background: #fee2e2; color: #991b1b; border: 2px solid #ef4444; }
    .qc-honeypot { position: absolute; left: -9999px; opacity: 0; }
</style>

<div class="qc-wrapper">
    <div class="qc-form-container">
    <form id="qc-form">
        <input type="text" name="website" class="qc-honeypot" tabindex="-1" autocomplete="off">
        
        <div class="qc-patient">
            <div class="qc-zoom-controls">
                <button type="button" class="qc-zoom-btn" id="qc-zoom-plus" title="Zoomer (Ctrl +)">+</button>
                <div class="qc-zoom-value" id="qc-zoom-display" title="Double-clic pour réinitialiser">70%</div>
                <button type="button" class="qc-zoom-btn" id="qc-zoom-minus" title="Dézoomer (Ctrl -)">−</button>
            </div>
            
            <div class="qc-patient-title">📋 Informations Patient</div>
            <div class="qc-patient-grid">
                <div class="qc-field">
                    <label class="qc-label qc-label-required">Âge</label>
                    <input type="number" name="age" class="qc-input" min="0" max="120" required>
                </div>
                <div class="qc-field">
                    <label class="qc-label qc-label-required">Sexe</label>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="sexe" value="Homme" id="sexe-h" class="qc-radio" required>
                            <span class="qc-radio-label">H</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="sexe" value="Femme" id="sexe-f" class="qc-radio">
                            <span class="qc-radio-label">F</span>
                        </label>
                    </div>
                </div>
                <div class="qc-field">
                    <label class="qc-label qc-label-required">Taille (cm)</label>
                    <input type="number" name="taille" class="qc-input" min="50" max="250" required>
                </div>
                <div class="qc-field">
                    <label class="qc-label qc-label-required">Poids (kg)</label>
                    <input type="number" name="poids" class="qc-input" min="20" max="300" required>
                </div>
                
                <div class="qc-field qc-field-half">
                    <label class="qc-label qc-label-required">Médecin adresseur</label>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="adresseur_type" value="Médecin traitant" id="adresseur-mt" class="qc-radio" required checked>
                            <span class="qc-radio-label">Médecin traitant</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="adresseur_type" value="Autre" id="adresseur-autre" class="qc-radio">
                            <span class="qc-radio-label">Autre</span>
                        </label>
                    </div>
                </div>
                <div class="qc-field qc-field-half" id="adresseur-autre-field" style="display: none;">
                    <label class="qc-label">Nom du médecin</label>
                    <input type="text" name="adresseur_nom" class="qc-input" placeholder="Nom du médecin">
                </div>
                
                <div class="qc-field qc-field-half">
                    <label class="qc-label qc-label-required">Commune de Résidence</label>
                    <input type="text" name="commune" class="qc-input" required>
                </div>
                
                <div class="qc-field qc-field-half">
                    <label class="qc-label qc-label-required">Suivi cardio ?</label>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="suivi_cardio" value="NON" id="suivi-non" class="qc-radio" required checked>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="suivi_cardio" value="OUI" id="suivi-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                
                <div class="qc-field qc-field-full" id="cardio-field" style="display: none;">
                    <label class="qc-label">Nom cardiologue</label>
                    <div class="qc-radio-group" style="max-width: 400px;">
                        <label class="qc-radio-item">
                            <input type="radio" name="cardio_type" value="Cabinet" id="cardio-cabinet" class="qc-radio">
                            <span class="qc-radio-label">Cabinet</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="cardio_type" value="Autre" id="cardio-autre" class="qc-radio">
                            <span class="qc-radio-label">Autre</span>
                        </label>
                    </div>
                    <div id="cardio-autre-panel" class="qc-panel">
                        <input type="text" name="cardio_nom" class="qc-input" placeholder="Nom du cardiologue" style="width: 100%;">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="qc-main-grid">
            <div class="qc-section qc-section-atcd">
                <div class="qc-section-header">
                    <span class="qc-section-icon">🚨</span>
                    <h2 class="qc-section-title">Antécédents</h2>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">1</span>
                        <span>ATCD Cardiovasculaires ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q1_atcd" value="NON" id="q1-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q1_atcd" value="OUI" id="q1-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                    <div id="q1-panel" class="qc-panel">
                        <div class="qc-panel-title">Cocher ce qui s'applique :</div>
                        <div class="qc-checkbox-list">
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_idm" value="IDM"> IDM (infarctus)
                            </label>
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_avc" value="AVC"> AVC
                            </label>
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_stents" value="Stents"> Stents coronariens
                            </label>
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_pontage" value="Pontage"> Pontage
                            </label>
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_valve" value="Valve"> Opération valve
                            </label>
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_arythmie" value="Arythmie"> Arythmie/FA
                            </label>
                            <label class="qc-checkbox-item">
                                <input type="checkbox" name="atcd_autre_check" value="Autre"> Autre : 
                                <input type="text" name="atcd_autre_text" class="qc-input-inline" placeholder="Préciser">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="qc-section qc-section-symptomes">
                <div class="qc-section-header">
                    <span class="qc-section-icon">⚠️</span>
                    <h2 class="qc-section-title">Symptômes</h2>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">2</span>
                        <span>Douleur thoracique ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q2_dt" value="NON" id="q2-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q2_dt" value="OUI" id="q2-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">3</span>
                        <span>Essoufflement ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q3_esso" value="NON" id="q3-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q3_esso" value="OUI" id="q3-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">4</span>
                        <span>Claudication (douleur mollet) ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q4_claud" value="NON" id="q4-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q4_claud" value="OUI" id="q4-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="qc-section qc-section-fdr">
                <div class="qc-section-header">
                    <span class="qc-section-icon">📊</span>
                    <h2 class="qc-section-title">Facteurs Risque</h2>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">5</span>
                        <span>Diabète ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q5_diab" value="NON" id="q5-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q5_diab" value="OUI" id="q5-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">6</span>
                        <span>HTA ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q6_hta" value="NON" id="q6-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q6_hta" value="OUI" id="q6-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">7</span>
                        <span>Tabac actuel ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q7_tabac" value="NON" id="q7-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q7_tabac" value="OUI" id="q7-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                    <div id="q7-panel" class="qc-panel">
                        <div class="qc-panel-title">Profil tabagique :</div>
                        <div class="qc-tabac-profiles">
                            <label class="qc-profile-item">
                                <input type="radio" name="tabac_profil" value="leger" id="tabac-leger">
                                <div class="qc-profile-box">
                                    <div class="qc-profile-label">Léger</div>
                                    <div class="qc-profile-detail">10 cig/j × 5 ans</div>
                                    <div class="qc-profile-pa">2.5 PA</div>
                                </div>
                            </label>
                            <label class="qc-profile-item">
                                <input type="radio" name="tabac_profil" value="moyen" id="tabac-moyen">
                                <div class="qc-profile-box">
                                    <div class="qc-profile-label">Moyen</div>
                                    <div class="qc-profile-detail">20 cig/j × 10 ans</div>
                                    <div class="qc-profile-pa">10 PA</div>
                                </div>
                            </label>
                            <label class="qc-profile-item">
                                <input type="radio" name="tabac_profil" value="fort" id="tabac-fort">
                                <div class="qc-profile-box">
                                    <div class="qc-profile-label">Fort</div>
                                    <div class="qc-profile-detail">30 cig/j × 20 ans</div>
                                    <div class="qc-profile-pa">30 PA</div>
                                </div>
                            </label>
                            <label class="qc-profile-item">
                                <input type="radio" name="tabac_profil" value="perso" id="tabac-perso" checked>
                                <div class="qc-profile-box">
                                    <div class="qc-profile-label">Personnalisé</div>
                                </div>
                            </label>
                        </div>
                        <div id="tabac-perso-panel" class="qc-tabac-perso">
                            <div class="qc-panel-grid">
                                <input type="number" name="tabac_cig" id="tabac-cig" class="qc-input" placeholder="Cig/jour" min="0">
                                <input type="number" name="tabac_annees" id="tabac-annees" class="qc-input" placeholder="Années" min="0">
                            </div>
                            <div id="pa-result" class="qc-pa-result">
                                📊 <span id="pa-value">0</span> PA
                            </div>
                        </div>
                    </div>
                </div>
                <div class="qc-question">
                    <div class="qc-question-text">
                        <span class="qc-q-number">8</span>
                        <span>Cholestérol ?</span>
                    </div>
                    <div class="qc-radio-group">
                        <label class="qc-radio-item">
                            <input type="radio" name="q8_chol" value="NON" id="q8-non" class="qc-radio" required>
                            <span class="qc-radio-label">NON</span>
                        </label>
                        <label class="qc-radio-item">
                            <input type="radio" name="q8_chol" value="OUI" id="q8-oui" class="qc-radio">
                            <span class="qc-radio-label">OUI</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="qc-actions">
            <div class="qc-buttons">
                <button type="submit" id="qc-submit" class="qc-button">
                    🚀 Calculer et déterminer le RDV
                </button>
                <button type="button" id="qc-reset" class="qc-button qc-button-reset">
                    🔄 Reset
                </button>
            </div>
            <div id="qc-alert" class="qc-alert"></div>
        </div>
    </form>
    </div>
    
    <div id="qc-result" class="qc-result">
        <div class="qc-result-content">
            <div class="qc-result-grid">
                <div class="qc-rdv-box">
                    <div class="qc-rdv-label">⏰ TYPE RDV DOCTOLIB</div>
                    <div id="qc-rdv-value" class="qc-rdv-value"></div>
                </div>
                
                <div class="qc-notes-container">
                    <div class="qc-notes-header">
                        <h3 class="qc-notes-title">📋 Notes Doctolib</h3>
                        <button type="button" id="qc-copy" class="qc-copy-btn">📋 Copier</button>
                    </div>
                    <pre id="qc-notes" class="qc-notes"></pre>
                </div>
                
                <div class="qc-result-actions">
                    <button type="button" id="qc-new-qualif" class="qc-new-qualif-btn">
                        🔄 Nouvelle Qualification
                    </button>
                </div>
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
    
    const $form = $('#qc-form');
    const $formContainer = $('.qc-form-container');
    const $result = $('#qc-result');
    const $notes = $('#qc-notes');
    const $rdvValue = $('#qc-rdv-value');
    const $alert = $('#qc-alert');
    const $submitBtn = $('#qc-submit');
    
    // ============================================
    // GESTION DU ZOOM - 70% PAR DÉFAUT
    // ============================================
    const STORAGE_KEY = 'qualif_cardio_zoom';
    const minZoom = 0.5;
    const maxZoom = 1.5;
    const zoomStep = 0.1;
    
    let currentZoom;
    let defaultZoom;
    
    // Zoom par défaut à 70% pour tous les écrans
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
        $('.qc-wrapper').css('zoom', currentZoom);
        $('#qc-zoom-display').text(Math.round(currentZoom * 100) + '%');
        if (save) {
            saveZoom(currentZoom);
        }
    }
    
    function resetZoom() {
        const newDefault = getDefaultZoom();
        updateZoom(newDefault);
        console.log('🔄 Zoom réinitialisé à 70%');
    }
    
    $('#qc-zoom-plus').on('click', function() {
        updateZoom(currentZoom + zoomStep);
    });
    
    $('#qc-zoom-minus').on('click', function() {
        updateZoom(currentZoom - zoomStep);
    });
    
    $('#qc-zoom-display').on('dblclick', function() {
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
    $('input[name="adresseur_type"]').on('change', function() {
        if ($(this).val() === 'Autre') {
            $('#adresseur-autre-field').slideDown(200);
        } else {
            $('#adresseur-autre-field').slideUp(200);
            $('input[name="adresseur_nom"]').val('');
        }
    });
    
    $('input[name="suivi_cardio"]').on('change', function() {
        if ($(this).val() === 'OUI') {
            $('#cardio-field').slideDown(200);
        } else {
            $('#cardio-field').slideUp(200);
            $('input[name="cardio_type"]').prop('checked', false);
            $('#cardio-autre-panel').hide();
            $('input[name="cardio_nom"]').val('');
        }
    });
    
    $('input[name="cardio_type"]').on('change', function() {
        if ($(this).val() === 'Autre') {
            $('#cardio-autre-panel').slideDown(200);
        } else {
            $('#cardio-autre-panel').slideUp(200);
            $('input[name="cardio_nom"]').val('');
        }
    });
    
    $('#q1-oui').on('change', function() { $('#q1-panel').slideDown(200); });
    $('#q1-non').on('change', function() { 
        $('#q1-panel').slideUp(200);
        $('#q1-panel input[type="checkbox"]').prop('checked', false);
        $('input[name="atcd_autre_text"]').val('');
    });
    
    $('#q7-oui').on('change', function() { $('#q7-panel').slideDown(200); });
    $('#q7-non').on('change', function() { 
        $('#q7-panel').slideUp(200);
        $('input[name="tabac_profil"]').prop('checked', false);
        $('#tabac-perso').prop('checked', true);
        $('#tabac-cig, #tabac-annees').val('');
        $('#pa-result').hide();
    });
    
    const tabacProfiles = {
        leger: { cig: 10, ans: 5, pa: 2.5 },
        moyen: { cig: 20, ans: 10, pa: 10 },
        fort: { cig: 30, ans: 20, pa: 30 }
    };
    
    $('input[name="tabac_profil"]').on('change', function() {
        const profil = $(this).val();
        if (profil !== 'perso' && tabacProfiles[profil]) {
            const data = tabacProfiles[profil];
            $('#tabac-cig').val(data.cig);
            $('#tabac-annees').val(data.ans);
            $('#pa-value').text(data.pa);
            $('#pa-result').slideDown(200);
        }
    });
    
    function calcPA() {
        const cig = parseFloat($('#tabac-cig').val()) || 0;
        const ans = parseFloat($('#tabac-annees').val()) || 0;
        if (cig > 0 && ans > 0) {
            const pa = ((cig / 20) * ans).toFixed(1);
            $('#pa-value').text(pa);
            $('#pa-result').slideDown(200);
            return pa;
        } else {
            $('#pa-result').slideUp(200);
            return null;
        }
    }
    
    $('#tabac-cig, #tabac-annees').on('input', function() {
        $('#tabac-perso').prop('checked', true);
        calcPA();
    });
    
    $('input[type="radio"]').on('change', function() {
        const name = $(this).attr('name');
        $('input[name="' + name + '"]').closest('.qc-radio-item').removeClass('selected');
        $(this).closest('.qc-radio-item').addClass('selected');
    });
    
    $('input[type="radio"]:checked').each(function() {
        $(this).closest('.qc-radio-item').addClass('selected');
    });
    
    const utils = {
        showAlert: function(msg, type) {
            $alert.removeClass('qc-alert-success qc-alert-error').addClass('qc-alert-' + type).text(msg).fadeIn();
            setTimeout(() => $alert.fadeOut(), 5000);
        }
    };
    
    // ============================================
    // LOGIQUE MÉTIER - AVEC CORRECTIONS v5.3
    // ============================================
    const business = {
        /**
         * Compte les facteurs de risque cardiovasculaire
         * Guidelines ESC 2021 : Âge (H>55, F>60), Diabète, HTA, Tabac, Cholestérol
         * CORRECTION v5.3 : Tabac compté uniquement si PA >= 1
         */
        countFacteurs: function(data) {
            let count = 0, list = [];
            
            // Diabète
            if (data.q5_diab === 'OUI') { 
                count++; 
                list.push('Diabète'); 
            }
            
            // HTA
            if (data.q6_hta === 'OUI') { 
                count++; 
                list.push('HTA'); 
            }
            
            // Tabac : CORRECTION - Uniquement si PA >= 1
            if (data.q7_tabac === 'OUI' && data.tabacPA && parseFloat(data.tabacPA) >= 1) {
                count++;
                list.push('Tabac actuel (' + data.tabacPA + ' PA)');
            }
            
            // Cholestérol
            if (data.q8_chol === 'OUI') { 
                count++; 
                list.push('Cholestérol'); 
            }
            
            // Âge (Guidelines ESC : H>55ans, F>60ans)
            const age = parseInt(data.age);
            const sexe = data.sexe;
            if ((sexe === 'Homme' && age > 55) || (sexe === 'Femme' && age > 60)) {
                count++; 
                list.push('Âge (' + age + ' ans)');
            }
            
            return { count: count, list: list };
        },
        
        /**
         * Détermine le type de RDV selon protocole cabinet
         * PRIORITAIRE si :
         * - ATCD cardiovasculaire (IDM, AVC, stents, etc.)
         * - Douleur thoracique (symptôme urgent)
         * - >= 3 facteurs de risque
         * - >= 2 facteurs de risque + symptômes (essoufflement ou claudication)
         */
        determineRDV: function(data, facteurs) {
            // ATCD cardio = PRIORITAIRE
            if (data.q1_atcd === 'OUI') {
                return '1ère consultation prioritaire';
            }
            
            // Douleur thoracique = PRIORITAIRE (urgence potentielle)
            if (data.q2_dt === 'OUI') {
                return '1ère consultation prioritaire';
            }
            
            // >= 3 FDR = PRIORITAIRE
            if (facteurs.count >= 3) {
                return '1ère consultation prioritaire';
            }
            
            // >= 2 FDR + symptômes = PRIORITAIRE
            const hasSymptom = (data.q3_esso === 'OUI' || data.q4_claud === 'OUI');
            if (facteurs.count >= 2 && hasSymptom) {
                return '1ère consultation prioritaire';
            }
            
            // Sinon = Risque faible
            return '1ère consultation risque faible';
        },
        
        /**
         * Génère les notes Doctolib formatées
         */
        generateNotes: function(data, facteurs) {
            let notes = '';
            
            // En-tête patient
            notes += 'PATIENT : ' + data.age + ' ans - ' + data.sexe + ' - IMC: ' + data.imc;
            notes += ' (' + data.taille + 'cm, ' + data.poids + 'kg)\n';
            notes += 'Médecin adresseur : ' + data.medecin_adresseur + '\n';
            notes += 'Commune de Résidence : ' + data.commune + '\n';
            notes += 'Suivi cardiologue : ' + data.suivi_cardio;
            if (data.suivi_cardio === 'OUI' && data.nom_cardiologue) {
                notes += ' (' + data.nom_cardiologue + ')';
            }
            notes += '\n\n';
            
            // Antécédents
            notes += 'Antécédents : ';
            if (data.q1_atcd === 'OUI') {
                notes += 'OUI';
                if (data.q1_atcd_details) {
                    notes += '\n  ' + data.q1_atcd_details;
                }
            } else {
                notes += 'NON';
            }
            notes += '\n\n';
            
            // Symptômes
            notes += 'Symptômes : ';
            let symptoms = [];
            if (data.q2_dt === 'OUI') symptoms.push('Douleur thoracique (→ RDV PRIORITAIRE)');
            if (data.q3_esso === 'OUI') symptoms.push('Essoufflement');
            if (data.q4_claud === 'OUI') symptoms.push('Claudication');
            notes += symptoms.length > 0 ? symptoms.join(', ') : 'Aucun';
            notes += '\n\n';
            
            // Facteurs de risque
            notes += 'Facteurs de risque : (' + facteurs.count + ')\n';
            if (facteurs.count > 0) {
                facteurs.list.forEach(function(f) {
                    notes += '  • ' + f + '\n';
                });
            } else {
                notes += '  • Aucun\n';
            }
            
            return notes;
        }
    };
    
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
        
        $submitBtn.prop('disabled', true).text('⏳ Calcul en cours...');
        
        // Collecte médecin adresseur
        let medecinAdresseur = $('input[name="adresseur_type"]:checked').val();
        if (medecinAdresseur === 'Autre') {
            const nomAutre = $('input[name="adresseur_nom"]').val().trim();
            medecinAdresseur = nomAutre ? nomAutre : 'Autre (non précisé)';
        }
        
        // Collecte ATCD détails
        let atcdDetails = '';
        if ($('input[name="q1_atcd"]:checked').val() === 'OUI') {
            let atcdList = [];
            $('#q1-panel input[type="checkbox"]:checked').each(function() {
                const val = $(this).val();
                if ($(this).attr('name') === 'atcd_autre_check') {
                    const autreText = $('input[name="atcd_autre_text"]').val().trim();
                    if (autreText) atcdList.push('Autre : ' + autreText);
                } else {
                    atcdList.push(val);
                }
            });
            atcdDetails = atcdList.length > 0 ? atcdList.join(', ') : '';
        }
        
        // Collecte cardiologue
        let nomCardio = '';
        if ($('input[name="suivi_cardio"]:checked').val() === 'OUI') {
            const cardioType = $('input[name="cardio_type"]:checked').val();
            if (cardioType === 'Cabinet') {
                nomCardio = 'Cardiologue du cabinet';
            } else if (cardioType === 'Autre') {
                const nomAutre = $('input[name="cardio_nom"]').val().trim();
                nomCardio = nomAutre ? nomAutre : 'Autre (non précisé)';
            }
        }
        
        // Collecte données tabac
        let tabacCig = null, tabacAnnees = null, tabacPA = null;
        if ($('input[name="q7_tabac"]:checked').val() === 'OUI') {
            const cig = parseFloat($('#tabac-cig').val()) || 0;
            const ans = parseFloat($('#tabac-annees').val()) || 0;
            if (cig > 0 && ans > 0) {
                tabacCig = cig;
                tabacAnnees = ans;
                tabacPA = ((cig / 20) * ans).toFixed(1);
            }
        }
        
        // Construction objet données
        const formData = {
            age: $('input[name="age"]').val(),
            sexe: $('input[name="sexe"]:checked').val(),
            taille: $('input[name="taille"]').val(),
            poids: $('input[name="poids"]').val(),
            imc: (parseFloat($('input[name="poids"]').val()) / Math.pow(parseFloat($('input[name="taille"]').val()) / 100, 2)).toFixed(2),
            medecin_adresseur: medecinAdresseur,
            commune: $('input[name="commune"]').val(),
            suivi_cardio: $('input[name="suivi_cardio"]:checked').val(),
            nom_cardiologue: nomCardio,
            q1_atcd: $('input[name="q1_atcd"]:checked').val(),
            q1_atcd_details: atcdDetails,
            q2_dt: $('input[name="q2_dt"]:checked').val(),
            q3_esso: $('input[name="q3_esso"]:checked').val(),
            q4_claud: $('input[name="q4_claud"]:checked').val(),
            q5_diab: $('input[name="q5_diab"]:checked').val(),
            q6_hta: $('input[name="q6_hta"]:checked').val(),
            q7_tabac: $('input[name="q7_tabac"]:checked').val(),
            q7_tabac_cigarettes: tabacCig,
            q7_tabac_annees: tabacAnnees,
            q7_tabac_pa: tabacPA,
            q8_chol: $('input[name="q8_chol"]:checked').val(),
            tabacPA: tabacPA
        };
        
        // Calcul qualification
        const facteurs = business.countFacteurs(formData);
        const typeRDV = business.determineRDV(formData, facteurs);
        const notesDoctolib = business.generateNotes(formData, facteurs);
        
        // Affichage résultat
        $rdvValue.text(typeRDV);
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
                action: 'qc_submit',
                nonce: config.nonce,
                website: $('input[name="website"]').val(),
                data: JSON.stringify({
                    age: formData.age,
                    sexe: formData.sexe,
                    taille: formData.taille,
                    poids: formData.poids,
                    imc: formData.imc,
                    medecin_adresseur: formData.medecin_adresseur,
                    commune: formData.commune,
                    suivi_cardio: formData.suivi_cardio,
                    nom_cardiologue: formData.nom_cardiologue,
                    q1_atcd: formData.q1_atcd,
                    q1_atcd_details: formData.q1_atcd_details,
                    q2_dt: formData.q2_dt,
                    q3_esso: formData.q3_esso,
                    q4_claud: formData.q4_claud,
                    q5_diab: formData.q5_diab,
                    q6_hta: formData.q6_hta,
                    q7_tabac: formData.q7_tabac,
                    q7_tabac_cigarettes: formData.q7_tabac_cigarettes,
                    q7_tabac_annees: formData.q7_tabac_annees,
                    q7_tabac_pa: formData.q7_tabac_pa,
                    q8_chol: formData.q8_chol,
                    nb_facteurs: facteurs.count,
                    type_rdv: typeRDV,
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
                $submitBtn.prop('disabled', false).text('🚀 Calculer et déterminer le RDV');
                $form.data('submitting', false);
            }
        });
    });
    
    // ============================================
    // BOUTONS RESET / NOUVELLE QUALIF / COPIE
    // ============================================
    $('#qc-reset').on('click', function() {
        if (confirm('Réinitialiser le formulaire ?')) {
            $form[0].reset();
            $result.fadeOut();
            $formContainer.fadeIn();
            $alert.hide();
            $('.qc-panel').hide();
            $('#cardio-field, #adresseur-autre-field').hide();
            $('#pa-result').hide();
            $('.qc-radio-item').removeClass('selected');
            $('body').css('overflow', '');
            $('html, body').animate({ scrollTop: 0 }, 500);
            utils.showAlert('✅ Prêt pour nouvelle qualification', 'success');
        }
    });
    
    $('#qc-new-qualif').on('click', function() {
        $result.fadeOut(300, function() {
            $form[0].reset();
            $('.qc-panel').hide();
            $('#cardio-field, #adresseur-autre-field').hide();
            $('#pa-result').hide();
            $('.qc-radio-item').removeClass('selected');
            $alert.hide();
            $formContainer.fadeIn(400);
            $('body').css('overflow', '');
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    });
    
    $('#qc-copy').on('click', function() {
        const text = $notes.text();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                $('#qc-copy').text('✓ Copié !');
                setTimeout(function() { $('#qc-copy').text('📋 Copier'); }, 2500);
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

add_shortcode('qualif_cardio', 'qc_shortcode');