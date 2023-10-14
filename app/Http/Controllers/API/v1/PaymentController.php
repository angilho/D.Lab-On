<?php

namespace App\Http\Controllers\API\v1;

use Illuminate\Support\Facades\Hash;

use App\Constants\PaymentStatus;
use App\Filter\PaymentSearchFilter;
use App\Http\Requests\PaymentStoreRequest;
use App\Http\Requests\PaymentUpdateRequest;
use App\Http\Requests\PaymentCompleteRequest;
use App\Container\API\PaymentStoreService;
use App\Container\API\PaymentCompleteService;
use App\Container\API\PaymentCancelService;

use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;
use App\Models\PaymentItem;
use Exception;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PaymentController extends Controller
{
	/**
	 * 사용자 아이디 없이 전체 결제 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function all()
	{
		return QueryBuilder::for(Payment::class)
			->allowedFilters([
				AllowedFilter::exact("status"),
				AllowedFilter::partial("merchant_uid"),
				AllowedFilter::custom("search", new PaymentSearchFilter()),
			])
			->with(["user", "paymentItem.course", "paymentItem.courseSection", "paymentItem.user"])
			->paginate(30);
	}

	/**
	 * 전체 결제 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index($userId)
	{
		return QueryBuilder::for(Payment::class)
			->allowedFilters([AllowedFilter::exact("status"), AllowedFilter::exact("merchant_uid")])
			->with(["paymentItem.course", "paymentItem.courseSection", "paymentItem.user"])
			->where([["req_user_id", "=", $userId]])
			->get();
	}

	/**
	 * 결제 정보를 추가한다.
	 *
	 * @param  App\Http\Requests\PaymentStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(PaymentStoreRequest $request, $userId)
	{
		try {
			$userCode = env("IAMPORT_USER_CODE");
			$validated = $request->validated();

			$paymentService = new PaymentStoreService($userId, $validated);
			$paymentService->calcPaymentData();
			$paymentService->appendAdditionalData();

			$validated = $paymentService->validated();

			// 결제 정보를 생성한다.
			// 무료 결제인 경우는 method를 "free"로 지정한다.
			if ($validated["total_price"] === 0) {
				$validated["method"] = "free";
			}
			$payment = Payment::create($validated);
			foreach ($validated["payment_items"] as $key => $value) {
				$value["payment_id"] = $payment->id;
				$paymentItem = PaymentItem::create($value);
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json(
			[
				"id" => $payment->id,
				"iamport_user_code" => $userCode,
				"pg" => "html5_inicis",
				"merchant_uid" => $payment->merchant_uid,
				"name" => $payment->name,
				"price" => $payment->total_price,
			],
			200
		);

		return response()->json($payment, 201);
	}

	/**
	 * 결제 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\PaymentUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(PaymentUpdateRequest $request, $userId, $id)
	{
		$validated = $request->validated();
		$payment = Payment::findOrFail($id);

		try {
			$payment->fill($validated);

			if (!$payment->isDirty()) {
				return response()->noContent();
			}

			$payment->update();

			// 카드결제를 취소하는 경우 Iamport에 취소 요청을 보낸다.
			if ($payment->status == PaymentStatus::CANCEL && $payment->method == "card") {
				$service = new PaymentCancelService($id);
				$service->cancelPayment();
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($payment, 201);
	}

	/**
	 * ID에 매칭되는 결제 정보를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($userId, $paymentId)
	{
		$user = User::with([
			"payment" => function ($q) use ($paymentId) {
				$q->where("payments.id", "=", $paymentId);
			},
			"paymentItem" => function ($q) use ($paymentId) {
				$q->where("payment_items.payment_id", "=", $paymentId);
			},
			"paymentItem.course",
			"paymentItem.courseSection",
			"children.paymentItem" => function ($q) use ($paymentId) {
				$q->where("payment_items.payment_id", "=", $paymentId);
			},
			"children.paymentItem.course",
			"children.paymentItem.courseSection",
		])
			->where([["id", "=", $userId]])
			->get();

		return $user;
	}

	/**
	 * ID에 매칭되는 결제 정보를 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($userId, $id)
	{
		$payment = Payment::findOrFail($id);
		try {
			$payment->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}

	/**
	 * 결제 완료 처리를 위한 함수
	 */
	public function complete(PaymentCompleteRequest $request, $userId, $id)
	{
		$validated = $request->validated();
		$service = new PaymentCompleteService($validated, $userId, $id);

		try {
			//위변조된 결제 요청인지 검사함
			$service->isFakePayment();

			//결제 정보에 따라 데이터를 수정함.
			$service->paymentComplete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		} finally {
			$service->updatePayment();
		}

		$payment = $service->getPayment();

		return response()->json($payment, 201);
	}
}
