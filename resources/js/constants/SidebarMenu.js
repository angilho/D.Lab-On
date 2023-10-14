const SidebarMenu = [
	{
		title: "계정",
		subMenu: [
			{ title: "가입 정보", link: "/mypage" },
			{ title: "비밀번호", link: "/mypage/password/edit" },
			{ title: "쿠폰정보", link: "/mypage/coupon" },
			{ title: "회원 탈퇴", link: "/mypage/user/delete" }
		]
	},
	{
		title: "자녀 정보",
		subMenu: [
			{ title: "자녀 정보", link: "/mypage/children", reload: true },
			{ title: "자녀 추가", link: "/mypage/child/create" }
		]
	},
	{
		title: "수강 내역",
		subMenu: [
			{ title: "수강 내역", link: "/mypage/enrollment" },
			{ title: "수강 종료 내역", link: "/mypage/enrollment/closed" },
			{ title: "수료증 발급", link: "/mypage/enrollment/certificate" },
			{ title: "보충수업 내역", link: "/mypage/support_class_enrollment", needCampus: true },
			{ title: "보충수업 종료 내역", link: "/mypage/support_class_enrollment/closed", needCampus: true }
		]
	},
	{
		title: "결제 내역",
		link: "/mypage/payment",
		subMenu: [{ title: "결제 내역", link: "/mypage/payment" }]
	}
];

const ChildSidebarMenu = [
	{
		title: "계정",
		subMenu: [
			{ title: "가입 정보", link: "/mypage" },
			{ title: "비밀번호", link: "/mypage/password/edit" },
			{ title: "쿠폰정보", link: "/mypage/coupon" },
			{ title: "회원 탈퇴", link: "/mypage/user/delete" }
		]
	},
	{
		// 자녀는 자녀 정보를 편집할 수 없기 때문에 메뉴에서 제거함. index 유지를 위해 빈 object는 남겨두었다.
	},
	{
		title: "수강 내역",
		subMenu: [
			{ title: "수강 내역", link: "/mypage/enrollment" },
			{ title: "수강 종료 내역", link: "/mypage/enrollment/closed" },
			{ title: "수료증 발급", link: "/mypage/enrollment/certificate" },
			{ title: "보충수업 내역", link: "/mypage/support_class_enrollment", needCampus: true },
			{ title: "보충수업 종료 내역", link: "/mypage/support_class_enrollment/closed", needCampus: true }
		]
	},
	{
		title: "결제 내역",
		link: "/mypage/payment",
		subMenu: [{ title: "결제 내역", link: "/mypage/payment" }]
	}
];

export { SidebarMenu, ChildSidebarMenu };
