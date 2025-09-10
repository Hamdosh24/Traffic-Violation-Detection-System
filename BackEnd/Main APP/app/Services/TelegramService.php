<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * A simple service to encapsulate all logic for sending messages via the Telegram Bot API.
 */
class TelegramService
{
    protected ?string $botToken;

    protected ?string $chatId;

    protected string $baseUrl;

    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
        $this->chatId = config('services.telegram.chat_id');
        $this->baseUrl = "https://api.telegram.org/bot{$this->botToken}";
    }

    /**
     * Sends a message to the configured Telegram chat.
     *
     * @param  string  $message  The text message to send. Supports Markdown.
     * @return bool True on success, false on failure.
     */
    public function sendMessage(string $message): bool
    {
        // Guard Clause: Fail early if the service is not configured.
        if (! $this->botToken || ! $this->chatId) {
            Log::error('Telegram Service is not configured. Please check your .env file for TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.');

            return false;
        }

        try {
            $response = Http::timeout(10)->post("{$this->baseUrl}/sendMessage", [
                'chat_id' => $this->chatId,
                'text' => $message,
                'parse_mode' => 'Markdown', // Allows for text formatting like *bold* or _italic_.
            ]);

            // Throw an exception if the API returned an error status code.
            $response->throw();

            Log::info('Telegram message sent successfully.');

            return true;

        } catch (RequestException $e) {
            // Log specific API errors from Telegram.
            Log::error('Failed to send Telegram message. The API responded with an error.', [
                'status' => $e->response->status(),
                'response' => $e->response->body(),
            ]);

            return false;
        } catch (Throwable $e) {
            // Catch any other exceptions (e.g., connection issues).
            Log::error('An unexpected error occurred while sending a Telegram message.', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
