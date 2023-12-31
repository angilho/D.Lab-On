<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildrenTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("children", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("parent_id");
			$table->unsignedBigInteger("child_id");
			$table->timestamps();

			$table
				->foreign("parent_id")
				->references("id")
				->on("users")
				->onDelete("cascade");
			$table
				->foreign("child_id")
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
		Schema::dropIfExists("children");
	}
}