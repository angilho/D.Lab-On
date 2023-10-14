@extends('layouts.app', [
    'title' => '자녀 가입 정보 입력'
])

@section('content')
<div id="root" data-parent_id="{{$parent_id}}">
    <script src="/js/auth/register/child.index.app.js?version={{config('app.version')}}"></script>
</div>
@endsection