<?php

use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "thirdParty", "as" => "thirdParty."], function () {
	Route::post("/searchAddress", [
		App\Http\Controllers\ThirdParty\ThirdPartyController::class,
		"searchAddressPost",
	])->name("searchAddressPost");
});