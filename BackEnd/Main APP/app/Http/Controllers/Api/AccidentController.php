<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Http\Resources\AccidentResource; // <-- تأكد من استيراد الـ Resource
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

        return response()->json([
            'message' => 'Accident recorded successfully.',
            'id' => $accident->id
        ], 201);
    }

    /**
     * Display a listing of new accidents for the frontend.
     */
    public function indexNew()
    {
        $newAccidents = Accident::with('camera')
            ->where('status', 'new')
            ->latest()
            ->get();

        // Use the Resource to format the response correctly
        return AccidentResource::collection($newAccidents);
    }
    
    /**
     * Update the specified accident's status to 'viewed'.
     */
    public function markAsViewed(Accident $accident): AccidentResource
    {
        $accident->status = 'viewed';
        $accident->save();
        
        // Use the Resource here as well for a consistent response
        return new AccidentResource($accident->load('camera'));
    }

    /**
     * Stream new accidents in real-time using Server-Sent Events.
     */
    public function streamNewAccidents(): StreamedResponse
    {
        $response = new StreamedResponse(function() {
            set_time_limit(0);

            $listener = function ($event) {
                // Use the resource to format the data before sending
                $accidentResource = new AccidentResource($event->accident->load('camera'));

                echo "event: new-accident\n";
                echo 'data: ' . $accidentResource->toJson() . "\n\n";

                ob_flush();
                flush();
            };

            Event::listen(\App\Events\NewAccidentDetected::class, $listener);

            while (connection_status() === CONNECTION_NORMAL && !connection_aborted()) {
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
