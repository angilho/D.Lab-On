import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import AdminFilter from "@components/adminFilter";
import Button from "@components/elements/Button";

import PaymentStatus from "@constants/PaymentStatus";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

import PaymentStatusChangeModal from "../modal/PaymentStatusChangeModal";
import AdminTablePagination from "../../../components/adminTablePagination";

const AdminPaymentList = ({}) => {
	const history = useHistory();
	const [payments, setPayments] = useState([]);
	const [paymentStatus, setPaymentStatus] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalTargetPayment, setModalTargetPayment] = useState({});
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		if (!showModal) ctrl.getAllPayments("", setPayments);
	}, [showModal]);

	const onChangeFilter = index => {
		let query = "";
		if (index !== 0) {
			let status = Object.values(PaymentStatus)[index - 1];
			setPaymentStatus(status);
			query = {
				//맨 앞에 전체를 넣었으므로 전체를 제외한 나머지 인덱스로 role을 판별한다(운영자:0,회원:1,자녀:2)
				"filter[status]": status
			};
			if (filterKeyword) {
				query["filter[search]"] = filterKeyword;
			}
		} else {
			setPaymentStatus(null);
			if (filterKeyword) {
				query = {
					"filter[search]": filterKeyword
				};
			}
		}

		ctrl.getAllPayments(query, setPayments);
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text
		};
		if (paymentStatus) {
			query["filter[status]"] = paymentStatus;
		}
		ctrl.getAllPayments(query, setPayments);
	};

	const onClickPageItem = url => {
		if (url) {
			if (paymentStatus) {
				url += `&filter[status]=${paymentStatus}`;
			}
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setPayments);
		}
	};

	const onClickUpdatePaymentStatus = payment => {
		setModalTargetPayment(payment);
		setShowModal(true);
	};

	const onClickModalOk = (payment, status) => {
		payment.status = status;
		ctrl.updatePayment(payment.req_user_id, payment.id, payment, () => {
			setShowModal(false);
		});
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="이름, 아이디, 결제ID" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<AdminFilter
						filters={[
							"전체",
							...Object.keys(PaymentStatus).map(key => {
								return util.getPaymentStatusStr(PaymentStatus[key]);
							})
						]}
						onChange={onChangeFilter}
					/>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<PaymentTable striped bordered hover>
						<thead>
							<tr>
								<th style={{ minWidth: "100px" }}>이름</th>
								<th style={{ minWidth: "80px" }}>아이디</th>
								<th style={{ minWidth: "200px" }}>결제 상세 정보</th>
								<th style={{ minWidth: "100px" }}>결제 ID</th>
								<th style={{ minWidth: "80px" }}>결제 방법</th>
								<th style={{ minWidth: "80px" }}>금액</th>
								<th style={{ minWidth: "80px" }}>결제 상태</th>
								<th style={{ minWidth: "80px" }}></th>
							</tr>
						</thead>
						<tbody>
							{payments.data &&
								payments.data.map((payment, idx) => {
									let paymentDetails = [];
									payment.payment_item.forEach(paymentItem => {
										paymentDetails.push(
											`수강자: ${paymentItem.user.name} / ${paymentItem.course.name}`
										);
									});

									return (
										<tr key={idx}>
											<td>
												{payment.user ? `${payment.user.name}(${payment.user.user_login})` : ""}
											</td>
											<td>{payment.user ? payment.user.user_login : ""}</td>
											<td>
												{paymentDetails.length === 1 ? (
													<span>{paymentDetails[0]}</span>
												) : (
													paymentDetails.map((detail, idx) => {
														return (
															<span key={idx}>
																{detail}
																<br />
															</span>
														);
													})
												)}
											</td>

											<td>{payment.merchant_uid}</td>
											<td>{payment.method_str}</td>
											<td>{util.addNumberComma(payment.total_price)}원</td>
											<td style={{ width: "10.66%" }}>{payment.status_str}</td>
											<td style={{ width: "12.66%" }}>
												<Button
													primary
													size="small"
													className="w-100"
													onClick={() => onClickUpdatePaymentStatus(payment)}
												>
													상태 변경
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</PaymentTable>
					<div className="mt-20">
						<AdminTablePagination
							links={payments.links}
							firstPageUrl={payments.first_page_url}
							lastPageUrl={payments.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
			<PaymentStatusChangeModal
				show={showModal}
				onHide={() => setShowModal(false)}
				payment={modalTargetPayment}
				handleOk={onClickModalOk}
			/>
		</React.Fragment>
	);
};

const PaymentTable = styled(Table)`
	font-size: 13px;
	word-break: break-all;
`;

export default AdminPaymentList;
