<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Constants\CourseType;

class CreateCoursesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("courses", function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger("user_id");
			$table->string("name");
			$table->enum("type", CourseType::all());
			$table->unsignedBigInteger("thumbnail_id");
			$table->boolean("closed");
			$table->string("student_target");
			$table->string("elice_course_id")->nullable();
			$table->integer("price");
			$table->integer("discount_price")->nullable();
			$table->integer("duration_week");
			$table->integer("duration_hour");
			$table->integer("duration_minute");
			$table->string("dlab_course_code")->unique();
			$table->timestamps();

			$table
				->foreign("user_id")
				->references("id")
				->on("users")
				->onUpdate("cascade");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("courses");
	}
}