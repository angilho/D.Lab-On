<?php

namespace App\Exports;

use App\Models\Payment;
use App\Constants\CouponCategory;
use App\Constants\CouponType;
use App\Constants\PaymentStatus;
use Carbon\Carbon;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class CouponUsagesExport implements FromCollection, WithHeadings, WithMapping, WithColumnFormatting, WithProperties
{
	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Coupon Usage List",
			"description" => "D.LAB On Coupon Usage List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		return [
			"ID",
			"쿠폰제목",
			"발급방식",
			"발급번호",
			"쿠폰유형",
			"할인금액",
			"발급일",
			"만료일",
			"사용자ID",
			"사용자명",
			"사용일",
		];
	}

	public function collection()
	{
		// 쿠폰을 사용한 payment를 모두 구한다.
		return Payment::whereNotNull("coupon_id")
			->where("status", PaymentStatus::SUCCESS)
			->with(["user", "coupon"])
			->get();
	}

	/**
	 * @var Payment $payment
	 */
	public function map($payment): array
	{
		$coupon = $payment->coupon;
		$couponCreatedAt = Carbon::parse($coupon->created_at)->setTimezone("Asia/Seoul");
		$couponEndAt = Carbon::parse($coupon->end_at)->setTimezone("Asia/Seoul");

		$paymentUser = $payment->user;
		$paymentCreatedAt = Carbon::parse($payment->created_at)->setTimezone("Asia/Seoul");

		return [
			$payment->id,
			$coupon->name,
			$this->getCouponCategoryStr($coupon->category),
			$coupon->code,
			$this->getCouponTypeStr($coupon->type),
			$this->getCouponValueStr($coupon),
			$couponCreatedAt ? Date::dateTimeToExcel($couponCreatedAt) : "-",
			$couponEndAt ? Date::dateTimeToExcel($couponEndAt) : "-",
			$paymentUser->user_login,
			$paymentUser->name,
			$paymentCreatedAt ? Date::dateTimeToExcel($paymentCreatedAt) : "-",
		];
	}

	public function columnFormats(): array
	{
		return [
			//생성 시각
			"F" => NumberFormat::FORMAT_DATE_YYYYMMDD . " " . NumberFormat::FORMAT_DATE_TIME4,
			//만료 시각
			"G" => NumberFormat::FORMAT_DATE_YYYYMMDD . " " . NumberFormat::FORMAT_DATE_TIME4,
			//사용 시각
			"J" => NumberFormat::FORMAT_DATE_YYYYMMDD . " " . NumberFormat::FORMAT_DATE_TIME4,
		];
	}

	private function getCouponCategoryStr($category)
	{
		switch ($category) {
			case CouponCategory::MULTIPLE_TIME:
				return "다회성";
			case CouponCategory::ONE_TIME:
				return "일회성";
		}

		return $category;
	}

	private function getCouponTypeStr($type)
	{
		switch ($type) {
			case CouponType::PERCENT_DISCOUNT:
				return "할인권(%)";
			case CouponType::VALUE_DISCOUNT:
				return "금액권";
		}
		return $type;
	}

	private function getCouponValueStr($coupon)
	{
		switch ($coupon->type) {
			case CouponType::PERCENT_DISCOUNT:
				return "{$coupon->value}%";
			case CouponType::VALUE_DISCOUNT:
				return number_format($coupon->value) . "원";
		}
		return $coupon->value;
	}
}
