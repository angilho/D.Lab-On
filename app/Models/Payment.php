<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Constants\PaymentStatus;
use App\Constants\EnrollmentStatus;
use Carbon\Carbon;

class Payment extends Model
{
	use HasFactory;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		"merchant_uid",
		"req_user_id",
		"method",
		"name",
		"total_price",
		"status",
		"payment_at",
		"coupon_id",
		"vbank_name",
		"vbank_num",
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		"payment_at" => "datetime",
	];

	protected $appends = ["method_str", "status_str", "vbank_str"];

	public static function boot()
	{
		parent::boot();

		//FIXME: Join으로 한번에 처리 필요
		static::updating(function ($model) {
			if ($model->status == PaymentStatus::SUCCESS) {
				//결제 완료가 되면, 결제 완료 시간 추가
				$model->payment_at = Carbon::now();

				//enrollment에 등록
				$paymentItems = PaymentItem::where("payment_id", $model->id)->get();
				foreach ($paymentItems as $paymentItem) {
					$beforeEnrollment = Enrollment::where([
						["user_id", $paymentItem->user_id],
						["course_id", $paymentItem->course_id],
						["course_section_id", $paymentItem->course_section_id],
						["status", EnrollmentStatus::COMPLETE],
					])->first();
					if ($beforeEnrollment) {
						$beforeEnrollment->touch();
						$beforeEnrollment->save();
					} else {
						Enrollment::updateOrCreate(
							[
								"user_id" => $paymentItem->user_id,
								"course_id" => $paymentItem->course_id,
								"course_section_id" => $paymentItem->course_section_id,
							],
							["status" => EnrollmentStatus::COMPLETE]
						);
					}

					//Cart의 모든 항목 제거
					Cart::where([
						"user_id" => $paymentItem->user_id,
						"course_id" => $paymentItem->course_id,
						"course_section_id" => $paymentItem->course_section_id,
					])->delete();
				}
			} elseif ($model->status == PaymentStatus::READY) {
				//가상계좌 결제 요청을 했을 경우 Cart의 모든 항목을 제거한다.
				$paymentItems = PaymentItem::where("payment_id", $model->id)->get();
				foreach ($paymentItems as $paymentItem) {
					Cart::where([
						"user_id" => $paymentItem->user_id,
						"course_id" => $paymentItem->course_id,
						"course_section_id" => $paymentItem->course_section_id,
					])->delete();
				}
			} elseif ($model->status == PaymentStatus::CANCEL) {
				//결제 취소 시 Enrollment도 취소하자
				$paymentItems = PaymentItem::where("payment_id", $model->id)->get();

				foreach ($paymentItems as $paymentItem) {
					$enrollment = Enrollment::where([
						"user_id" => $paymentItem->user_id,
						"course_id" => $paymentItem->course_id,
						"course_section_id" => $paymentItem->course_section_id,
					])->first();
					if ($enrollment) {
						$enrollment->status = EnrollmentStatus::CANCEL;
						$enrollment->update();
					}
				}
			}
		});

		// 결제 정보 삭제 시 결제 정보 상세(payment_item)도 필요 없으므로 함께 삭제한다.
		static::deleted(function ($model) {
			$model->paymentItem()->delete();
		});
	}

	/**
	 * 결제 요청자의 사용자 정보를 구한다.
	 */
	public function user()
	{
		return $this->hasOne(User::class, "id", "req_user_id");
	}

	/**
	 * 결제 정보의 상세 과목 정보를 구한다.
	 */
	public function paymentItem()
	{
		return $this->hasMany(PaymentItem::class, "payment_id", "id");
	}

	/**
	 * 결제에 사용한 쿠폰 정보
	 */
	public function coupon()
	{
		return $this->belongsTo(Coupon::class, "coupon_id", "id");
	}

	public function getMethodStrAttribute()
	{
		if ($this->method === "vbank") {
			return "가상계좌";
		} elseif ($this->method === "free") {
			return "무료결제";
		}
		return "신용카드";
	}

	public function getStatusStrAttribute()
	{
		return PaymentStatus::convertLocaleString($this->status);
	}

	public function getVbankStrAttribute()
	{
		if ($this->vbank_name && $this->vbank_num) {
			return "{$this->vbank_name}: {$this->vbank_num}";
		}
		return "";
	}
}
