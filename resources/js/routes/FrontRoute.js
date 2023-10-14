import React from "react";
import { Route } from "react-router-dom";

import FrontPage from "@components/pages/FrontPage";

import Curriculum from "../front/curriculum";
import DetailCurriculum from "../front/detail-curriculum";
import About from "../front/about";
import MyCodingSpace from "../front/myCodingSpace";
import Course from "../front/course";
import ChapterBase from "../front/course/chapter/chapter-base";
import ChapterViewType from "@constants/ChapterViewType";
import Cart from "../front/cart";
import Payment from "../front/payment";
import Faq from "../front/faq";
import SupportClass from "../front/support-class";

export default [
	<Route
		exact
		path="/"
		key="front"
		render={props => (
			<FrontPage title="디랩온 (주니어 온라인 코딩)">
				<Curriculum {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/about"
		key="about"
		render={props => (
			<FrontPage title="회사소개">
				<About {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/detail_curriculum"
		key="detail_curriculum"
		render={props => (
			<FrontPage title="커리큘럼">
				<DetailCurriculum {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/notice"
		key="faq"
		render={props => (
			<FrontPage title="공지사항" paddingBottom={6.25} paddingBottomMobile={3.75}>
				<Faq notice {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/faq"
		key="faq"
		render={props => (
			<FrontPage title="FAQ" paddingBottom={6.25} paddingBottomMobile={3.75}>
				<Faq {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/faq/:id"
		key="faq"
		render={props => (
			<FrontPage title="FAQ" paddingBottom={6.25} paddingBottomMobile={3.75}>
				<Faq {...props} faq_category_id={props.match.params.id} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/mycodingspace"
		key="mycodingspace"
		render={props => (
			<FrontPage title="나의 강의실">
				<MyCodingSpace {...props} />
			</FrontPage>
		)}
	/>,
	<Route
		exact
		path="/courses/:id"
		key="courses.id"
		render={props => {
			return (
				<FrontPage title="D.LAB ON" topBtnEnable>
					<Course {...props} course_id={props.match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/chapters"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - VOD 클래스">
					<ChapterBase {...props} view={ChapterViewType.CHAPTER_LIST} course_id={props.match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/chapters/:chapter_id"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - VOD 클래스">
					<ChapterBase
						{...props}
						view={ChapterViewType.CHAPTER}
						course_id={props.match.params.id}
						chapter_id={props.match.params.chapter_id}
					/>
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/chapters/:chapter_id/vods/:vod_id"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 동영상 강의">
					<ChapterBase
						{...props}
						view={ChapterViewType.CHAPTER_VOD}
						course_id={props.match.params.id}
						chapter_id={props.match.params.chapter_id}
						vod_id={props.match.params.vod_id}
					/>
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/chapters/:chapter_id/quiz"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 퀴즈">
					<ChapterBase
						{...props}
						view={ChapterViewType.CHAPTER_QUIZ}
						course_id={props.match.params.id}
						chapter_id={props.match.params.chapter_id}
					/>
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/chapters/:chapter_id/resources"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 참고자료 다운로드">
					<ChapterBase
						{...props}
						view={ChapterViewType.CHAPTER_RESOURCE}
						course_id={props.match.params.id}
						chapter_id={props.match.params.chapter_id}
					/>
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/statistics/quiz"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 퀴즈 통계">
					<ChapterBase {...props} view={ChapterViewType.STATISTICS_QUIZ} course_id={props.match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/posts"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 강좌 게시판">
					<ChapterBase {...props} view={ChapterViewType.POST_LIST} course_id={props.match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/posts/create"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 강좌 게시판">
					<ChapterBase {...props} view={ChapterViewType.POST_CREATE} course_id={props.match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/posts/:post_id"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 강좌 게시판">
					<ChapterBase
						{...props}
						view={ChapterViewType.POST}
						course_id={props.match.params.id}
						post_id={props.match.params.post_id}
					/>
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/courses/:id/posts/:post_id/edit"
		key="courses.id.chapter"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 강좌 게시판">
					<ChapterBase
						{...props}
						view={ChapterViewType.POST_CREATE}
						course_id={props.match.params.id}
						post_id={props.match.params.post_id}
					/>
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/cart"
		key="cart"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 장바구니" marginBottom0>
					<Cart {...props} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/payment"
		key="payment"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 결제하기">
					<Payment {...props} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/payment/:id/success"
		key="payment.id.success"
		render={props => {
			return (
				<FrontPage title="D.LAB ON - 결제 완료">
					<Payment {...props} payment_id={props.match.params.id} />
				</FrontPage>
			);
		}}
	/>,
	<Route
		exact
		path="/support_class"
		key="support_class"
		render={props => (
			<FrontPage title="보충수업 클래스">
				<SupportClass {...props} />
			</FrontPage>
		)}
	/>
];
