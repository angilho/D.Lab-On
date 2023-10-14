<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChapterVodsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("chapter_vods", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("chapter_id");
			$table->integer("index");
			$table->string("title");
			$table->string("vod_url");

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
		Schema::dropIfExists("chapter_vods");
	}
}