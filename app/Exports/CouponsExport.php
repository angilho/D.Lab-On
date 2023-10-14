<?php

namespace App\Exports;

use App\Models\Coupon;
use App\Constants\CouponType;
use Carbon\Carbon;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class CouponsExport implements FromCollection, WithHeadings, WithMapping, WithColumnFormatting, WithProperties
{
	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Coupon List",
			"description" => "D.LAB On Coupon List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		return ["ID", "쿠폰제목", "발급번호", "쿠폰유형", "할인금액", "발급일", "만료일", "사용일"];
	}

	public function collection()
	{
		return Coupon::where("deleted", false)->get();
	}

	/**
	 * @var Coupon $coupon
	 */
	public function map($coupon): array
	{
		$createdAt = Carbon::parse($coupon->created_at)->setTimezone("Asia/Seoul");
		$endAt = Carbon::parse($coupon->end_at)->setTimezone("Asia/Seoul");
		$usedAt = $coupon->used_at ? Carbon::parse($coupon->used_at)->setTimezone("Asia/Seoul") : null;

		return [
			$coupon->id,
			$coupon->name,
			$coupon->code,
			$this->getCouponTypeStr($coupon->type),
			$this->getCouponValueStr($coupon),
			$createdAt ? Date::dateTimeToExcel($createdAt) : "-",
			$endAt ? Date::dateTimeToExcel($endAt) : "-",
			$usedAt ? Date::dateTimeToExcel($usedAt) : "-",
		];
	}

	public function columnFormats(): array
	{
		return [
			//생성 시각
			"F" => NumberFormat::FORMAT_DATE_YYYYMMDD,
			//만료 시각
			"G" => NumberFormat::FORMAT_DATE_YYYYMMDD,
			//사용 시각
			"H" => NumberFormat::FORMAT_DATE_YYYYMMDD,
		];
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
