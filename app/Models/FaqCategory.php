<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqCategory extends Model
{
	use HasFactory;

	protected $fillable = ["name"];

	/**
	 * 강좌 정보를 구한다.
	 */
	public function faqItem()
	{
		return $this->hasMany(FaqItem::class, "faq_category_id", "id");
	}
}