<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceSectionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("attendance_sections", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("attendance_course_id");
			$table->integer("index");
			$table->date("attendance_at")->nullable();
			$table->boolean("attendance_checked")->default(false);
			$table->timestamps();

			$table
				->foreign("attendance_course_id")
				->references("id")
				->on("attendance_courses");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("attendance_sections");
	}
}
