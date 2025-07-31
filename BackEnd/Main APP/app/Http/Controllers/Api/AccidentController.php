<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Event;

class AccidentController extends Controller
{
    /**
     * Store a newly created accident in storage.
     * This is called by the AI system.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'camera_id' => 'required|string|max:255|exists:cameras,camera_id',
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $accident = Accident::create($validator->validated());

        return response()->json($accident->load('camera'), 201);
    }

    /**
     * Display a listing of new accidents.
     * This is called by the frontend on page load.
     */
    public function indexNew(): JsonResponse
    {
        $newAccidents = Accident::with('camera')
            ->where('status', 'new')
            ->latest()
            ->get();

        return response()->json($newAccidents);
    }
    
    /**
     * Update the specified accident's status to 'viewed'.
     */
    public function markAsViewed(Accident $accident): JsonResponse
    {
        $accident->status = 'viewed';
        $accident->save();
        return response()->json($accident->load('camera'));
    }

    /**
     * Stream new accidents in real-time using Server-Sent Events.
     */
    public function streamNewAccidents(): StreamedResponse
{
    $response = new StreamedResponse(function() {
        // --- ADD THIS LINE ---
        // Disable the PHP time limit for this long-running script
        set_time_limit(0);

        $listener = function ($event) {
            $accidentData = $event->accident->load('camera');

            echo "event: new-accident\n";
            echo 'data: ' . json_encode($accidentData) . "\n\n";

            ob_flush();
            flush();
        };

        Event::listen(
            \App\Events\NewAccidentDetected::class,
            $listener
        );

        while (true) {
            echo ": ping\n\n";
            ob_flush();
            flush();
            sleep(15);
        }
    });

    $response->headers->set('Content-Type', 'text/event-stream');
    $response->headers->set('X-Accel-Buffering', 'no');
    $response->headers->set('Cache-Control', 'no-cache');
    
    return $response;
}
}