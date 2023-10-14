<?php

namespace App\Http\Controllers\Front;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Constants\EnrollmentStatus;

class MypageController extends Controller
{
	/**
	 * Mypage를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		return view("app");
	}

	/**
	 * Mypage Password 수정 뷰를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function passwordEdit()
	{
		return view("app");
	}

	/**
	 * coupon 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function coupon()
	{
		return view("app");
	}

	/**
	 * Mypage 사용자 탈퇴 뷰를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function userDelete()
	{
		return view("app");
	}

	/**
	 * Mypage 아이 추가 뷰를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function childCreate()
	{
		return view("app");
	}

	/**
	 * Mypage 아이 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function childrenIndex()
	{
		return view("app");
	}

	/**
	 * Mypage 결제 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function paymentIndex()
	{
		return view("app");
	}

	/**
	 * Enrollment 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function enrollmentIndex()
	{
		return view("app");
	}

	/**
	 * 종료된 Enrollment 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function enrollmentClosed()
	{
		return view("app");
	}

	/**
	 * 보충 수업 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function supportClassEnrollmentIndex()
	{
		return view("app");
	}

	/**
	 * 종료된 보충 수업 정보를 보여준다.
	 *
	 * @return \Illuminate\View\View
	 */
	public function supportClassEnrollmentClosed()
	{
		return view("app");
	}

	/**
	 * 수료증 발급
	 *
	 * @return \Illuminate\View\View
	 */
	public function certificate()
	{
		return view("app");
	}

	/**
	 * 수료증 화면
	 */
	public function issueCertificate(Request $request, $courseId)
	{
		$user = $request->user();
		if (!$user) {
			abort(401);
		}

		try {
			// 수료 과목 확인
			$course = Course::where("id", $courseId)->first();
			if (!$course) {
				return abort(404);
			}
			$enrollment = Enrollment::where([
				["user_id", $user->id],
				["course_id", (int) $courseId],
				["status", EnrollmentStatus::COMPLETE],
			])->first();
			if (!$enrollment) {
				return abort(404);
			}
		} catch (\Throwable $th) {
			return abort(404);
		}

		$courseEnrollmentDate = new Carbon($enrollment->updated_at);
		$courseDuration =
			$courseEnrollmentDate->format("Y-m-d") .
			" ~ " .
			$courseEnrollmentDate
				->addYear(1)
				->subDays(1)
				->format("Y-m-d");

		$now = Carbon::now();

		return view("certificate", [
			"year" => $now->year,
			"month" => str_pad($now->month, 2, "0", STR_PAD_LEFT),
			"day" => str_pad($now->day, 2, "0", STR_PAD_LEFT),
			"name" => $user->name,
			"course_name" => $course->name,
			"course_duration" => $courseDuration,
		]);
	}
}
