<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizQuestionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("quiz_questions", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("quiz_id");
			$table->integer("index");
			$table->string("question");
			$table->unsignedBigInteger("question_image_file_id")->nullable();

			$table->timestamps();

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
		Schema::dropIfExists("quiz_questions");
	}
}