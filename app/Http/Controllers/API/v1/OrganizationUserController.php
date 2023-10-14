<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Requests\OrganizationUserImportRequest;
use App\Filter\OrganizationUserSearchFilter;
use App\Constants\Role;
use App\Models\User;
use App\Models\UserAgreement;
use App\Models\Organization;

class OrganizationUserController extends Controller
{
	/**
	 * 전체 사용자 목록을 기업 정보를 포함하여 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return QueryBuilder::for(User::class)
			->with("organization")
			->whereNotNull("organization_id")
			->allowedFilters([AllowedFilter::custom("search", new OrganizationUserSearchFilter())])
			->orderBy("created_at", "asc")
			->paginate(30);
	}

	/**
	 * ID에 매칭되는 사용자를 기업 정보를 포함하여 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return User::with(["organization"])->findOrFail($id);
	}

	/**
	 * 사용자를 일괄 등록한다.
	 */
	public function import(OrganizationUserImportRequest $request)
	{
		$validated = $request->validated();

		try {
			$createdUsers = [];
			$failedUserIdx = [];
			foreach ($validated["users"] as $idx => $importUser) {
				// 컬럼이 6개인지 확인
				if (count($importUser) !== 6) {
					$failedUserIdx[] = $idx + 1;
					continue;
				}

				$organizationName = $importUser[0];
				$userName = $importUser[1];
				$userLogin = $importUser[2];
				$userEmail = $importUser[3];
				$userPassword = $importUser[4];
				$userPhone = $importUser[5];

				// 값이 모두 있는지 확인
				if (!$organizationName || !$userName || !$userLogin || !$userEmail || !$userPassword || !$userPhone) {
					$failedUserIdx[] = $idx + 1;
					continue;
				}

				// 기업명으로 된 기업이 있는지 확인한다.
				$organization = Organization::where("name", $organizationName)->first();
				if (!$organization) {
					$failedUserIdx[] = $idx + 1;
					continue;
				}

				// UserLogin이 충돌나는지 확인한다.
				if (User::where("user_login", $userLogin)->exists()) {
					$failedUserIdx[] = $idx + 1;
					continue;
				}

				// 회원을 생성한다.
				$user = User::create([
					"user_login" => $userLogin,
					"name" => $userName,
					"phone" => $userPhone,
					"password" => Hash::make($userPassword),
					"email" => $userEmail,
					"birthday" => ["year" => "2000", "month" => "1", "day" => "1"],
					"address" => "-",
					"address_detail" => "-",
					"role" => Role::MEMBER,
					"organization_id" => $organization->id,
				]);

				// 약관 동의 정보 생성
				UserAgreement::create([
					"user_id" => $user->id,
					"dlab_on" => true,
					"privacy" => true,
					"promotion" => false,
				]);

				$createdUsers[] = $user;
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		if (count($failedUserIdx) !== 0) {
			return response()->json(["failed_users" => $failedUserIdx], 206);
		}

		return response()->json($createdUsers, 201);
	}
}