/**
 * Snippet ID: 9
 * Name: CF7 Email Confirmation Fix
 * Modified: 2025-10-29 08:55:02
 * Active: True
 * Source: cf7-email-confirmation-fix_code-snippets__1_.json
 */

// Force CF7 à accepter les emails de confirmation
add_filter('wpcf7_validate_configuration', '__return_false');