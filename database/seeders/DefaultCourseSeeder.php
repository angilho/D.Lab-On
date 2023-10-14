<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Constants\CourseType;
use App\Constants\CourseTargetGroup;
use Illuminate\Http\File;

use App\Models\Course;
use App\Models\File as FileModel;
use App\Models\CourseSection;

use Illuminate\Support\Facades\Storage;

class DefaultCourseSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		if (Course::all()->isEmpty()) {
			$courseList = $this->getDefaultCourseList();
			foreach ($courseList as $key => $course) {
				$thumbnailId = $this->createThumbnail($course["name"]);
				$course = Course::create([
					"id" => $key + 1,
					"user_id" => 1,
					"name" => $course["name"],
					"type" => $course["type"],
					"thumbnail_id" => $thumbnailId,
					"closed" => 0,
					"student_target" => "대상 입력",
					"elice_course_id" => 0,
					"price" => 100000,
					"discount_price" => 10000,
					"discount_text" => "런칭 기념 할인 20%",
					"duration_week" => 10,
					"duration_hour" => 3,
					"duration_minute" => 10,
					"dlab_course_code" => $course["type"] . "_" . ($key + 1),
				]);
				if ($course["type"] === CourseType::REGULAR) {
					$this->createRegularCourseSection($course->id);
				} else {
					$this->createOtherCourseSection($course->id);
				}
			}
		}
	}

	private function createThumbnail($filename)
	{
		//thumbnail 파일을 seeder 안에서 찾는다.
		$directory = "template/defaultCourseThumbnail/";
		$thumbnailFilePath = null;
		if (Storage::exists($directory)) {
			$filePath = $directory . $filename . ".png";
			if (Storage::exists($filePath)) {
				$thumbnailFilePath = $filePath;
			}

			$filePath = $directory . $filename . ".gif";
			if (Storage::exists($filePath)) {
				$thumbnailFilePath = $filePath;
			}
		}

		if ($thumbnailFilePath) {
			$file = new File(Storage::path($thumbnailFilePath));

			$filename = Storage::putFile("public/files", $file);

			$thumbnail = FileModel::create([
				"user_id" => 1,
				"filename" => pathinfo($filename, PATHINFO_BASENAME),
				"org_filename" => $filename,
			]);
			$validated["thumbnail_id"] = $thumbnail->id;
			return $thumbnail->id;
		}
	}

	private function createRegularCourseSection($courseId)
	{
		//For Regular course
		CourseSection::create([
			"course_id" => $courseId,
			"target_group" => CourseTargetGroup::ELEMENTRY_SCHOOL,
			"target_grade" => "1",
			"max_student" => 10,
			"start_at" => "2021-04-10",
			"end_at" => "2021-09-10",
			"cycle_week" => 3,
			"start_hour" => 2,
			"start_minute" => 30,
			"end_hour" => 4,
			"end_minute" => 30,
			"duration_day" => ["월", "화", "수"],
			"zoom_url" => "https://www.zoom.com",
		]);
	}

	private function createOtherCourseSection($courseId)
	{
		//For 1:1 and Package course
		CourseSection::create([
			"course_id" => $courseId,
			"target_group" => CourseTargetGroup::ELEMENTRY_SCHOOL,
			"target_grade" => "1",
			"max_student" => 10,
			"start_at" => "2021-04-10",
			"end_at" => "2021-09-10",
			"cycle_week" => 1,
			"start_hour" => 0,
			"start_minute" => 0,
			"end_hour" => 0,
			"end_minute" => 0,
			"duration_day" => [],
			"zoom_url" => "https://www.zoom.com",
		]);
	}

	private function getDefaultCourseList()
	{
		return [
			[
				"name" => "스크래치 기초",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "스크래치 심화",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "메이키메이키(하드웨어)",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "메이크코드(하드웨어)",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "파이썬 기초",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "파이게임",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "웹 자동화",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "웹 크롤링",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "앱 인벤터 기초",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "앱 인벤터 심화",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "스크래치 기초 + 스크래치 심화",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "스크래치 기초 + 스크래치 심화 + 메이키메이키(하드웨어)",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "스크래치 기초 + 스크래치 심화 + 메이크코드(하드웨어)",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "파이썬 기초 + 파이게임",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "파이썬 기초 + 웹 자동화",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "파이썬 기초 + 웹 크롤링",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "앱 인벤터 기초 + 모바일 게임 앱",
				"type" => CourseType::PACKAGE,
			],
			[
				"name" => "스크래치 기초",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "스크래치 심화",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "메이키메이키(하드웨어)",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "메이크코드(하드웨어)",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "파이썬 기초",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "파이게임",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "웹 자동화",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "웹 크롤링",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "앱 인벤터 기초",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "앱 인벤터 심화",
				"type" => CourseType::ONEONONE,
			],
			[
				"name" => "로블록스",
				"type" => CourseType::REGULAR,
			],
			[
				"name" => "제2회 글로벌커리어특강 Life of SW Engineer at Google",
				"type" => CourseType::REGULAR,
			],
		];
	}
}