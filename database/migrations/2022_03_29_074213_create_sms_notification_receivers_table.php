<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSmsNotificationReceiversTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("sms_notification_receivers", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("sms_notification_id");
			$table->unsignedBigInteger("user_id")->nullable();
			$table->string("phone");
			$table->timestamps();

			$table
				->foreign("sms_notification_id")
				->references("id")
				->on("sms_notifications")
				->onDelete("cascade");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("sms_notification_receivers");
	}
}
