<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumCategory extends Model
{
	use HasFactory;

	protected $fillable = ["title", "subtitle", "description", "order"];

	public function curriculumCourses()
	{
		return $this->hasMany(CurriculumCourse::class, "curriculum_category_id", "id");
	}

	/**
	 * 커리큘럼 카테고리 삭제 시 order 순서를 재정렬 한다.
	 */
	public function reorderForDelete($fromOrder)
	{
		$curriculumCategories = $this->where("order", ">", $fromOrder)->get();
		$curriculumCategories->each(function ($curriculumCategory) {
			$curriculumCategory->order--;
			$curriculumCategory->save();
		});
	}
}
