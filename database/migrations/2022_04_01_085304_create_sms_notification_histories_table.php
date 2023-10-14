<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSmsNotificationHistoriesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("sms_notification_histories", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("sms_notification_id");
			$table->unsignedBigInteger("user_id")->nullable();
			$table->string("user_login")->nullable();
			$table->string("user_name")->nullable();
			$table->string("phone")->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("sms_notification_histories");
	}
}
