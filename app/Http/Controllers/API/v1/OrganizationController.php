<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Requests\OrganizationStoreRequest;
use App\Http\Requests\OrganizationUpdateRequest;
use App\Filter\OrganizationSearchFilter;
use App\Models\Organization;

use Exception;

class OrganizationController extends Controller
{
	/**
	 * 전체 B2B 회원 목록을 구한다.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		return QueryBuilder::for(Organization::class)
			->allowedFilters([AllowedFilter::custom("search", new OrganizationSearchFilter())])
			->paginate(30);
	}

	/**
	 * 신규 B2B 회원을 추가한다.
	 *
	 * @param  App\Http\Requests\OrganizationStoreRequest  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(OrganizationStoreRequest $request)
	{
		$validated = $request->validated();

		try {
			$organization = Organization::create($validated);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($organization, 201);
	}

	/**
	 * ID에 매칭되는 B2B 회원을 구한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		return Organization::findOrFail($id);
	}

	/**
	 * B2B 회원 정보를 갱신한다.
	 *
	 * @param  App\Http\Requests\OrganizationUpdateRequest  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(OrganizationUpdateRequest $request, $id)
	{
		$validated = $request->validated();

		$organization = Organization::findOrFail($id);
		try {
			$organization->fill($validated);
			if (!$organization->isDirty()) {
				return response()->noContent();
			}
			$organization->save();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($organization, 201);
	}

	/**
	 * B2B 회원을 삭제한다.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$organization = Organization::findOrFail($id);

		try {
			$organization->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}