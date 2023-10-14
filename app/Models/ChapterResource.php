<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\File;

class ChapterResource extends Model
{
	use HasFactory;

	protected $fillable = ["chapter_id", "index", "resource_file_id", "resource_password"];

	protected $with = ["file"];

	public function file()
	{
		return $this->hasOne(File::class, "id", "resource_file_id");
	}
}