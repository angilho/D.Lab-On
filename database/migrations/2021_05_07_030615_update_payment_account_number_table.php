<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePaymentAccountNumberTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table("payments", function (Blueprint $table) {
			$table->string("vbank_name")->nullable();
			$table->string("vbank_num")->nullable();
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
			$table->dropColumn("vbank_name")->nullable();
			$table->dropColumn("vbank_num")->nullable();
		});
	}
}