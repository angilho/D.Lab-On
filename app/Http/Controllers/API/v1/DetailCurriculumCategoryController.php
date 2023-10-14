<?php

namespace App\Http\Controllers\API\v1;

use DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\DetailCurriculumCategoryStoreRequest;
use App\Http\Requests\DetailCurriculumCategoryUpdateRequest;
use App\Http\Requests\DetailCurriculumCategoryReorderRequest;
use App\Models\DetailCurriculumCategory;
use App\Models\DetailCurriculumCourse;

use Exception;

class DetailCurriculumCategoryController extends Controller
{
	/**
	 * 전체 커리큘럼 카테고리 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return DetailCurriculumCategory::with("curriculumCourses")
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
		return DetailCurriculumCategory::with("curriculumCourses")->findOrFail($id);
	}

	/**
	 * 신규 커리큘럼 카테고리를 추가한다.
	 *
	 * @param  App\Http\Requests\DetailCurriculumCategoryStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(DetailCurriculumCategoryStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			DB::beginTransaction();

			$validated["order"] = DetailCurriculumCategory::count() + 1;
			$detailCurriculumCategory = DetailCurriculumCategory::create($validated);

			// DetailCurriculum Course를 생성한다.
			$curriculumCourses = $validated["curriculum_courses"];
			foreach ($curriculumCourses as $curriculumCourse) {
				DetailCurriculumCourse::create([
					"detail_curriculum_category_id" => $detailCurriculumCategory->id,
					"course_id" => $curriculumCourse["id"],
					"order" => $curriculumCourse["order"],
				]);
			}

			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($detailCurriculumCategory, 201);
	}

	/**
	 * 커리큘럼 카테고리 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\DetailCurriculumCategoryUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(DetailCurriculumCategoryUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$detailCurriculumCategory = DetailCurriculumCategory::findOrFail($id);
		try {
			DB::beginTransaction();

			$detailCurriculumCategory->fill($validated);
			// 기존 Curriculum Course를 삭제하고, Curriculum Course를 생성한다.
			DetailCurriculumCourse::where("detail_curriculum_category_id", $detailCurriculumCategory->id)->delete();
			$curriculumCourses = $validated["curriculum_courses"];
			foreach ($curriculumCourses as $curriculumCourse) {
				DetailCurriculumCourse::create([
					"detail_curriculum_category_id" => $detailCurriculumCategory->id,
					"course_id" => $curriculumCourse["id"],
					"order" => $curriculumCourse["order"],
				]);
			}
			if (!$detailCurriculumCategory->isDirty()) {
				DB::commit();
				return response()->noContent();
			}
			$detailCurriculumCategory->save();

			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($detailCurriculumCategory, 201);
	}

	/**
	 * 커리큘럼 카테고리를 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$detailCurriculumCategory = DetailCurriculumCategory::findOrFail($id);

		try {
			$detailCurriculumCategory->reorderForDelete($detailCurriculumCategory->order);
			$detailCurriculumCategory->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 커리큘럼 카테고리 순서를 재배치 한다.
	 */
	public function reorder(DetailCurriculumCategoryReorderRequest $request)
	{
		$validated = $request->validated();
		try {
			$curriculumCategories = $validated["curriculum_categories"];
			collect($curriculumCategories)->map(function ($curriculumCategory) {
				DetailCurriculumCategory::find($curriculumCategory["id"])->update([
					"order" => $curriculumCategory["order"],
				]);
			});
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
