import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import AdminFilter from "@components/adminFilter";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import RoleType from "@constants/RoleType";
import CreateUserModal from "../modal/user-create";
import UserRole from "../../../constants/UserRole";

import * as ctrl from "./index.ctrl";

const UserList = props => {
	const [users, setUsers] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");
	const [showCreateUserModal, setShowCreateUserModal] = useState(false);

	useEffect(() => {
		ctrl.getUsers("", setUsers);
	}, []);

	const onClickPageItem = url => {
		if (url) {
			url += `&filter[role]=${RoleType.ADMIN}`;
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setUsers);
		}
	};

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		ctrl.getUsers(keyword, setUsers);
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="이름, 아이디, 이메일, 전화번호 검색" onClick={onClickSearch} />
				</Col>
				<Col md={4} align="right">
					<Button primary size="large" className="w-100" onClick={() => setShowCreateUserModal(true)}>
						회원추가
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col align="right">
					<Button primary className="float-right" onClick={() => ctrl.handleExport(filterKeyword)}>
						목록 다운로드
					</Button>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					<UserTable striped bordered hover>
						<thead>
							<tr>
								<th>회원 유형</th>
								<th>이름</th>
								<th>아이디</th>
								<th>이메일</th>
								<th>전화번호</th>
								<th>주소</th>
							</tr>
						</thead>
						<tbody>
							{users.data &&
								users.data.map((user, _) => {
									return (
										<tr key={_}>
											<td>{UserRole[user.role] || ""}</td>
											<td>{user.name || "-"}</td>
											<td>
												<Link to={`/admin/users/${user.id}`}>{user.user_login || "-"}</Link>
											</td>
											<td>{user.email || "-"}</td>
											<td>{user.phone || "-"}</td>
											<td>{`${user.address}, ${user.address_detail}`}</td>
										</tr>
									);
								})}
						</tbody>
					</UserTable>
					<div className="mt-20">
						<AdminTablePagination
							links={users.links}
							firstPageUrl={users.first_page_url}
							lastPageUrl={users.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
			<CreateUserModal show={showCreateUserModal} onHide={() => setShowCreateUserModal(false)} />
		</React.Fragment>
	);
};

const UserTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default UserList;
