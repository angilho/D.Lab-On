<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapterVodLearning extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "chapter_id", "vod_id", "status"];
}