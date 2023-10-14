<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportClassEnrollmentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("support_class_enrollments", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("enrollment_id");
			$table->dateTime("class_end_at")->nullable();
			$table->timestamps();

			$table
				->foreign("enrollment_id")
				->references("id")
				->on("enrollments")
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
		Schema::dropIfExists("support_class_enrollments");
	}
}
