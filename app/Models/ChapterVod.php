<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapterVod extends Model
{
	use HasFactory;

	protected $fillable = ["chapter_id", "index", "title", "vod_url", "description", "description_url"];
}