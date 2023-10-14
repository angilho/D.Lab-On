<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSmsNotificationsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("sms_notifications", function (Blueprint $table) {
			$table->id();
			$table->string("type");
			$table->string("name");
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("section_id");
			$table->string("receiver");
			$table->date("start_at");
			$table->date("end_at");
			$table->integer("reserved_hour");
			$table->integer("reserved_minute");
			$table->string("sms_title");
			$table->longText("sms_description");
			$table->unsignedBigInteger("work_user_id");
			$table->boolean("completed")->default(false);
			$table->timestamps();

			$table
				->foreign("course_id")
				->references("id")
				->on("courses")
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
		Schema::dropIfExists("sms_notifications");
	}
}
