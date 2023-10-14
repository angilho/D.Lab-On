<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChildStoreRequest;
use App\Models\User;
use App\Models\Child;
use App\Models\ChildMetadata;
use Exception;

class ChildController extends Controller
{
	/**
	 * 특정 사용자의 자녀 정보를 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index($parentId)
	{
		return User::with(["children", "parent.parentInfo", "menuPermission"])->findOrFail($parentId);
	}

	/**
	 * 신규 자녀를 추가한다.
	 *
	 * @param  App\Http\Requests\ChildStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(ChildStoreRequest $request, $parentId)
	{
		$validated = $request->validated();

		// 패스워드를 Hash한다.
		$validated["password"] = Hash::make($validated["password"]);

		try {
			// 사용자 생성
			$user = User::create($validated);
			$validated["user_id"] = $user->id;

			// 자녀 정보 설정
			ChildMetadata::create($validated);

			// 사용자, 자녀 연결
			Child::create([
				"parent_id" => $parentId,
				"child_id" => $user->id,
			]);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($user, 201);
	}

	/**
	 * ID에 매칭되는 아이 정보를 제거한다.
	 */
	public function destroy($userId, $childId)
	{
		try {
			$child = Child::where([
				"parent_id" => $userId,
				"child_id" => $childId,
			]);
			$child->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
