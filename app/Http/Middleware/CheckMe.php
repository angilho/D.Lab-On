<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Child;
use App\Constants\TokenAbility;

class CheckMe
{
	public function handle(Request $request, Closure $next, ...$abilities)
	{
		// 1. Request 요청을 보낸 로그인 사용자가 정보를 얻기 위한 대상 사용자와 동일한지 확인한다.
		// 2. Request 요청을 보낸 로그인 사용자가 정보를 얻기 위한 대상 사용자의 부모와 동일한지 확인한다.
		// 3. 운영자는 가능하다.
		$checkMe = $request->user()->id == $request->route("user");
		$child = Child::where("child_id", $request->route("user"))->first();
		$checkParent = $child && $request->user()->id == $child->parent_id;
		$checkAdmin = $request->user()->tokenCan(TokenAbility::ADMIN);
		if (!$checkMe && !$checkParent && !$checkAdmin) {
			abort(403, "Access denied");
		}

		return $next($request);
	}
}