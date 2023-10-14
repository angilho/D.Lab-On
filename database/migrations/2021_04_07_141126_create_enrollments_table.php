<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Constants\EnrollmentStatus;

class CreateEnrollmentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("enrollments", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("course_section_id");
			$table->enum("status", EnrollmentStatus::all());

			$table->timestamps();

			//같은 과목에 같은 사용자가 수강할 수 없다.
			$table->unique(["user_id", "course_id", "course_section_id"]);

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
		Schema::table("enrollments", function (Blueprint $table) {
			$table->dropForeign("enrollments_course_section_id_foreign");
			$table->dropForeign("enrollments_course_id_foreign");
		});
		Schema::dropIfExists("enrollments");
	}
}