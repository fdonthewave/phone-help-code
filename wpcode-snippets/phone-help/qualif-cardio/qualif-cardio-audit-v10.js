/**
 * Snippet ID: 7
 * Name: Qualif Cardio Audit v1.0
 * Modified: 2025-10-13 20:28:08
 * Active: True
 * Source: qualif-cardio-audit-v1_0_code-snippets__1_.json
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * QUALIF CARDIO - AUDIT v2.0 AVEC ZOOM INTELLIGENT
 * ═══════════════════════════════════════════════════════════════
 * 
 * 📋 Shortcode : [qualif_audit]
 * 🔍 Page de recherche/audit des qualifications
 * 🔐 Protégée par mot de passe WordPress (natif)
 * 🔍 Zoom intelligent avec localStorage
 * 
 * FONCTION :
 * - Recherche par date et/ou heure
 * - Affiche TOUTES les infos de la qualification
 * - Bouton copier notes Doctolib
 * - Pour audit/réécoute appels Callibri
 * - Zoom adaptatif + sauvegarde préférence
 * 
 * ═══════════════════════════════════════════════════════════════
 */

// Shortcode [qualif_audit]
if (!function_exists('qc_audit_shortcode')) {
    function qc_audit_shortcode() {
        // Protection par mot de passe WordPress (géré par WP lui-même)
        
        global $wpdb;
        $table = $wpdb->prefix . 'qualif_cardio_complete';
        $config = qc_get_config();
        
        // Recherche
        $results = array();
        $search_date = '';
        $search_time = '';
        
        if (isset($_POST['qc_audit_search'])) {
            $search_date = sanitize_text_field($_POST['search_date']);
            $search_time = sanitize_text_field($_POST['search_time']);
            
            if ($search_time) {
                // Recherche précise avec heure
                $datetime_start = $search_date . ' ' . $search_time . ':00';
                $datetime_end = $search_date . ' ' . $search_time . ':59';
                $results = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM $table WHERE created_at BETWEEN %s AND %s ORDER BY created_at DESC",
                    $datetime_start,
                    $datetime_end
                ));
            } else {
                // Recherche par date uniquement
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
            .qc-audit-wrapper {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: zoom 0.2s ease;
                position: relative;
            }
            
            /* ============================================ */
            /* CONTRÔLES ZOOM */
            /* ============================================ */
            .qc-audit-zoom-controls {
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
            
            .qc-audit-zoom-btn {
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
            
            .qc-audit-zoom-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(5, 150, 222, 0.5);
            }
            
            .qc-audit-zoom-btn:active {
                transform: scale(0.95);
            }
            
            .qc-audit-zoom-value {
                text-align: center;
                font-size: 13px;
                font-weight: 800;
                color: <?php echo $config['couleur_primaire']; ?>;
                padding: 4px 0;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .qc-audit-zoom-value:hover {
                color: <?php echo $config['couleur_secondaire']; ?>;
                text-decoration: underline;
            }
            /* ============================================ */
            
            .qc-audit-header {
                background: linear-gradient(135deg, <?php echo $config['couleur_primaire']; ?>, <?php echo $config['couleur_secondaire']; ?>);
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .qc-audit-title {
                margin: 0;
                font-size: 28px;
                color: white;
                font-weight: 700;
            }
            .qc-audit-subtitle {
                margin: 8px 0 0 0;
                font-size: 14px;
                color: rgba(255,255,255,0.9);
            }
            .qc-audit-search-form {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                margin-bottom: 30px;
            }
            .qc-audit-search-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 200px;
                gap: 15px;
                align-items: end;
            }
            .qc-audit-field {
                display: flex;
                flex-direction: column;
            }
            .qc-audit-label {
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .qc-audit-input {
                padding: 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 15px;
                transition: all 0.2s;
            }
            .qc-audit-input:focus {
                outline: none;
                border-color: <?php echo $config['couleur_primaire']; ?>;
            }
            .qc-audit-btn {
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
            .qc-audit-btn:hover {
                background: <?php echo $config['couleur_secondaire']; ?>;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .qc-audit-results {
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
            .qc-audit-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                overflow: hidden;
            }
            .qc-audit-card-header {
                background: <?php echo $config['couleur_primaire']; ?>;
                color: white;
                padding: 18px 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .qc-audit-card-time {
                font-size: 18px;
                font-weight: 700;
            }
            .qc-audit-card-id {
                font-size: 13px;
                opacity: 0.9;
            }
            .qc-audit-card-body {
                padding: 25px;
            }
            .qc-audit-section {
                margin-bottom: 25px;
            }
            .qc-audit-section:last-child {
                margin-bottom: 0;
            }
            .qc-audit-section-title {
                font-size: 16px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e2e8f0;
            }
            .qc-audit-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .qc-audit-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .qc-audit-item-label {
                font-size: 12px;
                color: #64748b;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .qc-audit-item-value {
                font-size: 15px;
                color: #1e293b;
                font-weight: 600;
            }
            .qc-audit-rdv-type {
                display: inline-block;
                padding: 8px 16px;
                background: #fef3c7;
                border: 2px solid #fbbf24;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 700;
                color: #92400e;
                text-transform: uppercase;
            }
            .qc-audit-questions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .qc-audit-q {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: #f8fafc;
                border-radius: 6px;
            }
            .qc-audit-q-label {
                font-size: 14px;
                color: #475569;
                font-weight: 600;
            }
            .qc-audit-q-value {
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 700;
            }
            .qc-audit-q-value.yes {
                background: #dcfce7;
                color: #166534;
            }
            .qc-audit-q-value.no {
                background: #fee2e2;
                color: #991b1b;
            }
            .qc-audit-notes-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #e2e8f0;
            }
            .qc-audit-notes-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            .qc-audit-notes-title {
                font-size: 16px;
                font-weight: 700;
                color: <?php echo $config['couleur_primaire']; ?>;
                text-transform: uppercase;
            }
            .qc-audit-copy-btn {
                padding: 10px 20px;
                background: <?php echo $config['couleur_primaire']; ?>;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
            }
            .qc-audit-copy-btn:hover {
                background: <?php echo $config['couleur_secondaire']; ?>;
                transform: translateY(-2px);
            }
            .qc-audit-notes {
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
            .qc-audit-no-results {
                text-align: center;
                padding: 40px;
                background: #f8fafc;
                border-radius: 12px;
                color: #64748b;
                font-size: 16px;
            }
            @media (max-width: 768px) {
                .qc-audit-search-grid {
                    grid-template-columns: 1fr;
                }
                .qc-audit-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <div class="qc-audit-wrapper" id="qc-audit-wrapper">
            <!-- ============================================ -->
            <!-- CONTRÔLES ZOOM -->
            <!-- ============================================ -->
            <div class="qc-audit-zoom-controls">
                <button type="button" class="qc-audit-zoom-btn" id="qc-audit-zoom-plus" title="Zoomer (Ctrl +)">+</button>
                <div class="qc-audit-zoom-value" id="qc-audit-zoom-display" title="Double-clic pour réinitialiser">90%</div>
                <button type="button" class="qc-audit-zoom-btn" id="qc-audit-zoom-minus" title="Dézoomer (Ctrl -)">−</button>
            </div>
            
            <div class="qc-audit-header">
                <h1 class="qc-audit-title">🔍 Audit Qualifications</h1>
                <p class="qc-audit-subtitle">Recherche et consultation des qualifications enregistrées</p>
            </div>
            
            <div class="qc-audit-search-form">
                <form method="POST">
                    <div class="qc-audit-search-grid">
                        <div class="qc-audit-field">
                            <label class="qc-audit-label">📅 Date</label>
                            <input type="date" name="search_date" class="qc-audit-input" 
                                   value="<?php echo $search_date ? $search_date : date('Y-m-d'); ?>" required>
                        </div>
                        <div class="qc-audit-field">
                            <label class="qc-audit-label">🕐 Heure (optionnel)</label>
                            <input type="time" name="search_time" class="qc-audit-input" 
                                   value="<?php echo $search_time; ?>" placeholder="Ex: 15:21">
                        </div>
                        <div class="qc-audit-field">
                            <label class="qc-audit-label">&nbsp;</label>
                            <button type="submit" name="qc_audit_search" class="qc-audit-btn">
                                🔍 Rechercher
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <?php if (isset($_POST['qc_audit_search'])): ?>
                <?php if (empty($results)): ?>
                    <div class="qc-audit-no-results">
                        Aucune qualification trouvée pour cette date/heure.
                    </div>
                <?php else: ?>
                    <div class="qc-audit-results">
                        <?php foreach ($results as $r): ?>
                            <div class="qc-audit-card">
                                <div class="qc-audit-card-header">
                                    <div class="qc-audit-card-time">
                                        ⏰ <?php echo date('H:i:s', strtotime($r->created_at)); ?>
                                    </div>
                                    <div class="qc-audit-card-id">
                                        ID #<?php echo $r->id; ?>
                                    </div>
                                </div>
                                
                                <div class="qc-audit-card-body">
                                    <div class="qc-audit-section">
                                        <div class="qc-audit-section-title">👤 Patient</div>
                                        <div class="qc-audit-grid">
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Âge</span>
                                                <span class="qc-audit-item-value"><?php echo $r->age; ?> ans</span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Sexe</span>
                                                <span class="qc-audit-item-value"><?php echo $r->sexe; ?></span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Taille</span>
                                                <span class="qc-audit-item-value"><?php echo $r->taille; ?> cm</span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Poids</span>
                                                <span class="qc-audit-item-value"><?php echo $r->poids; ?> kg</span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">IMC</span>
                                                <span class="qc-audit-item-value"><?php echo number_format($r->imc, 1); ?></span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Médecin adresseur</span>
                                                <span class="qc-audit-item-value"><?php echo $r->medecin_adresseur; ?></span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Commune</span>
                                                <span class="qc-audit-item-value"><?php echo $r->commune; ?></span>
                                            </div>
                                            <div class="qc-audit-item">
                                                <span class="qc-audit-item-label">Suivi cardio</span>
                                                <span class="qc-audit-item-value"><?php echo $r->suivi_cardio; ?></span>
                                            </div>
                                            <?php if ($r->nom_cardiologue): ?>
                                                <div class="qc-audit-item">
                                                    <span class="qc-audit-item-label">Cardiologue</span>
                                                    <span class="qc-audit-item-value"><?php echo $r->nom_cardiologue; ?></span>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                    
                                    <div class="qc-audit-section">
                                        <div class="qc-audit-section-title">📋 Type de RDV</div>
                                        <div class="qc-audit-rdv-type">
                                            <?php echo $r->type_rdv; ?>
                                        </div>
                                    </div>
                                    
                                    <div class="qc-audit-section">
                                        <div class="qc-audit-section-title">🩺 Questions</div>
                                        <div class="qc-audit-questions">
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q1. Antécédents CV</span>
                                                <span class="qc-audit-q-value <?php echo $r->q1_atcd == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q1_atcd; ?>
                                                    <?php if ($r->q1_atcd_details): ?>
                                                        <span style="font-size:12px;"> (<?php echo $r->q1_atcd_details; ?>)</span>
                                                    <?php endif; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q2. Douleur thoracique</span>
                                                <span class="qc-audit-q-value <?php echo $r->q2_douleur_thoracique != 'NON' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q2_douleur_thoracique; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q3. Essoufflement</span>
                                                <span class="qc-audit-q-value <?php echo $r->q3_essoufflement == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q3_essoufflement; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q4. Claudication</span>
                                                <span class="qc-audit-q-value <?php echo $r->q4_claudication == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q4_claudication; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q5. Diabète</span>
                                                <span class="qc-audit-q-value <?php echo $r->q5_diabete == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q5_diabete; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q6. HTA</span>
                                                <span class="qc-audit-q-value <?php echo $r->q6_hta == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q6_hta; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q7. Tabac</span>
                                                <span class="qc-audit-q-value <?php echo $r->q7_tabac == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q7_tabac; ?>
                                                    <?php if ($r->q7_tabac_pa): ?>
                                                        <span style="font-size:12px;"> (<?php echo $r->q7_tabac_pa; ?> PA)</span>
                                                    <?php endif; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q">
                                                <span class="qc-audit-q-label">Q8. Cholestérol</span>
                                                <span class="qc-audit-q-value <?php echo $r->q8_cholesterol == 'OUI' ? 'yes' : 'no'; ?>">
                                                    <?php echo $r->q8_cholesterol; ?>
                                                </span>
                                            </div>
                                            
                                            <div class="qc-audit-q" style="border-top: 2px solid #cbd5e1; margin-top: 10px; padding-top: 10px;">
                                                <span class="qc-audit-q-label">Nombre de facteurs de risque</span>
                                                <span class="qc-audit-q-value yes"><?php echo $r->nb_facteurs_risque; ?></span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="qc-audit-notes-section">
                                        <div class="qc-audit-notes-header">
                                            <h3 class="qc-audit-notes-title">📋 Notes Doctolib</h3>
                                            <button type="button" class="qc-audit-copy-btn" onclick="copyNotes<?php echo $r->id; ?>()">
                                                📋 Copier
                                            </button>
                                        </div>
                                        <pre id="notes-<?php echo $r->id; ?>" class="qc-audit-notes"><?php echo esc_html($r->notes_doctolib); ?></pre>
                                        <script>
                                        function copyNotes<?php echo $r->id; ?>() {
                                            const text = document.getElementById('notes-<?php echo $r->id; ?>').textContent;
                                            if (navigator.clipboard) {
                                                navigator.clipboard.writeText(text).then(function() {
                                                    alert('✅ Notes copiées !');
                                                });
                                            } else {
                                                alert('Veuillez copier manuellement (Ctrl+C)');
                                            }
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
            
            // ============================================
            // GESTION DU ZOOM INTELLIGENT + LOCALSTORAGE
            // ============================================
            const STORAGE_KEY = 'qualif_audit_zoom';
            const minZoom = 0.5;
            const maxZoom = 1.5;
            const zoomStep = 0.1;
            
            let currentZoom;
            let defaultZoom;
            
            // Détection auto résolution
            function getDefaultZoom() {
                const screenWidth = window.screen.width;
                return screenWidth < 1400 ? 0.9 : 1.0;
            }
            
            // Charger le zoom
            function loadZoom() {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    currentZoom = parseFloat(saved);
                    console.log('📊 Audit Zoom chargé:', currentZoom);
                } else {
                    defaultZoom = getDefaultZoom();
                    currentZoom = defaultZoom;
                    console.log('📊 Audit Zoom défaut:', currentZoom);
                }
                updateZoom(currentZoom, false);
            }
            
            // Sauvegarder
            function saveZoom(zoom) {
                localStorage.setItem(STORAGE_KEY, zoom);
                console.log('💾 Audit Zoom sauvegardé:', zoom);
            }
            
            // Appliquer
            function updateZoom(newZoom, save = true) {
                if (newZoom < minZoom) newZoom = minZoom;
                if (newZoom > maxZoom) newZoom = maxZoom;
                currentZoom = newZoom;
                document.getElementById('qc-audit-wrapper').style.zoom = currentZoom;
                document.getElementById('qc-audit-zoom-display').textContent = Math.round(currentZoom * 100) + '%';
                if (save) {
                    saveZoom(currentZoom);
                }
            }
            
            // Reset
            function resetZoom() {
                const newDefault = getDefaultZoom();
                updateZoom(newDefault);
                console.log('🔄 Audit Zoom reset:', newDefault);
            }
            
            // Bouton +
            document.getElementById('qc-audit-zoom-plus').addEventListener('click', function() {
                updateZoom(currentZoom + zoomStep);
            });
            
            // Bouton -
            document.getElementById('qc-audit-zoom-minus').addEventListener('click', function() {
                updateZoom(currentZoom - zoomStep);
            });
            
            // Double-clic = Reset
            document.getElementById('qc-audit-zoom-display').addEventListener('dblclick', function() {
                resetZoom();
            });
            
            // Raccourcis clavier
            document.addEventListener('keydown', function(e) {
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
            
            // Charger au démarrage
            loadZoom();
        })();
        </script>
        <?php
        return ob_get_clean();
    }
}

add_shortcode('qualif_audit', 'qc_audit_shortcode');