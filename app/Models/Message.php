<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
	use HasFactory;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ["title", "description", "req_user_id", "message_to", "sent_at"];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		"sent_at" => "datetime",
	];

	protected $with = ["user"];

	public function user()
	{
		return $this->belongsTo(User::class, "req_user_id", "id");
	}
}