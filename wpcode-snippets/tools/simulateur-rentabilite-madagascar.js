/**
 * Snippet ID: 8
 * Name: Simulateur Rentabilite Madagascar
 * Modified: 2025-10-17 20:47:41
 * Active: True
 * Source: simulateur-rentabilite-madagascar_code-snippets.json
 */


/**
 * Phone-Help Simulateur de Rentabilité
 * 
 * Shortcode: [phone_help_simulator]
 */

function phone_help_simulator_shortcode() {
    ob_start();
    ?>
    
    <style>
        .phone-help-simulator * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        .phone-help-simulator {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
            color: #333;
            max-width: 1400px;
            margin: 20px auto;
        }
        
        .phone-help-simulator h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 32px;
        }
        
        .phone-help-simulator .subtitle {
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .phone-help-simulator .section {
            margin-bottom: 40px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            background: #fafafa;
        }
        
        .phone-help-simulator .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #34495e;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }
        
        .phone-help-simulator .three-columns {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .phone-help-simulator .column {
            background: white;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        
        .phone-help-simulator .column-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .phone-help-simulator .col-client { border-left: 4px solid #3498db; }
        .phone-help-simulator .col-freelance { border-left: 4px solid #e74c3c; }
        .phone-help-simulator .col-marge { border-left: 4px solid #27ae60; }
        
        .phone-help-simulator .form-group {
            margin-bottom: 15px;
        }
        
        .phone-help-simulator label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            color: #555;
            font-weight: 500;
        }
        
        .phone-help-simulator input[type="number"],
        .phone-help-simulator input[type="text"],
        .phone-help-simulator select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        .phone-help-simulator input[type="number"]:focus,
        .phone-help-simulator input[type="text"]:focus,
        .phone-help-simulator select:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .phone-help-simulator .readonly {
            background: #ecf0f1;
            color: #7f8c8d;
            cursor: not-allowed;
        }
        
        .phone-help-simulator .client-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .phone-help-simulator .client-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .phone-help-simulator .client-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .phone-help-simulator .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .phone-help-simulator .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .phone-help-simulator .btn-primary:hover {
            background: #2980b9;
        }
        
        .phone-help-simulator .btn-danger {
            background: #e74c3c;
            color: white;
            font-size: 11px;
            padding: 4px 8px;
        }
        
        .phone-help-simulator .btn-danger:hover {
            background: #c0392b;
        }
        
        .phone-help-simulator .btn-add {
            background: #95a5a6;
            color: white;
            margin-top: 10px;
        }
        
        .phone-help-simulator .btn-add:hover {
            background: #7f8c8d;
        }
        
        .phone-help-simulator .btn-calculate {
            background: #27ae60;
            color: white;
            font-size: 18px;
            padding: 15px 40px;
            display: block;
            margin: 30px auto;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .phone-help-simulator .btn-calculate:hover {
            background: #229954;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.15);
        }
        
        .phone-help-simulator .results {
            background: #ecf0f1;
            padding: 30px;
            border-radius: 8px;
            margin-top: 40px;
        }
        
        .phone-help-simulator .results-title {
            font-size: 28px;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-weight: 700;
        }
        
        .phone-help-simulator .year-result {
            background: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 5px solid #3498db;
        }
        
        .phone-help-simulator .year-title {
            font-size: 22px;
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .phone-help-simulator .result-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        
        .phone-help-simulator .result-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        }
        
        .phone-help-simulator .result-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: 600;
        }
        
        .phone-help-simulator .result-value {
            font-size: 24px;
            color: #2c3e50;
            font-weight: 700;
        }
        
        .phone-help-simulator .profit-total {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-top: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .phone-help-simulator .profit-label {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .phone-help-simulator .profit-amount {
            font-size: 48px;
            font-weight: 700;
        }
        
        .phone-help-simulator .breakdown {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
        }
        
        .phone-help-simulator .breakdown-title {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .phone-help-simulator .breakdown-line {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ecf0f1;
        }
        
        .phone-help-simulator .breakdown-line:last-child {
            border-bottom: none;
            font-weight: 600;
            font-size: 16px;
            padding-top: 15px;
            margin-top: 10px;
            border-top: 2px solid #3498db;
        }
        
        .phone-help-simulator .hidden {
            display: none;
        }
        
        .phone-help-simulator .freelance-block {
            background: #fff;
            border: 2px solid #3498db;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .phone-help-simulator .freelance-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .phone-help-simulator .note {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 12px;
            margin-top: 15px;
            font-size: 13px;
            color: #856404;
        }
        
        @media (max-width: 1024px) {
            .phone-help-simulator .three-columns {
                grid-template-columns: 1fr;
            }
            
            .phone-help-simulator .result-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <div class="phone-help-simulator">
        <h1>📊 Phone-Help - Simulateur de Rentabilité</h1>
        <p class="subtitle">Simulateur de viabilité économique avec calcul détaillé des marges</p>
        
        <!-- SECTION 1: TARIFS HORAIRES -->
        <div class="section">
            <div class="section-title">1. Tarification Horaire par Volume</div>
            <div class="three-columns">
                <div class="column col-client">
                    <div class="column-title">💰 Tarif Client</div>
                    <div class="form-group">
                        <label>20-50h /mois (€/h)</label>
                        <input type="number" id="tarif_20_50" value="8.50" step="0.10">
                    </div>
                    <div class="form-group">
                        <label>51-80h /mois (€/h)</label>
                        <input type="number" id="tarif_51_80" value="7.50" step="0.10">
                    </div>
                    <div class="form-group">
                        <label>81-120h /mois (€/h)</label>
                        <input type="number" id="tarif_81_120" value="7.00" step="0.10">
                    </div>
                    <div class="form-group">
                        <label>121-160h /mois (€/h)</label>
                        <input type="number" id="tarif_121_160" value="6.50" step="0.10">
                    </div>
                </div>
                
                <div class="column col-freelance">
                    <div class="column-title">👤 Tarif Freelance</div>
                    <div class="form-group">
                        <label>Année 1 (€/h)</label>
                        <input type="number" id="tarif_freelance_an1" value="5.00" step="0.10">
                    </div>
                    <div class="form-group">
                        <label>Année 2 (€/h)</label>
                        <input type="number" id="tarif_freelance_an2" value="5.00" step="0.10">
                    </div>
                    <div class="form-group">
                        <label>Année 3 (€/h)</label>
                        <input type="number" id="tarif_freelance_an3" value="5.50" step="0.10">
                    </div>
                </div>
                
                <div class="column col-marge">
                    <div class="column-title">✅ Ta Marge (calculée)</div>
                    <div class="form-group">
                        <label>20-50h</label>
                        <input type="text" id="marge_20_50" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>51-80h</label>
                        <input type="text" id="marge_51_80" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>81-120h</label>
                        <input type="text" id="marge_81_120" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>121-160h</label>
                        <input type="text" id="marge_121_160" class="readonly" readonly>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- SECTION 2: FORFAITS INFRASTRUCTURE -->
        <div class="section">
            <div class="section-title">2. Forfaits Infrastructure (Paliers)</div>
            <div class="three-columns">
                <div class="column col-client">
                    <div class="column-title">💰 Tarif Client</div>
                    <div class="form-group">
                        <label>Minimum (0-50h)</label>
                        <input type="number" id="forfait_min" value="50" step="5">
                    </div>
                    <div class="form-group">
                        <label>Linéaire (51-120h) - €/h</label>
                        <input type="number" id="forfait_lineaire" value="1" step="0.10">
                    </div>
                    <div class="form-group">
                        <label>Maximum (121h+)</label>
                        <input type="number" id="forfait_max" value="120" step="5">
                    </div>
                </div>
                
                <div class="column col-freelance">
                    <div class="column-title">💸 Tes Coûts</div>
                    <div class="form-group">
                        <label>VM /mois (€)</label>
                        <input type="number" id="cout_vm" value="7" step="1">
                    </div>
                    <div class="form-group">
                        <label>Virement /mois (€)</label>
                        <input type="number" id="cout_virement" value="25" step="1">
                    </div>
                    <div class="form-group">
                        <label>Total coûts fixes</label>
                        <input type="text" id="cout_total" class="readonly" readonly>
                    </div>
                </div>
                
                <div class="column col-marge">
                    <div class="column-title">✅ Marge Nette</div>
                    <div class="note">
                        La marge sur forfaits dépend du nombre de clients par freelance.
                        <br><br>
                        Exemple : 2 clients × 80€ = 160€<br>
                        Moins coûts fixes 32€ = 128€ net
                    </div>
                </div>
            </div>
        </div>
        
        <!-- SECTION 3: SETUP & SUIVI -->
        <div class="section">
            <div class="section-title">3. Setup & Forfait Suivi Annuel</div>
            <div class="three-columns">
                <div class="column col-client">
                    <div class="column-title">💰 Prix Client</div>
                    <div class="form-group">
                        <label>Setup 3 mois (€)</label>
                        <input type="number" id="setup_3m" value="800" step="10">
                    </div>
                    <div class="form-group">
                        <label>Setup 6 mois (€)</label>
                        <input type="number" id="setup_6m" value="890" step="10">
                    </div>
                    <div class="form-group">
                        <label>Setup 12 mois (€)</label>
                        <input type="number" id="setup_12m" value="1000" step="10">
                    </div>
                    <div class="form-group">
                        <label>Setup 24 mois (€)</label>
                        <input type="number" id="setup_24m" value="1200" step="10">
                    </div>
                    <div class="form-group">
                        <label>Forfait suivi annuel standard (€)</label>
                        <input type="number" id="forfait_suivi_standard" value="240" step="10">
                    </div>
                </div>
                
                <div class="column col-freelance">
                    <div class="column-title">💸 Coût Freelance</div>
                    <div class="form-group">
                        <label>Setup</label>
                        <input type="text" value="0€" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>Forfait suivi</label>
                        <input type="text" value="0€" class="readonly" readonly>
                    </div>
                    <div class="note" style="margin-top: 40px;">
                        Les setups et forfaits suivi sont de la marge pure. La freelance ne reçoit rien.
                    </div>
                </div>
                
                <div class="column col-marge">
                    <div class="column-title">✅ Ta Marge</div>
                    <div class="form-group">
                        <label>Setup 3 mois</label>
                        <input type="text" id="marge_setup_3m" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>Setup 6 mois</label>
                        <input type="text" id="marge_setup_6m" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>Setup 12 mois</label>
                        <input type="text" id="marge_setup_12m" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>Setup 24 mois</label>
                        <input type="text" id="marge_setup_24m" class="readonly" readonly>
                    </div>
                    <div class="form-group">
                        <label>Forfait suivi annuel</label>
                        <input type="text" id="marge_suivi" class="readonly" readonly>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <label style="font-weight: 600; margin-bottom: 10px; display: block;">Répartition des engagements (%)</label>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                    <div class="form-group">
                        <label>3 mois (%)</label>
                        <input type="number" id="repart_3m" value="10" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>6 mois (%)</label>
                        <input type="number" id="repart_6m" value="20" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>12 mois (%)</label>
                        <input type="number" id="repart_12m" value="50" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>24 mois (%)</label>
                        <input type="number" id="repart_24m" value="20" min="0" max="100">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- SECTION 4: CONFIGURATION ANNÉES -->
        <div class="section">
            <div class="section-title">4. Configuration par Année</div>
            <div id="years-container">
                <!-- Les années seront ajoutées dynamiquement ici -->
            </div>
            <button class="btn btn-primary" onclick="ajouterAnnee()">+ Ajouter Année</button>
        </div>
        
        <!-- BOUTON CALCULER -->
        <button class="btn btn-calculate" onclick="calculer()">🚀 CALCULER LA RENTABILITÉ</button>
        
        <!-- RÉSULTATS -->
        <div id="results" class="results hidden">
            <!-- Les résultats seront affichés ici -->
        </div>
    </div>

    <script>
        let annees = [];
        let nextAnneeNum = 1;
        let nextFreelanceId = 1;
        let nextClientId = 1;
        
        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            ajouterAnnee();
            calculerMarges();
            
            document.querySelectorAll('.phone-help-simulator input[type="number"]').forEach(input => {
                input.addEventListener('input', calculerMarges);
            });
        });
        
        function calculerMarges() {
            const tarif2050 = parseFloat(document.getElementById('tarif_20_50').value);
            const tarif5180 = parseFloat(document.getElementById('tarif_51_80').value);
            const tarif81120 = parseFloat(document.getElementById('tarif_81_120').value);
            const tarif121160 = parseFloat(document.getElementById('tarif_121_160').value);
            const tarifFreelanceAn1 = parseFloat(document.getElementById('tarif_freelance_an1').value);
            
            document.getElementById('marge_20_50').value = (tarif2050 - tarifFreelanceAn1).toFixed(2) + '€/h';
            document.getElementById('marge_51_80').value = (tarif5180 - tarifFreelanceAn1).toFixed(2) + '€/h';
            document.getElementById('marge_81_120').value = (tarif81120 - tarifFreelanceAn1).toFixed(2) + '€/h';
            document.getElementById('marge_121_160').value = (tarif121160 - tarifFreelanceAn1).toFixed(2) + '€/h';
            
            const vm = parseFloat(document.getElementById('cout_vm').value);
            const virement = parseFloat(document.getElementById('cout_virement').value);
            document.getElementById('cout_total').value = (vm + virement).toFixed(2) + '€';
            
            document.getElementById('marge_setup_3m').value = document.getElementById('setup_3m').value + '€';
            document.getElementById('marge_setup_6m').value = document.getElementById('setup_6m').value + '€';
            document.getElementById('marge_setup_12m').value = document.getElementById('setup_12m').value + '€';
            document.getElementById('marge_setup_24m').value = document.getElementById('setup_24m').value + '€';
            document.getElementById('marge_suivi').value = document.getElementById('forfait_suivi_standard').value + '€';
        }
        
        function ajouterAnnee() {
            const anneeNum = nextAnneeNum++;
            const anneeData = {
                num: anneeNum,
                annee: 2024 + anneeNum,
                freelances: []
            };
            annees.push(anneeData);
            
            const container = document.getElementById('years-container');
            const anneeDiv = document.createElement('div');
            anneeDiv.id = `annee-${anneeNum}`;
            anneeDiv.className = 'section';
            anneeDiv.style.background = '#fff';
            anneeDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Année ${anneeNum} (${anneeData.annee})</h3>
                    <button class="btn btn-danger" onclick="supprimerAnnee(${anneeNum})">Supprimer cette année</button>
                </div>
                <div id="freelances-${anneeNum}">
                </div>
                <button class="btn btn-add" onclick="ajouterFreelance(${anneeNum})">+ Ajouter Freelance</button>
                <div class="form-group" style="margin-top: 20px; max-width: 300px;">
                    <label>Nombre de nouveaux clients cette année (pour setups)</label>
                    <input type="number" id="nouveaux_clients_${anneeNum}" value="0" min="0">
                </div>
            `;
            container.appendChild(anneeDiv);
            
            ajouterFreelance(anneeNum);
        }
        
        function supprimerAnnee(anneeNum) {
            if (annees.length <= 1) {
                alert('Vous devez garder au moins une année !');
                return;
            }
            document.getElementById(`annee-${anneeNum}`).remove();
            annees = annees.filter(a => a.num !== anneeNum);
        }
        
        function ajouterFreelance(anneeNum) {
            const freelanceId = nextFreelanceId++;
            const annee = annees.find(a => a.num === anneeNum);
            const freelanceData = {
                id: freelanceId,
                clients: []
            };
            annee.freelances.push(freelanceData);
            
            const container = document.getElementById(`freelances-${anneeNum}`);
            const freelanceDiv = document.createElement('div');
            freelanceDiv.id = `freelance-${freelanceId}`;
            freelanceDiv.className = 'freelance-block';
            freelanceDiv.innerHTML = `
                <div class="freelance-title">
                    <span>Freelance ${annee.freelances.length}</span>
                    <button class="btn btn-danger" onclick="supprimerFreelance(${anneeNum}, ${freelanceId})">Supprimer</button>
                </div>
                <div id="clients-${freelanceId}">
                </div>
                <button class="btn btn-add" onclick="ajouterClient(${anneeNum}, ${freelanceId})">+ Ajouter Client</button>
            `;
            container.appendChild(freelanceDiv);
            
            ajouterClient(anneeNum, freelanceId);
        }
        
        function supprimerFreelance(anneeNum, freelanceId) {
            const annee = annees.find(a => a.num === anneeNum);
            if (annee.freelances.length <= 1) {
                alert('Vous devez garder au moins une freelance par année !');
                return;
            }
            document.getElementById(`freelance-${freelanceId}`).remove();
            annee.freelances = annee.freelances.filter(f => f.id !== freelanceId);
        }
        
        function ajouterClient(anneeNum, freelanceId) {
            const clientId = nextClientId++;
            const annee = annees.find(a => a.num === anneeNum);
            const freelance = annee.freelances.find(f => f.id === freelanceId);
            const clientData = {
                id: clientId,
                heures: 80,
                forfaitSuivi: 240,
                nouveauClient: false
            };
            freelance.clients.push(clientData);
            
            const container = document.getElementById(`clients-${freelanceId}`);
            const clientDiv = document.createElement('div');
            clientDiv.id = `client-${clientId}`;
            clientDiv.className = 'client-card';
            clientDiv.innerHTML = `
                <div class="client-header">
                    <div class="client-name">Client ${freelance.clients.length}</div>
                    <button class="btn btn-danger" onclick="supprimerClient(${anneeNum}, ${freelanceId}, ${clientId})">✕</button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Heures/mois</label>
                        <input type="number" id="heures_${clientId}" value="80" min="20" max="160" step="10">
                    </div>
                    <div class="form-group">
                        <label>Forfait suivi annuel (€)</label>
                        <select id="suivi_${clientId}">
                            <option value="0">Aucun (0€)</option>
                            <option value="240" selected>Standard (240€)</option>
                            <option value="350">Élevé (350€)</option>
                            <option value="500">Premium (500€)</option>
                        </select>
                    </div>
                </div>
            `;
            container.appendChild(clientDiv);
        }
        
        function supprimerClient(anneeNum, freelanceId, clientId) {
            const annee = annees.find(a => a.num === anneeNum);
            const freelance = annee.freelances.find(f => f.id === freelanceId);
            if (freelance.clients.length <= 1) {
                alert('Vous devez garder au moins un client par freelance !');
                return;
            }
            document.getElementById(`client-${clientId}`).remove();
            freelance.clients = freelance.clients.filter(c => c.id !== clientId);
        }
        
        function getTarifHoraireClient(heures) {
            if (heures <= 50) return parseFloat(document.getElementById('tarif_20_50').value);
            if (heures <= 80) return parseFloat(document.getElementById('tarif_51_80').value);
            if (heures <= 120) return parseFloat(document.getElementById('tarif_81_120').value);
            return parseFloat(document.getElementById('tarif_121_160').value);
        }
        
        function getForfaitInfra(heures) {
            const min = parseFloat(document.getElementById('forfait_min').value);
            const lineaire = parseFloat(document.getElementById('forfait_lineaire').value);
            const max = parseFloat(document.getElementById('forfait_max').value);
            
            if (heures <= 50) return min;
            if (heures <= 120) return heures * lineaire;
            return max;
        }
        
        function calculer() {
            const resultatsDiv = document.getElementById('results');
            resultatsDiv.innerHTML = '';
            resultatsDiv.classList.remove('hidden');
            
            let html = '<div class="results-title">📊 RÉSULTATS DE LA SIMULATION</div>';
            
            let profitTotalGlobal = 0;
            
            annees.forEach(annee => {
                const tarifFreelance = parseFloat(document.getElementById(`tarif_freelance_an${annee.num}`).value);
                const nouveauxClients = parseInt(document.getElementById(`nouveaux_clients_${annee.num}`).value) || 0;
                
                const setup3m = parseFloat(document.getElementById('setup_3m').value);
                const setup6m = parseFloat(document.getElementById('setup_6m').value);
                const setup12m = parseFloat(document.getElementById('setup_12m').value);
                const setup24m = parseFloat(document.getElementById('setup_24m').value);
                
                const repart3m = parseFloat(document.getElementById('repart_3m').value) / 100;
                const repart6m = parseFloat(document.getElementById('repart_6m').value) / 100;
                const repart12m = parseFloat(document.getElementById('repart_12m').value) / 100;
                const repart24m = parseFloat(document.getElementById('repart_24m').value) / 100;
                
                const nb3m = Math.round(nouveauxClients * repart3m);
                const nb6m = Math.round(nouveauxClients * repart6m);
                const nb12m = Math.round(nouveauxClients * repart12m);
                const nb24m = nouveauxClients - nb3m - nb6m - nb12m;
                
                const revenusSetups = (nb3m * setup3m) + (nb6m * setup6m) + (nb12m * setup12m) + (nb24m * setup24m);
                
                let totalHeures = 0;
                let totalClients = 0;
                let revenusHeures = 0;
                let coutFreelances = 0;
                let revenusForfaits = 0;
                let revenusSuivi = 0;
                
                annee.freelances.forEach(freelance => {
                    freelance.clients.forEach(client => {
                        const heures = parseFloat(document.getElementById(`heures_${client.id}`).value);
                        const suiviAnnuel = parseFloat(document.getElementById(`suivi_${client.id}`).value);
                        
                        totalHeures += heures;
                        totalClients++;
                        
                        const tarifClient = getTarifHoraireClient(heures);
                        const forfaitInfra = getForfaitInfra(heures);
                        
                        revenusHeures += heures * tarifClient;
                        coutFreelances += heures * tarifFreelance;
                        revenusForfaits += forfaitInfra;
                        revenusSuivi += suiviAnnuel;
                    });
                });
                
                const margeHeures = revenusHeures - coutFreelances;
                const vm = parseFloat(document.getElementById('cout_vm').value);
                const virement = parseFloat(document.getElementById('cout_virement').value);
                const coutsFixes = (vm + virement) * annee.freelances.length * 12;
                
                const margeForfaits = revenusForfaits * 12;
                const margeSuivi = revenusSuivi;
                
                const profitRecurrent = (margeHeures * 12) + margeForfaits + margeSuivi - coutsFixes;
                const profitTotal = revenusSetups + profitRecurrent;
                
                profitTotalGlobal += profitTotal;
                
                html += `
                    <div class="year-result">
                        <div class="year-title">Année ${annee.num} (${annee.annee})</div>
                        
                        <div class="result-grid">
                            <div class="result-box">
                                <div class="result-label">Freelances</div>
                                <div class="result-value">${annee.freelances.length}</div>
                            </div>
                            <div class="result-box">
                                <div class="result-label">Clients totaux</div>
                                <div class="result-value">${totalClients}</div>
                            </div>
                            <div class="result-box">
                                <div class="result-label">Heures/mois</div>
                                <div class="result-value">${totalHeures}h</div>
                            </div>
                        </div>
                        
                        <div class="breakdown">
                            <div class="breakdown-title">💰 SETUPS (nouveaux clients: ${nouveauxClients})</div>
                            <div class="breakdown-line">
                                <span>${nb3m} × ${setup3m}€ (3 mois)</span>
                                <span>${(nb3m * setup3m).toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span>${nb6m} × ${setup6m}€ (6 mois)</span>
                                <span>${(nb6m * setup6m).toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span>${nb12m} × ${setup12m}€ (12 mois)</span>
                                <span>${(nb12m * setup12m).toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span>${nb24m} × ${setup24m}€ (24 mois)</span>
                                <span>${(nb24m * setup24m).toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span><strong>Total Setups</strong></span>
                                <span><strong>${revenusSetups.toFixed(0)}€</strong></span>
                            </div>
                        </div>
                        
                        <div class="breakdown">
                            <div class="breakdown-title">🔄 RÉCURRENT ANNUEL</div>
                            <div class="breakdown-line">
                                <span>Marge heures (${totalHeures}h/mois × 12)</span>
                                <span>${(margeHeures * 12).toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span>Forfaits infrastructure × 12</span>
                                <span>${margeForfaits.toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span>Forfaits suivi annuels</span>
                                <span>${margeSuivi.toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span>Coûts fixes (VM + virements)</span>
                                <span>-${coutsFixes.toFixed(0)}€</span>
                            </div>
                            <div class="breakdown-line">
                                <span><strong>Profit Récurrent</strong></span>
                                <span><strong>${profitRecurrent.toFixed(0)}€</strong></span>
                            </div>
                        </div>
                        
                        <div class="profit-total">
                            <div class="profit-label">PROFIT TOTAL ANNÉE ${annee.num}</div>
                            <div class="profit-amount">${profitTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€</div>
                            <div class="profit-label" style="margin-top: 10px;">Soit ${(profitTotal / 12).toFixed(0)}€/mois en moyenne</div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                <div class="year-result" style="border-left-color: #27ae60;">
                    <div class="year-title">📈 RÉSUMÉ ${annees.length} ANS</div>
                    <div class="profit-total" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
                        <div class="profit-label">PROFIT CUMULÉ ${annees.length} ANS</div>
                        <div class="profit-amount">${profitTotalGlobal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€</div>
                        <div class="profit-label" style="margin-top: 10px;">
                            Soit ${(profitTotalGlobal / annees.length).toFixed(0)}€/an en moyenne
                        </div>
                    </div>
                </div>
            `;
            
            resultatsDiv.innerHTML = html;
            resultatsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    </script>
    
    <?php
    return ob_get_clean();
}

add_shortcode('phone_help_simulator', 'phone_help_simulator_shortcode');
?>
```

---

## 📝 COMMENT L'INSTALLER :

1. **Va dans WordPress** → Extensions → Code Snippets
2. **Ajoute un nouveau snippet**
3. **Colle le code ci-dessus**
4. **Sauvegarde et active**
5. **Utilise le shortcode** dans n'importe quelle page :
```
[phone_help_simulator]