<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoticeStoreRequest;
use App\Http\Requests\NoticeUpdateRequest;
use App\Models\Notice;
use App\Constants\Role;
use Illuminate\Http\Request;
use Exception;

class NoticeController extends Controller
{
	/**
	 * 공지사항 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request)
	{
		$keyword = $request->input("keyword");
		$notices = Notice::when($keyword, function ($q) use ($keyword) {
			return $q->where(function ($query) use ($keyword) {
				$query
					->where("title", "like", "%{$keyword}%")
					->orWhere("description", "like", "%{$keyword}%")
					->orWhereHas("user", function ($query2) use ($keyword) {
						return $query2->where("users.name", "like", "%{$keyword}%");
					});
			});
		})
			->orderBy("created_at", "desc")
			->paginate(10);

		return $notices;
	}

	/**
	 * 공지사항 아이템을 추가한다.
	 *
	 * @param  App\Http\Requests\NoticeStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(NoticeStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			// 현재 글을 작성하는 사용자 정보를 추가로 넣어준다.
			$user = auth()->user();
			$validated["user_id"] = $user->id;
			$notice = Notice::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($notice, 201);
	}

	/**
	 * 공지사항을 갱신한다.
	 *
	 * @param  App\Http\Requests\NoticeUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(NoticeUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$notice = Notice::findOrFail($id);
		try {
			$notice->fill($validated);
			if (!$notice->isDirty()) {
				return response()->noContent();
			}
			$notice->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($notice, 201);
	}

	/**
	 * ID에 매칭되는 공지사항 정보를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		// 공지사항 정보를 구할 때 조회수를 1증가한다.
		// 운영자가 조회한 경우에는 조회수를 증가시키지 않는다.
		$notice = Notice::findOrFail($id);

		$user = auth("sanctum")->user();
		if (!($user && $user->role === Role::ADMIN)) {
			$notice->update([
				"view_count" => $notice->view_count + 1,
			]);
		}

		return $notice;
	}

	/**
	 * ID에 매칭되는 공지사항 정보를 제거한다.
	 */
	public function destroy($id)
	{
		try {
			$notice = Notice::findOrFail($id);
			$notice->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}