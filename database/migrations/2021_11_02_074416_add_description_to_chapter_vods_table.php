<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDescriptionToChapterVodsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table("chapter_vods", function (Blueprint $table) {
			$table->longText("description")->nullable();
			$table->string("description_url")->nullable();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table("chapter_vods", function (Blueprint $table) {
			$table->dropColumn("description");
			$table->dropColumn("description_url");
		});
	}
}