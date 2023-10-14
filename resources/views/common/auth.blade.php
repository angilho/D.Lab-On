@php
	$user = Auth::User();
	$child = null;
	$gender = "f";
	$isChild = $user && $user->role == App\Constants\Role::CHILD;
	
	//사용자가 아이인 경우 아이의 정보를 가져온다.
	if ($isChild) {
		$child = App\Models\Child::where('child_id', $user->id)->first();
		if ($child) {
			$gender = $child->userMetadata->gender;
		}
	}
	
	// profile image가 있는 경우
	$profileImage = null;
	if ($user && !$user->use_default_profile) {
		$profileImage = App\Models\File::where('id', $user->profile_image_id)->first();
	}

	// 운영자 메뉴 권한
	$adminMenuPermissions = null;
	if ($user && $user->is_admin) {
		$adminMenuPermissions = App\Models\MenuPermission::where('user_id', $user->id)->get();
	}
@endphp
<script>
	var userInfo = {
		'logged_in': {!! json_encode(Auth::check()) !!},
		'id': {!! $user ? $user->id : 0 !!},
		'name': '{!! $user ? $user->name : '' !!}',
		'is_child': {!! json_encode($isChild) !!},
		'gender': '{!! $gender !!}',
		'parentId': {!! $child ? $child->parent_id : 0 !!},
		'is_admin': {!! json_encode($user && $user->is_admin) !!},
		'is_instructor': {!! json_encode($user && $user->is_instructor) !!},
		'use_default_profile': {!! json_encode($user && $user->use_default_profile) !!},
		'profile_image': {!! json_encode($profileImage) !!},
		'organization_id' : {!! ($user && $user->organization_id) ? $user->organization_id : 0 !!},
		'admin_menu_permissions' : {!! $adminMenuPermissions ? $adminMenuPermissions : '[]' !!},
		'campus' : {!! ($user && $user->campus) ? $user->campus : 0 !!},
	}
</script>