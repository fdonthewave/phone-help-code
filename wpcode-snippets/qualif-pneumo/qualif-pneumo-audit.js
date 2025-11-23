/**
 * Snippet ID: 11
 * Name: Qualif Pneumo Audit
 * Modified: 2025-11-10 16:25:06
 * Active: True
 * Source: qualif-pneumo-audit_code-snippets.json
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * QUALIF PNEUMO AUDIT - VERSION 1.0
 * ═══════════════════════════════════════════════════════════════
 * 
 * Outil de recherche et audit des qualifications pneumologie
 * Permet de retrouver les qualifications et croiser avec Callibri
 * 
 * SHORTCODE : [pneumo_audit]
 * TABLE BDD : qualif_pneumo_amiotsimion
 * 
 * ═══════════════════════════════════════════════════════════════
 */

// Sécurité WordPress
if (!defined('ABSPATH')) exit;

// ═════════════════════════════════════════════════════════════════
// TRAITEMENT AJAX RECHERCHE
// ═════════════════════════════════════════════════════════════════

add_action('wp_ajax_pneumo_audit_search', 'qp_audit_search');
add_action('wp_ajax_nopriv_pneumo_audit_search', 'qp_audit_search');

function qp_audit_search() {
    global $wpdb;
    
    // Vérification nonce
    if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'pneumo_audit_nonce')) {
        wp_send_json_error('Sécurité : requête invalide');
    }
    
    $table_name = $wpdb->prefix . 'qualif_pneumo_amiotsimion';
    
    // Vérifier que la table existe
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        wp_send_json_error('Table non trouvée. Aucune qualification enregistrée.');
    }
    
    $search_type = sanitize_text_field($_POST['search_type']);
    $search_value = sanitize_text_field($_POST['search_value']);
    
    if (empty($search_value)) {
        wp_send_json_error('Veuillez saisir un critère de recherche');
    }
    
    // Construction de la requête selon le type
    switch ($search_type) {
        case 'nom':
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table_name WHERE nom LIKE %s ORDER BY timestamp DESC LIMIT 50",
                '%' . $wpdb->esc_like($search_value) . '%'
            ));
            break;
            
        case 'prenom':
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table_name WHERE prenom LIKE %s ORDER BY timestamp DESC LIMIT 50",
                '%' . $wpdb->esc_like($search_value) . '%'
            ));
            break;
            
        case 'telephone':
            // Nettoyer le numéro (enlever espaces, points, tirets)
            $clean_phone = preg_replace('/[^0-9]/', '', $search_value);
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table_name WHERE REPLACE(REPLACE(REPLACE(telephone, ' ', ''), '.', ''), '-', '') LIKE %s ORDER BY timestamp DESC LIMIT 50",
                '%' . $wpdb->esc_like($clean_phone) . '%'
            ));
            break;
            
        case 'date':
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table_name WHERE DATE(timestamp) = %s ORDER BY timestamp DESC",
                $search_value
            ));
            break;
            
        default:
            wp_send_json_error('Type de recherche invalide');
    }
    
    if (empty($results)) {
        wp_send_json_error('Aucun résultat trouvé');
    }
    
    wp_send_json_success($results);
}

// ═════════════════════════════════════════════════════════════════
// SHORTCODE INTERFACE AUDIT
// ═════════════════════════════════════════════════════════════════

add_shortcode('pneumo_audit', 'qp_audit_render');

function qp_audit_render() {
    $nonce = wp_create_nonce('pneumo_audit_nonce');
    
    ob_start();
    ?>
    
    <style>
        /* Zoom par défaut */
        body.audit-pneumo-page { zoom: 0.7; }
        
        .qpa-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .qpa-header {
            background: linear-gradient(135deg, #20B2AA 0%, #008B8B 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .qpa-header h2 {
            margin: 0;
            font-size: 28px;
        }
        
        .qpa-header p {
            margin: 8px 0 0 0;
            opacity: 0.95;
        }
        
        .qpa-search-box {
            background: #f8fafc;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 2px solid #20B2AA;
        }
        
        .qpa-search-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .qpa-search-row {
            display: flex;
            gap: 15px;
            align-items: flex-end;
        }
        
        .qpa-field {
            flex: 1;
        }
        
        .qpa-label {
            display: block;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .qpa-input, .qpa-select {
            width: 100%;
            padding: 12px;
            border: 2px solid #cbd5e1;
            border-radius: 6px;
            font-size: 15px;
        }
        
        .qpa-input:focus, .qpa-select:focus {
            outline: none;
            border-color: #20B2AA;
        }
        
        .qpa-search-btn {
            padding: 12px 30px;
            background: linear-gradient(135deg, #20B2AA 0%, #008B8B 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .qpa-search-btn:hover {
            transform: translateY(-2px);
        }
        
        .qpa-search-btn:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            transform: none;
        }
        
        .qpa-loading {
            display: none;
            text-align: center;
            padding: 40px;
        }
        
        .qpa-loading.active {
            display: block;
        }
        
        .qpa-spinner {
            border: 4px solid #f3f4f6;
            border-top: 4px solid #20B2AA;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: qpa-spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes qpa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .qpa-results {
            display: none;
        }
        
        .qpa-results.visible {
            display: block;
        }
        
        .qpa-results-header {
            background: #e0f2f1;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .qpa-results-count {
            font-weight: bold;
            color: #1e293b;
            font-size: 16px;
        }
        
        .qpa-result-card {
            background: white;
            border: 2px solid #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            transition: border-color 0.2s;
        }
        
        .qpa-result-card:hover {
            border-color: #20B2AA;
        }
        
        .qpa-result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .qpa-result-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
        }
        
        .qpa-result-date {
            color: #64748b;
            font-size: 14px;
        }
        
        .qpa-result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .qpa-result-item {
            background: #f8fafc;
            padding: 12px;
            border-radius: 6px;
        }
        
        .qpa-result-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .qpa-result-value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 500;
        }
        
        .qpa-notes-section {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
        }
        
        .qpa-notes-title {
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
        }
        
        .qpa-notes-content {
            background: white;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .qpa-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .qpa-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        
        .qpa-btn:hover {
            transform: translateY(-2px);
        }
        
        .qpa-btn-callibri {
            background: #3b82f6;
            color: white;
        }
        
        .qpa-btn-copy {
            background: #20B2AA;
            color: white;
        }
        
        .qpa-error {
            background: #fee2e2;
            border: 2px solid #ef4444;
            padding: 20px;
            border-radius: 8px;
            color: #991b1b;
            display: none;
        }
        
        .qpa-error.visible {
            display: block;
        }
        
        .qpa-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .qpa-badge-oui {
            background: #dcfce7;
            color: #166534;
        }
        
        .qpa-badge-non {
            background: #fee2e2;
            color: #991b1b;
        }
    </style>
    
    <div class="qpa-container">
        <div class="qpa-header">
            <h2>🔍 Audit Qualifications Pneumologie</h2>
            <p>Recherche et consultation des qualifications enregistrées</p>
        </div>
        
        <div class="qpa-search-box">
            <div class="qpa-search-title">📋 Rechercher une qualification</div>
            
            <form id="audit-search-form">
                <div class="qpa-search-row">
                    <div class="qpa-field">
                        <label class="qpa-label">Type de recherche</label>
                        <select name="search_type" id="search-type" class="qpa-select" required>
                            <option value="nom">Nom</option>
                            <option value="prenom">Prénom</option>
                            <option value="telephone">Téléphone</option>
                            <option value="date">Date (AAAA-MM-JJ)</option>
                        </select>
                    </div>
                    
                    <div class="qpa-field">
                        <label class="qpa-label">Valeur recherchée</label>
                        <input type="text" name="search_value" id="search-value" class="qpa-input" placeholder="Ex: Dupont, 0612345678, 2024-10-21" required>
                    </div>
                    
                    <button type="submit" class="qpa-search-btn">
                        🔍 Rechercher
                    </button>
                </div>
            </form>
        </div>
        
        <div class="qpa-loading" id="loading">
            <div class="qpa-spinner"></div>
            <p>Recherche en cours...</p>
        </div>
        
        <div class="qpa-error" id="error"></div>
        
        <div class="qpa-results" id="results">
            <div class="qpa-results-header">
                <div class="qpa-results-count" id="results-count"></div>
            </div>
            <div id="results-list"></div>
        </div>
    </div>
    
    <script>
    jQuery(document).ready(function($) {
        // Appliquer le zoom
        $('body').addClass('audit-pneumo-page');
        
        // Helper pour formater la date
        function formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Helper pour générer URL Callibri
        function getCallibriUrl(telephone, timestamp) {
            const date = new Date(timestamp);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            // Nettoyer le téléphone
            const cleanPhone = telephone.replace(/[^0-9]/g, '');
            
            return `https://app.callibri.io/search?phone=${cleanPhone}&date_from=${day}.${month}.${year}&date_to=${day}.${month}.${year}`;
        }
        
        // Afficher les résultats
        function displayResults(data) {
            let html = '';
            
            data.forEach(function(row) {
                const callibriUrl = getCallibriUrl(row.telephone, row.timestamp);
                
                html += `
                <div class="qpa-result-card">
                    <div class="qpa-result-header">
                        <div class="qpa-result-title">
                            ${row.prenom} ${row.nom}
                        </div>
                        <div class="qpa-result-date">
                            📅 ${formatDate(row.timestamp)}
                        </div>
                    </div>
                    
                    <div class="qpa-result-grid">
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">📞 Téléphone</div>
                            <div class="qpa-result-value">${row.telephone}</div>
                        </div>
                        
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">🎂 Age</div>
                            <div class="qpa-result-value">${row.age} ans</div>
                        </div>
                        
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">👨‍⚕️ Médecin</div>
                            <div class="qpa-result-value">${row.medecin}</div>
                        </div>
                        
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">📅 Type RDV</div>
                            <div class="qpa-result-value">${row.type_rdv}</div>
                        </div>
                    </div>
                    
                    <div class="qpa-result-grid" style="margin-top: 15px;">
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">🫁 Toux</div>
                            <div class="qpa-result-value">
                                <span class="qpa-badge qpa-badge-${row.toux}">${row.toux.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">💧 Crachats</div>
                            <div class="qpa-result-value">
                                <span class="qpa-badge qpa-badge-${row.crachats}">${row.crachats.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <div class="qpa-result-item">
                            <div class="qpa-result-label">🚬 Fumeur</div>
                            <div class="qpa-result-value">
                                <span class="qpa-badge qpa-badge-${row.fumeur}">${row.fumeur.toUpperCase()}</span>
                                ${row.fumeur === 'oui' && row.fumeur_pa ? ' - ' + row.fumeur_pa + ' PA' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="qpa-notes-section">
                        <div class="qpa-notes-title">📋 Notes Doctolib</div>
                        <div class="qpa-notes-content" id="notes-${row.id}">${row.notes_doctolib}</div>
                    </div>
                    
                    <div class="qpa-actions">
                        <a href="${callibriUrl}" target="_blank" class="qpa-btn qpa-btn-callibri">
                            📞 Ouvrir dans Callibri
                        </a>
                        <button onclick="copyNotes(${row.id})" class="qpa-btn qpa-btn-copy">
                            📋 Copier les notes
                        </button>
                    </div>
                </div>
                `;
            });
            
            $('#results-list').html(html);
            $('#results-count').text(`🎯 ${data.length} résultat(s) trouvé(s)`);
            $('#results').addClass('visible');
        }
        
        // Soumission du formulaire
        $('#audit-search-form').on('submit', function(e) {
            e.preventDefault();
            
            $('#loading').addClass('active');
            $('#error').removeClass('visible');
            $('#results').removeClass('visible');
            $('.qpa-search-btn').prop('disabled', true);
            
            const formData = $(this).serialize();
            
            $.ajax({
                url: '<?php echo admin_url('admin-ajax.php'); ?>',
                type: 'POST',
                data: formData + '&action=pneumo_audit_search&nonce=<?php echo $nonce; ?>',
                success: function(response) {
                    $('#loading').removeClass('active');
                    $('.qpa-search-btn').prop('disabled', false);
                    
                    if (response.success) {
                        displayResults(response.data);
                    } else {
                        $('#error').addClass('visible').html(
                            '<strong>❌ Aucun résultat</strong><br>' + response.data
                        );
                    }
                },
                error: function() {
                    $('#loading').removeClass('active');
                    $('.qpa-search-btn').prop('disabled', false);
                    $('#error').addClass('visible').html(
                        '<strong>❌ Erreur</strong><br>Erreur de connexion au serveur'
                    );
                }
            });
        });
    });
    
    function copyNotes(id) {
        const notesElement = document.getElementById('notes-' + id);
        const textarea = document.createElement('textarea');
        textarea.value = notesElement.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copié !';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }
    </script>
    
    <?php
    return ob_get_clean();
}