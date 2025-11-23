/**
 * Snippet: FURGE-ADMIN-Dashboard
 * ID WPCode: 11
 * Dernière modification: 2025-10-01 20:14:42
 * Active: True
 * Révision: 1
 * 
 * Site: tele-consultation.com
 * Projet: Furge - Téléconsultation
 */


/**
 * Admin Furge - Interface simple de gestion des téléconsultations
 * Pour Code Snippets WordPress
 * Shortcode: [admin_furge]
 */

add_shortcode('admin_furge', 'render_admin_furge');

function render_admin_furge() {
    
    $base_url = 'https://tele-consultation.com/consultation-furge/';
    $payment_url = 'https://tele-consultation.com/paiement-consultation/';
    
    ob_start();
    ?>
    
    <div id="adminFurge">
        <style>
            #adminFurge * { box-sizing: border-box; }
            #adminFurge { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 1200px; margin: 0 auto; }
            
            .af-header {
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            
            .af-warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                color: #856404;
            }
            
            .af-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            
            @media (max-width: 768px) {
                .af-grid { grid-template-columns: 1fr; }
            }
            
            .af-card {
                background: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            
            .af-card h2 {
                margin: 0 0 20px 0;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
                color: #333;
            }
            
            .af-group {
                margin-bottom: 20px;
            }
            
            .af-group label {
                display: block;
                margin-bottom: 8px;
                color: #555;
                font-weight: 500;
            }
            
            .af-group input,
            .af-group select,
            .af-group textarea {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
            }
            
            .af-group input:focus,
            .af-group select:focus,
            .af-group textarea:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .af-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .af-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 28px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
            }
            
            .af-btn-primary:hover { opacity: 0.9; }
            
            .af-result {
                display: none;
                background: #e8f5e9;
                border: 2px solid #4caf50;
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
            }
            
            .af-result.active { display: block; }
            
            .af-code {
                background: white;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                color: #333;
                margin: 15px 0;
                border: 2px dashed #4caf50;
            }
            
            .af-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 15px;
            }
            
            .af-btn {
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                color: white;
                text-align: center;
            }
            
            .af-btn-copy { background: #2196F3; }
            .af-btn-mail-doc { background: #FF9800; }
            .af-btn-mail-patient { background: #4CAF50; }
            .af-btn-cal { background: #9C27B0; }
            .af-btn-payment { 
                background: #667eea; 
                grid-column: 1 / -1;
                margin-top: 10px;
            }
            .af-btn-backup {
                background: #FF5722;
                grid-column: 1 / -1;
            }
            .af-btn-join {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                grid-column: 1 / -1;
                padding: 16px;
                font-size: 16px;
                margin-top: 10px;
            }
            
            .af-history-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 15px;
                border-left: 4px solid #667eea;
            }
            
            .af-history-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .af-history-details {
                font-size: 14px;
                color: #666;
                line-height: 1.5;
            }
            
            .af-history-actions {
                margin-top: 10px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .af-btn-small {
                padding: 8px 16px;
                font-size: 13px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                background: #e3f2fd;
                color: #1976D2;
            }
            
            .af-btn-del {
                background: #ffebee;
                color: #c62828;
            }
            
            .af-btn-pay {
                background: #e8f5e9;
                color: #2e7d32;
            }
            
            .af-btn-payment-small {
                background: #f0f4ff;
                color: #667eea;
            }
            
            .af-empty {
                text-align: center;
                padding: 40px;
                color: #999;
            }
            
            .af-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.3s;
                z-index: 99999;
                pointer-events: none;
            }
            
            .af-toast.show {
                opacity: 1;
                pointer-events: auto;
            }
            
            .af-footer {
                background: white;
                margin-top: 40px;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                text-align: center;
                color: #666;
            }
            
            .af-btn-export {
                background: #607D8B;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                margin-top: 20px;
            }
        </style>
        
        <div class="af-header">
            <h1>🏥 Gestion des Téléconsultations - Dr Furge</h1>
            <div class="af-warning">
                <strong>⚠️ Rappel :</strong> L'historique est stocké uniquement sur cet ordinateur. 
                Envoyez-vous un mail pour garder une trace.
            </div>
        </div>
        
        <div class="af-grid">
            <!-- Formulaire -->
            <div class="af-card">
                <h2>📝 Nouvelle Consultation</h2>
                <form id="afForm">
                    <div class="af-group">
                        <label>Nom du patient *</label>
                        <input type="text" id="afPatient" placeholder="MARTIN" required>
                    </div>
                    
                    <div class="af-row">
                        <div class="af-group">
                            <label>Date *</label>
                            <input type="date" id="afDate" required>
                        </div>
                        <div class="af-group">
                            <label>Heure *</label>
                            <input type="time" id="afTime" step="300" required>
                        </div>
                    </div>
                    
                    <div class="af-group">
                        <label>Type de consultation</label>
                        <select id="afType">
                            <option value="Première consultation">Première consultation</option>
                            <option value="Suivi">Suivi</option>
                            <option value="Urgence">Urgence</option>
                            <option value="Contrôle">Contrôle</option>
                            <option value="Renouvellement">Renouvellement ordonnance</option>
                        </select>
                    </div>
                    
                    <div class="af-group">
                        <label>Notes (motif, remarques...)</label>
                        <textarea id="afNotes" rows="3" placeholder="Ex: Suivi diabète, contrôle tension..."></textarea>
                    </div>
                    
                    <div class="af-group">
                        <label>Tarif (€)</label>
                        <input type="number" id="afPrice" value="25" min="0" step="0.01">
                    </div>
                    
                    <button type="submit" class="af-btn-primary">
                        Générer le Code
                    </button>
                </form>
                
                <!-- Résultat (masqué par défaut) -->
                <div id="afResult" class="af-result">
                    <h3 style="color: #2e7d32;">✅ Code généré</h3>
                    <div class="af-code" id="afCode"></div>
                    <div class="af-actions">
                        <button class="af-btn af-btn-copy" onclick="afCopy()">📋 Copier Code</button>
                        <button class="af-btn af-btn-mail-doc" onclick="afMailDoc()">📧 Mail Médecin</button>
                        <button class="af-btn af-btn-mail-patient" onclick="afMailPatient()">📨 Mail Patient</button>
                        <button class="af-btn af-btn-cal" onclick="afCalendar()">📅 + Google Agenda</button>
                    </div>
                    <button class="af-btn af-btn-payment" onclick="afPaymentLink()">
                        💳 Copier Lien Paiement Patient
                    </button>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                        <button class="af-btn af-btn-join" onclick="afJoin()">📹 REJOINDRE</button>
                        <button class="af-btn af-btn-backup" onclick="afJoinBackup()">🔄 SERVEUR SECOURS</button>
                    </div>
                </div>
            </div>
            
            <!-- Historique -->
            <div class="af-card">
                <h2>📊 Historique</h2>
                <div id="afHistory"></div>
                <button class="af-btn-export" onclick="afExportCSV()">
                    📥 Export CSV
                </button>
            </div>
        </div>
        
        <div class="af-footer">
            <p><strong>💡 Simple et efficace</strong></p>
            <p style="font-size: 14px;">
                Code unique → Patient rejoint → Consultation vidéo Jitsi → Terminé<br>
                Pas de serveur, pas de base de données, tout en local.
            </p>
        </div>
        
        <div id="afToast" class="af-toast"></div>
        
        <!-- Modal pour afficher les mails -->
        <div id="afOverlay" class="af-overlay" onclick="afCloseModal()"></div>
        <div id="afModal" class="af-modal">
            <div class="af-modal-header">
                <h3 id="afModalTitle">Mail</h3>
                <button class="af-modal-close" onclick="afCloseModal()">✖</button>
            </div>
            <div class="af-modal-content" id="afModalContent"></div>
            <div class="af-modal-actions">
                <button class="af-btn af-btn-copy" onclick="afCopyMail()">📋 Copier TOUT</button>
                <button class="af-btn af-btn-mail-patient" onclick="afCopyBody()">📝 Copier le corps</button>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 12px; color: #666; margin: 0 0 10px 0;">Ou envoyer directement via :</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="afOpenGmail()" style="background: #EA4335; color: white; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                        Gmail Web
                    </button>
                    <button onclick="afOpenOutlook()" style="background: #0078D4; color: white; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                        Outlook Web
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
    const AF_URL = '<?php echo $base_url; ?>';
    const AF_PAYMENT_URL = '<?php echo $payment_url; ?>';
    let afCurrent = null;
    let afConsults = [];
    let afCurrentMail = null;
    
    // Init
    document.addEventListener('DOMContentLoaded', function() {
        // Charger historique
        afRefreshHistory();
        
        // Date/heure par défaut
        const now = new Date();
        document.getElementById('afDate').value = now.toISOString().split('T')[0];
        
        // Heure arrondie aux 5 min
        const m = Math.ceil(now.getMinutes() / 5) * 5;
        now.setMinutes(m, 0, 0);
        document.getElementById('afTime').value = now.toTimeString().slice(0, 5);
        
        // Masquer le résultat si refresh
        document.getElementById('afResult').classList.remove('active');
        
        // Form submit
        document.getElementById('afForm').addEventListener('submit', function(e) {
            e.preventDefault();
            afGenerate();
        });
        
        // Forcer 5 min
        document.getElementById('afTime').addEventListener('change', function() {
            if (this.value) {
                const [h, m] = this.value.split(':');
                const rounded = Math.round(m / 5) * 5;
                this.value = h.padStart(2, '0') + ':' + String(rounded).padStart(2, '0');
            }
        });
    });
    
    // Générer code
    function afGenerate() {
        const patient = document.getElementById('afPatient').value.trim().toUpperCase();
        if (!patient) {
            afToast('⚠️ Nom patient requis');
            return;
        }
        
        // Code = NOM + 4 chiffres
        const code = patient.replace(/[^A-Z]/g, '').slice(0, 8) + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        // Objet consultation
        afCurrent = {
            code: code,
            patient: patient,
            date: document.getElementById('afDate').value,
            time: document.getElementById('afTime').value,
            type: document.getElementById('afType').value,
            notes: document.getElementById('afNotes').value.trim(),
            price: parseFloat(document.getElementById('afPrice').value) || 25,
            paid: false,
            created: Date.now()
        };
        
        // Afficher résultat
        document.getElementById('afCode').textContent = code;
        document.getElementById('afResult').classList.add('active');
        
        // Sauvegarder ET rafraîchir
        afConsults = JSON.parse(localStorage.getItem('afConsults') || '[]');
        afConsults.unshift(afCurrent);
        if (afConsults.length > 100) afConsults = afConsults.slice(0, 100);
        localStorage.setItem('afConsults', JSON.stringify(afConsults));
        
        // IMPORTANT: Rafraîchir l'historique immédiatement
        afRefreshHistory();
        
        // Scroll
        document.getElementById('afResult').scrollIntoView({behavior: 'smooth', block: 'nearest'});
        
        afToast('✅ Code généré: ' + code);
    }
    
    // Rafraîchir historique
    function afRefreshHistory() {
        afConsults = JSON.parse(localStorage.getItem('afConsults') || '[]');
        const div = document.getElementById('afHistory');
        
        if (afConsults.length === 0) {
            div.innerHTML = '<div class="af-empty">Aucune consultation</div>';
            return;
        }
        
        div.innerHTML = afConsults.map((c, i) => {
            const btnPayText = c.paid ? '❌ Non payé' : '💰 Marquer payé';
            const statusText = c.paid ? '<span style="color: green;">✅ Payé</span>' : '<span style="color: orange;">⏳ En attente</span>';
            
            return `
            <div class="af-history-item">
                <div class="af-history-header">
                    <span>${c.patient}</span>
                    <span>${formatDate(c.date)} ${c.time}</span>
                </div>
                <div class="af-history-details">
                    Code: <strong>${c.code}</strong><br>
                    Type: ${c.type}<br>
                    ${c.notes ? 'Notes: ' + c.notes + '<br>' : ''}
                    Tarif: ${c.price}€ - ${statusText}
                </div>
                <div class="af-history-actions">
                    <button class="af-btn-small" onclick="afReload(${i})">📄 Recharger</button>
                    <button class="af-btn-small" onclick="afQuickJoin('${c.code}')">📹 Rejoindre</button>
                    <button class="af-btn-small af-btn-payment-small" onclick="afPaymentLinkQuick('${c.code}')">💳 Lien paiement</button>
                    <button class="af-btn-small af-btn-pay" onclick="afTogglePay(${i})">${btnPayText}</button>
                    <button class="af-btn-small af-btn-del" onclick="afDel(${i})">🗑️ Suppr</button>
                </div>
            </div>
        `}).join('');
    }
    
    // Générer lien de paiement
    function afPaymentLink() {
        if (!afCurrent) return;
        
        // URL de la page paiement avec le code pré-rempli
        const paymentUrl = AF_PAYMENT_URL + '?code=' + afCurrent.code;
        
        // Copier dans le presse-papier
        navigator.clipboard.writeText(paymentUrl);
        
        // Afficher un toast avec le lien
        afToast('💳 Lien paiement copié : ' + paymentUrl);
        
        // Option : ouvrir aussi dans un nouvel onglet pour vérifier
        if (confirm('Lien copié !\n\n' + paymentUrl + '\n\nVoulez-vous l\'ouvrir pour vérification ?')) {
            window.open(paymentUrl, '_blank');
        }
    }
    
    // Lien paiement rapide depuis l'historique
    function afPaymentLinkQuick(code) {
        const paymentUrl = AF_PAYMENT_URL + '?code=' + code;
        navigator.clipboard.writeText(paymentUrl);
        afToast('💳 Lien paiement copié pour ' + code);
    }
    
    // Rejoindre rapidement depuis l'historique
    function afQuickJoin(code) {
        if (confirm('Rejoindre la consultation ' + code + ' ?')) {
            window.open(AF_URL + '?ref=' + code + '&doctor=1', '_blank');
        }
    }
    
    // Recharger consultation
    function afReload(i) {
        const c = afConsults[i];
        document.getElementById('afPatient').value = c.patient;
        document.getElementById('afDate').value = c.date;
        document.getElementById('afTime').value = c.time;
        document.getElementById('afType').value = c.type;
        document.getElementById('afNotes').value = c.notes || '';
        document.getElementById('afPrice').value = c.price;
        
        afCurrent = c;
        document.getElementById('afCode').textContent = c.code;
        document.getElementById('afResult').classList.add('active');
        document.getElementById('afForm').scrollIntoView({behavior: 'smooth'});
    }
    
    // Basculer paiement (plus clair)
    function afTogglePay(i) {
        const c = afConsults[i];
        c.paid = !c.paid;
        localStorage.setItem('afConsults', JSON.stringify(afConsults));
        afRefreshHistory();
        afToast(c.paid ? '✅ ' + c.patient + ' marqué PAYÉ' : '⏳ ' + c.patient + ' marqué NON PAYÉ');
    }
    
    // Supprimer
    function afDel(i) {
        if (confirm('Supprimer ' + afConsults[i].patient + ' ?')) {
            afConsults.splice(i, 1);
            localStorage.setItem('afConsults', JSON.stringify(afConsults));
            afRefreshHistory();
            afToast('Supprimé');
        }
    }
    
    // Copier code
    function afCopy() {
        if (!afCurrent) return;
        navigator.clipboard.writeText(afCurrent.code);
        afToast('📋 Code copié: ' + afCurrent.code);
    }
    
    // Fonction pour formater la date
    function formatDate(d) {
        const date = new Date(d + 'T00:00:00');
        return date.toLocaleDateString('fr-FR');
    }
    
    // Fonction utilitaire pour échapper le HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Fonction pour formater la date pour Google Calendar
    function getGoogleCalendarDate(date, time) {
        const start = new Date(date + 'T' + time);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        
        const format = (d) => {
            return d.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z');
        };
        
        return format(start) + '/' + format(end);
    }
    
    // Mail médecin (avec modal)
    function afMailDoc() {
        if (!afCurrent) return;
        
        const paymentUrl = AF_PAYMENT_URL + '?code=' + afCurrent.code;
        
        const subject = '[TÉLÉCONSULT] ' + afCurrent.patient + ' - ' + formatDate(afCurrent.date) + ' ' + afCurrent.time;
        const body = 'MÉMO CONSULTATION\n' +
            '================\n\n' +
            'Patient: ' + afCurrent.patient + '\n' +
            'Date: ' + formatDate(afCurrent.date) + ' à ' + afCurrent.time + '\n' +
            'CODE À SAISIR: ' + afCurrent.code + '\n\n' +
            'Type: ' + afCurrent.type + '\n' +
            (afCurrent.notes ? 'Notes: ' + afCurrent.notes + '\n' : '') +
            'Tarif: ' + afCurrent.price + '€\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'LIENS RAPIDES MÉDECIN:\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '→ Rejoindre (principal):\n' +
            AF_URL + '?ref=' + afCurrent.code + '&doctor=1\n\n' +
            '→ Si problème, serveur de secours:\n' + 
            AF_URL + '?ref=' + afCurrent.code + '&backup=1&doctor=1\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'LIENS POUR LE PATIENT:\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            '💳 PAIEMENT:\n' +
            paymentUrl + '\n\n' +
            '📹 CONSULTATION:\n' +
            AF_URL + '?ref=' + afCurrent.code + '\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'AJOUTER À VOTRE AGENDA:\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            'Google Calendar:\n' +
            'https://calendar.google.com/calendar/render?action=TEMPLATE' +
            '&text=' + encodeURIComponent('Téléconsult ' + afCurrent.patient) +
            '&dates=' + getGoogleCalendarDate(afCurrent.date, afCurrent.time) +
            '&details=' + encodeURIComponent('Code: ' + afCurrent.code + '\nType: ' + afCurrent.type + (afCurrent.notes ? '\nNotes: ' + afCurrent.notes : '')) +
            '&location=En ligne' +
            '&sf=true&output=xml\n\n' +
            'Outlook/Office 365: Copier ce mail et créer un RDV';
        
        // Stocker le mail
        afCurrentMail = {
            subject: subject,
            body: body
        };
        
        // Afficher dans la modal (avec échappement HTML)
        document.getElementById('afModalTitle').textContent = 'Mail Médecin - ' + afCurrent.patient;
        document.getElementById('afModalContent').innerHTML = 
            '<div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">' +
            '<strong style="color: #666;">OBJET:</strong><br>' +
            '<span style="color: #333;">' + escapeHtml(subject) + '</span>' +
            '</div>' +
            '<div>' +
            '<strong style="color: #666;">MESSAGE:</strong><br>' +
            '<span style="white-space: pre-wrap;">' + escapeHtml(body) + '</span>' +
            '</div>';
        document.getElementById('afModal').classList.add('active');
        document.getElementById('afOverlay').classList.add('active');
    }
    
    // Mail patient (avec modal)
    function afMailPatient() {
        if (!afCurrent) return;
        
        const paymentUrl = AF_PAYMENT_URL + '?code=' + afCurrent.code;
        
        const subject = 'Votre téléconsultation du ' + formatDate(afCurrent.date) + ' à ' + afCurrent.time;
        const body = 'Bonjour,\n\n' +
            'Votre téléconsultation avec le Dr Furge est confirmée.\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            '📅 DATE: ' + formatDate(afCurrent.date) + '\n' +
            '🕐 HEURE: ' + afCurrent.time + '\n' +
            '🔑 VOTRE CODE: ' + afCurrent.code + '\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            'ÉTAPE 1: PAIEMENT\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'Réglez votre consultation en cliquant sur ce lien:\n' +
            paymentUrl + '\n\n' +
            'ÉTAPE 2: CONSULTATION\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'Après paiement, vous serez automatiquement redirigé.\n' +
            'Ou utilisez ce lien le jour J:\n' +
            AF_URL + '?ref=' + afCurrent.code + '\n\n' +
            'Si problème, lien de secours:\n' +
            AF_URL + '?ref=' + afCurrent.code + '&backup=1\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'CONSEILS DE CONNEXION:\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            '• Connectez-vous 5 minutes avant\n' +
            '• Utilisez Chrome ou Firefox\n' +
            '• Autorisez caméra et microphone\n' +
            '• Préparez votre carte vitale\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n' +
            'AJOUTER À VOTRE AGENDA:\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            'Cliquez sur ce lien pour ajouter à Google Calendar:\n' +
            'https://calendar.google.com/calendar/render?action=TEMPLATE' +
            '&text=' + encodeURIComponent('Téléconsultation Dr Furge') +
            '&dates=' + getGoogleCalendarDate(afCurrent.date, afCurrent.time) +
            '&details=' + encodeURIComponent('Code de connexion: ' + afCurrent.code + '\nLien: ' + AF_URL + '?ref=' + afCurrent.code) +
            '&location=En ligne' +
            '&sf=true&output=xml\n\n' +
            'Pour Outlook: Créez un rappel avec le code ' + afCurrent.code + '\n\n' +
            '━━━━━━━━━━━━━━━━━━━━━\n\n' +
            'En cas de problème, veuillez appeler le secrétariat.\n\n' +
            'Cordialement,\n' +
            'Dr Furge';
        
        // Stocker le mail
        afCurrentMail = {
            subject: subject,
            body: body
        };
        
        // Afficher dans la modal
        document.getElementById('afModalTitle').textContent = 'Mail Patient - ' + afCurrent.patient;
        document.getElementById('afModalContent').innerHTML = 
            '<div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">' +
            '<strong style="color: #666;">OBJET:</strong><br>' +
            '<span style="color: #333;">' + escapeHtml(subject) + '</span>' +
            '</div>' +
            '<div>' +
            '<strong style="color: #666;">MESSAGE:</strong><br>' +
            '<span style="white-space: pre-wrap;">' + escapeHtml(body) + '</span>' +
            '</div>';
        document.getElementById('afModal').classList.add('active');
        document.getElementById('afOverlay').classList.add('active');
    }
    
    // Fermer la modal
    function afCloseModal() {
        document.getElementById('afModal').classList.remove('active');
        document.getElementById('afOverlay').classList.remove('active');
    }
    
    // Copier tout le mail (objet + corps)
    function afCopyMail() {
        if (!afCurrentMail) return;
        const fullMail = 'OBJET: ' + afCurrentMail.subject + '\n\n' + afCurrentMail.body;
        navigator.clipboard.writeText(fullMail);
        afToast('📋 Mail complet copié !');
    }
    
    // Copier seulement le corps du mail
    function afCopyBody() {
        if (!afCurrentMail) return;
        navigator.clipboard.writeText(afCurrentMail.body);
        afToast('📝 Corps du mail copié !');
    }
    
    // Ouvrir Gmail Web avec le mail pré-rempli
    function afOpenGmail() {
        if (!afCurrentMail) return;
        const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
            '&su=' + encodeURIComponent(afCurrentMail.subject) +
            '&body=' + encodeURIComponent(afCurrentMail.body);
        window.open(gmailUrl, '_blank');
        afToast('📧 Ouverture de Gmail...');
    }
    
    // Ouvrir Outlook Web 
    function afOpenOutlook() {
        if (!afCurrentMail) return;
        const outlookUrl = 'https://outlook.live.com/mail/0/deeplink/compose?' +
            'subject=' + encodeURIComponent(afCurrentMail.subject) +
            '&body=' + encodeURIComponent(afCurrentMail.body);
        window.open(outlookUrl, '_blank');
        afToast('📧 Ouverture d\'Outlook...');
    }
    
    // Calendrier - Ouvre Google Calendar directement
    function afCalendar() {
        if (!afCurrent) return;
        
        const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
            '&text=' + encodeURIComponent('Téléconsult ' + afCurrent.patient) +
            '&dates=' + getGoogleCalendarDate(afCurrent.date, afCurrent.time) +
            '&details=' + encodeURIComponent(
                'Code patient: ' + afCurrent.code + '\n' +
                'Type: ' + afCurrent.type + '\n' +
                (afCurrent.notes ? 'Notes: ' + afCurrent.notes + '\n' : '') +
                'Tarif: ' + afCurrent.price + '€\n\n' +
                'Lien consultation: ' + AF_URL + '?ref=' + afCurrent.code + '&doctor=1\n' +
                'Lien secours: ' + AF_URL + '?ref=' + afCurrent.code + '&backup=1&doctor=1'
            ) +
            '&location=' + encodeURIComponent('Téléconsultation en ligne') +
            '&sf=true&output=xml';
        
        window.open(url, '_blank');
        afToast('📅 Ouverture Google Calendar');
    }
    
    // Rejoindre
    function afJoin() {
        if (!afCurrent) return;
        window.open(AF_URL + '?ref=' + afCurrent.code + '&doctor=1', '_blank');
    }
    
    // Rejoindre serveur de secours
    function afJoinBackup() {
        if (!afCurrent) return;
        window.open(AF_URL + '?ref=' + afCurrent.code + '&backup=1&doctor=1', '_blank');
        afToast('🔄 Ouverture serveur de secours');
    }
    
    // Export CSV
    function afExportCSV() {
        if (afConsults.length === 0) {
            afToast('Rien à exporter');
            return;
        }
        
        const csv = 'Date;Heure;Patient;Code;Type;Notes;Tarif;Payé\n' +
            afConsults.map(c => [
                c.date,
                c.time,
                c.patient,
                c.code,
                c.type,
                c.notes || '',
                c.price,
                c.paid ? 'Oui' : 'Non'
            ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\n');
        
        const blob = new Blob(['\ufeff' + csv], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'consultations-' + new Date().toISOString().slice(0, 10) + '.csv';
        a.click();
        
        afToast('📥 CSV exporté');
    }
    
    // Toast
    function afToast(msg) {
        const t = document.getElementById('afToast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
    </script>
    
    <?php
    return ob_get_clean();
}