<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\Constants\Role;
use App\Models\User;
use App\Models\UserAgreement;

class UsersTableSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		if (User::all()->isEmpty()) {
			$user = User::create([
				"role" => Role::ADMIN,
				"user_login" => "admin",
				"name" => "운영자",
				"phone" => "010-1234-5678",
				"password" => Hash::make("Elfoq@!2021#"),
				"email" => "admin@daddyslab.com",
				"birthday" => [
					"year" => "2020",
					"month" => "04",
					"day" => "01",
				],
				"address" => "경기도 성남시 분당구 운중로 138번길 7",
				"address_detail" => "KT 빌딩 3층",
				"inflow_path" => "최초 생성 운영자",
			]);
			UserAgreement::create([
				"user_id" => $user->id,
				"dlab_on" => true,
				"privacy" => true,
				"promotion" => true,
			]);
		}
	}
}