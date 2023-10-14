<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CoursePost;
use App\Constants\CoursePostType;

class VodCoursePostController extends Controller
{
	/**
	 * VOD 코스에 속한 전체 강좌 게시판 글 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request)
	{
		$keyword = $request->input("keyword");
		$coursePosts = CoursePost::where("type", "!=", CoursePostType::NOTICE)
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
			->with(["course"])
			->orderBy("order", "desc")
			->orderBy("created_at", "desc")
			->paginate(20);

		return $coursePosts;
	}

	/**
	 * 강좌 게시판 글을 구한다.
	 *
	 * @param  int  $postId
	 * @return \Illuminate\Http\Response
	 */
	public function show($postId)
	{
		$coursePost = CoursePost::where("id", $postId)
			->with(["comments", "course"])
			->first();

		return $coursePost;
	}
}
