<?php
namespace App\Filter;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class SmsNotificationSearchFilter implements Filter
{
	public function __invoke(Builder $query, $value, string $property)
	{
		$query->where("name", "like", "%{$value}%")->orWhereHas("workUser", function ($q) use ($value) {
			return $q->where("users.name", "like", "%{$value}%");
		});
	}
}
