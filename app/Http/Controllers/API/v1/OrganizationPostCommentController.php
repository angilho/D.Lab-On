<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrganizationPostCommentStoreRequest;
use App\Models\OrganizationPostComment;
use App\Models\File;
use App\Constants\Role;

class OrganizationPostCommentController extends Controller
{
	/**
	 * B2B 게시판 글에 답변을 추가한다.
	 *
	 * @param  App\Http\Requests\OrganizationPostCommentStoreRequest  $request
	 * @param  int  $organizationId
	 * @return \Illuminate\Http\Response
	 */
	public function store(OrganizationPostCommentStoreRequest $request, $organizationId, $postId)
	{
		$validated = $request->validated();

		try {
			$validated["organization_id"] = $organizationId;
			$validated["post_id"] = $postId;

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

			// 답변을 생성한다.
			$comment = OrganizationPostComment::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($comment, 201);
	}

	/**
	 * 게시판 글의 댓글을 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($organizationId, $postId, $commentId)
	{
		$comment = OrganizationPostComment::where([
			["organization_id", $organizationId],
			["post_id", $postId],
			["id", $commentId],
		])->firstOrFail();

		$user = auth("sanctum")->user();
		if (!($user && ($comment["user_id"] === $user->id || $user->role === Role::ADMIN))) {
			return response()->json(["message" => "권한이 없습니다."], 500);
		}

		try {
			$comment->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}