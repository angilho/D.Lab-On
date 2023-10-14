<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChapterVodLearningsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("chapter_vod_learnings", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("chapter_id");
			$table->unsignedBigInteger("vod_id");
			$table->string("status");

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
				->foreign("vod_id")
				->references("id")
				->on("chapter_vods")
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
		Schema::dropIfExists("chapter_vod_learnings");
	}
}