<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapterQuizSubmission extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "chapter_id", "question_id", "answer_id"];

	protected $with = ["question"];

	public function question()
	{
		return $this->belongsTo(QuizQuestion::class, "question_id", "id");
	}
}