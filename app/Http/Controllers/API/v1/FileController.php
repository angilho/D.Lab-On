<?php

namespace App\Http\Controllers\Api\v1;

use Exception;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\File;

class FileController extends Controller
{
	/**
	 * 파일 조회
	 */
	public function show($id)
	{
		$file = File::findOrFail($id);
		return response()->json($file, 200);
	}

	public function store(Request $request)
	{
		try {
			$userId = $request->user()->id;
			$uploadedFile = $request->file("file");
			$filename = $uploadedFile->store("public/files");
			$file = File::create([
				"user_id" => $userId,
				"filename" => pathinfo($filename, PATHINFO_BASENAME),
				"org_filename" => $uploadedFile->getClientOriginalName(),
			]);
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->json($file, 201);
	}

	public function destroy($id)
	{
		try {
			$file = File::findOrFail($id);
			$file->delete();
		} catch (Exception $e) {
			return response()->json(["message" => $e->getMessage()], 500);
		}

		return response()->noContent();
	}
}
