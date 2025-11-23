# 📦 WPCode Snippets - Phone-Help & Télé-consultation

Repository centralisé des snippets WordPress (WPCode) pour les projets **Phone-Help** et **Télé-consultation Dr FURGE**.

[![Last Commit](https://img.shields.io/github/last-commit/fdonthewave/phone-help-code)](https://github.com/fdonthewave/phone-help-code/commits/main)
[![License](https://img.shields.io/badge/license-Private-red)](https://github.com/fdonthewave/phone-help-code)

---

## 📊 Statistiques

- **15 snippets** totaux versionnés
- **Phone-Help**: 11 snippets (~7,800 lignes)
- **Télé-consultation**: 4 snippets (~3,600 lignes)
- **Total**: ~11,400 lignes | ~418 KB de code

---

## 📁 Structure du Repository

```
phone-help-code/
├── README.md (ce fichier)
├── GUIDE-INTEGRATION-GITHUB.md
└── wpcode-snippets/
    ├── phone-help/ (11 snippets)
    │   ├── config/ (2 snippets)
    │   ├── client/ (1 snippet)
    │   ├── qualif-cardio/ (2 snippets)
    │   ├── qualif-pneumo/ (4 snippets)
    │   ├── tools/ (2 snippets)
    │   └── fixes/ (1 snippet)
    │
    └── tele-consultation/ (4 snippets)
```

---

## 🏥 Phone-Help (11 snippets)

### 📋 Configuration (2 snippets critiques)

| Fichier | WPCode ID | Description | Taille |
|---------|-----------|-------------|--------|
| [ph-config-global.js](wpcode-snippets/phone-help/config/ph-config-global.js) | **2506** | Configuration globale PhoneHelp<br>• Clients: MANEKINEKO, CUISINES, TECHCORP<br>• Agents: Alexandra, Marie<br>• Serveurs Jitsi: Primary 🇩🇪, Backup 🇫🇷<br>• Fonctions helpers | 7.5 KB<br>289 lignes |
| [ph-config-rustdesk.js](wpcode-snippets/phone-help/config/ph-config-rustdesk.js) | **2499** | ⚠️ **SENSIBLE** - Config RustDesk support<br>• Server: support.phone-help.net<br>• Clé API incluse<br>• IDs agents | 1.1 KB<br>40 lignes |

### 👤 Client (1 snippet)

| Fichier | WPCode ID | Description | Taille |
|---------|-----------|-------------|--------|
| [ph-client-generic.js](wpcode-snippets/phone-help/client/ph-client-generic.js) | **2455** | Interface client générique visio<br>• Switch serveur Jitsi (Primary/Backup)<br>• Boutons flottants aide + téléphone<br>• Panel aide responsive<br>• Design gradient violet #667eea→#764ba2 | 12.4 KB<br>504 lignes |

### 🏥 Qualifications Cardio (2 snippets)

| Fichier | Description | Taille |
|---------|-------------|--------|
| [qualif-cardio-audit-v10.js](wpcode-snippets/phone-help/qualif-cardio/qualif-cardio-audit-v10.js) | Audit qualifications cardio v10 | 32 KB |
| [qualif-cardio-formulaire-v55.js](wpcode-snippets/phone-help/qualif-cardio/qualif-cardio-formulaire-v55.js) | Formulaire qualifications cardio v55 | 65 KB |

### 🫁 Qualifications Pneumo (4 snippets)

| Fichier | Description | Taille |
|---------|-------------|--------|
| [qualif-pneumo-audit.js](wpcode-snippets/phone-help/qualif-pneumo/qualif-pneumo-audit.js) | Audit qualifications pneumo | 22 KB |
| [qualif-pneumo-audit-ordonnances.js](wpcode-snippets/phone-help/qualif-pneumo/qualif-pneumo-audit-ordonnances.js) | Audit ordonnances pneumo | 18 KB |
| [qualif-pneumo-formulaire-v10.js](wpcode-snippets/phone-help/qualif-pneumo/qualif-pneumo-formulaire-v10.js) | Formulaire qualifications pneumo v10 | 45 KB |
| [qualif-pneumo---demandes-ordonnancescertificats-v10.js](wpcode-snippets/phone-help/qualif-pneumo/qualif-pneumo---demandes-ordonnancescertificats-v10.js) | Demandes ordonnances/certificats v10 | 44 KB |

### 🛠️ Outils (2 snippets)

| Fichier | WPCode ID | Description | Taille |
|---------|-----------|-------------|--------|
| [simulateur-rentabilite-madagascar.js](wpcode-snippets/phone-help/tools/simulateur-rentabilite-madagascar.js) | - | Simulateur rentabilité agents Madagascar | 39 KB |
| [ph-utils-shortlinks.js](wpcode-snippets/phone-help/tools/ph-utils-shortlinks.js) | **2489** | Décodage codes courts visio<br>• Exemple: `DUP01021430` → `DUPONT-0102-1430`<br>• Redirection vers `/rdv-visio-phonehelp/`<br>• Logging accès avec IP | 8.3 KB<br>343 lignes |

### 🔧 Fixes (1 snippet)

| Fichier | Description | Taille |
|---------|-------------|--------|
| [cf7-email-confirmation-fix.js](wpcode-snippets/phone-help/fixes/cf7-email-confirmation-fix.js) | Fix email confirmation Contact Form 7 | 512 bytes |

---

## 🏥 Télé-consultation Dr FURGE (4 snippets)

| Fichier | WPCode ID | Description | Taille |
|---------|-----------|-------------|--------|
| [client-paiement.js](wpcode-snippets/tele-consultation/client-paiement.js) | **9** | Formulaire paiement Stripe<br>• 3 options: prépaiement, post-paiement, déjà régularisé<br>• Shortcode: `[paiement_furge]` | 21 KB<br>20,678 car. |
| [client-consultation.js](wpcode-snippets/tele-consultation/client-consultation.js) | **10** | Interface vidéo patient<br>• Shortcode: `[consultation_furge]` | 47 KB<br>46,648 car. |
| [admin-dashboard.js](wpcode-snippets/tele-consultation/admin-dashboard.js) | **11** | Dashboard médecin<br>• Shortcode: `[dashboard_furge]` | 34 KB<br>33,366 car. |
| [consultation-patient-ref.js](wpcode-snippets/tele-consultation/consultation-patient-ref.js) | - | Accès consultation avec code patient<br>• Formulaire si pas de `?ref=`<br>• Iframe Jitsi `meet.ffmuc.net/FURGE-{ref}` | 3.6 KB<br>84 lignes |

---

## 🚀 Installation & Utilisation

### Prérequis

- WordPress 5.0+
- Plugin **WPCode** (gratuit ou Pro)
- PHP 7.4+

### Méthode 1 : Import via WPCode (Recommandé)

1. **Télécharger** le fichier `.js` depuis GitHub
2. Dans WordPress, aller dans **Snippets > + Add Snippet**
3. Choisir **Import/Export** > **Import Code Snippet**
4. **Uploader** le fichier `.js`
5. **Activer** le snippet

### Méthode 2 : Copier-coller manuel

1. Ouvrir le fichier `.js` sur GitHub
2. Copier tout le contenu
3. Dans WordPress, aller dans **Snippets > + Add Snippet**
4. Choisir **Add Your Custom Code (New Snippet)**
5. Coller le code
6. Configurer les paramètres (type, location, priority)
7. **Activer** le snippet

---

## ⚙️ Configuration Phone-Help

### Dépendances critiques

⚠️ **IMPORTANT** : Le snippet **2506 (ph-config-global.js)** doit TOUJOURS être chargé **AVANT** les autres snippets Phone-Help.

**Ordre de priorité recommandé** :
1. `ph-config-global.js` (Priority: 1)
2. `ph-config-rustdesk.js` (Priority: 1)
3. Autres snippets Phone-Help (Priority: 10+)

### Clients configurés

| Code | Nom | Couleur | Agent | Horaires | Room Jitsi |
|------|-----|---------|-------|----------|------------|
| `MANEKINEKO` | Manekineko | #667eea 🏢 | Alexandra | 9h-13h | PHONEHELP-ALEXANDRA-MANEKINEKO |
| `CUISINES` | Cuisines et Fourneaux | #A8220D 🍳 | Alexandra | 14h-17h | PHONEHELP-ALEXANDRA-CUISINES |
| `TECHCORP` | TechCorp France | #2ecc71 💻 | Marie | 9h-12h | PHONEHELP-MARIE-TECHCORP |

### Serveurs Jitsi

| Serveur | URL | Icône | Utilisation |
|---------|-----|-------|-------------|
| **Primary** | https://meet.ffmuc.net/ | 🇩🇪 | Par défaut |
| **Backup** | https://visio.chapril.org/ | 🇫🇷 | Fallback manuel |

---

## 🔐 Sécurité & Confidentialité

### ⚠️ Fichiers sensibles

Le fichier suivant contient des **informations sensibles** et ne doit **PAS** être partagé publiquement :

- **`wpcode-snippets/phone-help/config/ph-config-rustdesk.js`**
  - Clé API RustDesk
  - Configuration serveur support
  - IDs agents

**Recommandation** : Garder ce repository **privé** ou utiliser `.gitignore` pour exclure les fichiers sensibles.

### 🔒 Données personnelles

Aucun fichier ne contient :
- ❌ Mots de passe en clair
- ❌ Tokens d'authentification
- ❌ Données personnelles clients
- ❌ Numéros de carte bancaire

---

## 📝 Shortcodes disponibles

### Phone-Help

Aucun shortcode public (snippets système backend uniquement).

### Télé-consultation

| Shortcode | Description | Page |
|-----------|-------------|------|
| `[paiement_furge]` | Formulaire paiement consultation | `/paiement-consultation-furge/` |
| `[consultation_furge]` | Interface vidéo patient | `/consultation-furge/` |
| `[dashboard_furge]` | Dashboard médecin | `/dashboard-furge/` (admin) |

---

## 🛠️ Maintenance

### Mise à jour d'un snippet

1. **Modifier** le fichier `.js` localement
2. **Tester** en dev/staging
3. **Commit** sur GitHub
4. **Uploader** dans WordPress WPCode
5. **Vérifier** en production

### Versioning

- **Commit message format** : `[Type] Description courte`
  - `✨ [NEW]` : Nouveau snippet
  - `🐛 [FIX]` : Correction bug
  - `⚡ [IMPROVE]` : Amélioration
  - `📝 [DOC]` : Documentation
  - `🔒 [SECURITY]` : Sécurité

---

## 📈 Historique des versions

### v2.0 - 23 novembre 2025
- ➕ Ajout 4 snippets critiques Phone-Help (2506, 2499, 2455, 2489)
- ➕ Ajout 1 snippet consultation FURGE (code patient ref)
- ✅ Restructuration Option B (multi-projets)
- 📁 Création dossiers `config/` et `client/`
- **Total** : 15 snippets | 11,260 lignes

### v1.0 - 13 novembre 2025
- 📦 Restructuration Option B validée
- 📁 Structure multi-projets créée
- ✅ 8 snippets Phone-Help (qualif-cardio, qualif-pneumo, tools, fixes)
- ✅ 3 snippets Télé-consultation (paiement, consultation, dashboard)
- **Total** : 11 snippets | 10,000 lignes

---

## 🤝 Contribution

Ce repository est **privé** et maintenu par **François Danaels**.

### Workflow

1. **Notion** = Documentation & Décisions (source de vérité)
2. **Claude Projects** = Context opérationnel
3. **GitHub** = Versioning code
4. **WPCode** = Déploiement WordPress

---

## 📞 Contact & Support

### Phone-Help

- **Website** : [phone-help.net](https://phone-help.net)
- **Email** : support@phone-help.net
- **Téléphone** : 01 83 75 02 35

### Télé-consultation Dr FURGE

- **Website** : [tele-consultation.com](https://tele-consultation.com)
- **Email** : contact@tele-consultation.com

---

## 📚 Documentation

- [Guide d'intégration GitHub](GUIDE-INTEGRATION-GITHUB.md)
- [Méthodologie Infrastructure](https://www.notion.so/METHODOLOGIE-INFRASTRUCTURE-2-0) (Notion)
- [Architecture Pro-Assistante](https://www.notion.so/ARCHITECTURE-PRO-ASSISTANTE) (Notion)

---

## 📄 License

**Propriétaire privé** - Tous droits réservés © 2025 François Danaels

Ce code est la propriété exclusive de François Danaels et ne peut être utilisé, copié, modifié ou distribué sans autorisation écrite préalable.

---

## 🔗 Liens rapides

- [Repository GitHub](https://github.com/fdonthewave/phone-help-code)
- [Commits](https://github.com/fdonthewave/phone-help-code/commits/main)
- [Issues](https://github.com/fdonthewave/phone-help-code/issues)

---

*Dernière mise à jour : 23 novembre 2025 à 22:30*  
*Version : 2.0*  
*Commit : [`6fab5ad`](https://github.com/fdonthewave/phone-help-code/commit/6fab5ad)*
