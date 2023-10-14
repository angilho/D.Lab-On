<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Container\API\PaymentCompleteService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\IamportWebhookRequest;

class IamportController extends Controller
{
	/**
	 * Iamport Webhook
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function webhook(IamportWebhookRequest $request)
	{
		$validated = $request->validated();
		$service = null;
		try {
			$service = PaymentCompleteService::initInWebhook($validated);
			//위변조된 결제 요청인지 검사함
			$service->isFakePayment();

			//결제 정보에 따라 데이터를 수정함.
			$service->paymentComplete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		} finally {
			$service->updatePayment();
		}

		return response()->noContent();
	}
}