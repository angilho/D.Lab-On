<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class ResetPasswordNotification extends Notification
{
	use Queueable;

	private $token;

	public function __construct($data)
	{
		$this->token = $data;
	}

	/**
	 * Get the notification's delivery channels.
	 *
	 * @param  mixed  $notifiable
	 * @return array
	 */
	public function via($notifiable)
	{
		return ["mail"];
	}

	/**
	 * Get the mail representation of the notification.
	 *
	 * @param  mixed  $notifiable
	 * @return \Illuminate\Notifications\Messages\MailMessage
	 */
	public function toMail($notifiable)
	{
		$url = url(
			config("app.url") .
				route(
					"password.reset",
					[
						"token" => $this->token,
						"email" => $notifiable->getEmailForPasswordReset(),
					],
					false
				)
		);

		return (new MailMessage())->view("emails.resetPassword", ["url" => $url])->subject("디랩온 비밀번호 초기화");
	}

	/**
	 * Get the array representation of the notification.
	 *
	 * @param  mixed  $notifiable
	 * @return array
	 */
	public function toArray($notifiable)
	{
		return [
				//
			];
	}
}