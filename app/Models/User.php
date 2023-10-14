<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;
use App\Constants\Role;

class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		"role",
		"user_login",
		"name",
		"phone",
		"password",
		"email",
		"birthday",
		"address",
		"address_detail",
		"inflow_path",
		"use_default_profile",
		"profile_image_id",
		"organization_id",
		"campus",
	];

	/**
	 * The attributes that should be hidden for arrays.
	 *
	 * @var array
	 */
	protected $hidden = ["password", "remember_token"];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		"email_verified_at" => "datetime",
		"birthday" => "array",
		"use_default_profile" => "boolean",
	];

	protected $appends = ["is_admin", "is_instructor"];

	protected $with = ["profileImage"];

	public static function boot()
	{
		parent::boot();
	}

	/**
	 * 부모 아래에 속한 자녀를 구한다.
	 */
	public function children()
	{
		return $this->hasMany(Child::class, "parent_id", "id");
	}

	/**
	 * 부모 아래에 속한 자녀를 구한다.
	 */
	public function parent()
	{
		return $this->hasOne(Child::class, "child_id", "id");
	}

	/**
	 * 사용자의 메타데이터를 구한다.
	 */
	public function userMetadata()
	{
		return $this->hasOne(ChildMetadata::class, "user_id", "id");
	}

	/**
	 * 회원의 약관 동의 정보를 구한다.
	 */
	public function agreement()
	{
		return $this->hasOne(UserAgreement::class, "user_id", "id");
	}

	/**
	 * 회원의 장바구니 정보를 구한다.
	 */
	public function cart()
	{
		return $this->hasMany(Cart::class, "user_id", "id");
	}

	/**
	 * 회원의 결제 정보를 구한다.
	 */
	public function payment()
	{
		return $this->hasMany(Payment::class, "req_user_id", "id");
	}

	/**
	 * 회원의 결제 상세 정보를 구한다.
	 */
	public function paymentItem()
	{
		return $this->hasMany(PaymentItem::class, "user_id", "id");
	}

	public function enrollment()
	{
		return $this->hasMany(PaymentItem::class, "user_id", "id");
	}

	public function profileImage()
	{
		return $this->hasOne(File::class, "id", "profile_image_id");
	}

	public function organization()
	{
		return $this->belongsTo(Organization::class, "organization_id", "id");
	}

	public function menuPermission()
	{
		return $this->hasMany(MenuPermission::class, "user_id", "id");
	}

	public function instructorMetadata()
	{
		return $this->hasOne(InstructorMetadata::class, "user_id", "id");
	}

	/**
	 * 운영자인지 판별한다.
	 */
	public function getIsAdminAttribute()
	{
		return $this->attributes["role"] === Role::ADMIN;
	}

	/**
	 * 강사인지 판별한다.
	 */
	public function getIsInstructorAttribute()
	{
		return $this->attributes["role"] === Role::INSTRUCTOR;
	}

	/**
	 * 비밀번호 재설정 email 발송
	 */
	public function sendPasswordResetNotification($token)
	{
		$this->notify(new ResetPasswordNotification($token));
	}
}
