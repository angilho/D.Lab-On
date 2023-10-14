<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Constants\CourseType;

class AddCourseTypeToCouponsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table("coupons", function (Blueprint $table) {
			$table->string("course_type")->default(implode(",", CourseType::all()));
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table("coupons", function (Blueprint $table) {
			$table->dropColumn("course_type");
		});
	}
}