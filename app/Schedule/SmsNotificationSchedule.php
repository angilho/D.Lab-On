<?php

namespace App\Schedule;

use Log;
use Carbon\Carbon;
use App\Models\SmsNotification;
use App\Models\SmsNotificationReceiver;
use App\Models\SmsNotificationHistory;
use App\Models\Enrollment;
use App\Models\CourseSection;
use App\Constants\SmsNotificationType;
use App\Constants\EnrollmentStatus;
use App\Container\CoolSms\CoolSmsAPI;

class SmsNotificationSchedule
{
	public function run()
	{
		try {
			// 메세지를 보낼 대상 SmsNotification을 모두 얻어 온다.
			$now = Carbon::now()
				->timeZone("Asia/Seoul")
				->format("Y-m-d");
			$smsNotifications = SmsNotification::where([
				["completed", false],
				["start_at", "<=", $now],
				["end_at", ">=", $now],
			])
				->orderBy("created_at")
				->get();
			$smsNotifications->each(function ($smsNotification) {
				// 유형 별로 메세지 발송을 처리한다.
				switch ($smsNotification["type"]) {
					case SmsNotificationType::COURSE_THREE_DAY_BEFORE:
						$this->runCourseThreeDayBefore($smsNotification);
						break;
					case SmsNotificationType::COURSE_ONE_DAY_BEFORE:
						$this->runCourseOneDayBefore($smsNotification);
						break;
					case SmsNotificationType::REGULAR_LESSON_BEFORE:
						$this->runRegularLessonBefore($smsNotification);
						break;
					case SmsNotificationType::VOD_END_ONE_MONTH_BEFORE:
						$this->runVodEndOneMonthBefore($smsNotification);
						break;
					case SmsNotificationType::VOD_END_ONE_WEEK_BEFORE:
						$this->runVodEndOneWeekBefore($smsNotification);
						break;
					case SmsNotificationType::VOD_ENCOURAGE:
						$this->runVodEncourage($smsNotification);
						break;
				}
			});
		} catch (Exception $e) {
			Log::error($e->getMessage());
		}
	}

	/**
	 * 라이브 클래스, 1:1 패키지, 1:1 클래스 시작 3일전 (1회성), 과목 section에 신청된 학생
	 */
	private function runCourseThreeDayBefore($smsNotification)
	{
		// 현재 시각이 예약 시간인지 확인한다.
		if (!$this->checkReservedTime($smsNotification)) {
			return;
		}

		// 수업 정보를 구한다.
		$courseSection = CourseSection::where([
			["course_id", $smsNotification["course_id"]],
			["id", $smsNotification["section_id"]],
		])->first();
		if (!$courseSection) {
			return;
		}

		// 수업 시작일자 3일전인지 확인한다.
		$threeDayOverDate = Carbon::now()
			->timeZone("Asia/Seoul")
			->addDay(3)
			->setHours(23)
			->setMinutes(59)
			->setSeconds(59)
			->format("Y-m-d H:i:s");

		if ($courseSection["start_at"] > $threeDayOverDate) {
			return;
		}

		// 과목 모든 수강생에게 알림을 보낸다.
		$receiverList = $this->getReceiverList($smsNotification);
		$this->sendOneTimeMessageToCourseUser($receiverList, $smsNotification);
	}

	/**
	 * 라이브 클래스, 1:1 패키지, 1:1 클래스 시작 1일전 (1회성)
	 */
	private function runCourseOneDayBefore($smsNotification)
	{
		// 현재 시각이 예약 시간인지 확인한다.
		if (!$this->checkReservedTime($smsNotification)) {
			return;
		}

		// 수업 정보를 구한다.
		$courseSection = CourseSection::where([
			["course_id", $smsNotification["course_id"]],
			["id", $smsNotification["section_id"]],
		])->first();
		if (!$courseSection) {
			return;
		}

		// 수업 시작일자 1일전인지 확인한다.
		$oneDayOverDate = Carbon::now()
			->timeZone("Asia/Seoul")
			->addDay(1)
			->setHours(23)
			->setMinutes(59)
			->setSeconds(59)
			->format("Y-m-d H:i:s");

		if ($courseSection["start_at"] > $oneDayOverDate) {
			return;
		}

		// 과목 모든 수강생에게 알림을 보낸다.
		$receiverList = $this->getReceiverList($smsNotification);
		$this->sendOneTimeMessageToCourseUser($receiverList, $smsNotification);
	}

	/**
	 * 라이브 클래스 수업 시작 전 : 라이브 클래스 수업 당일 (요일에 맞춘 발송)
	 */
	private function runRegularLessonBefore($smsNotification)
	{
		$now = Carbon::now()->timeZone("Asia/Seoul");

		// 수업 정보를 구한다.
		$courseSection = CourseSection::where([
			["course_id", $smsNotification["course_id"]],
			["id", $smsNotification["section_id"]],
			["start_at", "<=", $now],
			["end_at", ">=", $now],
		])->first();
		if (!$courseSection) {
			return;
		}

		// 수업 요일이 맞는지 확인한다.
		$days = ["일", "월", "화", "수", "목", "금", "토"];
		$durationDays = $courseSection["duration_day"];
		$todayOfWeek = $days[$now->dayOfWeek];
		if (!in_array($todayOfWeek, $durationDays)) {
			return;
		}

		// 수업 시간 1시간 전인지 확인한다.
		$courseStartDate = $now
			->copy()
			->setHour($courseSection["start_hour"])
			->setMinute($courseSection["start_minute"]);
		if ($now->addHour(1) <= $courseStartDate) {
			return;
		}

		// 발신자 대상을 구한다.
		$receiverList = $this->getReceiverList($smsNotification);

		// 같은 날짜에 보낸 이력이 있는 사용자는 제거한다.
		$receiverList = collect($receiverList)
			->filter(function ($receiver) use ($smsNotification, $now) {
				if (
					SmsNotificationHistory::where([
						["sms_notification_id", $smsNotification["id"]],
						["user_id", $receiver["id"]],
					])
						->whereBetween("created_at", [$now->copy()->startOfDay(), $now->copy()->endOfDay()])
						->exists()
				) {
					return false;
				}
				return true;
			})
			->toArray();

		// 메세지를 전송한다.
		$messagesTo = collect($receiverList)
			->map(function ($receiver) {
				return $receiver["phone"];
			})
			->toArray();
		$this->sendCoolSmsMessage($messagesTo, $smsNotification["sms_title"], $smsNotification["sms_description"]);

		// 메세지 전송 이력을 기록한다.
		collect($receiverList)->each(function ($receiver) use ($smsNotification) {
			$this->createSmsNotificationHistory($smsNotification["id"], $receiver);
		});
	}

	/**
	 * VOD 종료 1달전 : 1회성, VOD 클래스 수강생
	 */
	private function runVodEndOneMonthBefore($smsNotification)
	{
		// 현재 시각이 예약 시간인지 확인한다.
		if (!$this->checkReservedTime($smsNotification)) {
			return;
		}

		// 전체 enrollment에서 마감이 1달 남은 enrollment를 구한다.
		$oneMonthOverDate = Carbon::now()
			->addYear(-1)
			->addMonth(1)
			->setHours(23)
			->setMinutes(59)
			->setSeconds(59)
			->format("Y-m-d H:i:s");

		$courseEnrollments = Enrollment::with("user")
			->where([
				["course_id", $smsNotification["course_id"]],
				["course_section_id", $smsNotification["section_id"]],
				["status", EnrollmentStatus::COMPLETE],
				["updated_at", "<", $oneMonthOverDate],
			])
			->get();

		$courseEnrollments->each(function ($courseEnrollment) use ($smsNotification) {
			// 해당 사용자에게 메세지를 전송한다.
			// 해당 사용자에게 이미 메세지를 전송한 경우 다시 전송하지 않는다.
			$user = $courseEnrollment->user;
			if (
				!SmsNotificationHistory::where([
					["sms_notification_id", $smsNotification["id"]],
					["user_id", $user->id],
				])->exists()
			) {
				$this->sendCoolSmsMessage(
					[$user->phone],
					$smsNotification["sms_title"],
					$smsNotification["sms_description"]
				);
				$this->createSmsNotificationHistory($smsNotification["id"], $user);
			}
		});
	}

	/**
	 * VOD 종료 1주일전 : 1회성
	 */
	private function runVodEndOneWeekBefore($smsNotification)
	{
		// 현재 시각이 예약 시간인지 확인한다.
		if (!$this->checkReservedTime($smsNotification)) {
			return;
		}

		// 전체 enrollment에서 마감이 1주일 남은 enrollment를 구한다.
		$oneWeekOverDate = Carbon::now()
			->addYear(-1)
			->addDay(7)
			->setHours(23)
			->setMinutes(59)
			->setSeconds(59)
			->format("Y-m-d H:i:s");

		$courseEnrollments = Enrollment::with("user")
			->where([
				["course_id", $smsNotification["course_id"]],
				["course_section_id", $smsNotification["section_id"]],
				["status", EnrollmentStatus::COMPLETE],
				["updated_at", "<", $oneWeekOverDate],
			])
			->get();

		$courseEnrollments->each(function ($courseEnrollment) use ($smsNotification) {
			// 해당 사용자에게 메세지를 전송한다.
			// 해당 사용자에게 이미 메세지를 전송한 경우 다시 전송하지 않는다.
			$user = $courseEnrollment->user;
			if (
				!SmsNotificationHistory::where([
					["sms_notification_id", $smsNotification["id"]],
					["user_id", $user->id],
				])->exists()
			) {
				$this->sendCoolSmsMessage(
					[$user->phone],
					$smsNotification["sms_title"],
					$smsNotification["sms_description"]
				);
				$this->createSmsNotificationHistory($smsNotification["id"], $user);
			}
		});
	}

	/**
	 *  VOD 독려문자 : 1회성
	 */
	private function runVodEncourage($smsNotification)
	{
		// 현재 시각이 예약 시간인지 확인한다.
		if (!$this->checkReservedTime($smsNotification)) {
			return;
		}

		$receiverList = $this->getReceiverList($smsNotification);
		$this->sendOneTimeMessageToCourseUser($receiverList, $smsNotification);
	}

	/**
	 * 예약 발송 시간인지 확인한다.
	 */
	private function checkReservedTime($smsNotification)
	{
		$nowTime = Carbon::now()
			->timeZone("Asia/Seoul")
			->format("H:i");

		$reservedHour =
			(int) $smsNotification["reserved_hour"] > 9
				? (string) $smsNotification["reserved_hour"]
				: "0" . (string) $smsNotification["reserved_hour"];
		$reservedMinute =
			(int) $smsNotification["reserved_minute"] > 9
				? (string) $smsNotification["reserved_minute"]
				: "0" . (string) $smsNotification["reserved_minute"];

		if ($nowTime >= "{$reservedHour}:{$reservedMinute}") {
			return true;
		}

		return false;
	}

	/**
	 * 메세지 전송 대상을 구한다.
	 */
	private function getReceiverList($smsNotification)
	{
		$receiverList = [];

		// 전송 대상을 구한다.
		if ($smsNotification["receiver"] == "all") {
			// 해당 과목을 수강하는 모든 사용자를 얻어온다.
			$receiverList = $this->getCourseEnrollmentUser(
				$smsNotification["course_id"],
				$smsNotification["section_id"]
			);
		} else {
			// 개별 등록되어 있는 모든 사용자를 얻어온다.
			$receiverList = $this->getNotificationReceiver($smsNotification["id"]);
		}

		return $receiverList;
	}
	/**
	 * SMS 노티를 1회 전송한다.
	 */
	private function sendOneTimeMessageToCourseUser($receiverList, $smsNotification)
	{
		// 메세지를 전송한다.
		$messagesTo = collect($receiverList)
			->map(function ($receiver) {
				return $receiver["phone"];
			})
			->toArray();
		$this->sendCoolSmsMessage($messagesTo, $smsNotification["sms_title"], $smsNotification["sms_description"]);

		// 메세지 전송이후 해당 Sms 노티는 완료 상태로 처리하여 다음에는 발송하지 않도록 한다.
		SmsNotification::find($smsNotification["id"])->update(["completed" => true]);

		// 메세지 전송 이력을 기록한다.
		collect($receiverList)->each(function ($receiver) use ($smsNotification) {
			$this->createSmsNotificationHistory($smsNotification["id"], $receiver);
		});
	}

	/**
	 * 과목 수강자를 모두 얻는다.
	 */
	private function getCourseEnrollmentUser($courseId, $sectionId)
	{
		$courseEnrollments = Enrollment::with("user")
			->where([
				["course_id", $courseId],
				["course_section_id", $sectionId],
				["status", EnrollmentStatus::COMPLETE],
			])
			->get();
		return $courseEnrollments
			->map(function ($courseEnrollment) {
				return $courseEnrollment->user;
			})
			->toArray();
	}

	/**
	 * 개별 등록된 사용자를 모두 얻는다.
	 */
	private function getNotificationReceiver($smsNotificationId)
	{
		$smsNotificationReceivers = SmsNotificationReceiver::where("sms_notification_id", $smsNotificationId)->get();
		return $smsNotificationReceivers
			->map(function ($smsNotificationReceiver) {
				return [
					"id" => $smsNotificationReceiver["user_id"] ?? 0,
					"user_login" => isset($smsNotificationReceiver->user)
						? $smsNotificationReceiver->user->user_login
						: "",
					"name" => isset($smsNotificationReceiver->user) ? $smsNotificationReceiver->user->name : "",
					"phone" => $smsNotificationReceiver["phone"] ?? "",
				];
			})
			->toArray();
	}

	/**
	 * 메세지를 전송한다.
	 */
	private function sendCoolSmsMessage($messagesTo, $messageTitle, $messageDescription)
	{
		// cool sms 전송을 위한 양식으로 변경한다.
		// 한번에 1000건까지 보낼 수 있다.
		$coolSmsApi = new CoolSmsAPI();
		$messagesFrom = "031-526-9313";

		$messagesToArray = array_chunk($messagesTo, 1000);
		foreach ($messagesToArray as $messagesTo) {
			$coolSmsMessages = [];
			foreach ($messagesTo as $to) {
				$coolSmsMessages[] = [
					"from" => str_replace("-", "", $messagesFrom),
					"to" => str_replace("-", "", $to),
					"text" => $messageTitle . PHP_EOL . $messageDescription,
				];
			}
			$coolSmsApi->sendMessage($coolSmsMessages);
		}
	}

	/**
	 * SMS 발송 이력을 기록한다.
	 */
	private function createSmsNotificationHistory($smsNotificationId, $user)
	{
		SmsNotificationHistory::create([
			"sms_notification_id" => $smsNotificationId,
			"user_id" => $user["id"],
			"user_login" => $user["user_login"],
			"user_name" => $user["name"],
			"phone" => $user["phone"],
		]);
	}
}
