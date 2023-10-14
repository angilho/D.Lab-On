<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizQuestionAnswersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("quiz_question_answers", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("question_id");
			$table->integer("index");
			$table->string("answer");
			$table->unsignedBigInteger("answer_image_file_id")->nullable();
			$table->string("commentary")->nullable();
			$table->boolean("correct");

			$table->timestamps();

			$table
				->foreign("question_id")
				->references("id")
				->on("quiz_questions")
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
		Schema::dropIfExists("quiz_question_answers");
	}
}