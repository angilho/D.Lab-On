<?php

namespace App\Exports;

use App\Models\User;
use App\Constants\Role;

use Carbon\Carbon;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class UsersExport implements FromCollection, WithHeadings, WithMapping, WithColumnFormatting, WithProperties
{
	private $keyword;

	function __construct($keyword)
	{
		$this->keyword = $keyword;
	}

	public function properties(): array
	{
		return [
			"creator" => "D.LAB ON Admin Server",
			"title" => "D.LAB On User List",
			"description" => "D.LAB On User List",
			"manager" => "D.LAB ON Admin",
			"company" => "D.LAB ON",
		];
	}

	public function headings(): array
	{
		return ["ID", "역할", "이름", "이메일", "전화번호", "주소", "학년", "생년월일", "가입일"];
	}

	public function collection()
	{
		$keyword = $this->keyword;

		return User::whereIn("role", [Role::ADMIN])
			->when($keyword, function ($q) use ($keyword) {
				$q->where(function ($q2) use ($keyword) {
					$q2->where("user_login", "like", "%{$keyword}%")
						->orWhere("name", "like", "%{$keyword}%")
						->orWhere("email", "like", "%{$keyword}%")
						->orWhere("phone", "like", "%{$keyword}%");
				});
			})
			->with("userMetadata")
			->get();
	}

	/**
	 * @var User $user
	 */
	public function map($user): array
	{
		$createdAt = Carbon::parse($user->created_at)->setTimezone("Asia/Seoul");
		return [
			$user->user_login,
			Role::convertRoleToString($user->role),
			$user->name,
			$user->email,
			$user->phone,
			"{$user->address}, {$user->address_detail}",
			$user->userMetadata ? $user->userMetadata->grade_str : "",
			$user->birthday ? "{$user->birthday["year"]}-{$user->birthday["month"]}-{$user->birthday["day"]}" : "",
			$createdAt ? Date::dateTimeToExcel($createdAt) : "-",
		];
	}

	public function columnFormats(): array
	{
		return [
			//생성 시각
			"I" => NumberFormat::FORMAT_DATE_YYYYMMDD,
		];
	}
}
