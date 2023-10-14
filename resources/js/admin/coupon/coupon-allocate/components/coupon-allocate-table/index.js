import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import Checkbox from "@components/elements/Checkbox";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";

const CouponAllocateTable = ({ allocatedCoupons, onAllChecked, onChangeCheckboxStatus, allChecked }) => {
	return (
		<CouponListTable striped bordered hover className="mt-3">
			<thead>
				<tr>
					<th>
						<Checkbox checked={allChecked} onChange={onAllChecked} label="" />
					</th>
					<th>번호</th>
					<th>회원아이디</th>
					<th>쿠폰코드</th>
				</tr>
			</thead>
			<tbody>
				{allocatedCoupons &&
					allocatedCoupons.length > 0 &&
					allocatedCoupons.map((allocatedCoupon, idx) => {
						return (
							<tr key={idx}>
								<td>
									<Checkbox
										checked={allocatedCoupon.selected}
										onChange={value => {
											onChangeCheckboxStatus(value, idx);
										}}
										label=""
									/>
								</td>
								<td>{idx + 1}</td>
								<td>{allocatedCoupon.user_login}</td>
								<td>{allocatedCoupon.coupon_code}</td>
							</tr>
						);
					})}
			</tbody>
		</CouponListTable>
	);
};

const CouponListTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default CouponAllocateTable;
