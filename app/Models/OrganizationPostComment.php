<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationPostComment extends Model
{
	use HasFactory;

	protected $fillable = ["organization_id", "post_id", "user_id", "comment", "attachment_file_id"];

	protected $with = ["user", "attachment"];

	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}

	public function attachment()
	{
		return $this->hasOne(File::class, "id", "attachment_file_id");
	}
}