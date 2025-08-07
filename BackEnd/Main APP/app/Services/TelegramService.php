<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected $botToken;
    protected $chatId;
    protected $baseUrl;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
        $this->chatId = config('services.telegram.chat_id');
        $this->baseUrl = "https://api.telegram.org/bot{$this->botToken}";
    }
    
    public function sendMessage(string $message)
    {
        if (!$this->botToken || !$this->chatId) {
            Log::error('Telegram Bot Token or Chat ID is not configured.');
            return false;
        }

        try {
            $response = Http::post("{$this->baseUrl}/sendMessage", [
                'chat_id' => $this->chatId,
                'text' => $message,
                'parse_mode' => 'Markdown'
            ]);

            if ($response->successful()) {
                Log::info("Telegram message sent successfully.");
                return true;
            } else {
                Log::error("Failed to send Telegram message: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Exception in sending Telegram message: " . $e->getMessage());
            return false;
        }
    }
}