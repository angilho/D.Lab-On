<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationPostsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("organization_posts", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("organization_id");
			$table->unsignedBigInteger("user_id");
			$table->string("title");
			$table->longText("description")->nullable();
			$table->unsignedBigInteger("attachment_file_id")->nullable();
			$table->boolean("private");
			$table->integer("order")->default(0);
			$table->integer("view_count")->default(0);
			$table->timestamps();

			$table
				->foreign("organization_id")
				->references("id")
				->on("organizations")
				->onDelete("cascade");

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
		Schema::dropIfExists("organization_posts");
	}
}