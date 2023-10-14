<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\UserCheckRequest;
use App\Http\Requests\UserPasswordUpdateRequest;
use App\Http\Requests\UserCheckPhoneRequest;
use App\Http\Requests\UserFindIdByPhoneRequest;
use App\Http\Requests\UserFindIdByEmailRequest;
use App\Filter\UserSearchFilter;
use App\Models\User;
use App\Models\ChildMetadata;
use App\Models\UserAgreement;
use App\Models\Enrollment;
use App\Models\File;
use App\Models\MenuPermission;
use App\Models\InstructorMetadata;
use App\Mail\FindUserId;
use App\Constants\Role;
use App\Constants\AdminMenu;
use Exception;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
	/**
	 * 전체 사용자 목록을 자녀를 포함하여 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return QueryBuilder::for(User::class)
			->allowedFilters([
				"role",
				AllowedFilter::exact("campus"),
				AllowedFilter::custom("search", new UserSearchFilter()),
			])
			->with(["instructorMetadata"])
			->orderBy("created_at", "asc")
			->paginate(30);
	}

	/**
	 * 신규 사용자를 추가한다.
	 *
	 * @param  App\Http\Requests\UserStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(UserStoreRequest $request)
	{
		$validated = $request->validated();

		// 패스워드를 Hash한다.
		$validated["password"] = Hash::make($validated["password"]);

		try {
			// 해당 email이 unique한지 확인한다. 빈값이 존재할 수 있기 때문에 email은 unique 처리가 안된다.
			if ($validated["email"] && User::where("email", "=", $validated["email"])->exists()) {
				return response()->json(
					["message" => "The given data was invalid", "errors" => ["email" => ["이메일이 중복되었습니다."]]],
					422
				);
			}
			// 사용자 생성
			$user = User::create($validated);

			// 약관 동의 정보 생성
			UserAgreement::create([
				"user_id" => $user->id,
				"dlab_on" => $validated["agreements"]["dlab_on"] === "true",
				"privacy" => $validated["agreements"]["privacy"] === "true",
				"promotion" => $validated["agreements"]["promotion"]
					? $validated["agreements"]["promotion"] === "true"
					: false,
			]);

			// 자식을 등록하는 경우 childMetadata 생성
			if ($user->role == Role::CHILD) {
				ChildMetadata::create(array_merge($validated, ["user_id" => $user->id]));
			}
			// 운영자인 경우 메뉴 권한 기본 추가
			if ($user->role == Role::ADMIN) {
				$this->generateDefaultAdminUserMenuPermission($user);
			}
			// 강사 회원인 경우 InstructorMetadata 생성
			if ($user->role == Role::INSTRUCTOR) {
				$employeeNumber =
					"dlabon_" .
					Carbon::now()
						->timezone("Asia/Seoul")
						->format("YmdHis");
				InstructorMetadata::create([
					"user_id" => $user->id,
					"employee_number" => $employeeNumber,
					"start_at" => $validated["start_at"],
					"end_at" => $validated["end_at"],
					"gender" => $validated["gender"],
				]);
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($user, 201);
	}

	/**
	 * ID에 매칭되는 사용자를 자녀를 포함하여 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		$user = User::with(["userMetadata", "parent.parentInfo", "instructorMetadata"])->findOrFail($id);

		//헷갈리는 필요없는 정보 지우자
		if ($user->parent && $user->parent->userMetadata) {
			unset($user->parent->userMetadata);
		}
		if ($user->parent && $user->parent->userInfo) {
			unset($user->parent->userInfo);
		}

		return $user;
	}

	/**
	 * 사용자 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\UserUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(UserUpdateRequest $request, $id)
	{
		$validated = $request->validated();
		$user = User::findOrFail($id);
		$childMetadata = ChildMetadata::where("user_id", "=", $id)->first();
		$instructorMetadata = InstructorMetadata::where("user_id", "=", $id)->first();
		$updated = false;
		try {
			// 사용자가 비밀번호를 변경했을 때 Hash해서 저장한다.
			if (isset($validated["password"])) {
				$validated["password"] = Hash::make($validated["password"]);
			}

			// 사용자 프로필 이미지 변경 대응
			// profile_image가 있는 경우 해당 이미지를 resize해서 저장한다.
			// thumbnail을 교체하는 경우
			if ($request->hasFile("profile_image")) {
				$profileImageFile = $request->file("profile_image");
				$filename = $profileImageFile->store("public/files");
				$profileImage = File::create([
					"user_id" => $id,
					"filename" => pathinfo($filename, PATHINFO_BASENAME),
					"org_filename" => $profileImageFile->getClientOriginalName(),
				]);
				$validated["profile_image_id"] = $profileImage->id;
			}

			$user->fill($validated);

			if ($user->isDirty()) {
				$user->update();
				$updated |= true;
			}

			if ($childMetadata) {
				$childMetadata->fill($validated);
				if ($childMetadata->isDirty()) {
					$childMetadata->update();
					$updated |= true;
				}
			}

			if ($instructorMetadata) {
				$instructorMetadata->fill($validated);
				if ($instructorMetadata->isDirty()) {
					$instructorMetadata->update();
					$updated |= true;
				}
			}

			if (!$updated) {
				return response()->noContent();
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($user, 201);
	}

	/**
	 * 사용자를 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$user = User::findOrFail($id);
		try {
			$user->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 사용자를 체크한다.
	 */
	public function check(UserCheckRequest $request)
	{
		$validated = $request->validated();

		if (Auth::attempt(["email" => $validated["email"], "password" => $validated["password"]])) {
			return response()->noContent();
		}

		return response()->json(["error" => "Unauthenticated."], 401);
	}

	public function checkPhone(UserCheckPhoneRequest $request)
	{
		$validated = $request->validated();

		return response()->noContent();
	}

	public function updatePassword(UserPasswordUpdateRequest $request)
	{
		$validated = $request->validated();
		$user = User::where("id", Auth::user()->id)->first();
		$user->password = Hash::make($validated["new_password"]);
		$user->update();
		return response()->json($user, 201);
	}

	/**
	 * 사용자 로그인 ID를 핸드폰 번호 인증으로 찾는다.
	 */
	public function findIdByPhone(UserFindIdByPhoneRequest $request)
	{
		$validated = $request->validated();

		$query = [["name", "=", $validated["name"]]];
		if (isset($validated["phone"]) && !empty($validated["phone"])) {
			array_push($query, ["phone", "=", $validated["phone"]]);
		}
		if (isset($validated["email"]) && !empty($validated["email"])) {
			array_push($query, ["email", "=", $validated["email"]]);
		}

		$user_login = User::where($query)
			->get()
			->pluck("user_login")
			->first();

		return response()->json(
			[
				"user_login" => $user_login,
			],
			200
		);
	}

	/**
	 * 사용자 로그인 ID를 이메일로 전송한다.
	 */
	public function findIdByEmail(UserFindIdByEmailRequest $request)
	{
		$validated = $request->validated();

		$user_login = User::where("email", "=", $validated["email"])
			->get()
			->pluck("user_login")
			->first();

		// Email을 전송한다.
		Mail::to($validated["email"])->send(new FindUserId($user_login));

		return response()->noContent();
	}

	/**
	 * 기존 운영자 전체 메뉴권한 추가
	 */
	public function seedDefaultAdminUserMenuPermission()
	{
		$adminUsers = User::where("role", Role::ADMIN)->get();
		$adminUsers->map(function ($adminUser) {
			$permissionMenus = collect(AdminMenu::all());
			$permissionMenus->map(function ($menu) use ($adminUser) {
				MenuPermission::create([
					"menu_id" => $menu["id"],
					"user_id" => $adminUser->id,
				]);
			});
		});
	}

	/**
	 * 운영자 일부 메뉴권한 추가
	 */
	public function generateDefaultAdminUserMenuPermission($user)
	{
		$permissionMenus = collect([
			AdminMenu::DASHBOARD,
			AdminMenu::ENROLLMENTS,
			AdminMenu::PARENT_USERS,
			AdminMenu::MESSAGES,
		]);
		$permissionMenus->map(function ($menu) use ($user) {
			MenuPermission::create([
				"menu_id" => $menu["id"],
				"user_id" => $user->id,
			]);
		});
	}
}
