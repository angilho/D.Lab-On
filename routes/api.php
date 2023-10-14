<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\v1\UserController;
use App\Http\Controllers\API\v1\ChildController;
use App\Http\Controllers\API\v1\CourseController;
use App\Http\Controllers\API\v1\CourseChapterController;
use App\Http\Controllers\API\v1\CoursePostController;
use App\Http\Controllers\API\v1\CoursePostCommentController;
use App\Http\Controllers\API\v1\CourseDescriptionController;
use App\Http\Controllers\API\v1\EnrollmentController;
use App\Http\Controllers\API\v1\DashboardController;
use App\Http\Controllers\API\v1\CartController;
use App\Http\Controllers\API\v1\PaymentController;
use App\Http\Controllers\API\v1\FaqController;
use App\Http\Controllers\API\v1\CouponController;
use App\Http\Controllers\API\v1\UserCouponController;
use App\Http\Controllers\API\v1\ForgotPasswordController;
use App\Http\Controllers\API\v1\EliceCourseController;
use App\Http\Controllers\API\v1\IamportController;
use App\Http\Controllers\API\v1\LearningController;
use App\Http\Controllers\API\v1\MessageController;
use App\Http\Controllers\API\v1\NoticeController;
use App\Http\Controllers\API\v1\OrganizationController;
use App\Http\Controllers\API\v1\OrganizationUserController;
use App\Http\Controllers\API\v1\OrganizationEnrollmentController;
use App\Http\Controllers\API\v1\OrganizationPostController;
use App\Http\Controllers\API\v1\OrganizationPostCommentController;
use App\Http\Controllers\API\v1\CarouselController;
use App\Http\Controllers\API\v1\CurriculumCategoryController;
use App\Http\Controllers\API\v1\DetailCurriculumCategoryController;
use App\Http\Controllers\API\v1\CertificateController;
use App\Http\Controllers\API\v1\MenuPermissionController;
use App\Http\Controllers\API\v1\FileController;
use App\Http\Controllers\API\v1\InstructorEnrollmentController;
use App\Http\Controllers\API\v1\VodCoursePostController;
use App\Http\Controllers\API\v1\SupportClassEnrollmentController;
use App\Http\Controllers\API\v1\SmsNotificationController;
use App\Http\Controllers\API\v1\AttendanceCourseController;
use App\Http\Controllers\API\v1\AttendanceSectionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * D.LAB On API v1
 *
 * middleware 정의 규칙
 * 1. auth:sanctum - 로그인 사용자 확인
 * 2. sanctum.abilities:admin - 운영자 확인 (2를 사용하기 위해서는 1번 middleware 필수)
 */
Route::group(["prefix" => "v1", "as" => "api.v1."], function () {
	Route::post("users/check", [UserController::class, "check"]);
	Route::post("users/check/phone", [UserController::class, "checkPhone"]);
	Route::put("users/password", [UserController::class, "updatePassword"])->middleware(["auth:sanctum"]);
	Route::post("users/find/id/phone", [UserController::class, "findIdByPhone"]);
	Route::post("users/find/id/email", [UserController::class, "findIdByEmail"]);
	Route::get("users/enrollments", [EnrollmentController::class, "getUserEnrollments"])->middleware([
		"auth:sanctum",
		"sanctum.abilities:admin",
	]);
	Route::get("payments", [PaymentController::class, "all"])->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("users/{user}/payments/{paymentId}/complete", [PaymentController::class, "complete"])->middleware([
		"auth:sanctum",
		"check.me",
	]);
	Route::apiResource("users", UserController::class)
		->only(["index"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::apiResource("users", UserController::class)->only(["store"]);
	Route::apiResource("users", UserController::class)
		->only(["show", "update", "destroy"])
		->middleware(["auth:sanctum", "check.me"]);
	Route::apiResource("users.children", ChildController::class)
		->only(["index", "store", "destroy"])
		->middleware(["auth:sanctum", "check.me"]);
	Route::apiResource("users.carts", CartController::class)
		->only(["index", "store", "destroy"])
		->middleware(["auth:sanctum", "check.me"]);
	Route::apiResource("users.payments", PaymentController::class)->middleware(["auth:sanctum", "check.me"]);
	Route::apiResource("users.enrollments", EnrollmentController::class)->middleware(["auth:sanctum", "check.me"]);
	Route::apiResource("users.coupons", UserCouponController::class)
		->only(["index"])
		->middleware(["auth:sanctum", "check.me"]);

	Route::get("users/{user}/course_learnings/{courseId}", [LearningController::class, "index"])->middleware([
		"auth:sanctum",
		"check.me",
	]);
	Route::post("users/{user}/course_learnings/{courseId}/chapters/{chapterId}/vods/{vodId}", [
		LearningController::class,
		"completeVod",
	])->middleware(["auth:sanctum", "check.me"]);
	Route::post("users/{user}/course_learnings/{courseId}/chapters/{chapterId}/quiz/{quizId}/submissions", [
		LearningController::class,
		"submitQuiz",
	])->middleware(["auth:sanctum", "check.me"]);
	Route::get("users/{user}/course_learnings/{courseId}/chapters/{chapterId}/quiz/{quizId}/submissions", [
		LearningController::class,
		"quizSubmissions",
	])->middleware(["auth:sanctum", "check.me"]);
	Route::get("users/{user}/certificates", [CertificateController::class, "index"])->middleware([
		"auth:sanctum",
		"check.me",
	]);

	Route::get("courses/{course}/sections/{section}/enrollments", [
		EnrollmentController::class,
		"getCourseSectionEnrollments",
	])->middleware(["auth:sanctum", "sanctum.abilities:instructor"]);
	Route::get("courses/{course}/enrollments", [EnrollmentController::class, "getCourseEnrollments"])->middleware([
		"auth:sanctum",
		"sanctum.abilities:admin",
	]);
	Route::get("courses/enrollments", [EnrollmentController::class, "getCoursesEnrollments"])->middleware([
		"auth:sanctum",
		"sanctum.abilities:admin",
	]);

	Route::apiResource("courses", CourseController::class)->only(["index", "show"]);
	Route::apiResource("courses", CourseController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("courses/{course}/copy", [CourseController::class, "copyCourse"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("courses.copy");

	Route::apiResource("courses.chapters", CourseChapterController::class)->only(["index"]);
	Route::get("courses/{course}/chapters/admin", [CourseChapterController::class, "adminIndex"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("courses.chapters.indexAdmin");
	Route::post("courses/{course}/chapters", [CourseChapterController::class, "store"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("courses.chapters.store");
	Route::match(["PUT", "PATCH"], "courses/{course}/chapters", [CourseChapterController::class, "update"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("courses.chapters.update");

	Route::apiResource("courses.posts", CoursePostController::class)
		->only(["index", "store", "update", "show", "destroy"])
		->middleware(["auth:sanctum"]);
	Route::apiResource("courses.posts.comments", CoursePostcommentController::class)->only(["store"]);
	Route::apiResource("courses.description", CourseDescriptionController::class)
		->only(["store"])
		->middleware(["auth:sanctum"]);

	Route::apiResource("dashboards", DashboardController::class)
		->only(["index"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::apiResource("faqs", FaqController::class)->only(["index", "show"]);
	Route::apiResource("faqs", FaqController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::get("faq_categories", [FaqController::class, "faqCategories"]);

	/**
	 * 쿠폰
	 */
	Route::apiResource("coupons", CouponController::class)->only(["index"]);
	Route::apiResource("coupons", CouponController::class)
		->only(["show"])
		->middleware(["auth:sanctum"]);
	Route::apiResource("coupons", CouponController::class)
		->only(["store"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("coupons/delete", [CouponController::class, "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("coupons.delete");
	Route::post("coupons/user_coupon_import", [CouponController::class, "import"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("coupons.user_coupon_import");

	Route::apiResource("messages", MessageController::class)
		->only(["index", "show"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("messages/send", [MessageController::class, "send"])->middleware([
		"auth:sanctum",
		"sanctum.abilities:admin",
	]);
	Route::apiResource("notices", NoticeController::class)->only(["index", "show"]);
	Route::apiResource("notices", NoticeController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::apiResource("faqs", FaqController::class)->only(["index", "show"]);
	Route::apiResource("faqs", FaqController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);

	Route::apiResource("organizations", OrganizationController::class)->only(["index", "show"]);
	Route::apiResource("organizations", OrganizationController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::apiResource("organization_users", OrganizationUserController::class)
		->only(["index", "show"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("organization_user_import", [OrganizationUserController::class, "import"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("organization_user_import");
	Route::apiResource("organization_enrollments", OrganizationEnrollmentController::class)
		->only(["index"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("organization_enrollments/delete", [OrganizationEnrollmentController::class, "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("organization_enrollments.delete");
	Route::post("organization_enrollment_import", [OrganizationEnrollmentController::class, "import"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("organization_enrollment_import");
	Route::apiResource("organizations.posts", OrganizationPostController::class)
		->only(["index", "store", "update", "show", "destroy"])
		->middleware(["auth:sanctum"]);
	Route::apiResource("organizations.posts.comments", OrganizationPostCommentController::class)->only([
		"store",
		"destroy",
	]);
	Route::apiResource("menu_permissions", MenuPermissionController::class)
		->only(["index", "show", "update"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);

	/**
	 * 캐러셀
	 */
	Route::post("carousels/reorder", [CarouselController::class, "reorder"])->middleware([
		"auth:sanctum",
		"sanctum.abilities:admin",
	]);
	Route::apiResource("carousels", CarouselController::class)->only(["index"]);
	Route::apiResource("carousels", CarouselController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);

	/**
	 * 메인 페이지 커리큘럼
	 */
	Route::post("curriculum_categories/reorder", [CurriculumCategoryController::class, "reorder"])->middleware([
		"auth:sanctum",
		"sanctum.abilities:admin",
	]);
	Route::apiResource("curriculum_categories", CurriculumCategoryController::class)->only(["index", "show"]);
	Route::apiResource("curriculum_categories", CurriculumCategoryController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);

	/**
	 * 커리큘럼
	 */
	Route::post("detail_curriculum_categories/reorder", [
		DetailCurriculumCategoryController::class,
		"reorder",
	])->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::apiResource("detail_curriculum_categories", DetailCurriculumCategoryController::class)->only([
		"index",
		"show",
	]);
	Route::apiResource("detail_curriculum_categories", DetailCurriculumCategoryController::class)
		->only(["store", "update", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);

	/**
	 * 강사회원
	 */
	Route::apiResource("instructors.enrollments", InstructorEnrollmentController::class)
		->only(["store", "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);

	/**
	 * VOD 과목 게시판
	 */
	Route::apiResource("vod_course_posts", VodCoursePostController::class)
		->only(["index", "show"])
		->middleware(["auth:sanctum"]);

	/**
	 * 보충 수업
	 */
	Route::apiResource("support_class_enrollments", SupportClassEnrollmentController::class)
		->only(["index"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"]);
	Route::post("support_class_enrollments/delete", [SupportClassEnrollmentController::class, "destroy"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("support_class_enrollments.delete");
	Route::post("support_class_enrollment_import", [SupportClassEnrollmentController::class, "import"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("support_class_enrollment_import");
	Route::post("support_class_enrollment_extend", [SupportClassEnrollmentController::class, "extend"])
		->middleware(["auth:sanctum", "sanctum.abilities:admin"])
		->name("support_class_enrollment_extend");

	/**
	 * Sms Notifications
	 */
	Route::apiResource("sms_notifications", SmsNotificationController::class)
		->only(["index", "store", "update", "show", "destroy"])
		->middleware(["auth:sanctum"]);

	/**
	 * 출결 관리
	 */
	Route::apiResource("attendance_courses", AttendanceCourseController::class)
		->only(["index", "show", "store"])
		->middleware(["auth:sanctum"]);
	Route::get("attendance_courses/{attendance_course}/student_attendances/{student}", [
		AttendanceCourseController::class,
		"studentAttendances",
	])
		->middleware(["auth:sanctum"])
		->name("attendance_courses.student_attendances");
	Route::put("attendance_courses/{attendance_course}/student_attendances/{student}", [
		AttendanceCourseController::class,
		"updateStudentAttendances",
	])
		->middleware(["auth:sanctum"])
		->name("attendance_courses.student_attendances");
	Route::post("attendance_courses/{attendance_course}/sections_delete", [
		AttendanceSectionController::class,
		"sectionsDelete",
	])
		->middleware(["auth:sanctum", "sanctum.abilities:instructor"])
		->name("attendance_courses.sections_delete");
	Route::get("attendance_courses/{attendance_course}/sections/{attendance_section}", [
		AttendanceSectionController::class,
		"show",
	])
		->middleware(["auth:sanctum"])
		->name("attendance_courses.sections.show");
	Route::post("attendance_courses/{attendance_course}/sections/{attendance_section}/attendances", [
		AttendanceSectionController::class,
		"storeAttendances",
	])
		->middleware(["auth:sanctum"])
		->name("attendance_courses.sections.storeAttendances");

	/**
	 * Password 초기화
	 */
	Route::post("password/forgot", [ForgotPasswordController::class, "forgot"]);
	Route::post("password/reset", [ForgotPasswordController::class, "reset"]);

	/**
	 * Elice
	 */
	Route::get("elice/courses/{elice_id}/sso", [EliceCourseController::class, "getSsoUrl"])->middleware([
		"auth:sanctum",
	]);

	/**
	 * Iamport webhook
	 */
	Route::post("iamport/webhook", [IamportController::class, "webhook"]);

	/**
	 * File
	 */
	Route::apiResource("files", FileController::class)
		->only(["show", "store", "destroy"])
		->middleware(["auth:sanctum"]);
});

Route::fallback(function () {
	return response()->json(
		[
			"message" => "API Not Found",
		],
		404
	);
});
