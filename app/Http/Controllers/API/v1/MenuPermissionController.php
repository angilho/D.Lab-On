<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\MenuPermissionUpdateRequest;
use App\Constants\AdminMenu;
use App\Models\MenuPermission;

class MenuPermissionController extends Controller
{
	/**
	 * 메뉴 권한 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request)
	{
		$keyword = $request->input("keyword");

		$adminMenus = collect(AdminMenu::all());
		if ($keyword) {
			$adminMenus = $adminMenus->filter(function ($adminMenu) use ($keyword) {
				return str_contains($adminMenu["name"], $keyword);
			});
		}

		return $adminMenus->values();
	}

	/**
	 * menu_id에 해당하는 모든 MenuPermissin을 구한다.
	 *
	 * @param  int  $messageId
	 * @return \Illuminate\Http\Response
	 */
	public function show($menuId)
	{
		$menu = collect(AdminMenu::all())->first(function ($menu) use ($menuId) {
			return $menu["id"] == $menuId;
		});
		$menuPermissions = MenuPermission::where("menu_id", $menuId)
			->with("user")
			->get()
			->filter(function ($menuPermission) {
				return $menuPermission->user->user_login !== "admin";
			})
			->values();
		return response()->json(["menu" => $menu, "menu_permissions" => $menuPermissions], 200);
	}

	/**
	 * 메뉴 권한을 추가한다.
	 *
	 * @param  App\Http\Requests\MenuPermissionUpdateRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function update(MenuPermissionUpdateRequest $request, $menuId)
	{
		$validated = $request->validated();

		try {
			// 해당 MenuId에 있는 모든 권한을 제거하고, 전달 받은 사용자를 신규 권한에 추가한다.
			MenuPermission::where("menu_id", $menuId)
				->where("user_id", "!=", 1)
				->delete();

			collect($validated["user_ids"])->map(function ($userId) use ($menuId) {
				MenuPermission::create([
					"menu_id" => $menuId,
					"user_id" => $userId,
				]);
			});
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
