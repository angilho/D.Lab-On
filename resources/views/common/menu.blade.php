<script>
var menus = [
    {
        title: '커리큘럼',
        url: '/detail_curriculum',
    },
    {
        title: '나의 강의실',
        url: '/mycodingspace',
        needAuth: true,
    },
    {
        title: "고객센터",
        url: "/notice",
    },
    {
        title: "회사소개",
        url: "/about",
    },
    {
        title: "보충수업 클래스",
        url: "/support_class",
        needCampus: true,
    },
    {
        title: '나의 강의실',
        url: '/mycodingspace',
        needOrganization: true,
    },
    {
        title: "게시판",
        url: "/organizations/[ORG_ID]/posts",
        needOrganization: true
    },
];

var adminSideMenus = [
    {
        title: '관리자 홈',
        url: '/admin/dashboard',
        exact: true
    },
    {
        title: '수강현황 관리',
        url: '/admin/enrollments'
    },
    {
        title: '회원 관리',
        url: '/admin/users'
    },
    {
        title: '과목 관리',
        url: '/admin/courses'
    }
];
</script>