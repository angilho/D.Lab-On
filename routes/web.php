<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**
 * Auth
 */
Auth::routes(); // vendor/laravel/ui/src/AuthRouteMethods.php 정의를 따른다.
Route::group(["prefix" => "register"], function () {
	Route::get("/", "App\Http\Controllers\Auth\RegisterController@index")->name("register.index");
	Route::get("agreement", "App\Http\Controllers\Auth\RegisterController@showRegistrationAgreement")->name(
		"register.agreement"
	);
	Route::get("user", "App\Http\Controllers\Auth\RegisterController@showRegistrationUser")->name("register.user");
	Route::get("user/{id}/child", "App\Http\Controllers\Auth\RegisterController@showRegistrationChild")->name(
		"register.child"
	);
	Route::get("child/confirm", "App\Http\Controllers\Auth\RegisterController@showRegistrationChildConfirm")->name(
		"register.child.confirm"
	);
	Route::get("child", "App\Http\Controllers\Auth\RegisterController@showRegistrationChildUser")->name(
		"register.child.user"
	);
	Route::get("welcome", "App\Http\Controllers\Auth\RegisterController@showRegistrationWelcome")->name(
		"register.welcome"
	);
});

/**
 * Front
 */
Route::group(["as" => "front."], function () {
	Route::group(["as" => "main."], function () {
		Route::get("/", [App\Http\Controllers\Front\MainController::class, "index"])->name("index");
	});

	Route::group(["as" => "about."], function () {
		Route::get("/about", [App\Http\Controllers\Front\MainController::class, "about"])->name("about");
	});

	Route::group(["as" => "myCodingSpace."], function () {
		Route::get("mycodingspace", [App\Http\Controllers\Front\MyCodingSpaceController::class, "index"])->name(
			"index"
		);
	});

	Route::group(["as" => "curriculum."], function () {
		Route::get("curriculum", [App\Http\Controllers\Front\CurriculumController::class, "index"])->name("index");
	});

	Route::group(["as" => "detail_curriculum."], function () {
		Route::get("detail_curriculum", [App\Http\Controllers\Front\DetailCurriculumController::class, "index"])->name(
			"index"
		);
	});

	Route::group(["as" => "courses."], function () {
		Route::get("courses/{id}", [App\Http\Controllers\Front\CourseController::class, "index"])->name("index");
		Route::get("courses/{id}/chapters", [App\Http\Controllers\Front\CourseChapterController::class, "index"])
			->name("chapters.index")
			->middleware("check.enrollment");
		Route::get("courses/{id}/chapters/{chapterId}", [
			App\Http\Controllers\Front\CourseChapterController::class,
			"show",
		])
			->name("chapters.id.show")
			->middleware("check.enrollment");
		Route::get("courses/{id}/chapters/{chapterId}/resources", [
			App\Http\Controllers\Front\CourseChapterController::class,
			"resources",
		])
			->name("chapters.id.resources")
			->middleware("check.enrollment");
		Route::get("courses/{id}/chapters/{chapterId}/vods/{vodId}", [
			App\Http\Controllers\Front\CourseChapterController::class,
			"vod",
		])
			->name("chapters.id.vod.vodId")
			->middleware("check.enrollment");
		Route::get("courses/{id}/chapters/{chapterId}/quiz", [
			App\Http\Controllers\Front\CourseChapterController::class,
			"quiz",
		])
			->name("chapters.id.quiz")
			->middleware("check.enrollment");
		Route::get("courses/{id}/statistics/quiz", [
			App\Http\Controllers\Front\CourseChapterController::class,
			"quizStatistics",
		])
			->name("chapters.id.statistics.quiz")
			->middleware("check.enrollment");
		Route::get("courses/{id}/posts", [App\Http\Controllers\Front\CoursePostController::class, "index"])
			->name("posts")
			->middleware("check.enrollment");
		Route::get("courses/{id}/posts/create", [App\Http\Controllers\Front\CoursePostController::class, "create"])
			->name("posts.create")
			->middleware("check.enrollment");
		Route::get("courses/{id}/posts/{postId}", [App\Http\Controllers\Front\CoursePostController::class, "show"])
			->name("posts.id.show")
			->middleware("check.enrollment");
		Route::get("courses/{id}/posts/{postId}/edit", [App\Http\Controllers\Front\CoursePostController::class, "edit"])
			->name("posts.id.edit")
			->middleware("check.enrollment");
	});

	Route::group(["as" => "cart."], function () {
		Route::get("cart", [App\Http\Controllers\Front\CartController::class, "index"])->name("index");
	});

	Route::group(["as" => "faq."], function () {
		Route::get("notice", [App\Http\Controllers\Front\FaqController::class, "index"])->name("index");
		Route::get("faq", [App\Http\Controllers\Front\FaqController::class, "index"])->name("index");
		Route::get("faq/{id}", [App\Http\Controllers\Front\FaqController::class, "index"])->name("faq.id.index");
	});

	Route::group(["as" => "user."], function () {
		Route::get("user/find", [App\Http\Controllers\Front\UserController::class, "find"])->name("find");
		Route::get("user/find/id/phone", [App\Http\Controllers\Front\UserController::class, "find"])->name(
			"find.id.phone"
		);
		Route::get("user/find/id/email", [App\Http\Controllers\Front\UserController::class, "find"])->name(
			"find.id.email"
		);
		Route::get("user/find/password/email", [App\Http\Controllers\Front\UserController::class, "find"])->name(
			"find.password.email"
		);
		Route::get("user/delete/complete", [App\Http\Controllers\Front\UserController::class, "find"])->name(
			"delete.complete"
		);
	});

	Route::group(["as" => "payment."], function () {
		Route::get("payment", [App\Http\Controllers\Front\PaymentController::class, "index"])->name("index");
		Route::get("payment/{id}/success", [App\Http\Controllers\Front\PaymentController::class, "success"])->name(
			"success"
		);
	});

	Route::group(["as" => "mypage."], function () {
		Route::get("mypage", [App\Http\Controllers\Front\MypageController::class, "index"])->name("index");
		Route::get("mypage/coupon", [App\Http\Controllers\Front\MypageController::class, "coupon"])->name("coupon");
		Route::get("mypage/password/edit", [App\Http\Controllers\Front\MypageController::class, "passwordEdit"])->name(
			"password.edit"
		);
		Route::get("mypage/user/delete", [App\Http\Controllers\Front\MypageController::class, "userDelete"])->name(
			"user.delete"
		);
		Route::get("mypage/children", [App\Http\Controllers\Front\MypageController::class, "childrenIndex"])->name(
			"children.index"
		);
		Route::get("mypage/child/create", [App\Http\Controllers\Front\MypageController::class, "childCreate"])->name(
			"child.create"
		);
		Route::get("mypage/enrollment", [App\Http\Controllers\Front\MypageController::class, "enrollmentIndex"])->name(
			"enrollment.index"
		);
		Route::get("mypage/enrollment/closed", [
			App\Http\Controllers\Front\MypageController::class,
			"enrollmentClosed",
		])->name("enrollment.closed");
		Route::get("mypage/support_class_enrollment", [
			App\Http\Controllers\Front\MypageController::class,
			"supportClassEnrollmentIndex",
		])->name("support_class.index");
		Route::get("mypage/support_class_enrollment/closed", [
			App\Http\Controllers\Front\MypageController::class,
			"supportClassEnrollmentClosed",
		])->name("support_class_enrollment.closed");
		Route::get("mypage/enrollment/certificate", [
			App\Http\Controllers\Front\MypageController::class,
			"certificate",
		])->name("enrollment.certificate");
		Route::get("mypage/enrollment/certificate/{course}/issue", [
			App\Http\Controllers\Front\MypageController::class,
			"issueCertificate",
		])->name("issue.certificate");
		Route::get("mypage/payment", [App\Http\Controllers\Front\MypageController::class, "paymentIndex"])->name(
			"mypage.payment.index"
		);
		Route::get("mypage/payment/{id}", [App\Http\Controllers\Front\MypageController::class, "paymentIndex"])->name(
			"mypage.payment.index.id"
		);
	});

	Route::group(["as" => "event."], function () {
		Route::get("event/{name}", [App\Http\Controllers\Front\EventPageController::class, "index"])->name("index");
	});

	Route::group(["as" => "organizations."], function () {
		Route::get("organizations/{id}/posts", [
			App\Http\Controllers\Front\OrganizationPostController::class,
			"index",
		])->name("organizations.id.posts");
		Route::get("organizations/{id}/posts/create", [
			App\Http\Controllers\Front\OrganizationPostController::class,
			"create",
		])->name("organizations.id.posts.create");
		Route::get("organizations/{id}/posts/{postId}", [
			App\Http\Controllers\Front\OrganizationPostController::class,
			"show",
		])->name("organizations.id.posts.id.show");
		Route::get("organizations/{id}/posts/{postId}/edit", [
			App\Http\Controllers\Front\OrganizationPostController::class,
			"edit",
		])->name("organizations.id.posts.id.edit");
	});

	Route::group(["as" => "support_class."], function () {
		Route::get("support_class", [App\Http\Controllers\Front\SupportClassController::class, "index"])->name("index");
	});

	// 기업 로그인 대상 페이지로 이동하는 route는 다른 모든 route와 충돌하지 않고 맨 마지막에 남는 route에서 처리한다.
	Route::get("/{organization}", [App\Http\Controllers\Auth\LoginController::class, "organizationLogin"])->name(
		"organization.login"
	);
});

Route::group(["prefix" => "thirdParty", "as" => "thirdParty."], function () {
	Route::get("/searchAddress", [
		App\Http\Controllers\ThirdParty\ThirdPartyController::class,
		"searchAddressGet",
	])->name("searchAddressGet");
	Route::get("/searchSchool", [App\Http\Controllers\ThirdParty\ThirdPartyController::class, "searchSchoolGet"])->name(
		"searchSchoolGet"
	);
	Route::post("/searchSchool", [
		App\Http\Controllers\ThirdParty\ThirdPartyController::class,
		"searchSchoolPost",
	])->name("searchSchoolPost");
});

/**
 * Admin
 */
Route::group(["prefix" => "admin", "as" => "admin.", "middleware" => ["auth", "can:access-admin"]], function () {
	Route::get("/", function () {
		return redirect("/admin/dashboard");
	})->name("main");
	Route::resource("dashboard", App\Http\Controllers\Admin\DashboardController::class)->only(["index"]);
	Route::resource("enrollments", App\Http\Controllers\Admin\EnrollmentController::class)->only(["index"]);
	Route::resource("users", App\Http\Controllers\Admin\UserController::class)->only(["index", "show", "edit"]);
	Route::resource("parents", App\Http\Controllers\Admin\ParentController::class)->only(["index", "show", "edit"]);
	Route::get("courses/{id}/enrollments", [App\Http\Controllers\Admin\CourseController::class, "index"])->name(
		"courses.enrollments.index"
	);
	Route::get("courses/{id}/design/chapter", [App\Http\Controllers\Admin\CourseController::class, "index"])->name(
		"courses.design.chapter.index"
	);
	Route::resource("courses", App\Http\Controllers\Admin\CourseController::class)->only(["index", "create", "edit"]);
	Route::resource("payments", App\Http\Controllers\Admin\PaymentController::class)->only(["index"]);
	Route::resource("courses/{id}/posts", App\Http\Controllers\Admin\CoursePostController::class)->only([
		"index",
		"create",
		"show",
		"edit",
	]);
	Route::get("courses/{id}/description", [
		App\Http\Controllers\Admin\CourseDescriptionController::class,
		"index",
	])->name("courses.description.index");
	Route::resource("coupons", App\Http\Controllers\Admin\CouponController::class)->only(["index", "create"]);
	Route::get("coupons/allocate", [App\Http\Controllers\Admin\CouponController::class, "allocate"])->name(
		"coupons.allocate"
	);
	Route::resource("messages", App\Http\Controllers\Admin\MessageController::class)->only(["index", "show", "create"]);
	Route::resource("supports", App\Http\Controllers\Admin\SupportController::class)->only(["index"]);
	Route::resource("notices", App\Http\Controllers\Admin\NoticeController::class)->only(["show", "create"]);
	Route::resource("faqs", App\Http\Controllers\Admin\FaqController::class)->only(["show", "create"]);
	Route::resource("organizations", App\Http\Controllers\Admin\OrganizationController::class)->only([
		"index",
		"create",
		"edit",
	]);
	Route::resource("organization_users", App\Http\Controllers\Admin\OrganizationUserController::class)->only([
		"index",
		"show",
		"edit",
	]);
	Route::resource(
		"organization_enrollments",
		App\Http\Controllers\Admin\OrganizationEnrollmentController::class
	)->only(["index", "create"]);
	Route::resource("organizations/{id}/posts", App\Http\Controllers\Admin\OrganizationPostController::class)->only([
		"index",
		"create",
		"show",
		"edit",
	]);
	Route::resource("carousels", App\Http\Controllers\Admin\CarouselController::class)->only(["index"]);
	Route::resource("curriculums", App\Http\Controllers\Admin\CurriculumController::class)->only([
		"index",
		"create",
		"edit",
	]);
	Route::resource("detail_curriculums", App\Http\Controllers\Admin\DetailCurriculumController::class)->only([
		"index",
		"create",
		"edit",
	]);
	Route::resource("menu_permissions", App\Http\Controllers\Admin\MenuPermissionController::class)->only([
		"index",
		"show",
	]);
	Route::resource("instructors", App\Http\Controllers\Admin\InstructorController::class)->only([
		"index",
		"show",
		"edit",
	]);
	Route::get("vod_course_posts", [App\Http\Controllers\Admin\VodCoursePostController::class, "index"])->name(
		"vod_courses.index"
	);
	Route::get("vod_course_posts/{post_id}", [App\Http\Controllers\Admin\VodCoursePostController::class, "show"])->name(
		"vod_courses.posts.show"
	);
	Route::resource("support_classes", App\Http\Controllers\Admin\SupportClassEnrollmentController::class)->only([
		"index",
		"create",
	]);
	Route::resource("sms_notifications", App\Http\Controllers\Admin\SmsNotificationController::class)->only([
		"index",
		"edit",
		"create",
	]);

	Route::resource("vod_progress_rate", App\Http\Controllers\Admin\VodClassProgressRateController::class)->only([
		"index",
	]);

	/**
	 * Excel Export
	 */
	Route::group(["prefix" => "export", "as" => "export."], function () {
		Route::get("users", [App\Http\Controllers\Admin\ExportController::class, "users"])->name("users");
		Route::get("parents", [App\Http\Controllers\Admin\ExportController::class, "parents"])->name("parents");
		Route::get("enrollments", [App\Http\Controllers\Admin\ExportController::class, "enrollments"])->name(
			"enrollments"
		);
		Route::get("coupons", [App\Http\Controllers\Admin\ExportController::class, "coupons"])->name("coupons");
		Route::get("coupon_usages", [App\Http\Controllers\Admin\ExportController::class, "couponUsages"])->name(
			"coupon_usages"
		);
		Route::get("support_class_histories", [
			App\Http\Controllers\Admin\ExportController::class,
			"supportClassHistories",
		])->name("support_class_histories");
		Route::get("sms_notification_histories/{id}", [
			App\Http\Controllers\Admin\ExportController::class,
			"smsNotificationHistories",
		])->name("sms_notificationHistories.id");
		Route::get("course_attendances/{course}", [
			App\Http\Controllers\Admin\ExportController::class,
			"courseAttendances",
		])->name("courseAttendances.id");
		Route::get("vod_progress_rate/{course}", [
			App\Http\Controllers\Admin\ExportController::class,
			"vodProgressRate",
		])->name("vodProgressRate.id");
	});
});

/**
 * Admin allow instructor
 */
Route::group(
	[
		"prefix" => "admin",
		"as" => "admin.",
		"middleware" => ["auth", "can:access-admin-instructor"],
	],
	function () {
		Route::resource("attendances", App\Http\Controllers\Admin\AttendanceController::class)->only([
			"index",
			"create",
		]);
		Route::get("attendances/{attendance_course_id}", [
			App\Http\Controllers\Admin\AttendanceController::class,
			"index",
		])->name("attendances.index");
		Route::get("attendances/{attendance_course_id}/sections/{attendance_section_id}", [
			App\Http\Controllers\Admin\AttendanceController::class,
			"index",
		])->name("attendances.sections.index");
	}
);

/**
 * Masquerade Login
 */
Route::post("masquerade_login", [App\Http\Controllers\Auth\MasqueradeLoginController::class, "login"])->middleware([
	"auth",
]);
