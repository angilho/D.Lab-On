<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
	/**
	 * The policy mappings for the application.
	 *
	 * @var array
	 */
	protected $policies = [
		// 'App\Models\Model' => 'App\Policies\ModelPolicy',
	];

	/**
	 * Register any authentication / authorization services.
	 *
	 * @return void
	 */
	public function boot()
	{
		$this->registerPolicies();

		//
		Gate::define("access-admin", function ($user) {
			return $user->role === \App\Constants\Role::ADMIN;
		});
		//
		Gate::define("access-admin-instructor", function ($user) {
			return $user->role === \App\Constants\Role::INSTRUCTOR || $user->role === \App\Constants\Role::ADMIN;
		});
	}
}
