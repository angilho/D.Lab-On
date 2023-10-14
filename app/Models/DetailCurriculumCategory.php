<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailCurriculumCategory extends Model
{
	use HasFactory;

	protected $fillable = ["title", "description", "tag", "order"];

	public function curriculumCourses()
	{
		return $this->hasMany(DetailCurriculumCourse::class, "detail_curriculum_category_id", "id");
	}

	/**
	 * 커리큘럼 카테고리 삭제 시 order 순서를 재정렬 한다.
	 */
	public function reorderForDelete($fromOrder)
	{
		$detailCurriculumCategories = $this->where("order", ">", $fromOrder)->get();
		$detailCurriculumCategories->each(function ($detailCurriculumCategory) {
			$detailCurriculumCategory->order--;
			$detailCurriculumCategory->save();
		});
	}
}
