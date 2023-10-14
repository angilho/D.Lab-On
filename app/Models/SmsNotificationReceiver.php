<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsNotificationReceiver extends Model
{
	use HasFactory;

	protected $fillable = ["sms_notification_id", "user_id", "phone"];

	protected $with = ["user"];

	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}
}
