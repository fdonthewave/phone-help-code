/**
 * Snippet: FURGE-CLIENT-Paiement
 * ID WPCode: 9
 * Dernière modification: 2025-10-01 20:13:33
 * Active: True
 * Révision: 1
 * 
 * Site: tele-consultation.com
 * Projet: Furge - Téléconsultation
 */


/**
 * Snippet: FURGE-CLIENT-Paiement
 * Description: Formulaire de paiement Stripe pour téléconsultation avec option "déjà régularisé"
 * Shortcode: [paiement_furge]
 */

// Fonction qui génère la page de paiement
function furge_payment_page() {
    ob_start();
    ?>
    
<style>
/* Design médical épuré avec gradient violet cohérent */
.furge-payment {
    max-width: 500px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 20px;
}

.payment-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 25px;
    border-radius: 12px 12px 0 0;
    text-align: center;
}

.payment-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
}

.payment-header p {
    margin: 10px 0 0 0;
    opacity: 0.95;
    font-size: 14px;
}

.payment-body {
    background: white;
    border: 1px solid #e5e5e5;
    border-top: none;
    border-radius: 0 0 12px 12px;
    padding: 30px 25px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.code-prefilled-notice {
    background: #e8f5e9;
    border: 1px solid #4caf50;
    color: #2e7d32;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 13px;
    display: none;
}

.code-prefilled-notice.show {
    display: block;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    transition: all 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.form-group input[name="code"] {
    text-transform: uppercase;
}

.timing-section {
    margin: 25px 0;
    padding: 20px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
}

.timing-section h3 {
    font-size: 16px;
    color: #333;
    margin: 0 0 15px 0;
    text-align: center;
}

.timing-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
}

.timing-btn {
    padding: 15px;
    border: 2px solid #e5e5e5;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.timing-btn:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

.timing-btn.selected {
    border-color: #667eea;
    background: #f0f4ff;
    position: relative;
}

.timing-btn.selected::after {
    content: "✓";
    position: absolute;
    top: 8px;
    right: 8px;
    background: #667eea;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

.timing-btn .icon {
    font-size: 24px;
    margin-bottom: 5px;
    display: block;
}

.timing-btn .label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
    display: block;
    margin-bottom: 3px;
}

.timing-btn .desc {
    font-size: 12px;
    color: #666;
}

/* Style spécial pour le bouton "déjà régularisé" */
.timing-btn.already-paid {
    border-color: #4caf50;
}

.timing-btn.already-paid:hover {
    background: #e8f5e9;
}

.timing-btn.already-paid.selected {
    background: #e8f5e9;
    border-color: #4caf50;
}

.timing-btn.already-paid.selected::after {
    background: #4caf50;
}

.submit-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 20px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}

.submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}

.submit-btn.loading {
    position: relative;
    color: transparent;
}

.submit-btn.loading::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spinner 0.8s linear infinite;
}

/* Bouton vert pour déjà régularisé */
.submit-btn.already-paid-btn {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

@keyframes spinner {
    to { transform: rotate(360deg); }
}

.info-box {
    background: #f8f9fa;
    border-left: 3px solid #4dc26b;
    padding: 15px;
    margin-top: 25px;
    border-radius: 5px;
}

.info-box p {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #555;
}

.info-box ul {
    margin: 0;
    padding-left: 20px;
    font-size: 14px;
    color: #666;
}

.info-box li {
    margin-bottom: 5px;
}

.error-message,
.success-message {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: none;
    animation: slideDown 0.3s ease;
}

.error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
}

.success-message {
    background: #e8f8e8;
    border: 1px solid #c3e6c3;
    color: #2d7a2d;
}

.error-message.show,
.success-message.show {
    display: block;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.security-footer {
    margin-top: 30px;
    padding: 15px;
    background: #f8f9fa;
    border-top: 2px solid #667eea;
    text-align: center;
    font-size: 12px;
    color: #666;
    border-radius: 8px;
}

.direct-access {
    margin-top: 20px;
    text-align: center;
    font-size: 13px;
    color: #666;
}

.direct-access a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
}

.direct-access a:hover {
    text-decoration: underline;
}

.already-paid-info {
    background: #fff9e6;
    border: 1px solid #ffc107;
    color: #856404;
    padding: 12px;
    border-radius: 6px;
    margin-top: 15px;
    font-size: 13px;
    display: none;
}

.already-paid-info.show {
    display: block;
}

/* Mobile responsive */
@media (max-width: 500px) {
    .furge-payment {
        padding: 10px;
    }
    
    .payment-header {
        padding: 25px 20px;
        border-radius: 10px 10px 0 0;
    }
    
    .payment-body {
        padding: 20px 15px;
    }
    
    .timing-buttons {
        grid-template-columns: 1fr;
    }
    
    .timing-btn {
        padding: 12px;
    }
}
</style>

<div class="furge-payment">
    <!-- Header -->
    <div class="payment-header">
        <h2>Paiement Téléconsultation</h2>
        <p>Dr Camille FURGÉ • Médecine Générale</p>
    </div>

    <!-- Body -->
    <div class="payment-body">
        <!-- Messages -->
        <div class="error-message" id="error-msg"></div>
        <div class="success-message" id="success-msg"></div>
        <div class="code-prefilled-notice" id="code-prefilled">
            ✅ Code pré-rempli automatiquement
        </div>

        <!-- Formulaire -->
        <form id="payment-form">
            <!-- Code patient -->
            <div class="form-group">
                <label for="patient-code">Code patient *</label>
                <input 
                    type="text" 
                    id="patient-code" 
                    name="code"
                    placeholder="Ex: MARTIN2024" 
                    required
                    autocomplete="off"
                >
                <small style="color:#666;font-size:12px;">
                    Code reçu par email ou donné par votre praticien
                </small>
            </div>

            <!-- Nom -->
            <div class="form-group">
                <label for="patient-name">Nom *</label>
                <input 
                    type="text" 
                    id="patient-name" 
                    name="name"
                    placeholder="Votre nom" 
                    required
                >
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="patient-email">Email *</label>
                <input 
                    type="email" 
                    id="patient-email" 
                    name="email"
                    placeholder="votre@email.com" 
                    required
                >
            </div>

            <!-- Téléphone -->
            <div class="form-group">
                <label for="patient-phone">Téléphone *</label>
                <input 
                    type="tel" 
                    id="patient-phone" 
                    name="phone"
                    placeholder="06 12 34 56 78" 
                    required
                >
            </div>

            <!-- Choix du timing - AVEC 3 OPTIONS -->
            <div class="timing-section">
                <h3>Ma situation :</h3>
                <div class="timing-buttons">
                    <button type="button" class="timing-btn" onclick="selectTiming('before')" id="btn-before">
                        <span class="icon">📅</span>
                        <span class="label">À venir</span>
                        <span class="desc">Prépaiement</span>
                    </button>
                    <button type="button" class="timing-btn" onclick="selectTiming('after')" id="btn-after">
                        <span class="icon">✅</span>
                        <span class="label">Terminée</span>
                        <span class="desc">Règlement</span>
                    </button>
                    <button type="button" class="timing-btn already-paid" onclick="selectTiming('already')" id="btn-already">
                        <span class="icon">💚</span>
                        <span class="label">Déjà réglé</span>
                        <span class="desc">Autre moyen</span>
                    </button>
                </div>
                
                <!-- Info déjà réglé -->
                <div class="already-paid-info" id="already-paid-info">
                    💡 <strong>Déjà régularisé :</strong> Pour les paiements en cabinet, chèque, virement, forfait ou consultation gratuite. Accès direct sans paiement en ligne.
                </div>
            </div>

            <!-- Bouton de soumission -->
            <button type="submit" class="submit-btn" id="submit-btn" disabled>
                Sélectionnez votre situation
            </button>
        </form>

        <!-- Lien accès direct -->
        <div class="direct-access">
            <a href="/consultation-furge">→ Accès direct consultation (sans code)</a>
        </div>

        <!-- Informations -->
        <div class="info-box">
            <p><strong>Informations :</strong></p>
            <ul>
                <li>Montant : 25€ TTC</li>
                <li>Paiement sécurisé par Stripe</li>
                <li>Remboursable selon parcours de soins</li>
                <li>Confirmation immédiate par email</li>
                <li>Déjà réglé ? Choisissez "Déjà réglé"</li>
            </ul>
        </div>

        <!-- Sécurité -->
        <div class="security-footer">
            🔒 Consultation sécurisée via Jitsi • Solution open-source recommandée 
            par les services publics français • Serveurs hébergés en Europe (RGPD)
        </div>
    </div>
</div>

<script>
// Configuration Stripe - À REMPLACER PAR LES VRAIS LIENS
const STRIPE_CONFIG = {
    prepayment: 'https://buy.stripe.com/4gM9ASbs34A56VKg111VK00',  // REMPLACER
    postpayment: 'https://buy.stripe.com/8x28wO53F7Mheoc1671VK01'  // REMPLACER
};

// État du formulaire
let selectedTiming = null;

// Sélection du timing
function selectTiming(timing) {
    // Mise à jour visuelle
    document.querySelectorAll('.timing-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const alreadyInfo = document.getElementById('already-paid-info');
    const submitBtn = document.getElementById('submit-btn');
    
    if (timing === 'before') {
        document.getElementById('btn-before').classList.add('selected');
        submitBtn.textContent = '💳 Payer 25€ - Consultation à venir';
        submitBtn.className = 'submit-btn';
        alreadyInfo.classList.remove('show');
    } else if (timing === 'after') {
        document.getElementById('btn-after').classList.add('selected');
        submitBtn.textContent = '✅ Régler 25€ - Consultation terminée';
        submitBtn.className = 'submit-btn';
        alreadyInfo.classList.remove('show');
    } else if (timing === 'already') {
        document.getElementById('btn-already').classList.add('selected');
        submitBtn.textContent = '💚 Accéder à la consultation';
        submitBtn.className = 'submit-btn already-paid-btn';
        alreadyInfo.classList.add('show');
    }
    
    selectedTiming = timing;
    submitBtn.disabled = false;
}

// Soumission du formulaire
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupération des données
    const code = document.getElementById('patient-code').value.trim().toUpperCase();
    const name = document.getElementById('patient-name').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    
    // Validation
    if (!code || !name || !email || !phone || !selectedTiming) {
        showError('Veuillez remplir tous les champs et choisir votre situation');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Veuillez entrer une adresse email valide');
        return;
    }
    
    // Animation de chargement
    const btn = document.getElementById('submit-btn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Sauvegarde locale pour tracking
    const paymentData = {
        code: code,
        name: name,
        email: email,
        phone: phone,
        timing: selectedTiming,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('furge_payment_pending', JSON.stringify(paymentData));
    
    // Traitement selon le choix
    if (selectedTiming === 'already') {
        // DÉJÀ RÉGULARISÉ : Accès direct sans paiement
        showSuccess('✅ Accès autorisé - Consultation déjà régularisée');
        
        // Sauvegarder comme "payé autrement"
        paymentData.paid = true;
        paymentData.paymentMethod = 'other';
        paymentData.paidAt = new Date().toISOString();
        
        let history = JSON.parse(localStorage.getItem('furge_payment_history') || '[]');
        history.push(paymentData);
        localStorage.setItem('furge_payment_history', JSON.stringify(history));
        
        // Redirection après 2 secondes
        setTimeout(() => {
            window.location.href = '/consultation-furge/?ref=' + code;
        }, 2000);
        
    } else {
        // PAIEMENT STRIPE
        const stripeUrl = selectedTiming === 'before' 
            ? STRIPE_CONFIG.prepayment 
            : STRIPE_CONFIG.postpayment;
        
        // Vérifier si les liens sont configurés
        if (stripeUrl.includes('test_')) {
            // Mode démo
            showSuccess('Mode démo : En production, vous serez redirigé vers le paiement sécurisé Stripe');
            
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                
                // Simulation de redirection après paiement
                if (selectedTiming === 'before') {
                    showSuccess('✅ Simulation : Prépaiement effectué. Code : ' + code);
                    setTimeout(() => {
                        if (confirm('Accéder à la consultation ?')) {
                            window.location.href = '/consultation-furge/?ref=' + code;
                        }
                    }, 2000);
                } else {
                    showSuccess('✅ Simulation : Règlement effectué. Merci !');
                }
            }, 2000);
        } else {
            // Production : Construction de l'URL avec paramètres
            const returnUrl = window.location.origin + window.location.pathname;
            const successUrl = `${returnUrl}?success=1&code=${code}&type=${selectedTiming}`;
            const cancelUrl = `${returnUrl}?cancel=1&code=${code}`;
            
            // Ajout des paramètres à l'URL Stripe
            let finalUrl = stripeUrl;
            const separator = stripeUrl.includes('?') ? '&' : '?';
            finalUrl += separator + 'prefilled_email=' + encodeURIComponent(email);
            finalUrl += '&success_url=' + encodeURIComponent(successUrl);
            finalUrl += '&cancel_url=' + encodeURIComponent(cancelUrl);
            finalUrl += '&client_reference_id=' + code;
            
            // Redirection
            window.location.href = finalUrl;
        }
    }
});

// Gestion du retour de Stripe et pré-remplissage
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Pré-remplir si code dans l'URL
    const urlCode = urlParams.get('code');
    if (urlCode) {
        const codeInput = document.getElementById('patient-code');
        codeInput.value = urlCode;
        
        // Afficher la notice
        document.getElementById('code-prefilled').classList.add('show');
        
        // Focus sur le nom
        document.getElementById('patient-name').focus();
    }
    
    // Gérer les retours de paiement
    if (urlParams.get('success') === '1') {
        const code = urlParams.get('code');
        const type = urlParams.get('type');
        
        // Récupérer les données sauvegardées
        const savedData = localStorage.getItem('furge_payment_pending');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Marquer comme payé
            data.paid = true;
            data.paymentMethod = 'stripe';
            data.paidAt = new Date().toISOString();
            
            // Sauvegarder dans l'historique
            let history = JSON.parse(localStorage.getItem('furge_payment_history') || '[]');
            history.push(data);
            localStorage.setItem('furge_payment_history', JSON.stringify(history));
            
            // Nettoyer le pending
            localStorage.removeItem('furge_payment_pending');
        }
        
        if (type === 'before') {
            showSuccess('✅ Prépaiement confirmé ! Code : ' + code);
            
            // Redirection automatique après 3 secondes
            setTimeout(() => {
                showSuccess('🚀 Redirection vers la consultation...');
                setTimeout(() => {
                    window.location.href = '/consultation-furge/?ref=' + code;
                }, 1000);
            }, 2000);
        } else {
            showSuccess('✅ Règlement effectué avec succès. Une confirmation vous a été envoyée par email.');
        }
    } else if (urlParams.get('cancel') === '1') {
        // Pré-remplir le code même en cas d'annulation
        const cancelCode = urlParams.get('code');
        if (cancelCode) {
            document.getElementById('patient-code').value = cancelCode;
            document.getElementById('code-prefilled').classList.add('show');
        }
        showError('Paiement annulé. Vous pouvez réessayer quand vous voulez.');
    }
});

// Fonctions utilitaires
function showError(message) {
    const errorBox = document.getElementById('error-msg');
    errorBox.textContent = message;
    errorBox.classList.add('show');
    
    setTimeout(() => {
        errorBox.classList.remove('show');
    }, 5000);
}

function showSuccess(message) {
    const successBox = document.getElementById('success-msg');
    successBox.innerHTML = message;
    successBox.classList.add('show');
}

// Auto-format téléphone
document.getElementById('patient-phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 0) {
        const match = value.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
            e.target.value = match.slice(1).join(' ');
        }
    }
});
</script>

    <?php
    return ob_get_clean();
}

// Enregistrement du shortcode
add_shortcode('paiement_furge', 'furge_payment_page');

// NE PAS mettre de ?> à la fin