<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapterQuizLearning extends Model
{
	use HasFactory;

	protected $fillable = [
		"user_id",
		"chapter_id",
		"quiz_id",
		"total_question",
		"correct_answer",
		"status",
		"passed_at",
	];

	protected $casts = [
		"passed_at" => "datetime",
	];
}