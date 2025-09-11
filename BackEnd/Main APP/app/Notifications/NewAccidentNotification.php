<?php

// app/Notifications/NewAccidentNotification.php

// namespace App\Notifications;

// use App\Models\Accident;
// use Illuminate\Bus\Queueable;
// use Illuminate\Contracts\Queue\ShouldQueue;
// use Illuminate\Notifications\Notification;

// /**
//  * Defines a notification that is sent when a new accident occurs.
//  * This specific notification is configured to be stored in the database.
//  *
//  * Implements ShouldQueue to process this notification in the background
//  * without slowing down the user's web request.
//  */
// class NewAccidentNotification extends Notification implements ShouldQueue
// {
//     // The Queueable trait provides methods to control the notification's queueing behavior.
//     use Queueable;

//     /**
//      * The accident instance for which the notification is being sent.
//      *
//      * @var \App\Models\Accident
//      */
//     private Accident $accident;

//     /**
//      * Create a new notification instance.
//      *
//      * @param \App\Models\Accident $accident The accident that triggered the notification.
//      */
//     public function __construct(Accident $accident)
//     {
//         $this->accident = $accident;
//     }

//     /**
//      * Get the notification's delivery channels.
//      *
//      * @param object $notifiable The entity (e.g., User model) that receives the notification.
//      * @return array<int, string>
//      */
//     public function via(object $notifiable): array
//     {
//         // This specifies that the notification should only be stored in the database.
//         return ['database'];
//     }

//     /**
//      * Get the array representation of the notification for the database.
//      * The data returned by this method will be stored as a JSON column in the 'notifications' table.
//      *
//      * @param object $notifiable
//      * @return array<string, mixed>
//      */
//     public function toDatabase(object $notifiable): array
//     {
//         // This is the data structure that will be saved in the database.
//         return [
//             'accident_id' => $this->accident->id,
//             'message'     => 'تنبيه: تم رصد حادث مروري جديد.',
//             'camera_id'   => $this->accident->camera_id,
//             'timestamp'   => $this->accident->timestamp,
//         ];
//     }
// }
