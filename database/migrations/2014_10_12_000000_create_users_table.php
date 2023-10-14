<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Constants\Role;

class CreateUsersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("users", function (Blueprint $table) {
			$table->id();
			$table->string("user_login");
			$table->string("name");
			$table->string("phone");
			$table->string("password");
			$table->string("email")->nullable();
			$table->string("birthday");
			$table->string("address");
			$table->string("address_detail");
			$table->string("inflow_path")->nullable();
			$table->integer("role")->default(Role::MEMBER);
			$table->rememberToken();
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
		Schema::dropIfExists("users");
	}
}