<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetailCurriculumCategoriesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("detail_curriculum_categories", function (Blueprint $table) {
			$table->id();
			$table->string("title");
			$table->longText("description");
			$table->string("tag");
			$table->integer("order");
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("detail_curriculum_categories");
	}
}
