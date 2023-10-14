import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import CreateUserModal from "../modal/user-create";
import UserRole from "@constants/UserRole";
import Campus from "@constants/Campus";
import RoleType from "@constants/RoleType";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const ParentList = () => {
	const [users, setUsers] = useState([]);
	const [filterRole, setFilterRole] = useState(-1);
	const [filterCampus, setFilterCampus] = useState(-1);
	const [filterKeyword, setFilterKeyword] = useState("");
	const [showCreateUserModal, setShowCreateUserModal] = useState(false);

	useEffect(() => {
		ctrl.getUsers(-1, -1, "", setUsers);
	}, []);

	const onClickPageItem = url => {
		if (url) {
			if (filterRole == -1) {
				url += `&filter[role]=${RoleType.MEMBER},${RoleType.CHILD}`;
			} else {
				url += `&filter[role]=${filterRole}`;
			}
			if (filterCampus != -1) {
				url += `&filter[campus]=${filterCampus}`;
			}
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setUsers);
		}
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		ctrl.getUsers(filterRole, filterCampus, text, setUsers);
	};

	const onClickExport = () => {
		ctrl.handleExport(filterRole, filterCampus, filterKeyword);
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={2}>
					<FormControl
						className="w-100 p-0 m-0"
						as="select"
						name="role"
						value={filterRole}
						onChange={event => setFilterRole(event.currentTarget.value)}
					>
						<option value={-1}>전체</option>
						<option value={RoleType.MEMBER}>회원</option>
						<option value={RoleType.CHILD}>자녀</option>
					</FormControl>
				</Col>
				<Col md={3}>
					<FormControl
						className="w-100 p-0 m-0"
						as="select"
						name="campus"
						value={filterCampus}
						onChange={event => setFilterCampus(event.currentTarget.value)}
					>
						<option value={-1}>전체</option>
						{Campus.allCampus()
							.filter(c => c !== 0)
							.map((value, idx) => {
								return (
									<option key={idx} value={value}>
										{Campus.convertToString(value)}
									</option>
								);
							})}
					</FormControl>
				</Col>
				<Col md={6}>
					<AdminSearch placeholder="이름, 아이디, 이메일, 전화번호 검색" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col md={3} align="left">
					<Button primary className="w-100" onClick={() => setShowCreateUserModal(true)}>
						회원추가
					</Button>
				</Col>
				<Col align="right">
					<Button primary className="float-right" onClick={onClickExport}>
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
								<th>가입일</th>
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
												<Link to={`/admin/parents/${user.id}`}>{user.user_login || "-"}</Link>
											</td>
											<td>{user.email || "-"}</td>
											<td>{user.phone || "-"}</td>
											<td>{util.getFormatDate(user.created_at)}</td>
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
			<CreateUserModal
				show={showCreateUserModal}
				onHide={() => setShowCreateUserModal(false)}
				callback_url="/admin/parents"
			/>
		</React.Fragment>
	);
};

const UserTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default ParentList;
