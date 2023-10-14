<?php
namespace App\Filter;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class AttendanceCourseSearchFilter implements Filter
{
	public function __invoke(Builder $query, $value, string $property)
	{
		$query->whereHas("course", function ($q) use ($value) {
			return $q
				->where("courses.name", "like", "%{$value}%")
				->orWhere("courses.dlab_course_code", "like", "%{$value}%");
		});
	}
}
