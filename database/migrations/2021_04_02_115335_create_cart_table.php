<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("carts", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("course_section_id");
			$table->timestamps();

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
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table("carts", function (Blueprint $table) {
			$table->dropForeign("carts_user_id_foreign");
			$table->dropForeign("carts_course_section_id_foreign");
			$table->dropForeign("carts_course_id_foreign");
		});
		Schema::dropIfExists("carts");
	}
}