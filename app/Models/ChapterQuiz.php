<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuizQuestion;

class ChapterQuiz extends Model
{
	use HasFactory;

	protected $fillable = ["chapter_id", "required_correct_count"];

	protected $with = ["questions"];

	public function questions()
	{
		return $this->hasMany(QuizQuestion::class, "quiz_id", "id");
	}
}