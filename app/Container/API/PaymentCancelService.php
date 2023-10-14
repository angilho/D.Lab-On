<?php

namespace App\Container\API;

use App\Container\Iamport\IamportAPI;
use App\Models\Payment;

class PaymentCancelService
{
	private $payment;

	function __construct($paymentId)
	{
		$this->payment = Payment::findOrFail($paymentId);
	}

	public function cancelPayment()
	{
		$iamportApi = new IamportAPI();
		$iamportApi->cancelPayment($this->payment->merchant_uid);
	}
}
