<?php

return [

    'default' => env('BROADCAST_DRIVER', 'null'),

    'connections' => [

        // ... (اتصالات pusher, reverb, ably تبقى كما هي) ...

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        // --- ✅ أضف هذا الجزء بالكامل ---
        'redis' => [
            'driver' => 'redis',
            'connection' => 'default', // هذا يخبر Laravel باستخدام إعدادات Redis الافتراضية من ملف config/database.php
        ],
        // --- نهاية الجزء المضاف ---

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
