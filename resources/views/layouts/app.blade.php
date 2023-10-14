<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <title>디랩온 (주니어 온라인 코딩)</title>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="facebook-domain-verification" content="7duyvm7sg4cukl357ba3ozz795l74e" />

        <meta name="title" content="디랩온 (주니어 온라인 코딩)">
        <meta name="description" content="언제 어디서나 코딩교육은 디랩온에서">

        <!-- Facebook Meta Tags -->
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="https://dlabon.com/">
        <meta property="og:type" content="website">
        <meta property="og:title" content="디랩온 (주니어 온라인 코딩)">
        <meta property="og:description" content="언제 어디서나 코딩교육은 디랩온에서">
        <meta property="og:image" content="https://dlabon.com/dlabon-seo-img.jpg" />

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary">
        <meta property="twitter:domain" content="dlabon.com">
        <meta property="twitter:url" content="https://dlabon.com/">
        <meta name="twitter:title" content="디랩온 (주니어 온라인 코딩)">
        <meta name="twitter:description" content="언제 어디서나 코딩교육은 디랩온에서">
        <meta name="twitter:image" content="https://dlabon.com/dlabon-seo-img.jpg" />
        
        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
        <script src="/lib/js/jquery-3.6.0.min.js"></script>
        <script src="/lib/js/iamport.payment-1.1.5.js"></script>

        <!-- Firebase 모듈 -->
        <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-auth.js"></script>
        
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HW55YQG52X"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HW55YQG52X');
        </script>

        <!-- Facebook Pixel Code -->
        <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '320453662807605');
            fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=320453662807605&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Facebook Pixel Code -->

        <!-- Amplitude Code -->
        <script type="text/javascript">
            (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
            ;r.type="text/javascript"
            ;r.integrity="sha384-u0hlTAJ1tNefeBKwiBNwB4CkHZ1ck4ajx/pKmwWtc+IufKJiCQZ+WjJIi+7C6Ntm"
            ;r.crossOrigin="anonymous";r.async=true
            ;r.src="https://cdn.amplitude.com/libs/amplitude-8.1.0-min.gz.js"
            ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
            console.log("[Amplitude] Error: could not load SDK")}}
            ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
            ;function s(e,t){e.prototype[t]=function(){
            this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
            var o=function(){this._q=[];return this}
            ;var a=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove"]
            ;for(var c=0;c<a.length;c++){s(o,a[c])}n.Identify=o;var u=function(){this._q=[]
            ;return this}
            ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
            ;for(var p=0;p<l.length;p++){s(u,l[p])}n.Revenue=u
            ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
            ;function v(e){function t(t){e[t]=function(){
            e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
            for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
            e=(!e||e.length===0?"$default_instance":e).toLowerCase()
            ;if(!Object.prototype.hasOwnProperty.call(n._iq,e)){n._iq[e]={_q:[]};v(n._iq[e])
            }return n._iq[e]};e.amplitude=n})(window,document);
            amplitude.getInstance().init("25ba814d106f21a053cc3e08f9b58c28");
        </script>
        <!-- End Amplitude Code -->
        <script>
            let appVersion = "{{ config('app.version') }}";
        </script>
        @stack('styles')
    </head>
    <body>
        @auth
        <form id="logout-form" action="/logout" method="POST" style="display: none">
            {{ csrf_field() }}
        </form>
        @endauth
        @include('common.menu')
        @include('common.auth')
        <div class="main-content">
            @yield('content')
        </div>
        <!-- 문자 인증을 위한 recaptcha -->
        <div id="recaptcha-container"></div>

        <!-- Smartlog -->
        <script type="text/javascript"> 
            var hpt_info={'_account':'UHPT-19346', '_server': 'a23'};
        </script>
        <script language="javascript" src="//cdn.smlog.co.kr/core/smart.js" charset="utf-8"></script>
        <noscript><img src="//a23.smlog.co.kr/smart_bda.php?_account=19346" style="display:none;width:0;height:0;" border="0"/></noscript>
        <!-- End Smartlog -->
    </body>
</html>