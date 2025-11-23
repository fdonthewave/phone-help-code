# 📱 Phone-Help - WordPress Code Snippets

> Code snippets WordPress pour le site tele-consultation.com (Phone-Help)

## 📋 Structure

```
wpcode-snippets/
├── qualif-cardio/          # Qualification cardiologie
│   ├── qualif-cardio-audit-v10.js
│   └── qualif-cardio-formulaire-v55.js
├── qualif-pneumo/          # Qualification pneumologie  
│   ├── qualif-pneumo-audit.js
│   ├── qualif-pneumo-audit-ordonnances.js
│   ├── qualif-pneumo-formulaire-v10.js
│   └── qualif-pneumo---demandes-ordonnancescertificats-v10.js
├── tools/                  # Outils divers
│   └── simulateur-rentabilite-madagascar.js
└── fixes/                  # Corrections bugs
    └── cf7-email-confirmation-fix.js
```

## 🔧 Installation

Ces snippets sont gérés via [WPCode](https://wordpress.org/plugins/code-snippets/) sur WordPress.

### Importer un snippet

1. **WordPress** → Extensions → Code Snippets
2. **Tools** → Import
3. Sélectionner fichier `.js`
4. Activer le snippet

## 📝 Snippets disponibles

### Qualification Cardiologie

- **qualif-cardio-formulaire-v55** (Snippet ID: 6)
  - Shortcode: `[qualif_cardio]`
  - Formulaire qualification cardio complet
  - Calcul facteurs risque + type RDV
  - Sauvegarde BDD + email Brevo

- **qualif-cardio-audit-v10** (Snippet ID: 7)
  - Shortcode: `[qualif_cardio_audit]`
  - Audit recherche qualifications
  - Zoom intelligent localStorage

### Qualification Pneumologie

- **qualif-pneumo-formulaire-v10** (Snippet ID: 10)
  - Shortcode: `[qualif_pneumo]`
  - Formulaire qualification pneumo
  - Calcul PA tabac + type RDV

- **qualif-pneumo-audit** (Snippet ID: 11)
  - Shortcode: `[pneumo_audit]`
  - Recherche nom/prénom/tél/date
  - Intégration Callibri

- **qualif-pneumo-demandes-ordonnancescertificats** (Snippet ID: 12)
  - Shortcode: `[qualif_pneumo_ordonnances]`
  - Gestion demandes ordonnances/certificats
  - Email auto médecin

- **qualif-pneumo-audit-ordonnances** (Snippet ID: 13)
  - Shortcode: `[qualif_pneumo_ordonnances_audit]`
  - Audit demandes ordonnances

### Outils

- **simulateur-rentabilite-madagascar** (Snippet ID: 8)
  - Shortcode: `[phone_help_simulator]`
  - Simulateur rentabilité Pro-Assistante
  - Calcul marges/profits multi-années

### Fixes

- **cf7-email-confirmation-fix** (Snippet ID: 9)
  - Fix validation emails Contact Form 7
  - Désactive vérification config

## 🔗 Liens

- **Site WordPress** : https://tele-consultation.com
- **Admin WPCode** : https://tele-consultation.com/wp-admin/admin.php?page=wpcode
- **Documentation Notion** : [GitHub Repositories](https://www.notion.so/2b4878e834f18124b9bdd0c9c6c9b122)

## ⚠️ Prérequis

### wp-config.php

Certains snippets nécessitent des constantes dans `wp-config.php` :

```php
// Brevo API (emails)
define('BREVO_API_KEY', 'votre-cle');
define('BREVO_SENDER_EMAIL', 'scripts@phone-help.com');
define('BREVO_SENDER_NAME', 'Phone-Help');
define('BREVO_RECIPIENT_EMAIL', 'scripts@phone-help.com');
```

### Tables BDD

Les snippets créent automatiquement leurs tables :
- `wp_qualif_cardio_complete`
- `wp_qualif_pneumo_amiotsimion`
- `wp_qualif_pneumo_ordonnances`

## 📊 Versions

- **Cardio Formulaire** : v5.5 (21 Oct 2025)
- **Cardio Audit** : v1.0 (13 Oct 2025)
- **Pneumo Formulaire** : v1.0 (10 Nov 2025)
- **Pneumo Audit** : v1.0 (10 Nov 2025)
- **Pneumo Demandes** : v1.0 (19 Nov 2025)
- **Pneumo Audit Ordonnances** : v1.0 (19 Nov 2025)
- **Simulateur** : v1.0 (17 Oct 2025)
- **CF7 Fix** : v1.0 (29 Oct 2025)

## 📄 Licence

Code propriétaire Phone-Help © 2025

---

**Dernière mise à jour** : 23 Novembre 2025
**Repository** : https://github.com/fdonthewave/phone-help-code
