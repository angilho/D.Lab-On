<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\File;

class QuizQuestionAnswer extends Model
{
	use HasFactory;

	protected $fillable = ["question_id", "index", "answer", "answer_image_file_id", "commentary", "correct"];

	protected $hidden = ["commentary", "correct"];

	protected $with = ["answer_image"];

	protected $casts = [
		"correct" => "boolean",
	];

	public function answer_image()
	{
		return $this->hasOne(File::class, "id", "answer_image_file_id");
	}
}