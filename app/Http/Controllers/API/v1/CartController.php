<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartStoreRequest;
use App\Models\User;
use App\Models\Child;
use App\Models\ChildMetadata;
use App\Models\Cart;
use App\Models\CourseSection;
use Exception;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
	/**
	 * 장바구니 정보를 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index($userId)
	{
		$userWithCart = User::with([
			"cart.course",
			"cart.course_section",
			"children.cart.course",
			"children.cart.course_section",
		])
			->where("id", $userId)
			->first();

		// 카트에 담긴 과목이 현재 수강 가능한 과목인지 확인한다.
		$filteredUserCart = $userWithCart->cart
			->filter(function ($userCart) {
				// 수강 신청 인원을 초과했는지 확인한다.
				$courseSectionInfo = $userCart->course_section;
				if ($courseSectionInfo->enrollment_count >= $courseSectionInfo->max_student) {
					Cart::where([
						"user_id" => $userCart->user_id,
						"course_id" => $userCart->course_id,
						"course_section_id" => $userCart->course_section_id,
					])->delete();
					return false;
				}
				return true;
			})
			->values();

		unset($userWithCart->cart);
		$userWithCart->cart = $filteredUserCart;

		$userWithCart->children->each(function ($child) {
			// 카트에 담긴 과목이 현재 수강 가능한 과목인지 확인한다.
			$filteredChildCart = $child->cart
				->filter(function ($childCart) {
					// 수강 신청 인원을 초과했는지 확인한다.
					$courseSectionInfo = $childCart->course_section;
					if ($courseSectionInfo->enrollment_count >= $courseSectionInfo->max_student) {
						Cart::where([
							"user_id" => $childCart->user_id,
							"course_id" => $childCart->course_id,
							"course_section_id" => $childCart->course_section_id,
						])->delete();
						return false;
					}
					return true;
				})
				->values();

			unset($child->cart);
			$child->cart = $filteredChildCart;
		});

		return $userWithCart;
	}

	/**
	 * 장바구니에 아이템을 추가한다.
	 *
	 * @param  App\Http\Requests\CartStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(CartStoreRequest $request, $userId)
	{
		$validated = $request->validated();
		$validated["user_id"] = $userId;

		try {
			// 장바구니에 아이템을 넣는다.
			$cart = Cart::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($cart, 201);
	}

	/**
	 * ID에 매칭되는 Cart 정보를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return Cart::findOrFail($id);
	}

	/**
	 * ID에 매칭되는 Cart 정보를 제거한다.
	 */
	public function destroy($userId, $cartId)
	{
		try {
			$cart = Cart::findOrFail($cartId);
			$cart->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
