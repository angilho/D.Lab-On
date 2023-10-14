import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import UserRole from "@constants/UserRole";
import * as api from "@common/api";

const UserSearchModal = ({ show, onHide, handleAdd }) => {
	const [userList, setUserList] = useState([]);

	const onClickSearch = keyword => {
		api.getUsers({
			"filter[search]": keyword
		})
			.then(response => {
				setUserList(response.data);
			})
			.catch(err => console.error(err));
	};

	const onClickPageItem = url => {
		if (url) {
			api.getPaginationLink(url)
				.then(response => {
					if (response.data) setUserList(response.data);
				})
				.catch(err => console.error(err));
		}
	};

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>회원 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col>
						<AdminSearch placeholder="회원명 검색" onClick={onClickSearch} />
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>회원유형</th>
									<th>이름</th>
									<th>전화번호</th>
									<th>선택</th>
								</tr>
							</thead>
							<tbody>
								{userList.data &&
									userList.data.map((user, idx) => {
										return (
											<tr key={idx}>
												<td>{UserRole[user.role] || ""}</td>
												<td>{user.name}</td>
												<td>{user.phone}</td>
												<td>
													<Button
														primary
														size="small"
														className="w-100"
														onClick={() => handleAdd(user)}
													>
														추가
													</Button>
												</td>
											</tr>
										);
									})}
							</tbody>
						</Table>
						<div className="mt-20">
							<AdminTablePagination
								links={userList.links}
								firstPageUrl={userList.first_page_url}
								lastPageUrl={userList.last_page_url}
								onChange={onClickPageItem}
							/>
						</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

export default UserSearchModal;
