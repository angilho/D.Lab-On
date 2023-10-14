<?php
namespace App\Filter;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class OrganizationUserSearchFilter implements Filter
{
	public function __invoke(Builder $query, $value, string $property)
	{
		$query->where(function ($q) use ($value) {
			$q->where("user_login", "like", "%{$value}%")
				->orWhere("name", "like", "%{$value}%")
				->orWhere("email", "like", "%{$value}%")
				->orWhere("phone", "like", "%{$value}%")
				->orWhereHas("organization", function ($q2) use ($value) {
					return $q2->where("organizations.name", "like", "%{$value}%");
				});
		});
	}
}