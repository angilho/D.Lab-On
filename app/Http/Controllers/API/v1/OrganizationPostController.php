<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrganizationPostStoreRequest;
use App\Http\Requests\OrganizationPostUpdateRequest;
use Illuminate\Http\Request;
use App\Models\OrganizationPost;
use App\Models\File;
use App\Constants\Role;

class OrganizationPostController extends Controller
{
	/**
	 * B2B 기업에 속한 전체 게시판 글 목록을 구한다.
	 *
	 * @param  int  $organizationId
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request, $organizationId)
	{
		$user = auth("sanctum")->user();
		$keyword = $request->input("keyword");
		$organizationPosts = OrganizationPost::where("organization_id", $organizationId)
			->when($keyword, function ($q) use ($keyword) {
				return $q->where(function ($query) use ($keyword) {
					$query
						->where("title", "like", "%{$keyword}%")
						->orWhere("description", "like", "%{$keyword}%")
						->orWhereHas("user", function ($query2) use ($keyword) {
							return $query2->where("users.name", "like", "%{$keyword}%");
						});
				});
			})
			->with("comments")
			->orderBy("order", "desc")
			->orderBy("created_at", "desc")
			->paginate(10);

		// 비공개 글은 작성자 혹은 운영자가 아니면 데이터를 전달하지 않는다.
		collect($organizationPosts->items())->each(function ($organizationPost) use ($user) {
			$this->checkPostPrivate($organizationPost, $user);
		});

		return $organizationPosts;
	}

	/**
	 * B2B 기업에 속한 게시판 글을 추가한다.
	 *
	 * @param  App\Http\Requests\OrganizationPostStoreRequest  $request
	 * @param  int  $organizationId
	 * @return \Illuminate\Http\Response
	 */
	public function store(OrganizationPostStoreRequest $request, $organizationId)
	{
		$validated = $request->validated();

		try {
			$validated["organization_id"] = $organizationId;

			// 첨부파일 등록
			$attachmentFile = $request->file("attachment_file");
			if ($attachmentFile) {
				$filename = $attachmentFile->store("public/files");
				$attachment = File::create([
					"user_id" => $validated["user_id"],
					"filename" => pathinfo($filename, PATHINFO_BASENAME),
					"org_filename" => $attachmentFile->getClientOriginalName(),
				]);
				$validated["attachment_file_id"] = $attachment->id;
			}

			// 게시글을 생성한다.
			$post = OrganizationPost::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($post, 201);
	}

	/**
	 * B2B 기업에 속한 게시판 글을 수정한다.
	 *
	 * @param  App\Http\Requests\OrganizationPostUpdateRequest  $request
	 * @param  int  $organizationId
	 * @return \Illuminate\Http\Response
	 */
	public function update(OrganizationPostUpdateRequest $request, $organizationId, $postId)
	{
		$validated = $request->validated();

		try {
			$validated["organization_id"] = $organizationId;

			// 업데이트 대상 게시글
			$post = OrganizationPost::findOrFail($postId);

			// 첨부 파일 처리
			// 기존 첨부파일이 유지되는 경우 수정하지 않는다.
			if ($request->hasFile("attachment_file")) {
				$attachmentFile = $request->file("attachment_file");
				$filename = $attachmentFile->store("public/files");
				$attachment = File::create([
					"user_id" => $post->user_id,
					"filename" => pathinfo($filename, PATHINFO_BASENAME),
					"org_filename" => $attachmentFile->getClientOriginalName(),
				]);
				$validated["attachment_file_id"] = $attachment->id;
			}

			// 게시글을 업데이트 한다.
			$post->fill($validated);
			if (!$post->isDirty()) {
				return response()->noContent();
			}
			$post->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($post, 201);
	}

	/**
	 * ID에 매칭되는 게시판 글을 구한다.
	 *
	 * @param  int  $organizationId
	 * @param  int  $postId
	 * @return \Illuminate\Http\Response
	 */
	public function show($organizationId, $postId)
	{
		$user = auth("sanctum")->user();
		$organizationPost = OrganizationPost::where([["organization_id", $organizationId], ["id", $postId]])
			->with(["comments"])
			->first();
		$this->checkPostPrivate($organizationPost, $user);

		// 게시판 글 정보를 구할 때 조회수를 1증가한다.
		// 운영자가 조회한 경우에는 조회수를 증가시키지 않는다.
		if (!($user && $user->role === Role::ADMIN)) {
			$organizationPost->update([
				"view_count" => $organizationPost->view_count + 1,
			]);
		}

		return $organizationPost;
	}

	/**
	 * 게시판 글을 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($organizationId, $postId)
	{
		$post = OrganizationPost::findOrFail($postId);

		try {
			$post->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 게시글의 비공개 권한에 따라 데이터를 처리한다.
	 */
	private function checkPostPrivate(&$organizationPost, $user)
	{
		if ($organizationPost["private"]) {
			if (!($user && ($organizationPost["user_id"] === $user->id || $user->role === Role::ADMIN))) {
				$organizationPost["description"] = "비공개 글 입니다.";
				$organizationPost["attachment_file_id"] = null;
				$organizationPost->makeHidden(["attachment"]);
			}
		}
	}
}