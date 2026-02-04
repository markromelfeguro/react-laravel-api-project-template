<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait LogsAudit
{
    protected static function bootLogsAudit() {
        foreach (['created', 'updated', 'deleted'] as $event) {
            static::$event(function ($model) use ($event) {
                $model->logEvent($event);
            });
        }
    }

    public function logEvent(string $event) {
        
        $causer = auth()->user();
        $isSelfDelete = ($event === 'deleted' && $causer && $causer->id === $this->id);

        AuditLog::create([
            'user_id' => $isSelfDelete ? null : ($causer ? $causer->id : null),
            'event' => $event,
            'auditable_id' => $this->id,
            'auditable_type' => get_class($this),
            'old_values' => $event === 'updated' ? array_intersect_key($this->getOriginal(), $this->getDirty()) : null,
            'new_values' => $event !== 'deleted' ? $this->getDirty() : null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    public function auditLogs() {
        return $this->morphMany(AuditLog::class, 'auditable');
    }
}
