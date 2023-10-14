<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceStudentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("attendance_students", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("attendance_course_id");
			$table->unsignedBigInteger("attendance_section_id");
			$table->boolean("attendance")->default(false);
			$table->timestamps();

			$table
				->foreign("user_id")
				->references("id")
				->on("users");

			$table
				->foreign("attendance_section_id")
				->references("id")
				->on("attendance_sections");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("attendance_students");
	}
}
