<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetailCurriculumCoursesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("detail_curriculum_courses", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("detail_curriculum_category_id");
			$table->unsignedBigInteger("course_id");
			$table->integer("order");
			$table->timestamps();

			$table
				->foreign("detail_curriculum_category_id")
				->references("id")
				->on("detail_curriculum_categories")
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
		Schema::dropIfExists("detail_curriculum_courses");
	}
}
