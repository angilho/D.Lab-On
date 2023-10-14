<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ChapterVod;
use App\Models\ChapterResource;
use App\Models\ChapterQuiz;
use App\Models\ChapterVodLearning;
use App\Models\ChapterQuizLearning;

class CourseChapter extends Model
{
	use HasFactory;

	protected $fillable = ["course_id", "index", "title", "description", "need_quiz_pass"];

	protected $with = ["vods", "resources", "quiz"];

	protected $casts = [
		"need_quiz_pass" => "boolean",
	];

	public function vods()
	{
		return $this->hasMany(ChapterVod::class, "chapter_id", "id");
	}

	public function resources()
	{
		return $this->hasMany(ChapterResource::class, "chapter_id", "id");
	}

	public function quiz()
	{
		return $this->hasOne(ChapterQuiz::class, "chapter_id", "id");
	}

	public function vodLearnings()
	{
		return $this->hasMany(ChapterVodLearning::class, "chapter_id", "id");
	}

	public function quizLearnings()
	{
		return $this->hasMany(ChapterQuizLearning::class, "chapter_id", "id");
	}
}