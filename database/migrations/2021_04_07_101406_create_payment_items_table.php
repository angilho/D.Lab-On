<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentItemsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("payment_items", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("payment_id");
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("course_section_id");
			$table->unsignedBigInteger("price");

			$table
				->foreign("payment_id")
				->references("id")
				->on("payments")
				->onDelete("cascade");
			$table
				->foreign("user_id")
				->references("id")
				->on("users")
				->onDelete("cascade");
			$table
				->foreign("course_id")
				->references("id")
				->on("courses")
				->onDelete("cascade");
			$table
				->foreign("course_section_id")
				->references("id")
				->on("course_sections");

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
		Schema::table("payment_items", function (Blueprint $table) {
			$table->dropForeign("payment_items_user_id_foreign");
			$table->dropForeign("payment_items_payment_id_foreign");
			$table->dropForeign("payment_items_course_section_id_foreign");
			$table->dropForeign("payment_items_course_id_foreign");
		});
		Schema::dropIfExists("payment_items");
	}
}