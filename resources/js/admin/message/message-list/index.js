import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import Button from "@components/elements/Button";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminMessageList = ({}) => {
	const [messages, setMessages] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getMessages("", setMessages);
	}, []);

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		ctrl.getMessages(keyword, setMessages);
	};
	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&keyword=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setMessages);
		}
	};

	return (
		<React.Fragment>
			<Row className="mt-40 justify-content-end">
				<Col md={8}>
					<AdminSearch placeholder="SMS 제목, 작성자" onClick={onClickSearch} />
				</Col>
				<Col align="right">
					<Link to="/admin/messages/create">
						<Button primary size="large" className="w-100">
							SMS 작성
						</Button>
					</Link>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<MessageTable striped bordered hover>
						<thead>
							<tr>
								<th>번호</th>
								<th>SMS 제목</th>
								<th>보낸날짜</th>
								<th>작성자</th>
							</tr>
						</thead>
						<tbody>
							{messages.data &&
								messages.data.map((message, idx) => {
									return (
										<tr key={idx}>
											<td>{messages.from + idx}</td>
											<td>
												<Link to={`/admin/messages/${message.id}`}>{message.title}</Link>
											</td>
											<td>{util.getFormatDate(message.created_at)}</td>
											<td>{message.user.name}</td>
										</tr>
									);
								})}
						</tbody>
					</MessageTable>
					<div className="mt-20">
						<AdminTablePagination
							links={messages.links}
							firstPageUrl={messages.first_page_url}
							lastPageUrl={messages.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const MessageTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default AdminMessageList;
