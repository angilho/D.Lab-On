<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MessageSendRequest;
use App\Models\Message;
use App\Container\CoolSms\CoolSmsAPI;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MessageController extends Controller
{
	/**
	 * Message 정보를 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request)
	{
		$keyword = $request->input("keyword");
		$messages = Message::when($keyword, function ($q) use ($keyword) {
			return $q->where(function ($query) use ($keyword) {
				$query
					->where("title", "like", "%{$keyword}%")
					->orWhere("description", "like", "%{$keyword}%")
					->orWhereHas("user", function ($query2) use ($keyword) {
						return $query2->where("users.name", "like", "%{$keyword}%");
					});
			});
		})
			->orderBy("created_at", "desc")
			->paginate(30);

		return $messages;
	}

	/**
	 * id에 매칭되는 Message를 구한다.
	 *
	 * @param  int  $messageId
	 * @return \Illuminate\Http\Response
	 */
	public function show($messageId)
	{
		return Message::where("id", $messageId)->first();
	}

	/**
	 * 메시지를 발송한다.
	 *
	 * @param  App\Http\Requests\MessageSendRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function send(MessageSendRequest $request)
	{
		$validated = $request->validated();

		try {
			// Cool SMS를 통한 메세지를 발송한다.
			$this->sendCoolSmsMessage($validated);

			// 메세지 발송 이력을 DB에 기록한다.
			$user = auth()->user();
			$validated["req_user_id"] = $user->id;
			$validated["message_to"] = implode(",", $validated["to"]);
			$validated["sent_at"] = Carbon::now();
			$message = Message::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($message, 201);
	}

	private function sendCoolSmsMessage($messages)
	{
		// cool sms 전송을 위한 양식으로 변경한다.
		// 한번에 1000건까지 보낼 수 있다.

		$coolSmsApi = new CoolSmsAPI();

		$messagesToArray = array_chunk($messages["to"], 1000);
		foreach ($messagesToArray as $messagesTo) {
			$coolSmsMessages = [];
			foreach ($messagesTo as $to) {
				$coolSmsMessages[] = [
					"from" => str_replace("-", "", $messages["from"]),
					"to" => str_replace("-", "", $to),
					"text" => $messages["title"] . PHP_EOL . $messages["description"],
				];
			}
			$coolSmsApi->sendMessage($coolSmsMessages);
		}
	}
}