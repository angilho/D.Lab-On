<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserCouponsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("user_coupons", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->unsignedBigInteger("coupon_id");
			$table->timestamps();

			$table->unique(["user_id", "coupon_id"]);

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
		Schema::dropIfExists("user_coupons");
	}
}
