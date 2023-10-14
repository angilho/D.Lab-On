<?php

namespace App\Http\Controllers\API\v1;

use DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\CurriculumCategoryStoreRequest;
use App\Http\Requests\CurriculumCategoryUpdateRequest;
use App\Http\Requests\CurriculumCategoryReorderRequest;
use App\Models\CurriculumCategory;
use App\Models\CurriculumCourse;

use Exception;

class CurriculumCategoryController extends Controller
{
	/**
	 * 전체 커리큘럼 카테고리 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return CurriculumCategory::with("curriculumCourses")
			->orderBy("order", "asc")
			->get();
	}

	/**
	 * ID에 매칭되는 커리큘럼 카테고리를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return CurriculumCategory::with("curriculumCourses")->findOrFail($id);
	}

	/**
	 * 신규 커리큘럼 카테고리를 추가한다.
	 *
	 * @param  App\Http\Requests\CurriculumCategoryStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(CurriculumCategoryStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			DB::beginTransaction();

			$validated["order"] = CurriculumCategory::count() + 1;
			$curriculumCategory = CurriculumCategory::create($validated);

			// Curriculum Course를 생성한다.
			$curriculumCourses = $validated["curriculum_courses"];
			foreach ($curriculumCourses as $curriculumCourse) {
				CurriculumCourse::create([
					"curriculum_category_id" => $curriculumCategory->id,
					"course_id" => $curriculumCourse["id"],
					"order" => $curriculumCourse["order"],
				]);
			}

			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($curriculumCategory, 201);
	}

	/**
	 * 커리큘럼 카테고리 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\CurriculumCategoryUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(CurriculumCategoryUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$curriculumCategory = CurriculumCategory::findOrFail($id);
		try {
			DB::beginTransaction();

			$curriculumCategory->fill($validated);
			// 기존 Curriculum Course를 삭제하고, Curriculum Course를 생성한다.
			CurriculumCourse::where("curriculum_category_id", $curriculumCategory->id)->delete();
			$curriculumCourses = $validated["curriculum_courses"];
			foreach ($curriculumCourses as $curriculumCourse) {
				CurriculumCourse::create([
					"curriculum_category_id" => $curriculumCategory->id,
					"course_id" => $curriculumCourse["id"],
					"order" => $curriculumCourse["order"],
				]);
			}
			if (!$curriculumCategory->isDirty()) {
				DB::commit();
				return response()->noContent();
			}
			$curriculumCategory->save();

			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($curriculumCategory, 201);
	}

	/**
	 * 커리큘럼 카테고리를 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$curriculumCategory = CurriculumCategory::findOrFail($id);

		try {
			$curriculumCategory->reorderForDelete($curriculumCategory->order);
			$curriculumCategory->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 커리큘럼 카테고리 순서를 재배치 한다.
	 */
	public function reorder(CurriculumCategoryReorderRequest $request)
	{
		$validated = $request->validated();
		try {
			$curriculumCategories = $validated["curriculum_categories"];
			collect($curriculumCategories)->map(function ($curriculumCategory) {
				CurriculumCategory::find($curriculumCategory["id"])->update([
					"order" => $curriculumCategory["order"],
				]);
			});
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
