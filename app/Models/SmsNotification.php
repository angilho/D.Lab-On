<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmsNotification extends Model
{
	use HasFactory;

	protected $fillable = [
		"type",
		"name",
		"course_id",
		"section_id",
		"receiver",
		"start_at",
		"end_at",
		"reserved_hour",
		"reserved_minute",
		"sms_title",
		"sms_description",
		"work_user_id",
		"completed",
	];

	protected $casts = [
		"start_at" => "datetime",
		"end_at" => "datetime",
	];

	protected $with = ["workUser", "receiverList"];

	public function workUser()
	{
		return $this->belongsTo(User::class, "work_user_id", "id");
	}

	public function receiverList()
	{
		return $this->hasMany(SmsNotificationReceiver::class, "sms_notification_id", "id");
	}

	public function course()
	{
		return $this->belongsTo(Course::class, "course_id", "id");
	}
}
