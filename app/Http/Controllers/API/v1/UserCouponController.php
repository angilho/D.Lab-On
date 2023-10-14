<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\UserCoupon;
use App\Models\Payment;
use App\Constants\CouponCategory;

class UserCouponController extends Controller
{
	/**
	 * 사용자의 쿠폰 정보를 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index($id)
	{
		$userCoupons = UserCoupon::with(["coupon"])
			->where("user_id", $id)
			->whereHas("coupon", function ($q) {
				$q->where("coupons.deleted", false);
			})
			->get();

		$userCouponsResult = $userCoupons
			->filter(function ($userCoupon) {
				return isset($userCoupon->coupon);
			})
			->map(function ($userCoupon) use ($id) {
				$couponUsed = false;

				switch ($userCoupon->coupon->category) {
					case CouponCategory::ONE_TIME:
						// 쿠폰의 유형이 one_time인데 used_at이 있으면 이미 사용한 쿠폰이다.
						if (isset($userCoupon->coupon->used_at)) {
							$couponUsed = true;
						}
						break;
					case CouponCategory::MULTIPLE_TIME:
						// 쿠폰의 유형이 multiple_time인데 사용자의 다른 결제 내역이 있으면 안된다.
						if (Payment::where([["coupon_id", $userCoupon->coupon_id], ["req_user_id", $id]])->exists()) {
							$couponUsed = true;
						}
						break;
				}

				$userCoupon->coupon->used = $couponUsed;

				return $userCoupon;
			});

		return $userCouponsResult;
	}
}
