<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCurriculumInfoToCoursesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table("courses", function (Blueprint $table) {
			$table->string("curriculum_keyword")->nullable();
			$table->string("curriculum_target_keyword")->nullable();
			$table->longText("short_description")->nullable();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table("courses", function (Blueprint $table) {
			$table->dropColumn("curriculum_keyword");
			$table->dropColumn("curriculum_target_keyword");
			$table->dropColumn("short_description");
		});
	}
}
