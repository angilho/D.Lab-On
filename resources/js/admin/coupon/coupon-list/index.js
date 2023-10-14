import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import AdminTablePagination from "@components/adminTablePagination";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import CouponType from "@constants/CouponType";
import CourseType from "@constants/CourseType";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminCouponList = ({}) => {
	const history = useHistory();
	const [coupons, setCoupons] = useState([]);
	const [allChecked, setAllChecked] = useState(false);

	useEffect(() => {
		ctrl.getAllCoupons(callbackGetCoupons);
	}, []);

	const callbackGetCoupons = result => {
		setCoupons({
			...result,
			data: result.data.map(e => {
				e.selected = false;
				return e;
			})
		});
		setAllChecked(false);
	};

	const onAllChecked = () => {
		if (allChecked) {
			setAllChecked(false);
		} else {
			setAllChecked(true);
		}

		let checkedCoupons = coupons.data.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setCoupons({ ...coupons, data: checkedCoupons });
	};

	const getCouponTypeStr = type => {
		switch (type) {
			case CouponType.PERCENT_DISCOUNT:
				return "할인권(%)";
			case CouponType.VALUE_DISCOUNT:
				return "금액권";
		}
		return type;
	};

	const getCouponCourseTypeStr = couponCourseType => {
		// 모든 강좌에 사용 가능한 쿠폰
		if (couponCourseType.split(",").length === 4) {
			return "전체";
		}

		let result = couponCourseType
			.replaceAll(",", "\n")
			.replaceAll(CourseType.REGULAR, CourseType.convertToString(CourseType.REGULAR))
			.replaceAll(CourseType.ONEONONE, CourseType.convertToString(CourseType.ONEONONE))
			.replaceAll(CourseType.PACKAGE, CourseType.convertToString(CourseType.PACKAGE))
			.replaceAll(CourseType.VOD, CourseType.convertToString(CourseType.VOD));

		return result;
	};

	const onClickPageItem = url => {
		if (url) ctrl.getPaginationLink(url, callbackGetCoupons);
	};

	const onDeleteCoupons = () => {
		let deletedCouponIds = coupons.data.filter(e => e.selected).map(e => e.id);
		if (deletedCouponIds.length === 0) {
			alert("선택한 쿠폰이 없습니다.");
			return;
		}

		if (!confirm("선택한 쿠폰을 삭제하시겠습니까?")) {
			return;
		}

		ctrl.deleteCoupons(deletedCouponIds, () => {
			ctrl.getAllCoupons(callbackGetCoupons);
		});
	};

	return (
		<React.Fragment>
			<Row className="mt-40 justify-content-end">
				<Col className="col-auto">
					<Link to="/admin/coupons/allocate">
						<Button primary>쿠폰지급</Button>
					</Link>
					<Link to="/admin/coupons/create" className="ml-16">
						<Button primary>쿠폰 생성하기</Button>
					</Link>
					<Button primary className="ml-16" onClick={ctrl.handleExport}>
						목록 다운로드
					</Button>
					<Button primary className="ml-16" onClick={ctrl.handleExportUsage}>
						쿠폰사용내역
					</Button>
					<Button danger className="ml-16" onClick={onDeleteCoupons}>
						선택 삭제
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<CouponTable striped bordered hover>
						<thead>
							<tr>
								<th>
									<Checkbox checked={allChecked} onChange={onAllChecked} label="" />
								</th>
								<th>ID</th>
								<th>쿠폰제목</th>
								<th>발급번호</th>
								<th style={{ minWidth: "80px" }}>쿠폰유형</th>
								<th>할인금액</th>
								<th style={{ width: "75px" }}>사용대상</th>
								<th>발급일</th>
								<th>만료일</th>
								<th>사용일</th>
							</tr>
						</thead>
						<tbody>
							{coupons.data &&
								coupons.data.map((coupon, idx) => {
									return (
										<tr key={idx}>
											<td>
												<Checkbox
													checked={coupon.selected}
													onChange={value => {
														let changedCoupons = coupons.data.map(e => {
															if (e.id === coupon.id) {
																e.selected = value;
															}
															return e;
														});
														setCoupons({
															...coupons,
															data: changedCoupons
														});
													}}
													label=""
												/>
											</td>
											<td>{coupon.id}</td>
											<td>{coupon.name}</td>
											<td>{coupon.code}</td>
											<td>{getCouponTypeStr(coupon.type)}</td>
											<td>{util.getCouponValueStr(coupon)}</td>
											<td>{getCouponCourseTypeStr(coupon.course_type)}</td>
											<td>{util.getFormatDate(coupon.created_at)}</td>
											<td>{util.getFormatDate(coupon.end_at)}</td>
											<td>{coupon.used_at ? util.getFormatDate(coupon.used_at) : "-"}</td>
										</tr>
									);
								})}
						</tbody>
					</CouponTable>
					<div className="mt-20">
						<AdminTablePagination
							links={coupons.links}
							firstPageUrl={coupons.first_page_url}
							lastPageUrl={coupons.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const CouponTable = styled(Table)`
	font-size: 13px;
`;

export default AdminCouponList;
