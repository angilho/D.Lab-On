<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("messages", function (Blueprint $table) {
			$table->id();

			$table->string("title");
			$table->longText("description");
			$table->unsignedBigInteger("req_user_id");
			$table->longText("message_to");
			$table->dateTime("sent_at")->nullable();

			$table
				->foreign("req_user_id")
				->references("id")
				->on("users")
				->onDelete("cascade");

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
		Schema::dropIfExists("messages");
	}
}