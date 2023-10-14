<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\FaqStoreRequest;
use App\Http\Requests\FaqUpdateRequest;
use App\Models\FaqCategory;
use App\Models\FaqItem;
use Illuminate\Http\Request;
use Exception;

class FaqController extends Controller
{
	/**
	 * Faq 카테고리 정보와 faqItem을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function faqCategories()
	{
		return FaqCategory::with("faqItem")->get();
	}

	/**
	 * FAQ 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request)
	{
		$keyword = $request->input("keyword");
		$faqs = FaqItem::when($keyword, function ($q) use ($keyword) {
			return $q->where(function ($query) use ($keyword) {
				$query->where("name", "like", "%{$keyword}%")->orWhere("description", "like", "%{$keyword}%");
			});
		})
			->orderBy("created_at", "desc")
			->paginate(10);

		return $faqs;
	}

	/**
	 * FAQ 아이템을 추가한다.
	 *
	 * @param  App\Http\Requests\FaqStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(FaqStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			$faqItem = FaqItem::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($faqItem, 201);
	}

	/**
	 * FAQ를 갱신한다.
	 *
	 * @param  App\Http\Requests\FaqUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(FaqUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$faqItem = FaqItem::findOrFail($id);
		try {
			$faqItem->fill($validated);
			if (!$faqItem->isDirty()) {
				return response()->noContent();
			}
			$faqItem->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($faqItem, 201);
	}

	/**
	 * ID에 매칭되는 FAQ Item 정보를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return FaqItem::findOrFail($id);
	}

	/**
	 * ID에 매칭되는 FAQ 정보를 제거한다.
	 */
	public function destroy($id)
	{
		try {
			$faqItem = FaqItem::findOrFail($id);
			$faqItem->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}