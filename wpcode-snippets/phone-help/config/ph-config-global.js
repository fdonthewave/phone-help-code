/**
 * WPCode 2506 : PH-CONFIG-Global
 * Configuration globale PhoneHelp
 * Type: PHP Snippet | Location: Everywhere | Priority: 1
 * Version 2.2 - Emojis corrigés
 * Dernière modification: 24 septembre 2025 20:32
 * Site: tele-consultation.com
 */

// Définir les constantes du système
if(!defined('PHONEHELP_VERSION')) {
    define('PHONEHELP_VERSION', '2.2');
    define('PHONEHELP_DEBUG', false);
}

// ========== CONFIGURATION CLIENTS ==========
// Utiliser $GLOBALS au lieu de define() pour éviter les problèmes d'encodage des emojis
$GLOBALS['PHONEHELP_CLIENTS'] = [
    'MANEKINEKO' => [
        'name' => 'Manekineko',
        'color' => '#667eea',
        'icon' => '🏢',  // Immeuble
        'agent' => 'alexandra',
        'hours' => '9h-13h',
        'room' => 'PHONEHELP-ALEXANDRA-MANEKINEKO'
    ],
    'CUISINES' => [
        'name' => 'Cuisines et Fourneaux',
        'color' => '#A8220D',
        'icon' => '🍳',  // Poêle
        'agent' => 'alexandra',
        'hours' => '14h-17h',
        'room' => 'PHONEHELP-ALEXANDRA-CUISINES'
    ],
    'TECHCORP' => [
        'name' => 'TechCorp France',
        'color' => '#2ecc71',
        'icon' => '💻',  // Ordinateur
        'agent' => 'marie',
        'hours' => '9h-12h',
        'room' => 'PHONEHELP-MARIE-TECHCORP'
    ]
];

// ========== CONFIGURATION AGENTS ==========
$GLOBALS['PHONEHELP_ASSIGNMENTS'] = [
    'alexandra' => [
        'name' => 'Alexandra',
        'clients' => ['MANEKINEKO', 'CUISINES'],
        'email' => 'alexandra@phone-help.net',
        'phone' => '+261 34 XX XX XX'
    ],
    'marie' => [
        'name' => 'Marie',
        'clients' => ['TECHCORP'],
        'email' => 'marie@phone-help.net',
        'phone' => '+261 34 XX XX XX'
    ]
];

// ========== CONFIGURATION JITSI ==========
$GLOBALS['PHONEHELP_JITSI'] = [
    'primary' => [
        'url' => 'https://meet.ffmuc.net/',
        'name' => 'Serveur 1',
        'icon' => '🇩🇪'
    ],
    'backup' => [
        'url' => 'https://visio.chapril.org/',
        'name' => 'Serveur 2',
        'icon' => '🇫🇷'
    ],
    'switch_mode' => 'manual'  // manual = boutons, auto = bascule automatique
];

// ========== STYLES GLOBAUX ==========
add_action('wp_head', function() {
    ?>
    <style>
        /* PhoneHelp Global Styles */
        .phonehelp-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .phonehelp-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .badge-online {
            background: #48bb78;
            color: white;
        }
        
        .badge-offline {
            background: #f56565;
            color: white;
        }
        
        .badge-busy {
            background: #ed8936;
            color: white;
        }
        
        .phonehelp-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            font-weight: 500;
            z-index: 999999;
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        /* Boutons switch serveur Jitsi */
        .jitsi-server-switch {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 15px;
            padding: 15px;
            background: #f7fafc;
            border-radius: 10px;
        }
        
        .jitsi-btn {
            padding: 10px 20px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .jitsi-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .jitsi-btn.active {
            background: #48bb78;
            color: white;
            border-color: #48bb78;
        }
    </style>
    <?php
}, 1);

// ========== FONCTIONS HELPERS ==========

/**
 * Obtenir la configuration d'un client
 */
function phonehelp_get_client($code) {
    $clients = $GLOBALS['PHONEHELP_CLIENTS'] ?? [];
    return $clients[$code] ?? null;
}

/**
 * Obtenir la configuration d'un agent
 */
function phonehelp_get_agent($name) {
    $assignments = $GLOBALS['PHONEHELP_ASSIGNMENTS'] ?? [];
    return $assignments[$name] ?? null;
}

/**
 * Obtenir les serveurs Jitsi
 */
function phonehelp_get_jitsi_servers() {
    return $GLOBALS['PHONEHELP_JITSI'] ?? [
        'primary' => [
            'url' => 'https://meet.ffmuc.net/',
            'name' => 'Serveur 1',
            'icon' => '🇩🇪'
        ],
        'backup' => [
            'url' => 'https://visio.chapril.org/',
            'name' => 'Serveur 2',
            'icon' => '🇫🇷'
        ]
    ];
}

/**
 * Obtenir tous les clients d'un agent
 */
function phonehelp_get_agent_clients($agent) {
    $clients = $GLOBALS['PHONEHELP_CLIENTS'] ?? [];
    $agent_clients = [];
    
    foreach ($clients as $code => $client) {
        if (isset($client['agent']) && $client['agent'] === $agent) {
            $agent_clients[$code] = $client;
        }
    }
    
    return $agent_clients;
}

/**
 * Vérifier si un utilisateur est un agent
 */
function phonehelp_is_agent($user_id = null) {
    if (!$user_id) {
        $user_id = get_current_user_id();
    }
    
    $user = get_userdata($user_id);
    if (!$user) return false;
    
    $assignments = $GLOBALS['PHONEHELP_ASSIGNMENTS'] ?? [];
    foreach ($assignments as $agent_key => $agent_data) {
        if ($user->user_email === $agent_data['email']) {
            return $agent_key;
        }
    }
    
    return false;
}

/**
 * Logger une activité
 */
function phonehelp_log_activity($type, $agent, $client, $extra = '') {
    $logs = get_option('phonehelp_activity_logs', []);
    
    $logs[] = [
        'time' => current_time('H:i:s'),
        'date' => current_time('Y-m-d'),
        'type' => $type,
        'agent' => $agent,
        'client' => $client,
        'extra' => $extra
    ];
    
    // Garder seulement les 100 derniers logs
    if (count($logs) > 100) {
        $logs = array_slice($logs, -100);
    }
    
    update_option('phonehelp_activity_logs', $logs);
}

/**
 * Afficher une notification
 */
function phonehelp_notify($message, $type = 'success') {
    $icon = $type === 'success' ? '✅' : '⚠️';
    echo "<script>
        const notif = document.createElement('div');
        notif.className = 'phonehelp-notification';
        notif.textContent = '$icon $message';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    </script>";
}

// ========== INITIALISATION ==========
add_action('init', function() {
    // Enregistrer l'activité des agents connectés
    if (is_user_logged_in()) {
        $agent = phonehelp_is_agent();
        if ($agent) {
            update_option($agent . '_last_activity', time());
        }
    }
});

// Log de chargement
if (PHONEHELP_DEBUG) {
    error_log('✅ PhoneHelp Config v' . PHONEHELP_VERSION . ' chargée');
}
