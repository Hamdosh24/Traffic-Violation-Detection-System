<?php
// app/Http/Controllers/Api/AccidentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Http\Resources\AccidentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Cache; 

class AccidentController extends Controller
{
    /**
     * Store a new accident. Called by the AI system.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'camera_id' => 'required|integer|exists:cameras,camera_id', 
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $accident = Accident::create($validator->validated());

        return response()->json([
            'message' => 'Accident recorded successfully.',
            'id' => $accident->id
        ], 201);
    }

    /**
     * Get a list of all recent accidents (for historical view).
     */
    public function indexAll()
    {
        $allAccidents = Cache::remember('all_accidents_24h', now()->addMinutes(10), function () {
            return Accident::with('camera')
                ->latest()
                ->get();
        });

        return AccidentResource::collection($allAccidents);
    }
    
    /**
     * Stream new accidents in real-time using SSE.
     */
    public function streamNewAccidents(): StreamedResponse
    {
        $response = new StreamedResponse(function() {
            set_time_limit(0);

            while (true) {
                $latestAccident = Cache::get('latest_accident');

                if ($latestAccident) {
                    $accidentResource = new AccidentResource($latestAccident);

                    echo "event: new-accident\n";
                    echo 'data: ' . $accidentResource->toJson() . "\n\n";

                    ob_flush();
                    flush();

                    Cache::forget('latest_accident');
                }

                sleep(2);

                if (connection_aborted()) {
                    break;
                }
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Cache-Control', 'no-cache');
        
        return $response;
    }
}