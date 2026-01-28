<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'subject' => $this->subject,
            'message' => $this->message,
            'data' => $this->data,
            'action_url' => $this->action_url,
            'is_read' => $this->is_read,
            'sent_at' => $this->sent_at->diffForHumans(),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
