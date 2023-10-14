<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUseDefaultProfileToUsersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table("users", function (Blueprint $table) {
			$table->boolean("use_default_profile")->default(true);
			$table->unsignedBigInteger("profile_image_id")->nullable();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table("users", function (Blueprint $table) {
			$table->dropColumn("use_default_profile");
			$table->dropColumn("profile_image_id");
		});
	}
}