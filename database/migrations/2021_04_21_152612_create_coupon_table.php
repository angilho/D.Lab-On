<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Constants\CouponType;

class CreateCouponTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("coupons", function (Blueprint $table) {
			$table->id();
			$table->string("name");
			$table->string("code")->unique();
			$table->enum("type", CouponType::all());
			$table->dateTime("end_at");
			$table->integer("value");
			$table->timestamps();
		});

		Schema::table("payments", function (Blueprint $table) {
			$table->unsignedBigInteger("coupon_id")->nullable();
			$table
				->foreign("coupon_id")
				->references("id")
				->on("coupons")
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
		Schema::table("payments", function (Blueprint $table) {
			$table->dropForeign("payments_coupon_id_foreign");
		});
		Schema::dropIfExists("coupons");
	}
}
