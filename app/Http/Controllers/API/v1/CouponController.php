<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Http\Request;
use App\Constants\CouponCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\CouponStoreRequest;
use App\Http\Requests\UserCouponImportRequest;
use App\Models\Coupon;
use App\Models\Payment;
use App\Models\User;
use App\Models\UserCoupon;
use Carbon\Carbon;
use Illuminate\Support\Str;

class CouponController extends Controller
{
	/**
	 * Coupon 정보를 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return Coupon::where("deleted", false)->paginate(30);
	}

	/**
	 * code에 매칭되는 쿠폰을 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show(Request $request, $code)
	{
		$now = Carbon::now();
		$coupon = Coupon::where([["code", "=", $code], ["end_at", ">=", $now], ["deleted", "=", false]])
			->get()
			->first();

		if (!$coupon) {
			abort(404);
		}

		// 쿠폰의 유형이 one_time인데 used_at이 있으면 이미 사용한 쿠폰이다.
		if ($coupon->category === CouponCategory::ONE_TIME && $coupon->used_at) {
			abort(422);
		}

		// 쿠폰의 유형이 multiple_time인데 사용자의 다른 결제 내역이 있으면 안된다.
		if ($coupon->category === CouponCategory::MULTIPLE_TIME) {
			$user = $request->user();
			if (isset($user) && Payment::where([["coupon_id", $coupon->id], ["req_user_id", $user->id]])->exists()) {
				abort(422);
			}
		}

		return $coupon;
	}

	/**
	 * 신규 쿠폰을 추가한다.
	 *
	 * @param  App\Http\Requests\CouponStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(CouponStoreRequest $request)
	{
		$validated = $request->validated();

		$coupons = [];
		try {
			// 쿠폰의 Category에 따라서 다르게 생성한다.
			switch ($validated["category"]) {
				case CouponCategory::MULTIPLE_TIME:
					// 입력 받은 값으로 쿠폰 생성
					$coupons = [Coupon::create($validated)];
					break;
				case CouponCategory::ONE_TIME:
					// 유효기간이 설정되어 있지 않으면 쿠폰 유효기간을 먼 미래로 설정한다.
					if (!isset($validated["end_at"])) {
						$validated["end_at"] = "2200-01-01";
					}

					// 쿠폰 생성 규칙
					// - name: 입력한 이름 #n
					// - code: 랜덤 문자열 16자리
					$couponName = $validated["name"];
					for ($i = 1; $i <= $validated["count"]; $i++) {
						$validated["code"] = strtoupper(Str::random(16));
						$validated["name"] = "{$couponName} #{$i}";
						$coupons[] = Coupon::create($validated);
					}
					break;
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($coupons, 201);
	}

	/**
	 * 쿠폰을 삭제한다.
	 */
	public function destroy(Request $request)
	{
		$couponIds = $request->input("coupon_ids");

		try {
			Coupon::whereIn("id", $couponIds)->update(["deleted" => true]);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 사용자의 쿠폰을 일괄 등록한다.
	 */
	public function import(UserCouponImportRequest $request)
	{
		$validated = $request->validated();

		try {
			$createdUserCoupons = [];
			$failedUserLogin = [];
			foreach ($validated["coupons"] as $importCoupon) {
				$userLogin = $importCoupon["user_login"];
				$couponCode = $importCoupon["coupon_code"];

				// 값이 모두 있는지 확인
				if (!$userLogin || !$couponCode) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 사용자를 찾는다.
				$user = User::where("user_login", $userLogin)->first();
				if (!$user) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 쿠폰을 찾는다.
				$coupon = Coupon::where("code", $couponCode)->first();
				if (!$coupon) {
					$failedUserLogin[] = $userLogin;
					continue;
				}

				// 사용자 쿠폰 정보를 생성한다.
				$userCoupon = UserCoupon::updateOrCreate([
					"user_id" => $user->id,
					"coupon_id" => $coupon->id,
				]);

				$createdUserCoupons[] = $userCoupon;
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		if (count($failedUserLogin) !== 0) {
			return response()->json(["failed_user_coupons" => $failedUserLogin], 206);
		}

		return response()->json($createdUserCoupons, 201);
	}
}
