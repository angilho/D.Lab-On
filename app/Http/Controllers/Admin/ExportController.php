<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Exports\UsersExport;
use App\Exports\ParentsExport;
use App\Exports\EnrollmentsExport;
use App\Exports\CouponsExport;
use App\Exports\CouponUsagesExport;
use App\Exports\SupportClassHistoriesExport;
use App\Exports\SmsNotificationHistoriesExport;
use App\Exports\CourseAttendancesExport;
use App\Exports\VodProgressRateExport;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class ExportController extends Controller
{
	/**
	 * UserList Excel Export
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function users(Request $request)
	{
		$keyword = $request->input("keyword");

		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_admins_{$currentTime}.xlsx";

		return \Excel::download(new UsersExport($keyword), $fileName);
	}

	/**
	 * ParentList Excel Export
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function parents(Request $request)
	{
		$role = $request->input("role");
		$campus = $request->input("campus");
		$keyword = $request->input("keyword");

		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_parents_{$currentTime}.xlsx";

		return \Excel::download(new ParentsExport($role, $campus, $keyword), $fileName);
	}

	/**
	 * EnrollmentList Excel Export
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function enrollments()
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_enrollments_{$currentTime}.xlsx";

		return \Excel::download(new EnrollmentsExport(), $fileName);
	}

	/**
	 * CouponList Excel Export
	 */
	public function coupons()
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_coupon_{$currentTime}.xlsx";

		return \Excel::download(new CouponsExport(), $fileName);
	}

	/**
	 * Coupon UsageList Excel Export
	 */
	public function couponUsages()
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_coupon_usage_{$currentTime}.xlsx";

		return \Excel::download(new CouponUsagesExport(), $fileName);
	}

	/**
	 * Support Class History Excel Export
	 */
	public function supportClassHistories()
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_support_class_histories_{$currentTime}.xlsx";

		return \Excel::download(new SupportClassHistoriesExport(), $fileName);
	}

	/**
	 * Sms Notifcation History Excel Export
	 */
	public function smsNotificationHistories($id)
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "dlabon_sms_notification_histories_{$currentTime}.xlsx";

		return \Excel::download(new SmsNotificationHistoriesExport($id), $fileName);
	}

	/**
	 * Course Attendances Excel Export
	 */
	public function courseAttendances($courseId)
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "course_attendances_{$currentTime}.xlsx";

		return \Excel::download(new CourseAttendancesExport($courseId), $fileName);
	}

	/**
	 * Vod Progress Rate Excel Export
	 */
	public function vodProgressRate($courseId)
	{
		$currentTime = Carbon::now()->setTimeZone("Asia/Seoul");
		$fileName = "vod_progress_rate_course{$courseId}_{$currentTime}.xlsx";

		return \Excel::download(new VodProgressRateExport($courseId), $fileName);
	}
}
