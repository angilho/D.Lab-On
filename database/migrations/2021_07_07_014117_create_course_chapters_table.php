<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourseChaptersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("course_chapters", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("course_id");
			$table->integer("index");
			$table->string("title");
			$table->string("description")->nullable();
			$table->boolean("need_quiz_pass");

			$table->timestamps();

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
		Schema::table("course_chapters", function (Blueprint $table) {
			$table->dropForeign(["course_id"]);
		});
		Schema::dropIfExists("course_chapters");
	}
}