<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
	use HasFactory;

	protected $fillable = [
		"desktop_image_file_id",
		"mobile_image_file_id",
		"url",
		"background_color",
		"new_tab",
		"order",
	];

	protected $with = ["desktopImage", "mobileImage"];

	public function desktopImage()
	{
		return $this->hasOne(File::class, "id", "desktop_image_file_id");
	}

	public function mobileImage()
	{
		return $this->hasOne(File::class, "id", "mobile_image_file_id");
	}

	/**
	 * Carousel 삭제 시 order 순서를 재정렬 한다.
	 */
	public function reorderForDelete($fromOrder)
	{
		$carousels = $this->where("order", ">", $fromOrder)->get();
		$carousels->each(function ($carousel) {
			$carousel->order--;
			$carousel->save();
		});
	}
}
