<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourseSectionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("course_sections", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("course_id");
			$table->integer("target_group");
			$table->string("target_grade")->nullable();
			$table->integer("max_student");
			$table->date("start_at");
			$table->date("end_at");
			$table->integer("cycle_week")->nullable();
			$table->integer("start_hour")->nullable();
			$table->integer("start_minute")->nullable();
			$table->integer("end_hour")->nullable();
			$table->integer("end_minute")->nullable();
			$table->string("duration_day")->nullable();
			$table->string("zoom_url");
			$table->string("zoom_password")->nullable();
			$table->string("zoom_id")->nullable();

			$table->timestamps();

			$table
				->foreign("course_id")
				->references("id")
				->on("courses")
				->onUpdate("cascade")
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
		Schema::table("course_sections", function (Blueprint $table) {
			$table->dropForeign(["course_id"]);
			$table->dropColumn("course_id");
		});
		Schema::dropIfExists("course_sections");
	}
}
