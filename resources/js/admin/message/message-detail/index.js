import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Table } from "react-bootstrap";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminMessageDetail = ({ message_id }) => {
	const [message, setMessage] = useState({});

	useEffect(() => {
		ctrl.getMessage(message_id, setMessage);
	}, []);

	return (
		<div>
			<section className="mt-5">
				<h4>SMS 제목</h4>
				<MessageTitle>{message.title}</MessageTitle>
			</section>
			<section className="mt-5">
				<h4>SMS 내용</h4>
				<MessageDescription>{message.description}</MessageDescription>
			</section>
			<section className="mt-5">
				<h4>SMS 수신리스트</h4>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>번호</th>
							<th>수신번호</th>
							<th>보낸날짜</th>
						</tr>
					</thead>
					<tbody>
						{message.message_to &&
							message.message_to.split(",").map((to, idx) => {
								return (
									<tr key={idx}>
										<td>{idx + 1}</td>
										<td>{to}</td>
										<td>{util.getFormatDate(message.sent_at)}</td>
									</tr>
								);
							})}
					</tbody>
				</Table>
			</section>
			<section className="mt-5 d-flex justify-content-end">
				<Link to="/admin/messages" className="w-25">
					<Button primary size="large" className="w-100">
						확인
					</Button>
				</Link>
			</section>
		</div>
	);
};

const MessageTitle = styled(Text)`
	border: 1px solid gray;
	padding: 1rem;
`;

const MessageDescription = styled(Text)`
	border: 1px solid gray;
	padding: 1rem;
	white-space: pre-line;
`;

export default AdminMessageDetail;
