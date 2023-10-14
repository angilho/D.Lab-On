<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportClassHistoriesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("support_class_histories", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("work_user_id");
			$table->unsignedBigInteger("target_user_id");
			$table->unsignedBigInteger("target_course_id");
			$table->unsignedBigInteger("target_section_id");
			$table->string("action");
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
		Schema::dropIfExists("support_class_histories");
	}
}
