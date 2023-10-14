@extends('layouts.app', [
    'title' => '수료증'
])

@section('content')
<script src="/lib/js/jspdf.min.js" type="text/javascript"></script>
<script src="/lib/js/html2canvas.min.js" type="text/javascript"></script>

<style>
    html, 
    body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
    .container {
        position: relative;
        width: 842px;
        height: 595px;
        background-image: url('{{asset("/certificate/background.png")}}');
        background-size: contain;
    }
    .certificate_title {
        position: absolute;
        left: 100px;
        top: 80px;
        font-family: Noto Sans KR;
        font-size: 58px;
        font-weight: 900;
        line-height: 83.98px;
        letter-spacing: 0.24em;
        color: #ef4c12;
    }
    .title {
        position: absolute;
        left: 100px;
        top: 168px;
        font-family: Noto Sans KR;
        font-size: 16px;
        font-weight: 900;
        line-height: 22.4px;
        letter-spacing: -0.04em;
        color: #ef4c12;
    }
    .name {
        position: absolute;
        left: 100px;
        top: 230px;
        font-family: Noto Sans KR;
        font-size: 40px;
        font-weight: 700;
        line-height: 57.92px;
        letter-spacing: 0.1em;
        color: #222222;
    }
    .description {
        position: absolute;
        left: 100px;
        top: 320px;
        font-family: Noto Sans KR;
        font-size: 14px;
        font-weight: 400;
        line-height: 25.2px;
        letter-spacing: -0.02em;
        color: #555555;
    }
    .description .strong {
        font-weight: 700;
    }
    .course_duration {
        position: absolute;
        left: 100px;
        top: 399px;
        font-family: Noto Sans KR;
        font-size: 12px;
        font-weight: 400;
        line-height: 21.6px;
        letter-spacing: -0.02em;
        color: #555555;
    }
    .signature {
        position: absolute;
        left: 100px;
        top: 453px;
        font-family: Noto Sans KR;
        font-size: 12px;
        font-weight: 700;
        line-height: 21.6px;
        letter-spacing: -0.02em;
        color: #555555;
    }
    .export_button {
        margin-top: 20px;
        width: 200px;
        height: 60px;
        background-color: #FF5100;
        border: none;
        border-radius: 4px;
        color: #ffffff;
    }
</style>
<script>
    function onPdfExport() {
        // dlab-certificate 만 다운로드한다
        const certificate = document.getElementById('dlab-certificate');
        html2canvas(certificate).then(function(canvas) {
            let pdf = new jsPDF("l", "mm", [842, 595]);
            let width = pdf.internal.pageSize.getWidth();
            let height = pdf.internal.pageSize.getHeight();

            let imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, width, height, '', 'NONE', 0);

            let filename = '수료증_' + "{{$name}}" + '_' + "{{$course_name}}" + ".pdf";
            pdf.save(filename);
        })
    }
</script>
<div id="dlab-certificate" class="container">
    <div class="certificate_title">수료증</div>
    <div class="title">
        {{$year}} D.LAB ON CLASS CERTIFICATE
    </div>
    <div class="name">
        {{$name}}
    </div>
    <div class="description">
        <span>위 학생은 D.LAB ON 에서 진행하는</span><br/>
        <span class="strong">[ {{$course_name}} ]</span><span> 클래스를 성실히 참여하였으며,</span><br/>
        <span>과제 수행 결과가 평가 기준을 충족하였기에 본 증서를 수여합니다.</span>
    </div>
    <div class="course_duration">
        교육기간: {{$course_duration}}
    </div>
    <div class="signature">
        {{$year}}년 {{$month}}월 {{$day}}일, 디랩 대표&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;송영광
    </div>
</div>
<div class="export">
    <button class="export_button" onclick="onPdfExport()">PDF 다운로드</button>
</div>
@endsection