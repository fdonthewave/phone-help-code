/**
 * WPCode 2499 : PH-CONFIG-RustDesk
 * ⚠️ NE PAS PARTAGER CE CODE - CONTIENT DES INFOS SENSIBLES
 * Configuration RustDesk support technique
 * Type: PHP Snippet | Location: Everywhere | Priority: 1
 * Dernière modification: 24 septembre 2025 19:36
 * Site: tele-consultation.com
 */

// Configuration RustDesk
if(!defined('RUSTDESK_CONFIG')) {
    define('RUSTDESK_CONFIG', [
        'server' => 'support.phone-help.net',
        'relay' => 'support.phone-help.net',
        'api_port' => '21116',
        'relay_port' => '21117',
        'key' => '1u5X+cSsXxvqXr+E+P+3IUaBX01Qe8LLrNrfHSFeGlY=',
        'encrypted' => true
    ]);
}

// IDs RustDesk des agents
if(!defined('RUSTDESK_AGENTS')) {
    define('RUSTDESK_AGENTS', [
        'alexandra' => 'ALEXANDRA-PH',
        'marie' => 'MARIE-PH',
        'sophie' => 'SOPHIE-PH',
        'jean' => 'JEAN-PH'
    ]);
}

// Helper pour obtenir config RustDesk
function get_rustdesk_config() {
    if(!current_user_can('manage_options')) {
        return null;
    }
    return RUSTDESK_CONFIG;
}

// Note: MeshCentral est géré séparément
