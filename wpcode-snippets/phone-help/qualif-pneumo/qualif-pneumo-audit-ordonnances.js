/**
 * Snippet ID: 13
 * Name: Qualif Pneumo Audit Ordonnances
 * Modified: 2025-11-19 12:47:43
 * Active: True
 * Source: qualif-pneumo-audit-ordonnances_code-snippets.json
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * QUALIF PNEUMO ORDONNANCES - AUDIT v1.0
 * ═══════════════════════════════════════════════════════════════
 * 
 * 📋 Shortcode : [qualif_pneumo_ordonnances_audit]
 * 🔍 Recherche par date et/ou heure
 * 🔐 Protégé par mot de passe WordPress
 * 🔎 Zoom intelligent avec localStorage
 * 
 * ═══════════════════════════════════════════════════════════════
 */

if (!function_exists('qpo_audit_shortcode')) {
    function qpo_audit_shortcode() {
        global $wpdb;
        $config = qpo_get_config();
        $table = $wpdb->prefix . $config['table_bdd'];
        
        // Recherche
        $results = array();
        $search_date = '';
        $search_time = '';
        
        if (isset($_POST['qpo_audit_search'])) {
            $search_date = sanitize_text_field($_POST['search_date']);
            $search_time = sanitize_text_field($_POST['search_time']);
            
            if ($search_time) {
                $datetime_start = $search_date . ' ' . $search_time . ':00';
                $datetime_end = $search_date . ' ' . $search_time . ':59';
                $results = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM $table WHERE created_at BETWEEN %s AND %s ORDER BY created_at DESC",
                    $datetime_start,
                    $datetime_end
                ));
            } else {
                $date_start = $search_date . ' 00:00:00';
                $date_end = $search_date . ' 23:59:59';
                $results = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM $table WHERE created_at BETWEEN %s AND %s ORDER BY created_at DESC",
                    $date_start,
                    $date_end
                ));
            }
        }
        
        ob_start();
        ?>
        <style>
            .qpo-audit-wrapper {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: zoom 0.2s ease;
                position: relative;
            }
            
            /* ZOOM */
            .qpo-audit-zoom-controls {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                border: 3px solid <?php echo $config['couleur_primaire']; ?>;
            }
            
            .qpo-audit-zoom-btn {
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
            }
            
            .qpo-audit-zoom-btn:hover {
                transform: scale(1.1);
            }
            
            .qpo-audit-zoom-value {
                text-align: center;
                font-size: 13px;
                font-weight: 800;
                color: <?php echo $config['couleur_primaire']; ?>;
                padding: 4px 0;
                cursor: pointer;
            }
            
            .qpo-audit-header {
                background: linear-gradient(135deg, <?php echo $config['couleur_primaire']; ?>, <?php echo $config['couleur_secondaire']; ?>);
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .qpo-audit-title {
                margin: 0;
                font-size: 28px;
                color: white;
                font-weight: 700;
            }
            .qpo-audit-subtitle {
                margin: 8px 0 0 0;
                font-size: 14px;
                color: rgba(255,255,255,0.9);
            }
            .qpo-audit-search-form {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                margin-bottom: 30px;
            }
            .qpo-audit-search-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 200px;
                gap: 15px;
                align-items: end;
            }
            .qpo-audit-field {
                display: flex;
                flex-direction: column;
            }
            .qpo-audit-label {
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 6px;
                text-transform: uppercase;
            }
            .qpo-audit-input {
                padding: 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 15px;
            }
            .qpo-audit-input:focus {
                outline: none;
                border-color: <?php echo $config['couleur_primaire']; ?>;
            }
            .qpo-audit-btn {
                padding: 12px 24px;
                background: <?php echo $config['couleur_primaire']; ?>;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
            }
            .qpo-audit-btn:hover {
                background: <?php echo $config['couleur_secondaire']; ?>;
                transform: translateY(-2px);
            }
            .qpo-audit-results {
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
            .qpo-audit-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                overflow: hidden;
            }
            .qpo-audit-card-header {
                background: <?php echo $config['couleur_primaire']; ?>;
                color: white;
                padding: 18px 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .qpo-audit-card-time {
                font-size: 18px;
                font-weight: 700;
            }
            .qpo-audit-card-id {
                font-size: 13px;
                opacity: 0.9;
            }
            .qpo-audit-card-body {
                padding: 25px;
            }
            .qpo-audit-section {
                margin-bottom: 20px;
            }
            .qpo-audit-section-title {
                font-size: 16px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e2e8f0;
            }
            .qpo-audit-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .qpo-audit-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .qpo-audit-item-label {
                font-size: 12px;
                color: #64748b;
                font-weight: 600;
                text-transform: uppercase;
            }
            .qpo-audit-item-value {
                font-size: 15px;
                color: #1e293b;
                font-weight: 600;
            }
            .qpo-audit-notes-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #e2e8f0;
            }
            .qpo-audit-notes-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .qpo-audit-notes-title {
                font-size: 16px;
                font-weight: 700;
                color: <?php echo $config['couleur_primaire']; ?>;
                text-transform: uppercase;
            }
            .qpo-audit-copy-btn {
                padding: 10px 20px;
                background: <?php echo $config['couleur_primaire']; ?>;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }
            .qpo-audit-notes {
                background: #f8fafc;
                border: 2px solid #cbd5e1;
                border-radius: 8px;
                padding: 18px;
                white-space: pre-wrap;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.7;
                color: #1e293b;
                font-weight: 600;
            }
            .qpo-audit-no-results {
                text-align: center;
                padding: 40px;
                background: #f8fafc;
                border-radius: 12px;
                color: #64748b;
                font-size: 16px;
            }
        </style>

        <div class="qpo-audit-wrapper" id="qpo-audit-wrapper">
            <div class="qpo-audit-zoom-controls">
                <button type="button" class="qpo-audit-zoom-btn" id="qpo-audit-zoom-plus">+</button>
                <div class="qpo-audit-zoom-value" id="qpo-audit-zoom-display">90%</div>
                <button type="button" class="qpo-audit-zoom-btn" id="qpo-audit-zoom-minus">−</button>
            </div>
            
            <div class="qpo-audit-header">
                <h1 class="qpo-audit-title">🔍 Audit Demandes Pneumo</h1>
                <p class="qpo-audit-subtitle">Recherche et consultation des demandes enregistrées</p>
            </div>
            
            <div class="qpo-audit-search-form">
                <form method="POST">
                    <div class="qpo-audit-search-grid">
                        <div class="qpo-audit-field">
                            <label class="qpo-audit-label">📅 Date</label>
                            <input type="date" name="search_date" class="qpo-audit-input" 
                                   value="<?php echo $search_date ? $search_date : date('Y-m-d'); ?>" required>
                        </div>
                        <div class="qpo-audit-field">
                            <label class="qpo-audit-label">🕐 Heure (optionnel)</label>
                            <input type="time" name="search_time" class="qpo-audit-input" 
                                   value="<?php echo $search_time; ?>">
                        </div>
                        <div class="qpo-audit-field">
                            <label class="qpo-audit-label">&nbsp;</label>
                            <button type="submit" name="qpo_audit_search" class="qpo-audit-btn">
                                🔍 Rechercher
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <?php if (isset($_POST['qpo_audit_search'])): ?>
                <?php if (empty($results)): ?>
                    <div class="qpo-audit-no-results">
                        Aucune demande trouvée pour cette date/heure.
                    </div>
                <?php else: ?>
                    <div class="qpo-audit-results">
                        <?php foreach ($results as $r): ?>
                            <div class="qpo-audit-card">
                                <div class="qpo-audit-card-header">
                                    <div class="qpo-audit-card-time">
                                        ⏰ <?php echo date('H:i:s', strtotime($r->created_at)); ?>
                                    </div>
                                    <div class="qpo-audit-card-id">
                                        ID #<?php echo $r->id; ?>
                                    </div>
                                </div>
                                
                                <div class="qpo-audit-card-body">
                                    <div class="qpo-audit-section">
                                        <div class="qpo-audit-section-title">📋 Informations</div>
                                        <div class="qpo-audit-grid">
                                            <div class="qpo-audit-item">
                                                <span class="qpo-audit-item-label">Médecin</span>
                                                <span class="qpo-audit-item-value"><?php echo $r->medecin_destinataire; ?></span>
                                            </div>
                                            <div class="qpo-audit-item">
                                                <span class="qpo-audit-item-label">Type</span>
                                                <span class="qpo-audit-item-value"><?php echo $r->type_demande; ?></span>
                                            </div>
                                            <div class="qpo-audit-item">
                                                <span class="qpo-audit-item-label">Motif</span>
                                                <span class="qpo-audit-item-value"><?php echo $r->motif_demande; ?></span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="qpo-audit-notes-section">
                                        <div class="qpo-audit-notes-header">
                                            <h3 class="qpo-audit-notes-title">📋 Email envoyé</h3>
                                            <button type="button" class="qpo-audit-copy-btn" onclick="copyNotes<?php echo $r->id; ?>()">
                                                📋 Copier
                                            </button>
                                        </div>
                                        <pre id="notes-<?php echo $r->id; ?>" class="qpo-audit-notes"><?php echo esc_html($r->notes_email); ?></pre>
                                        <script>
                                        function copyNotes<?php echo $r->id; ?>() {
                                            const text = document.getElementById('notes-<?php echo $r->id; ?>').textContent;
                                            navigator.clipboard.writeText(text).then(function() {
                                                alert('✅ Notes copiées !');
                                            });
                                        }
                                        </script>
                                    </div>
                                    
                                    <?php if ($r->email_sent): ?>
                                        <div style="margin-top: 15px; padding: 10px; background: #d1fae5; border-radius: 6px; font-size: 12px; color: #065f46;">
                                            ✅ Email envoyé le <?php echo date('d/m/Y à H:i', strtotime($r->email_sent_at)); ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        
        <script>
        (function() {
            'use strict';
            const STORAGE_KEY = 'qualif_pneumo_ordonnances_audit_zoom';
            let currentZoom = parseFloat(localStorage.getItem(STORAGE_KEY)) || 0.9;
            
            function updateZoom(newZoom) {
                currentZoom = Math.max(0.5, Math.min(1.5, newZoom));
                document.getElementById('qpo-audit-wrapper').style.zoom = currentZoom;
                document.getElementById('qpo-audit-zoom-display').textContent = Math.round(currentZoom * 100) + '%';
                localStorage.setItem(STORAGE_KEY, currentZoom);
            }
            
            updateZoom(currentZoom);
            
            document.getElementById('qpo-audit-zoom-plus').addEventListener('click', function() {
                updateZoom(currentZoom + 0.1);
            });
            
            document.getElementById('qpo-audit-zoom-minus').addEventListener('click', function() {
                updateZoom(currentZoom - 0.1);
            });
            
            document.getElementById('qpo-audit-zoom-display').addEventListener('dblclick', function() {
                updateZoom(0.9);
            });
        })();
        </script>
        <?php
        return ob_get_clean();
    }
}

add_shortcode('qualif_pneumo_ordonnances_audit', 'qpo_audit_shortcode');