<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CoursePostCommentStoreRequest;
use App\Models\CoursePost;
use App\Models\CoursePostComment;
use App\Models\File;
use App\Constants\CoursePostStatus;

class CoursePostCommentController extends Controller
{
	/**
	 * 강좌 게시판 글에 답변을 추가한다.
	 *
	 * @param  App\Http\Requests\CoursePostCommentStoreRequest  $request
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function store(CoursePostCommentStoreRequest $request, $courseId, $postId)
	{
		$validated = $request->validated();

		try {
			$validated["course_id"] = $courseId;
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
			$comment = CoursePostComment::create($validated);

			// 게시글의 상태를 confirm으로 변경한다.
			CoursePost::where("id", $postId)->update([
				"status" => CoursePostStatus::CONFIRM,
			]);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($comment, 201);
	}
}