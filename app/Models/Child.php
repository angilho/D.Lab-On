<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
	use HasFactory;

	protected $fillable = ["parent_id", "child_id"];

	protected $with = ["userInfo", "userMetadata"];

	public static function boot()
	{
		parent::boot();

		// 사용자 삭제 시 사용자 상세 정보도 함께 삭제한다.
		static::deleted(function ($model) {
			$model->userMetadata()->delete();
		});
	}

	/**
	 * 자녀의 사용자 정보를 구한다.
	 */
	public function userInfo()
	{
		return $this->hasOne(User::class, "id", "child_id");
	}

	/**
	 * 자녀의 추가 부가 정보를 구한다.
	 */
	public function userMetadata()
	{
		return $this->hasOne(ChildMetadata::class, "user_id", "child_id");
	}

	/**
	 * 자녀의 장바구니 정보를 구한다.
	 */
	public function cart()
	{
		return $this->hasMany(Cart::class, "user_id", "child_id");
	}

	/**
	 * 자녀의 결제 상세 정보를 구한다.
	 */
	public function paymentItem()
	{
		return $this->hasMany(PaymentItem::class, "user_id", "child_id");
	}

	/**
	 * 자녀의 수강 정보를 구한다.
	 */
	public function enrollment()
	{
		return $this->hasMany(Enrollment::class, "user_id", "child_id");
	}

	/**
	 * 자녀의 부모 정보를 구한다.
	 */
	public function parentInfo()
	{
		return $this->hasOne(User::class, "id", "parent_id");
	}
}