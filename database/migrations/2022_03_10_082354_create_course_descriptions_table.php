<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourseDescriptionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("course_descriptions", function (Blueprint $table) {
			$table->id();
			$table->timestamps();
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("desktop_intro_image_id")->nullable();
			$table->longText("desktop_course_description")->nullable();
			$table->longText("desktop_course_curriculum")->nullable();
			$table->longText("desktop_operation")->nullable();
			$table->longText("desktop_refund")->nullable();
			$table->unsignedBigInteger("mobile_intro_image_id")->nullable();
			$table->longText("mobile_course_description")->nullable();
			$table->longText("mobile_course_curriculum")->nullable();
			$table->longText("mobile_operation")->nullable();
			$table->longText("mobile_refund")->nullable();

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
		Schema::dropIfExists("course_descriptions");
	}
}
