<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FindUserId extends Mailable
{
	use Queueable, SerializesModels;

	/**
	 * 메일로 전달할 사용자 ID
	 */
	public $userLogin;

	/**
	 * Create a new message instance.
	 *
	 * @return void
	 */
	public function __construct($userLogin)
	{
		$this->userLogin = $userLogin;
	}

	/**
	 * Build the message.
	 *
	 * @return $this
	 */
	public function build()
	{
		return $this->subject("디랩온 아이디 찾기")->view("emails.findUserId");
	}
}