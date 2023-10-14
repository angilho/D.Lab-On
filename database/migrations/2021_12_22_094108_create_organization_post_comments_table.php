<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationPostCommentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("organization_post_comments", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("organization_id");
			$table->unsignedBigInteger("post_id");
			$table->unsignedBigInteger("user_id");
			$table->longText("comment");
			$table->unsignedBigInteger("attachment_file_id")->nullable();

			$table->timestamps();

			$table
				->foreign("organization_id")
				->references("id")
				->on("organizations")
				->onDelete("cascade");

			$table
				->foreign("post_id")
				->references("id")
				->on("organization_posts")
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
		Schema::dropIfExists("organization_post_comments");
	}
}