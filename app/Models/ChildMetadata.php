<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildMetadata extends Model
{
	use HasFactory;

	protected $fillable = ["user_id", "gender", "grade", "school"];

	protected $appends = ["grade_str"];

	/**
	 * 1~12로 정의된 학년을 사람이 인식 가능한 학교 형태로 변경한다.
	 */
	function getGradeStrAttribute()
	{
		// 초등학교
		if ($this->grade >= 1 && $this->grade <= 6) {
			return "초등학교 {$this->grade}학년";
		}
		// 중학교
		if ($this->grade >= 7 && $this->grade <= 9) {
			$grade = $this->grade - 6;
			return "중학교 {$grade}학년";
		}
		// 고등학교
		if ($this->grade >= 10 && $this->grade <= 12) {
			$grade = $this->grade - 9;
			return "고등학교 {$grade}학년";
		}

		return $this->grade;
	}
}