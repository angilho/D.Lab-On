<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Course;
use Carbon\Carbon;
use App\Constants\Role;

use Exception;

class DashboardController extends Controller
{
	/**
	 * 전체 사용자 목록을 자녀를 포함하여 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		try {
			$todayEnrollmentCount = Enrollment::whereDate("created_at", Carbon::today())->count();
			$memberCount = User::where("role", Role::MEMBER)->count();
			$courseCount = Course::all()->count();
			$adminCount = User::where("role", Role::ADMIN)->count();
		} catch (\Throwable $th) {
			return response()->json(["message" => $th->getMessage()], 500);
		}

		return response()->json(
			[
				"todayEnrollmentCount" => $todayEnrollmentCount,
				"memberCount" => $memberCount,
				"courseCount" => $courseCount,
				"adminCount" => $adminCount,
			],
			200
		);
	}
}