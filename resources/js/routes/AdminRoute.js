import React from "react";
import { Route } from "react-router-dom";

import AdminPage from "@components/pages/AdminPage";
import Dashboard from "../admin/dashboard";
import AdminUserList from "../admin/user/user-list";
import AdminUserDetail from "../admin/user/user-detail";
import AdminParentList from "../admin/user/parent-list";
import AdminCourseCreate from "../admin/course/course-create";
import AdminCourseList from "../admin/course/course-list";
import AdminCourseEnrollmentList from "../admin/course/course-enrollment-list";
import AdminCourseDesignChapter from "../admin/course/course-design-chapter";
import AdminCoursePostList from "../admin/course/course-post-list";
import AdminCoursePostCreate from "../admin/course/course-post-create";
import AdminCoursePost from "../admin/course/course-post";
import AdminCourseDescription from "../admin/course/course-description";
import AdminEnrollmentList from "../admin/enrollment/enrollment-list";
import AdminPaymentList from "../admin/payment/payment-list";
import AdminCouponList from "../admin/coupon/coupon-list";
import AdminCouponCreate from "../admin/coupon/coupon-create";
import AdminCouponAllocate from "../admin/coupon/coupon-allocate";
import AdminMessageList from "../admin/message/message-list";
import AdminMessageCreate from "../admin/message/message-create";
import AdminMessageDetail from "../admin/message/message-detail";
import AdminSupportList from "../admin/support/support-list";
import AdminNoticeCreate from "../admin/support/notice-create";
import AdminFaqCreate from "../admin/support/faq-create";
import AdminOrganizationList from "../admin/organization/organization-list";
import AdminOrganizationCreate from "../admin/organization/organization-create";
import AdminOrganizationUserList from "../admin/organization/organization-user-list";
import AdminOrganizationUserDetail from "../admin/organization/organization-user-detail";
import AdminOrganizationUserEdit from "../admin/organization/organization-user-edit";
import AdminOrganizationEnrollmentList from "../admin/organization/organization-enrollment-list";
import AdminOrganizationEnrollmentCreate from "../admin/organization/organization-enrollment-create";
import OrganizationPostList from "../front/organization/post/post-list";
import OrganizationPostCreate from "../front/organization/post/post-create";
import OrganizationPost from "../front/organization/post/post";
import AdminCarouselList from "../admin/carousel/carousel-list";
import AdminCurriculumList from "../admin/curriculum/curriculum-list";
import AdminCurriculumCreate from "../admin/curriculum/curriculum-create";
import AdminDetailCurriculumList from "../admin/detail-curriculum/detail-curriculum-list";
import AdminDetailCurriculumCreate from "../admin/detail-curriculum/detail-curriculum-create";
import AdminMenuPermissionList from "../admin/menu-permission/menu-permission-list";
import AdminMenuPermissionDetail from "../admin/menu-permission/menu-permission-detail";
import AdminInstructorList from "../admin/instructor/instructor-list";
import AdminInstructorDetail from "../admin/instructor/instructor-detail";
import AdminVodCoursePostList from "../admin/course/vod-course-post-list";
import AdminVodCoursePost from "../admin/course/vod-course-post";
import AdminSupportClassEnrollmentList from "../admin/support-class/support-class-enrollment-list";
import AdminSupportClassEnrollmentCreate from "../admin/support-class/support-class-enrollment-create";
import AdminSmsNotificationList from "../admin/sms-notification/sms-notification-list";
import AdminSmsNotificationCreate from "../admin/sms-notification/sms-notification-create";
import AdminAttendanceCourseList from "../admin/attendance/attendance-course-list";
import AdminAttendanceCreate from "../admin/attendance/attendance-create";
import AdminAttendanceCourseSectionList from "../admin/attendance/attendance-course-section-list";
import AdminAttendanceStudentList from "../admin/attendance/attendance-student-list";
import AdminVodProgressRate from "../admin/vod-progress-rate";

import UserEdit from "../front/mypage/components/UserEdit";

export default [
	<Route
		exact
		path="/admin/dashboard"
		key="admin.dashboard"
		render={() => {
			return (
				<AdminPage title="대시보드">
					<Dashboard />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses"
		key="admin.courses"
		render={() => {
			return (
				<AdminPage title="과목">
					<AdminCourseList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/enrollments"
		key="admin.courses.id.enrollments"
		render={({ match }) => {
			return (
				<AdminPage title="과목 수강 관리">
					<AdminCourseEnrollmentList course_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/create"
		key="admin.courses/create"
		render={() => {
			return (
				<AdminPage title="과목 생성">
					<AdminCourseCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/edit"
		key="admin.courses.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="과목 수정">
					<AdminCourseCreate id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/design/chapter"
		key="admin.courses.id.design.chapter"
		render={({ match }) => {
			return (
				<AdminPage title="과목 설계">
					<AdminCourseDesignChapter course_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/posts"
		key="admin.courses.id.posts"
		render={({ match }) => {
			return (
				<AdminPage title="강좌 게시판">
					<AdminCoursePostList course_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/posts/create"
		key="admin.courses.id.posts.create"
		render={({ match }) => {
			return (
				<AdminPage title="공지 등록">
					<AdminCoursePostCreate course_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/posts/:post_id"
		key="admin.courses.id.posts.post_id"
		render={({ match }) => {
			return (
				<AdminPage title="답변 입력">
					<AdminCoursePost course_id={match.params.id} post_id={match.params.post_id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/posts/:post_id/edit"
		key="admin.courses.id.posts.post_id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="공지 수정">
					<AdminCoursePostCreate course_id={match.params.id} post_id={match.params.post_id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/courses/:id/description"
		key="admin.courses.id.description"
		render={({ match }) => {
			return (
				<AdminPage title="상세 페이지 관리">
					<AdminCourseDescription course_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/users"
		key="admin.users"
		render={() => {
			return (
				<AdminPage title="관리자 회원관리">
					<AdminUserList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/users/:id"
		key="admin.users.id"
		render={({ match }) => {
			return (
				<AdminPage title="회원 정보">
					<AdminUserDetail id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/users/:id/edit"
		key="admin.users.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="회원 수정" backButton>
					<UserEdit admin={true} id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/parents"
		key="admin.parents"
		render={() => {
			return (
				<AdminPage title="학생/학부모 관리">
					<AdminParentList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/parents/:id"
		key="admin.parents.id"
		render={({ match }) => {
			return (
				<AdminPage title="회원 정보">
					<AdminUserDetail from={"parents"} id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/parents/:id/edit"
		key="admin.parents.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="회원 수정" backButton>
					<UserEdit admin={true} id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/enrollments"
		key="admin.enrollments"
		render={() => {
			return (
				<AdminPage title="수강 목록">
					<AdminEnrollmentList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/payments"
		key="admin.payments"
		render={() => {
			return (
				<AdminPage title="결제 목록">
					<AdminPaymentList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/coupons"
		key="admin.coupons"
		render={() => {
			return (
				<AdminPage title="쿠폰 관리">
					<AdminCouponList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/coupons/create"
		key="admin.coupons.create"
		render={() => {
			return (
				<AdminPage title="새 쿠폰 등록">
					<AdminCouponCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/coupons/allocate"
		key="admin.coupons.allocate"
		render={() => {
			return (
				<AdminPage title="쿠폰 지급">
					<AdminCouponAllocate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/messages"
		key="admin.messages"
		render={() => {
			return (
				<AdminPage title="SMS 관리">
					<AdminMessageList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/messages/create"
		key="admin.messages.create"
		render={() => {
			return (
				<AdminPage title="SMS 발송">
					<AdminMessageCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/messages/:id"
		key="admin.messages.id"
		render={({ match }) => {
			return (
				<AdminPage title="SMS 정보">
					<AdminMessageDetail message_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/supports"
		key="admin.supports"
		render={() => {
			return (
				<AdminPage title="고객센터 관리">
					<AdminSupportList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/notices/create"
		key="admin.notice.create"
		render={() => {
			return (
				<AdminPage title="공지사항 작성">
					<AdminNoticeCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/notices/:id"
		key="admin.notices.id"
		render={({ match }) => {
			return (
				<AdminPage title="공지사항 수정">
					<AdminNoticeCreate notice_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/faqs/create"
		key="admin.faqs.create"
		render={() => {
			return (
				<AdminPage title="FAQ 작성">
					<AdminFaqCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/faqs/:id"
		key="admin.faqs.id"
		render={({ match }) => {
			return (
				<AdminPage title="FAQ 수정">
					<AdminFaqCreate faq_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations"
		key="admin.organizations"
		render={() => {
			return (
				<AdminPage title="B2B 관리">
					<AdminOrganizationList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations/create"
		key="admin.organizations.create"
		render={() => {
			return (
				<AdminPage title="B2B 신규 등록">
					<AdminOrganizationCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations/:id/edit"
		key="admin.organizations.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="B2B 수정">
					<AdminOrganizationCreate organization_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organization_users"
		key="admin.organization_users"
		render={() => {
			return (
				<AdminPage title="B2B 회원 관리">
					<AdminOrganizationUserList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organization_users/:id"
		key="admin.organization_users.id"
		render={({ match }) => {
			return (
				<AdminPage title="B2B 회원 정보">
					<AdminOrganizationUserDetail user_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organization_users/:id/edit"
		key="admin.organization_users.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="회원 수정" backButton>
					<AdminOrganizationUserEdit user_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organization_enrollments"
		key="admin.organization_enrollments"
		render={() => {
			return (
				<AdminPage title="B2B 수강 관리">
					<AdminOrganizationEnrollmentList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organization_enrollments/create"
		key="admin.organization_enrollments.create"
		render={() => {
			return (
				<AdminPage title="B2B 수강 신청">
					<AdminOrganizationEnrollmentCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations/:id/posts"
		key="admin.organizations.id.posts"
		render={({ match }) => {
			return (
				<AdminPage title="B2B 게시판">
					<OrganizationPostList organization_id={match.params.id} admin />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations/:id/posts/create"
		key="admin.organizations.id.posts.create"
		render={({ match }) => {
			return (
				<AdminPage title="B2B 공지 등록">
					<OrganizationPostCreate organization_id={match.params.id} admin />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations/:id/posts/:post_id"
		key="admin.organizations.id.posts.post_id"
		render={({ match }) => {
			return (
				<AdminPage title="B2B 게시글">
					<OrganizationPost organization_id={match.params.id} post_id={match.params.post_id} admin />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/organizations/:id/posts/:post_id/edit"
		key="admin.organizations.id.posts.post_id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="B2B 게시글 수정">
					<OrganizationPostCreate organization_id={match.params.id} post_id={match.params.post_id} admin />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/carousels"
		key="admin.carousels"
		render={() => {
			return (
				<AdminPage title="메인페이지 관리">
					<AdminCarouselList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/curriculums"
		key="admin.curriculums"
		render={() => {
			return (
				<AdminPage title="메인페이지 카테고리">
					<AdminCurriculumList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/curriculums/create"
		key="admin.curriculums.create"
		render={() => {
			return (
				<AdminPage title="메인페이지 카테고리 신규 등록">
					<AdminCurriculumCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/curriculums/:id/edit"
		key="admin.curriculums.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="메인페이지 카테고리 수정">
					<AdminCurriculumCreate curriculum_category_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/detail_curriculums"
		key="admin.detail_curriculums"
		render={() => {
			return (
				<AdminPage title="커리큘럼 카테고리">
					<AdminDetailCurriculumList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/detail_curriculums/create"
		key="admin.detail_curriculums.create"
		render={() => {
			return (
				<AdminPage title="커리큘럼 카테고리 신규 등록">
					<AdminDetailCurriculumCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/detail_curriculums/:id/edit"
		key="admin.detail_curriculums.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="커리큘럼 카테고리 수정">
					<AdminDetailCurriculumCreate detail_curriculum_category_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/menu_permissions"
		key="admin.menu_permissions"
		render={() => {
			return (
				<AdminPage title="메뉴권한 관리">
					<AdminMenuPermissionList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/menu_permissions/:id"
		key="admin.menu_permissions.id"
		render={({ match }) => {
			return (
				<AdminPage title="메뉴권한 관리">
					<AdminMenuPermissionDetail menu_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/instructors"
		key="admin.instructors"
		render={() => {
			return (
				<AdminPage title="강사관리">
					<AdminInstructorList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/instructors/:id"
		key="admin.instructors.id"
		render={({ match }) => {
			return (
				<AdminPage title="강사 정보">
					<AdminInstructorDetail id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/instructors/:id/edit"
		key="admin.instructors.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="강사 수정" backButton>
					<UserEdit admin={true} id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/vod_course_posts"
		key="admin.vod_course_posts"
		render={() => {
			return (
				<AdminPage title="VOD 과목 게시판 관리">
					<AdminVodCoursePostList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/vod_course_posts/:post_id"
		key="admin.vod_course_posts.post_id"
		render={({ match }) => {
			return (
				<AdminPage title="VOD 과목 게시글">
					<AdminVodCoursePost post_id={match.params.post_id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/support_classes"
		key="admin.support_classes"
		render={() => {
			return (
				<AdminPage title="보충수업 관리">
					<AdminSupportClassEnrollmentList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/support_classes/create"
		key="admin.support_classes.create"
		render={() => {
			return (
				<AdminPage title="보충수업 수강신청">
					<AdminSupportClassEnrollmentCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/sms_notifications"
		key="admin.sms_notifications"
		render={() => {
			return (
				<AdminPage title="SMS 노티관리">
					<AdminSmsNotificationList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/sms_notifications/create"
		key="admin.sms_notifications.create"
		render={() => {
			return (
				<AdminPage title="노티 등록">
					<AdminSmsNotificationCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/sms_notifications/:id/edit"
		key="admin.sms_notifications.id.edit"
		render={({ match }) => {
			return (
				<AdminPage title="노티 수정">
					<AdminSmsNotificationCreate sms_notification_id={match.params.id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/attendances"
		key="admin.attendances"
		render={() => {
			return (
				<AdminPage title="출결관리">
					<AdminAttendanceCourseList />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/attendances/create"
		key="admin.attendances.create"
		render={() => {
			return (
				<AdminPage title="출결등록">
					<AdminAttendanceCreate />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/attendances/:attendance_course_id"
		key="admin.attendances.attendance_course_id"
		render={({ match }) => {
			return (
				<AdminPage title="출결차시선택">
					<AdminAttendanceCourseSectionList attendanceCourseId={match.params.attendance_course_id} />
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/attendances/:attendance_course_id/sections/:attendance_section_id"
		key="admin.attendances.attendance_course_id.sections.attendance_section_id"
		render={({ match }) => {
			return (
				<AdminPage title="출결체크">
					<AdminAttendanceStudentList
						attendanceCourseId={match.params.attendance_course_id}
						attendanceSectionId={match.params.attendance_section_id}
					/>
				</AdminPage>
			);
		}}
	/>,
	<Route
		exact
		path="/admin/vod_progress_rate"
		key="admin.vod_progress_rate"
		render={() => {
			return (
				<AdminPage title="VOD 클래스 진도율 확인">
					<AdminVodProgressRate />
				</AdminPage>
			);
		}}
	/>
];
