<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursePostCommentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("course_post_comments", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("post_id");
			$table->unsignedBigInteger("user_id");
			$table->longText("comment");
			$table->unsignedBigInteger("attachment_file_id")->nullable();

			$table->timestamps();

			$table
				->foreign("course_id")
				->references("id")
				->on("courses")
				->onDelete("cascade");

			$table
				->foreign("post_id")
				->references("id")
				->on("course_posts")
				->onDelete("cascade");

			$table
				->foreign("user_id")
				->references("id")
				->on("users")
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
		Schema::dropIfExists("course_post_comments");
	}
}