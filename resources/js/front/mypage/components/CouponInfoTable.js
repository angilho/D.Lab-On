import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import * as ctrl from "./CouponInfoTable.ctrl";
import * as util from "@common/util";

const CouponInfoTable = ({ user_id }) => {
	const history = useHistory();
	const [couponList, setCouponList] = useState([]);
	useEffect(() => {
		if (!user_id) history.goBack();

		ctrl.getUserCoupons(user_id, setUserCouponList);
	}, []);
	const setUserCouponList = data => {
		setCouponList(data);
	};
	const checkCouponValidate = end_at => {
		const end_date = new Date(end_at);
		const now_date = new Date();
		if (end_date < now_date) {
			return "(만료)";
		}
		return "";
	};
	return (
		<CouponListTable striped bordered hover className="mt-3">
			<thead>
				<tr>
					<th>번호</th>
					<th>발행일</th>
					<th>쿠폰명(코드)</th>
					<th>할인율(액)</th>
					<th>유효기간</th>
					<th>사용여부</th>
				</tr>
			</thead>
			<tbody>
				{couponList &&
					couponList.map((data, idx) => {
						var coupon = data.coupon;
						return (
							<tr key={idx}>
								<td>{idx + 1}</td>
								<td>{util.getFormatDate(coupon.created_at)}</td>
								<td>{coupon.name}</td>
								<td>{util.getCouponValueStr(coupon)}</td>
								<td>
									{util.getFormatDate(coupon.end_at)}
									{checkCouponValidate(coupon.end_at)}
								</td>
								<td>{coupon.used ? "사용함" : "-"}</td>
							</tr>
						);
					})}
			</tbody>
		</CouponListTable>
	);
};

const CouponListTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
	text-align: center;
`;

export default CouponInfoTable;
