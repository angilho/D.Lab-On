<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChapterQuizLearningsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("chapter_quiz_learnings", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("chapter_id");
			$table->unsignedBigInteger("quiz_id");
			$table->integer("total_question");
			$table->integer("correct_answer");
			$table->string("status");
			$table->dateTime("passed_at")->nullable();

			$table->timestamps();

			$table
				->foreign("user_id")
				->references("id")
				->on("users")
				->onDelete("cascade");

			$table
				->foreign("chapter_id")
				->references("id")
				->on("course_chapters")
				->onDelete("cascade");

			$table
				->foreign("quiz_id")
				->references("id")
				->on("chapter_quizzes")
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
		Schema::dropIfExists("chapter_quiz_learnings");
	}
}