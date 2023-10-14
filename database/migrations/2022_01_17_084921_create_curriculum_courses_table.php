<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurriculumCoursesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("curriculum_courses", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("curriculum_category_id");
			$table->unsignedBigInteger("course_id");
			$table->integer("order");
			$table->timestamps();

			$table
				->foreign("curriculum_category_id")
				->references("id")
				->on("curriculum_categories")
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
		Schema::dropIfExists("curriculum_courses");
	}
}
