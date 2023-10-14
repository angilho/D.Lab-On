<?php

namespace App\Exports;

use App\Models\Enrollment;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Carbon\Carbon;

class EnrollmentsExport implements FromCollection, WithHeadings, WithMapping, WithColumnFormatting, WithProperties
{
	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Enrollment List",
			"description" => "D.LAB On Enrollment List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		return ["신청일", "수강생", "이메일", "전화번호", "학교", "학년", "과목명"];
	}

	public function collection()
	{
		return Enrollment::with(["course", "user.userMetadata"])->get();
	}

	/**
	 * @var Enrollment $enrollment
	 */
	public function map($enrollment): array
	{
		$createdAt = Carbon::parse($enrollment->created_at)->setTimezone("Asia/Seoul");

		return [
			$createdAt ? Date::dateTimeToExcel($createdAt) : "-",
			$enrollment->user->name,
			$enrollment->user->email ?? "-",
			$enrollment->user->phone ?? "-",
			$enrollment->user->userMetadata->school ?? "일반",
			$enrollment->user->userMetadata->grade_str ?? "일반",
			$enrollment->course->name,
		];
	}

	public function columnFormats(): array
	{
		return [
			//생성 시각
			"A" => NumberFormat::FORMAT_DATE_YYYYMMDD,
		];
	}
}