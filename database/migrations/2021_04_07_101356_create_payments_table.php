<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Constants\PaymentStatus;

class CreatePaymentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("payments", function (Blueprint $table) {
			$table->id();

			$table->string("merchant_uid")->unique();
			$table->string("name");
			$table->string("method");
			$table->unsignedBigInteger("req_user_id");
			$table->integer("total_price");
			$table->enum("status", PaymentStatus::all());
			$table->dateTime("payment_at")->nullable();

			$table
				->foreign("req_user_id")
				->references("id")
				->on("users")
				->onDelete("cascade");

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
		Schema::dropIfExists("payments");
	}
}