<?php
namespace App\Filter;

use Spatie\QueryBuilder\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

class PaymentSearchFilter implements Filter
{
	public function __invoke(Builder $query, $value, string $property)
	{
		$query->whereHas("user", function (Builder $query) use ($value) {
			$query->where("user_login", "like", "%{$value}%")->orWhere("name", "like", "%{$value}%");
			$query->orWhere("merchant_uid", "like", "%{$value}%");
		});
	}
}