<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
	/**
	 * A list of the exception types that are not reported.
	 *
	 * @var array
	 */
	protected $dontReport = [
		//
	];

	/**
	 * A list of the inputs that are never flashed for validation exceptions.
	 *
	 * @var array
	 */
	protected $dontFlash = ["password", "password_confirmation"];

	/**
	 * Register the exception handling callbacks for the application.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->reportable(function (Throwable $e) {
			//
		});
	}

	/**
	 * Render an exception into an HTTP response.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Throwable  $e
	 * @return \Symfony\Component\HttpFoundation\Response
	 *
	 * @throws \Throwable
	 */
	public function render($request, Throwable $exception)
	{
		// API에서 Model을 얻을 때 findOrFail을 사용하는 경우 json respose를 응답으로 내보내는 예외 처리함
		if ($exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
			if ($request->wantsJson()) {
				return response()->json(
					[
						"message" => $exception->getMessage(),
					],
					404
				);
			} else {
				abort(404);
			}
		}

		return parent::render($request, $exception);
	}
}