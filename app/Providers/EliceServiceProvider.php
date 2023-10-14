<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class EliceServiceProvider extends ServiceProvider
{
	/**
	 * Register services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->singleton(EliceAPI::class, function ($app) {
			return new EliceAPI();
		});
	}
}