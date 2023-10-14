<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>학교 검색</title>
	<link href="{{ mix('css/app.css') }}" rel="stylesheet">
	<!-- 이 뷰에서만 사용되는 bootstrap -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js" integrity="sha384-LtrjvnR4Twt/qOuYxE721u19sVFLVSA4hf/rRt6PrZTmiPltdZcI7q7PXQBYTKyf" crossorigin="anonymous"></script>
	<style>
		button {
			background-color: #FF5100 !important;
			border-color: #FF5100 !important;
		}
	</style>
</head>

<script language="javascript">
	function selectSchool(name) {
		window.opener.window.schoolCallback(name);
		window.close();
	}
</script>

<body>
	<div className="container ml-20 mr-20 mb-20">
		<form id="form" class="mt-20" name="form" method="post" action="/thirdParty/searchSchool">
			<div class="form-group row justify-content-center align-items-center">
				<label class="col-sm-2">학교 검색</label>
				<input type="text" class="form-control col-sm-6" id="search" name="search" value="" />
				<button type="submit" class="btn btn-primary col-sm-2 ml-20">검색</button>
			</div>
			
			@csrf
		</form>
		@if(isset($message) && !empty($message))
			<span>{!! $message !!}</span>
		@endif
		@if(isset($searchResult) && !empty($searchResult))
		<div class="table-responsive">
			<table class="table">
				<thead>
					<tr>
						<th scope="col">종류</th>
						<th scope="col">이름</th>
						<th scope="col">주소</th>
						<th scope="col">우편번호</th>
						<th scope="col">선택</th>
					</tr>
				</thead>
				<tbody>
					@foreach ($searchResult as $school)
						<tr>
							<td>{!! $school["kind"] !!}</td>
							<td>{!! $school["name"] !!}</td>
							<td>{!! $school["address"] !!}</td>
							<td>{!! $school["postcode"] !!}</td>
							<td><button class="btn btn-primary" onClick="javascript:selectSchool('{!! $school["name"] !!}');">✓</button></td>
						</tr>
					@endforeach
				</tbody>
			</table>
		</div>
		@endif
	</div>
</body>

</html>