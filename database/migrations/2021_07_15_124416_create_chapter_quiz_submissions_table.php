<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChapterQuizSubmissionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("chapter_quiz_submissions", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("chapter_id");
			$table->unsignedBigInteger("question_id");
			$table->unsignedBigInteger("answer_id");

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
				->foreign("answer_id")
				->references("id")
				->on("quiz_question_answers")
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
		Schema::dropIfExists("chapter_quiz_submissions");
	}
}