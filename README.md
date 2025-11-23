# 📦 Code Snippets - Multi-Projets WordPress

Repository centralisé des snippets WPCode pour les projets web médicaux.

---

## 📁 STRUCTURE

```
wpcode-snippets/
├── phone-help/              # 🏥 Phone-Help (Secrétariat médical)
│   ├── qualif-cardio/       # Qualifications cardiologie (2 snippets)
│   ├── qualif-pneumo/       # Qualifications pneumologie (4 snippets)
│   ├── tools/               # Outils (1 snippet)
│   └── fixes/               # Correctifs (1 snippet)
│
└── tele-consultation/       # 💻 Téléconsultation Furge (Dr Camille Furgé)
    ├── client-paiement.js       # Interface paiement Stripe
    ├── client-consultation.js   # Interface consultation patient
    └── admin-dashboard.js       # Dashboard admin médecin
```

---

## 🏥 PHONE-HELP (8 snippets)

**Site** : phone-help.fr  
**Mission** : Secrétariat médical téléphonique pour cabinets médicaux

### Qualifications Cardiologie (2)
- `qualif-cardio-audit-v10.js` (32 KB, 692 lignes)
- `qualif-cardio-formulaire-v55.js` (65 KB, 1367 lignes)

### Qualifications Pneumologie (4)
- `qualif-pneumo-audit.js` (21 KB, 630 lignes)
- `qualif-pneumo-audit-ordonnances.js` (18 KB, 424 lignes)
- `qualif-pneumo-formulaire-v10.js` (45 KB, 1302 lignes)
- `qualif-pneumo-demandes-ordonnancescertificats-v10.js` (43 KB, 1236 lignes)

### Tools (1)
- `simulateur-rentabilite-madagascar.js` (40 KB, 946 lignes)

### Fixes (1)
- `cf7-email-confirmation-fix.js` (285 bytes, 10 lignes)

---

## 💻 TELE-CONSULTATION (3 snippets)

**Site** : tele-consultation.com  
**Mission** : Plateforme téléconsultation Dr Camille Furgé

### Client Paiement
**Fichier** : `client-paiement.js` (20 KB)  
**Shortcode** : `[paiement_furge]`  
**Fonction** : Formulaire paiement Stripe avec 3 options
- 💳 Prépaiement (avant consultation)
- 📅 Post-paiement (après consultation)
- ✅ Déjà régularisé (accès direct)

**Features** :
- Intégration Stripe
- Validation temps réel
- LocalStorage pour tracking
- Responsive mobile
- Design médical épuré (gradient violet)

### Client Consultation
**Fichier** : `client-consultation.js` (46 KB)  
**Shortcode** : `[consultation_furge]`  
**Fonction** : Interface vidéo consultation patient

**Features** :
- Formulaire médical pré-consultation
- Salle d'attente virtuelle
- Motif de consultation
- Antécédents médicaux
- Upload documents médicaux
- Design responsive

### Admin Dashboard
**Fichier** : `admin-dashboard.js` (33 KB)  
**Shortcode** : `[dashboard_furge]`  
**Fonction** : Dashboard médecin

**Features** :
- Gestion consultations
- Liste patients
- Statistiques
- Export données
- Interface admin sécurisée

---

## 🔧 UTILISATION

### Import dans WordPress

1. **WPCode Plugin** (recommandé)
```
Extensions → WPCode → + Ajouter
Copier/coller le contenu du fichier .js
Type: PHP Snippet
```

2. **functions.php**
```php
// Copier directement le code dans functions.php
// ⚠️ Attention : backup avant modification
```

### Shortcodes disponibles

**Phone-Help** :
- Pas de shortcodes (snippets backend uniquement)

**Téléconsultation** :
- `[paiement_furge]` - Page paiement
- `[consultation_furge]` - Page consultation patient
- `[dashboard_furge]` - Dashboard médecin

---

## 📊 STATISTIQUES

| Projet | Snippets | Lignes | Taille |
|--------|----------|---------|--------|
| Phone-Help | 8 | ~5 000 | 263 KB |
| Télé-consultation | 3 | ~1 500 | 100 KB |
| **TOTAL** | **11** | **~6 500** | **363 KB** |

---

## 🚀 VERSIONS

### Phone-Help
- **Export** : 23 novembre 2025
- **Source** : WPCode v3.6.8

### Télé-consultation
- **Export** : 23 novembre 2025  
- **Source** : WPCode v3.9.2
- **Dernière modification** : 1er octobre 2025

---

## 📝 NOTES

### Phone-Help
- Snippets qualifications = formulaires complexes multi-étapes
- Audit = validation qualité des télépermanences
- Simulateur Madagascar = calcul rentabilité outsourcing

### Télé-consultation
- Stripe configuré en mode test (remplacer URLs prod)
- LocalStorage pour persistance données patient
- Design cohérent gradient violet (#667eea → #764ba2)
- Compatible mobile-first

---

## 🔐 SÉCURITÉ

- ✅ Tous les snippets validés en production
- ✅ Escape SQL/XSS automatique WordPress
- ✅ Nonces CSRF sur formulaires
- ✅ Validation côté serveur + client
- ⚠️ Stripe : remplacer clés test par prod

---

## 📬 CONTACT

**Développeur** : François Danaels  
**Email** : contact@pro-assistante.fr  
**GitHub** : @fdonthewave

---

*Dernière mise à jour : 23 novembre 2025*  
*Repository : github.com/fdonthewave/phone-help-code*
