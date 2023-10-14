import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import * as api from "@common/api";

const UserAddModal = ({ show, onHide, handleAdd }) => {
	const [userList, setUserList] = useState([]);

	const onClickSearch = text => {
		let query = {
			"filter[search]": text
		};
		api.getOrganizationUsers(query)
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
				<Modal.Title>B2B 회원 검색</Modal.Title>
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
									<th>기업명</th>
									<th>이름</th>
									<th>아이디</th>
									<th>선택</th>
								</tr>
							</thead>
							<tbody>
								{userList.data &&
									userList.data.map((user, idx) => {
										return (
											<tr key={idx}>
												<td>{user.organization.name}</td>
												<td>{user.name}</td>
												<td>{user.user_login}</td>
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

export default UserAddModal;
