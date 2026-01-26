<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});



// // Example: A private chat room (logic can be anything)
// Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
//     // Return true if the user is a member of this chat room
//     return $user->rooms->contains($roomId); 
// });