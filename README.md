# 📞 Phone-Help Code

> **CODE ONLY** - Code snippets WordPress, plugins, outils

## 📚 Documentation

**⚠️ Toute la documentation est dans Notion (source de vérité)**

- [📞 PhoneHelp Business](https://notion.so)
- [📦 CodeSnippets Manager](https://notion.so)
- [💻 Codes WordPress](https://notion.so)

## 🗂️ Structure

```
wpcode-snippets/
  ├── 2486-dashboard-admin.js          # Interface admin PhoneHelp
  ├── 2455-interface-client.js         # Interface RDV visio
  └── 2529-dashboard-admin-v2.js       # Dashboard stats

plugins/
  └── mu-plugins/                       # Must-use plugins custom

tools/
  ├── simulateur-profitabilite/        # Calculateur ROI
  └── dashboard-stats/                  # Stats temps réel

configs/
  └── wordpress/                        # Configs WP custom
```

## 🚀 Usage

```bash
# Backup code snippets depuis WP
./tools/export-wpcode.sh

# Deploy snippet sur site
./tools/deploy-snippet.sh 2486

# Tests local
./tools/test-snippet.sh
```

## 🔗 Liens

- **Site** : https://phone-help.com
- **WordPress** : https://tele-consultation.com/wp-admin
- **WPCode** : https://tele-consultation.com/wp-admin/admin.php?page=wpcode
- **Notion** : Documentation complète

---

**Créé** : 23 Nov 2025  
**Maintenu par** : François Danaels
