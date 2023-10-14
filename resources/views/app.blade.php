@extends('layouts.app', [
    'title' => 'D.LAB ON'
])
@section('content')
<div id="root" data-csrf_token="{{csrf_token()}}">
    <script src="{{mix('/js/app.js')}}"></script>
</div>
@endsection