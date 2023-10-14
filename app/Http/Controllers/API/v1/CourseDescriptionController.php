<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseDescriptionStoreRequest;
use App\Models\Course;
use App\Models\CourseDescription;
use App\Models\File;

class CourseDescriptionController extends Controller
{
	/**
	 * 강좌 상세 소개를 추가하거나 수정한다.
	 *
	 * @param  App\Http\Requests\CourseDescriptionStoreRequest  $request
	 * @param  int  $courseId
	 * @return \Illuminate\Http\Response
	 */
	public function store(CourseDescriptionStoreRequest $request, $courseId)
	{
		$validated = $request->validated();

		try {
			$user = $request->user();
			// 수업 안내 이미지 등록
			$desktopIntroImageFile = $request->file("desktop_intro_image_file");
			if ($desktopIntroImageFile) {
				$desktopIntroImageFilename = $desktopIntroImageFile->store("public/files");
				$desktopIntroImageFileModel = File::create([
					"user_id" => $user->id,
					"filename" => pathinfo($desktopIntroImageFilename, PATHINFO_BASENAME),
					"org_filename" => $desktopIntroImageFile->getClientOriginalName(),
				]);
				$validated["desktop_intro_image_id"] = $desktopIntroImageFileModel->id;
			}

			$mobileIntroImageFile = $request->file("mobile_intro_image_file");
			if ($mobileIntroImageFile) {
				$mobileIntroImageFilename = $mobileIntroImageFile->store("public/files");
				$mobileIntroImageFileModel = File::create([
					"user_id" => $user->id,
					"filename" => pathinfo($mobileIntroImageFilename, PATHINFO_BASENAME),
					"org_filename" => $mobileIntroImageFile->getClientOriginalName(),
				]);
				$validated["mobile_intro_image_id"] = $mobileIntroImageFileModel->id;
			}

			// 과목 상세 정보를 생성, 업데이트 한다.
			$courseDescription = CourseDescription::updateOrCreate(
				[
					"course_id" => $courseId,
				],
				$validated
			);

			// 과목에서 상세 소개를 작성했다고 표시한다.
			Course::where("id", $courseId)->update(["has_description" => true]);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($courseDescription, 201);
	}
}
