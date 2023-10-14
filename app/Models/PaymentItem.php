<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentItem extends Model
{
	use HasFactory;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ["payment_id", "user_id", "course_id", "course_section_id", "price"];

	/**
	 * 수강 신청한 Course 정보를 얻는다.
	 */
	public function course()
	{
		return $this->hasOne(Course::class, "id", "course_id");
	}

	/**
	 * 수강 신청한 course section 정보를 얻는다.
	 */
	public function courseSection()
	{
		return $this->hasOne(CourseSection::class, "id", "course_section_id");
	}

	/**
	 * 수강 신청한 사용자 정보를 얻는다.
	 */
	public function user()
	{
		return $this->belongsTo(User::class, "user_id", "id");
	}
	/**
	 * 수강 신청한 정보를 얻는다.
	 */
	public function payment()
	{
		return $this->belongsTo(Payment::class, "id", "payment_id");
	}
}