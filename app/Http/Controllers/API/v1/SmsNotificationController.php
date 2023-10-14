<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Requests\SmsNotificationStoreRequest;
use App\Http\Requests\SmsNotificationUpdateRequest;
use App\Filter\SmsNotificationSearchFilter;
use App\Models\SmsNotification;
use App\Models\SmsNotificationReceiver;
use App\Models\User;

class SmsNotificationController extends Controller
{
	/**
	 * 전체 노티 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return QueryBuilder::for(SmsNotification::class)
			->allowedFilters([AllowedFilter::custom("search", new SmsNotificationSearchFilter())])
			->orderBy("created_at", "asc")
			->paginate(30);
	}

	/**
	 * 노티를 추가한다.
	 *
	 * @param  App\Http\Requests\SmsNotificationStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(SmsNotificationStoreRequest $request)
	{
		$validated = $request->validated();
		$user = $request->user();

		try {
			$smsNotification = SmsNotification::create(array_merge($validated, ["work_user_id" => $user->id]));

			if ($validated["receiver"] === "part") {
				collect($validated["receiver_list"])->each(function ($receiver) use ($smsNotification) {
					$receiveUser = User::where("phone", $receiver)->first();
					SmsNotificationReceiver::create([
						"sms_notification_id" => $smsNotification->id,
						"user_id" => $receiveUser ? $receiveUser->id : null,
						"phone" => $receiver,
					]);
				});
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($smsNotification, 201);
	}

	/**
	 * 노티를 수정한다.
	 *
	 * @param  App\Http\Requests\SmsNotificationUpdateRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function update(SmsNotificationUpdateRequest $request, $smsNotificationId)
	{
		$validated = $request->validated();

		try {
			$smsNotification = SmsNotification::findOrFail($smsNotificationId);
			$smsNotification->fill($validated);
			$smsNotification->save();

			if ($validated["receiver"] === "part") {
				// 기존 receiver는 제거하고 새로 등록한다.
				SmsNotificationReceiver::where("sms_notification_id", $smsNotificationId)->delete();
				collect($validated["receiver_list"])->each(function ($receiver) use ($smsNotification) {
					SmsNotificationReceiver::create([
						"sms_notification_id" => $smsNotification->id,
						"user_id" => $receiver["user_id"],
						"phone" => $receiver["phone"],
					]);
				});
			}
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($smsNotification, 201);
	}

	/**
	 * ID에 매칭되는 노티를 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function show($smsNotificationId)
	{
		return SmsNotification::where("id", $smsNotificationId)
			->with(["course"])
			->first();
	}

	/**
	 * 노티를 삭제한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($smsNotificationId)
	{
		$smsNotification = SmsNotification::findOrFail($smsNotificationId);

		try {
			$smsNotification->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
