<?php
namespace App\Filter;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class CourseClassFilter implements Filter
{
	public function __invoke(Builder $query, $value, string $property)
	{
		$query->where(function ($q) use ($value) {
			if ($value == "support_class") {
				$q->where("support_class", true);
			}
			if ($value == "b2b_class") {
				$q->where("b2b_class", true);
			}
		});
	}
}
