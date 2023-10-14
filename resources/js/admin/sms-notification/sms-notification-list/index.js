import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import Button from "@components/elements/Button";
import SmsNotificationType from "@constants/SmsNotificationType";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminSmsNotificationList = ({}) => {
	const [smsNotifications, setSmsNotifications] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getSmsNotifications("", setSmsNotifications);
	}, []);

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		ctrl.getSmsNotifications(keyword, setSmsNotifications);
	};
	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setSmsNotifications);
		}
	};

	return (
		<React.Fragment>
			<Row className="mt-40 justify-content-end">
				<Col md={8}>
					<AdminSearch placeholder="노티명, 등록자" onClick={onClickSearch} />
				</Col>
				<Col align="right">
					<Link to="/admin/sms_notifications/create">
						<Button primary size="large" className="w-100">
							SMS 노티추가
						</Button>
					</Link>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<SmsNotificationTable striped bordered hover>
						<thead>
							<tr>
								<th>번호</th>
								<th>노티타입</th>
								<th>노티명</th>
								<th>등록자</th>
								<th>등록일</th>
							</tr>
						</thead>
						<tbody>
							{smsNotifications.data &&
								smsNotifications.data.map((smsNotification, idx) => {
									return (
										<tr key={idx}>
											<td>{smsNotifications.from + idx}</td>
											<td>{SmsNotificationType.convertToString(smsNotification.type)}</td>
											<td>
												<Link to={`/admin/sms_notifications/${smsNotification.id}/edit`}>
													{smsNotification.name}
												</Link>
											</td>
											<td>{smsNotification.work_user.name}</td>
											<td>{util.getFormatDate(smsNotification.created_at)}</td>
										</tr>
									);
								})}
						</tbody>
					</SmsNotificationTable>
					<div className="mt-20">
						<AdminTablePagination
							links={smsNotifications.links}
							firstPageUrl={smsNotifications.first_page_url}
							lastPageUrl={smsNotifications.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const SmsNotificationTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default AdminSmsNotificationList;
