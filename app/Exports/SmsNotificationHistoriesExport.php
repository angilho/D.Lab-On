<?php

namespace App\Exports;

use App\Models\SmsNotificationHistory;
use Carbon\Carbon;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class SmsNotificationHistoriesExport implements
	FromCollection,
	WithHeadings,
	WithMapping,
	WithColumnFormatting,
	WithProperties
{
	private $smsNotificationId;

	function __construct($smsNotificationId)
	{
		$this->smsNotificationId = $smsNotificationId;
	}

	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On Sms Notification History List",
			"description" => "D.LAB On Sms Notification History List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		return ["ID", "노티명", "학생이름", "학생아이디", "핸드폰번호", "발송일"];
	}

	public function collection()
	{
		return SmsNotificationHistory::with(["smsNotification"])
			->where("sms_notification_id", $this->smsNotificationId)
			->get();
	}

	/**
	 * @var SmsNotificationHistory $history
	 */
	public function map($history): array
	{
		$createdAt = Carbon::parse($history->created_at)->setTimezone("Asia/Seoul");

		return [
			$history->id,
			$history->smsNotification->name,
			$history->user_name,
			$history->user_login,
			$history->phone,
			$createdAt ? Date::dateTimeToExcel($createdAt) : "-",
		];
	}

	public function columnFormats(): array
	{
		return [
			// 발송 시각
			"F" => NumberFormat::FORMAT_DATE_YYYYMMDD . " HH:mm:ss",
		];
	}
}
