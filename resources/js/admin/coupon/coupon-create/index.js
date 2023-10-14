import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Tabs, Tab, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import CouponCategory from "@constants/CouponCategory";
import CouponType from "@constants/CouponType";
import CourseType from "@constants/CourseType";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import * as ctrl from "./index.ctrl";

const AdminCouponCreate = () => {
	const history = useHistory();
	const [coupon, setCoupon] = useState(ctrl.getDefaultCoupon());

	const renderOneTimeCouponCreate = () => {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<FormLabel required>쿠폰 제목</FormLabel>
						<FormControl
							type="text"
							placeholder="쿠폰 제목"
							value={coupon.name}
							onChange={event => setCoupon({ ...coupon, name: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰 종류</FormLabel>
						<Form.Check
							inline
							label="금액권"
							type="radio"
							id="coupon-type-value"
							onChange={() => setCoupon({ ...coupon, type: CouponType.VALUE_DISCOUNT })}
							checked={coupon.type == CouponType.VALUE_DISCOUNT}
						/>
						<Form.Check
							inline
							label="할인권"
							type="radio"
							id="coupon-type-percent"
							onChange={() => setCoupon({ ...coupon, type: CouponType.PERCENT_DISCOUNT })}
							checked={coupon.type == CouponType.PERCENT_DISCOUNT}
						/>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<FormLabel required>할인 금액 / %</FormLabel>
						<FormControl
							type="text"
							placeholder="할인 금액/%"
							value={coupon.value ?? ""}
							onChange={event => setCoupon({ ...coupon, value: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰사용 강좌 타입</FormLabel>
						<div className="d-flex">
							{[CourseType.REGULAR, CourseType.ONEONONE, CourseType.PACKAGE, CourseType.VOD].map(
								(courseType, _) => {
									return (
										<Checkbox
											key={_}
											className={_ !== 0 && "ml-10"}
											checked={coupon.course_type_list.includes(courseType)}
											onChange={value => {
												let courseTypeList = coupon.course_type_list;
												if (value) {
													courseTypeList.push(courseType);
												} else {
													courseTypeList = coupon.course_type_list.filter(
														courseTypeInList => courseTypeInList !== courseType
													);
												}
												setCoupon({ ...coupon, course_type_list: courseTypeList });
											}}
											label={CourseType.convertToString(courseType)}
										/>
									);
								}
							)}
						</div>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<FormLabel required>발급 매수</FormLabel>
						<FormControl
							type="text"
							placeholder="건"
							value={coupon.count ?? ""}
							onChange={event => setCoupon({ ...coupon, count: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰 유효기간</FormLabel>
						<StyledDatePicker
							selected={coupon.end_at_date}
							onChange={date => {
								let endDate = new Date(date);
								endDate.setHours(23);
								endDate.setMinutes(59);
								endDate.setSeconds(59);
								setCoupon({
									...coupon,
									end_at: endDate.toISOString(),
									end_at_date: date
								});
							}}
							dateFormat="yyyy-MM-dd"
						/>
					</Col>
				</Row>
				<Row className="mt-5 mb-5 align-self-center">
					<Col md={3}>
						<Button
							primary
							size="large"
							className="w-100"
							onClick={() =>
								ctrl.handleCreate(coupon, () => history.push({ pathname: "/admin/coupons" }))
							}
						>
							자동 생성하기
						</Button>
					</Col>
					<Col md={3}>
						<Link to={"/admin/coupons"}>
							<Button secondary size="large" className="w-100">
								취소
							</Button>
						</Link>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	const renderMultipleTimeCouponCreate = () => {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<FormLabel required>쿠폰 제목</FormLabel>
						<FormControl
							type="text"
							placeholder="쿠폰 제목"
							value={coupon.name}
							onChange={event => setCoupon({ ...coupon, name: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰 종류</FormLabel>
						<Form.Check
							inline
							label="금액권"
							type="radio"
							id="coupon-type-value"
							onChange={() => setCoupon({ ...coupon, type: CouponType.VALUE_DISCOUNT })}
							checked={coupon.type == CouponType.VALUE_DISCOUNT}
						/>
						<Form.Check
							inline
							label="할인권"
							type="radio"
							id="coupon-type-percent"
							onChange={() => setCoupon({ ...coupon, type: CouponType.PERCENT_DISCOUNT })}
							checked={coupon.type == CouponType.PERCENT_DISCOUNT}
						/>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<FormLabel required>할인 금액 / %</FormLabel>
						<FormControl
							type="text"
							placeholder="할인 금액/%"
							value={coupon.value ?? ""}
							onChange={event => setCoupon({ ...coupon, value: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰 코드</FormLabel>
						<FormControl
							type="text"
							placeholder="쿠폰코드"
							value={coupon.code}
							onChange={event => setCoupon({ ...coupon, code: event.currentTarget.value.toUpperCase() })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰사용 강좌 타입</FormLabel>
						<div className="d-flex">
							{[CourseType.REGULAR, CourseType.ONEONONE, CourseType.PACKAGE, CourseType.VOD].map(
								(courseType, _) => {
									return (
										<Checkbox
											key={_}
											className={_ !== 0 && "ml-10"}
											checked={coupon.course_type_list.includes(courseType)}
											onChange={value => {
												let courseTypeList = coupon.course_type_list;
												if (value) {
													courseTypeList.push(courseType);
												} else {
													courseTypeList = coupon.course_type_list.filter(
														courseTypeInList => courseTypeInList !== courseType
													);
												}
												setCoupon({ ...coupon, course_type_list: courseTypeList });
											}}
											label={CourseType.convertToString(courseType)}
										/>
									);
								}
							)}
						</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>쿠폰 유효기간</FormLabel>
						<StyledDatePicker
							selected={coupon.end_at_date}
							onChange={date => {
								let endDate = new Date(date);
								endDate.setHours(23);
								endDate.setMinutes(59);
								endDate.setSeconds(59);
								setCoupon({
									...coupon,
									end_at: endDate.toISOString(),
									end_at_date: date
								});
							}}
							dateFormat="yyyy-MM-dd"
						/>
					</Col>
				</Row>
				<Row className="mt-5 mb-5 align-self-center">
					<Col md={2}>
						<Button
							primary
							size="large"
							className="w-100"
							onClick={() =>
								ctrl.handleCreate(coupon, () => history.push({ pathname: "/admin/coupons" }))
							}
						>
							생성하기
						</Button>
					</Col>
					<Col md={2}>
						<Link to={"/admin/coupons"}>
							<Button secondary size="large" className="w-100">
								취소
							</Button>
						</Link>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<Tabs
			activeKey={coupon.category}
			className="mt-3 mb-3"
			onSelect={k => setCoupon({ ...coupon, code: "", category: k })}
		>
			<Tab eventKey={CouponCategory.ONE_TIME} title="일회성 쿠폰">
				{renderOneTimeCouponCreate()}
			</Tab>
			<Tab eventKey={CouponCategory.MULTIPLE_TIME} title="다회성 쿠폰">
				{renderMultipleTimeCouponCreate()}
			</Tab>
		</Tabs>
	);
};

const StyledDatePicker = styled(DatePicker)`
	border: 0.063rem solid #e1e1e1;
	padding: 1px 2px 1px 2px;
	text-indent: 1rem;
	border-radius: 0.25rem;
	width: 23.75rem;
	height: 3rem;
`;

export default AdminCouponCreate;
