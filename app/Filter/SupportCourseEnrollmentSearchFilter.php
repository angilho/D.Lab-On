<?php
namespace App\Filter;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class SupportCourseEnrollmentSearchFilter implements Filter
{
	public function __invoke(Builder $query, $value, string $property)
	{
		$query->where(function ($q) use ($value) {
			$q->whereHas("course", function ($q1) use ($value) {
				return $q1
					->where("courses.name", "like", "%{$value}%")
					->orWhere("courses.dlab_course_code", "like", "%{$value}%");
			})->orWhereHas("user", function ($q2) use ($value) {
				return $q2
					->where("users.user_login", "like", "%{$value}%")
					->orWhere("users.name", "like", "%{$value}%");
			});
		});
	}
}
