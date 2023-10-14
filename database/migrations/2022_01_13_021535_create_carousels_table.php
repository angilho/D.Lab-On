<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarouselsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("carousels", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("desktop_image_file_id");
			$table->unsignedBigInteger("mobile_image_file_id");
			$table->string("url");
			$table->string("background_color");
			$table->boolean("new_tab");
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
		Schema::dropIfExists("carousels");
	}
}
