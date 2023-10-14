<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChapterQuizzesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("chapter_quizzes", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("chapter_id");
			$table->integer("required_correct_count");

			$table->timestamps();

			$table
				->foreign("chapter_id")
				->references("id")
				->on("course_chapters")
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
		Schema::dropIfExists("chapter_quizzes");
	}
}