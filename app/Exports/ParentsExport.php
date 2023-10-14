<?php

namespace App\Exports;

use App\Models\User;
use App\Constants\Role;
use App\Constants\Campus;

use Carbon\Carbon;

use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class ParentsExport implements FromCollection, WithHeadings, WithMapping, WithColumnFormatting, WithProperties
{
	private $role;
	private $campus;
	private $keyword;

	function __construct($role, $campus, $keyword)
	{
		$this->role = $role;
		$this->campus = $campus;
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
		return [
			"ID",
			"역할",
			"이름",
			"이메일",
			"전화번호",
			"주소",
			"학년",
			"생년월일",
			"가입경로",
			"디랩코드아카데미",
			"가입일",
		];
	}

	public function collection()
	{
		$role = $this->role;
		$campus = $this->campus;
		$keyword = $this->keyword;

		return User::where(function ($q) use ($role) {
			if (!$role || $role == -1) {
				$q->whereIn("role", [Role::MEMBER, Role::CHILD]);
			} else {
				$q->whereIn("role", [$role]);
			}
		})
			->where(function ($q) use ($campus) {
				if ($campus && $campus != -1) {
					$q->where("campus", $campus);
				}
			})
			->when($keyword, function ($q) use ($keyword) {
				$q->where(function ($q2) use ($keyword) {
					$q2->where("user_login", "like", "%{$keyword}%")
						->orWhere("name", "like", "%{$keyword}%")
						->orWhere("email", "like", "%{$keyword}%")
						->orWhere("phone", "like", "%{$keyword}%");
				});
			})
			->with("userMetadata", "parent")
			->get();
	}

	/**
	 * @var User $user
	 */
	public function map($user): array
	{
		$createdAt = Carbon::parse($user->created_at)->setTimezone("Asia/Seoul");
		$inflowPath = $user->inflow_path;
		if (!$inflowPath && $user->role == Role::CHILD) {
			try {
				$inflowPath = $user->parent->parentInfo->inflow_path;
			} catch (\Exception $e) {
				$inflowPath = null;
			}
		}
		return [
			$user->user_login,
			Role::convertRoleToString($user->role),
			$user->name,
			$user->email,
			$user->phone,
			"{$user->address}, {$user->address_detail}",
			$user->userMetadata ? $user->userMetadata->grade_str : "",
			$user->birthday ? "{$user->birthday["year"]}-{$user->birthday["month"]}-{$user->birthday["day"]}" : "",
			$inflowPath ?? "없음",
			Campus::convertCampusToString($user->campus),
			$createdAt ? Date::dateTimeToExcel($createdAt) : "-",
		];
	}

	public function columnFormats(): array
	{
		return [
			//생성 시각
			"K" => NumberFormat::FORMAT_DATE_YYYYMMDD,
		];
	}
}
