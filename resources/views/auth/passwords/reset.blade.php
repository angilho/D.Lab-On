<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>D.LAB ON 비밀번호 초기화</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Scripts -->
    <script src="/lib/js/jquery-3.6.0.min.js"></script>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

    <!-- Styles -->
    <style>
        html, body {
            background-color: #ffd6cb;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }
        .full-height {
            height: 100vh;
        }
        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }
        .position-ref {
            position: relative;
        }
        input {
            padding: 10pt;
            width: 60%;
            font-size: 15pt;
            border-radius: 5pt;
            border: 1px solid lightgray;
            margin: 10pt;
        }
        .form-container {
            display: flex;
            flex-direction: column;
            width: 60%;
            align-items: center;
            margin: 20pt;
            border: 1px solid lightgray;
            padding: 20pt;
            border-radius: 5pt;
            background: white;
        }
        button {
            border-radius: 5pt;
            padding: 10pt 14pt;
            background: #ff5100;
            color: white;
            border: none;
            font-size: 14pt;
            margin: 20pt;
        }
        button:hover {
            cursor: pointer;
        }
    </style>
</head>
<body>
<div class="flex-center position-ref full-height">
    <form id="reset-form" class="form-container">
        <h2>비밀번호 재설정</h2>

        <input name="email" placeholder="이메일 주소" value="{{request()->get('email')}}" readonly style="background-color: lightgray">
        <input name="password" type="password" placeholder="새 비밀번호">
        <input name="password_confirmation" type="password" placeholder="새 비밀번호 확인">
        <input hidden name="token" placeholder="token" value="{{ collect(request()->segments())->last() }}">

        <button type="submit">비밀번호 재설정하기</button>
    </form>
</div>
<script>
    $(function() {
        $("#reset-form").submit(function(event) {
            event.preventDefault();
            
            $.ajax({
                type: "POST",
                url: "/api/v1/password/reset",
                data: $('#reset-form').serialize(),
                success: function(data) {
                    alert('비밀번호 변경에 성공하였습니다.');
                    window.location.href = "/";
                },
                error: function() {
                    alert("비밀번호 변경에 실패하였습니다.");
                }
            })
        });
    });
</script>
</body>
</html>