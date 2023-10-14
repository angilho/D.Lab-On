<?php

namespace App\Exports;

use App\Constants\SupportClassHistoryAction;
use App\Models\SupportClassHistory;
use Carbon\Carbon;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class SupportClassHistoriesExport implements
	FromCollection,
	WithHeadings,
	WithMapping,
	WithColumnFormatting,
	WithProperties
{
	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Support Class History List",
			"description" => "D.LAB On Support Class History List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		return ["ID", "작업자", "학생이름", "강의명", "작업"];
	}

	public function collection()
	{
		return SupportClassHistory::with(["workUser", "targetUser", "targetCourse"])->get();
	}

	/**
	 * @var SupportClassHistory $history
	 */
	public function map($history): array
	{
		$createdAt = Carbon::parse($history->created_at)->setTimezone("Asia/Seoul");

		return [
			$history->id,
			isset($history->workUser) ? $history->workUser->name : "-",
			isset($history->targetUser) ? $history->targetUser->name : "-",
			isset($history->targetCourse) ? $history->targetCourse->name : "-",
			$this->getActionTypeStr($history->action),
			$createdAt ? Date::dateTimeToExcel($createdAt) : "-",
		];
	}

	public function columnFormats(): array
	{
		return [
			//생성 시각
			"F" => NumberFormat::FORMAT_DATE_YYYYMMDD,
		];
	}

	private function getActionTypeStr($type)
	{
		switch ($type) {
			case SupportClassHistoryAction::REGISTER:
				return "수강등록";
			case SupportClassHistoryAction::CANCEL:
				return "수강취소";
		}
		return $type;
	}
}
