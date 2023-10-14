<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsNotificationHistory extends Model
{
	use HasFactory;

	protected $fillable = ["sms_notification_id", "user_id", "user_login", "user_name", "phone"];

	public function smsNotification()
	{
		return $this->belongsTo(SmsNotification::class, "sms_notification_id", "id");
	}
}
