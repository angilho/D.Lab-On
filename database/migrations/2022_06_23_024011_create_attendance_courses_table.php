<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceCoursesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("attendance_courses", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("section_id");
			$table->unsignedBigInteger("instructor_id");
			$table->timestamps();

			$table
				->foreign("course_id")
				->references("id")
				->on("courses")
				->onDelete("cascade");

			$table
				->foreign("instructor_id")
				->references("id")
				->on("users");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("attendance_courses");
	}
}
