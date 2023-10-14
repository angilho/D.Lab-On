<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <body>
        <div style="width: 650px; height: 583px; background-color: #ffd6cb; padding: 30px 40px 40px 40px">
            <div style="width: 100%; height: 53px; text-align: center">
                <img src="https://dlabon.com/images/footerLogoMobile.png" width="113px" height="23px">
            </div>
            <div style="width: 570px; height: 430px; background-color: white; padding: 40px">
                <div>
                    <span style="font-size: 24px">안녕하세요!</span>
                </div>
                <div style="margin-top: 20px">
                    <span style="font-size: 16px">이 메일은 고객님의 비밀번호 재설정 요청에 따라 전송된 메일입니다.</span>
                </div>
                <div style="margin-top: 40px">
                    <a target="_blank" href="{{ $url }}" style="text-decoration: none">
                        <div style="width: 180px; height: 48px; border-radius: 4px; background-color: #ff5100; color: white; text-align: center">
                            <span style="display: inline-block; padding-top: 12px; font-size: 18px">비밀번호 재설정</span>
                        </div>
                    </a>
                </div>
                <div style="margin-top: 40px;">
                    <span style="font-size: 16px">위 버튼을 눌러 비밀번호를 변경할 수 있는 화면으로 이동하여 진행해주시기 바랍니다.</span><br>
                    <span style="font-size: 16px">원치 않으시는 경우, 이 메일을 삭제해 주시기 바랍니다.</span>
                </div>
                <div style="margin-top: 20px;">
                    <span style="font-size: 16px">감사합니다.</span>
                </div>
                <hr style="margin-top: 20px">
                <div style="margin-top: 20px;">
                    <span style="font-size: 14px">만약 [비밀번호 재설정] 버튼에 문제가 있을 경우, 다음 URL을 웹 브라우저에 복사 및 붙여넣기 하여 비밀번호 재설정 페이지로 이동해주세요</span><br>
                    <span style="font-size: 14px">{{ $url }}</span>
                </div>
            </div>
            <div style="width: 100%; height: 40px; padding-top: 20px; text-align: center">
                <span style="font-size: 11px">© 2021 D.LAB Inc. All rights reserved</span>
            </div>
        </div>
    </body>
</html>