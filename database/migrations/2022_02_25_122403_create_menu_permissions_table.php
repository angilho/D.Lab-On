<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuPermissionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("menu_permissions", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("menu_id");
			$table->unsignedBigInteger("user_id");
			$table->timestamps();

			$table->unique(["menu_id", "user_id"]);

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
		Schema::dropIfExists("menu_permissions");
	}
}
