<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CoursePostStoreRequest;
use App\Http\Requests\CoursePostUpdateRequest;
use Illuminate\Http\Request;
use App\Models\CoursePost;
use App\Models\File;
use App\Constants\Role;

class CoursePostController extends Controller
{
	/**
	 * 코스에 속한 전체 강좌 게시판 글 목록을 구한다.
	 *
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request, $courseId)
	{
		$user = auth("sanctum")->user();
		$keyword = $request->input("keyword");
		$coursePosts = CoursePost::where("course_id", $courseId)
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
			->orderBy("order", "desc")
			->orderBy("created_at", "desc")
			->paginate(10);

		// 비공개 글은 작성자 혹은 운영자가 아니면 데이터를 전달하지 않는다.
		collect($coursePosts->items())->each(function ($coursePost) use ($user) {
			$this->checkPostPrivate($coursePost, $user);
		});

		return $coursePosts;
	}

	/**
	 * 코스에 강좌 게시판 글을 추가한다.
	 *
	 * @param  App\Http\Requests\CoursePostStoreRequest  $request
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function store(CoursePostStoreRequest $request, $courseId)
	{
		$validated = $request->validated();

		try {
			$validated["course_id"] = $courseId;

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
			$post = CoursePost::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($post, 201);
	}

	/**
	 * 코스에 강좌 게시판 글을 수정한다.
	 *
	 * @param  App\Http\Requests\CoursePostUpdateRequest  $request
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function update(CoursePostUpdateRequest $request, $courseId, $postId)
	{
		$validated = $request->validated();

		try {
			$validated["course_id"] = $courseId;

			// 업데이트 대상 게시글
			$post = CoursePost::findOrFail($postId);

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
	 * ID에 매칭되는 강좌 게시판 글을 구한다.
	 *
	 * @param  int  $courseId
	 * @param  int  $chapterId
	 * @return \Illuminate\Http\Response
	 */
	public function show($courseId, $postId)
	{
		$user = auth("sanctum")->user();
		$coursePost = CoursePost::where([["course_id", $courseId], ["id", $postId]])
			->with(["comments"])
			->first();
		$this->checkPostPrivate($coursePost, $user);

		// 강좌 게시판 글 정보를 구할 때 조회수를 1증가한다.
		// 운영자가 조회한 경우에는 조회수를 증가시키지 않는다.
		if (!($user && $user->role === Role::ADMIN)) {
			$coursePost->update([
				"view_count" => $coursePost->view_count + 1,
			]);
		}

		return $coursePost;
	}

	/**
	 * 강좌 게시판 글을 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($courseId, $postId)
	{
		$post = CoursePost::findOrFail($postId);

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
	private function checkPostPrivate(&$coursePost, $user)
	{
		if ($coursePost["private"]) {
			if (!($user && ($coursePost["user_id"] === $user->id || $user->role === Role::ADMIN))) {
				$coursePost["description"] = "비공개 글 입니다.";
				$coursePost["attachment_file_id"] = null;
				$coursePost->makeHidden(["attachment"]);
			}
		}
	}
}