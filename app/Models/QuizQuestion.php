<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuizQuestionAnswer;
use App\Models\File;

class QuizQuestion extends Model
{
	use HasFactory;

	protected $fillable = ["quiz_id", "index", "question", "question_image_file_id"];

	protected $with = ["answers", "question_image"];

	public function answers()
	{
		return $this->hasMany(QuizQuestionAnswer::class, "question_id", "id");
	}

	public function question_image()
	{
		return $this->hasOne(File::class, "id", "question_image_file_id");
	}
}