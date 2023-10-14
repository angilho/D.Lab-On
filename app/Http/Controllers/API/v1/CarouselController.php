<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CarouselStoreRequest;
use App\Http\Requests\CarouselUpdateRequest;
use App\Http\Requests\CarouselReorderRequest;
use App\Models\Carousel;
use App\Models\File;

use Exception;

class CarouselController extends Controller
{
	/**
	 * 전체 Carousel 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return Carousel::orderBy("order", "asc")->get();
	}

	/**
	 * 신규 Carousel을 추가한다.
	 *
	 * @param  App\Http\Requests\CarouselStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(CarouselStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			$userId = 1; // user_id=1인 admin으로 고정함

			// 캐러셀 이미지 등록
			$desktopImage = $request->file("desktop_image_file");
			$desktopImageFilename = $desktopImage->store("public/files");
			$desktopImageFile = File::create([
				"user_id" => $userId,
				"filename" => pathinfo($desktopImageFilename, PATHINFO_BASENAME),
				"org_filename" => $desktopImage->getClientOriginalName(),
			]);
			$validated["desktop_image_file_id"] = $desktopImageFile->id;

			$mobileImage = $request->file("mobile_image_file");
			$mobileImageFilename = $mobileImage->store("public/files");
			$mobileImageFile = File::create([
				"user_id" => $userId,
				"filename" => pathinfo($mobileImageFilename, PATHINFO_BASENAME),
				"org_filename" => $mobileImage->getClientOriginalName(),
			]);
			$validated["mobile_image_file_id"] = $mobileImageFile->id;

			$validated["order"] = Carousel::count() + 1;
			$carousel = Carousel::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($carousel, 201);
	}

	/**
	 * Carousel 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\CarouselUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(CarouselUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$carousel = Carousel::findOrFail($id);
		try {
			$carousel->fill($validated);
			if (!$carousel->isDirty()) {
				return response()->noContent();
			}
			$carousel->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($carousel, 201);
	}

	/**
	 * Carousel을 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$carousel = Carousel::findOrFail($id);

		try {
			$carousel->reorderForDelete($carousel->order);
			$carousel->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * Carousel의 순서를 재배치 한다.
	 */
	public function reorder(CarouselReorderRequest $request)
	{
		$validated = $request->validated();
		try {
			$carousels = $validated["carousels"];
			collect($carousels)->map(function ($carousel) {
				Carousel::find($carousel["id"])->update([
					"order" => $carousel["order"],
				]);
			});
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
