<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRecruitDateToCourseSectionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table("course_sections", function (Blueprint $table) {
			$table
				->date("recruit_start_at")
				->nullable()
				->default(null);
			$table
				->date("recruit_end_at")
				->nullable()
				->default(null);
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
			$table->dropColumn("recruit_start_at");
			$table->dropColumn("recruit_end_at");
		});
	}
}
