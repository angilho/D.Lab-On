<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Constants\CoursePostType;

class CreateCoursePostsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("course_posts", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("course_id");
			$table->unsignedBigInteger("user_id");
			$table->enum("type", CoursePostType::all());
			$table->string("title");
			$table->longText("description")->nullable();
			$table->unsignedBigInteger("attachment_file_id")->nullable();
			$table->boolean("private");
			$table->string("status");

			$table->timestamps();

			$table
				->foreign("course_id")
				->references("id")
				->on("courses")
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
		Schema::dropIfExists("course_posts");
	}
}