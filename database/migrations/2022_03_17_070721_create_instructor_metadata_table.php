<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstructorMetadataTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("instructor_metadata", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->string("employee_number");
			$table->date("start_at");
			$table->date("end_at");
			$table->enum("gender", ["m", "f"]);
			$table->timestamps();

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
		Schema::dropIfExists("instructor_metadata");
	}
}
