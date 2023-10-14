<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFaqItemsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("faq_items", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("faq_category_id");
			$table->string("name");
			$table->longText("description");
			$table->timestamps();

			$table
				->foreign("faq_category_id")
				->references("id")
				->on("faq_categories");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("faq_items");
	}
}