import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import RoleType from "@constants/RoleType";
import styled from "styled-components";
import * as api from "@common/api";

const InstructorAddModal = ({ show, onHide, handleAdd }) => {
	const [instructors, setInstructors] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		api.getUsers({
			"filter[role]": `${RoleType.INSTRUCTOR}`,
			"filter[search]": keyword
		})
			.then(response => {
				setInstructors(response.data);
			})
			.catch(err => console.error(err));
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			url += `&filter[role]=${RoleType.INSTRUCTOR}`;
			api.getPaginationLink(url)
				.then(response => {
					if (response.data) setInstructors(response.data);
				})
				.catch(err => console.error(err));
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>강사 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col>
						<AdminSearch placeholder="회원명 검색" onClick={onClickSearch} />
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<InstructorTable striped bordered hover>
							<thead>
								<tr>
									<th>아이디</th>
									<th>강사명</th>
									<th>연락처</th>
									<th>이메일</th>
									<th>선택</th>
								</tr>
							</thead>
							<tbody>
								{instructors.data &&
									instructors.data.map((instructor, idx) => {
										return (
											<tr key={idx}>
												<td>{instructor.user_login}</td>
												<td>{instructor.name}</td>
												<td>{instructor.phone}</td>
												<td>{instructor.email}</td>
												<td>
													<AddButton
														primary
														size="small"
														className="w-100"
														onClick={() => handleAdd(instructor)}
													>
														추가
													</AddButton>
												</td>
											</tr>
										);
									})}
							</tbody>
						</InstructorTable>
						<div className="mt-20">
							<AdminTablePagination
								links={instructors.links}
								firstPageUrl={instructors.first_page_url}
								lastPageUrl={instructors.last_page_url}
								onChange={onClickPageItem}
							/>
						</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

const InstructorTable = styled(Table)`
	font-size: 12px;
`;

const AddButton = styled(Button)`
	font-size: 14px;
	height: 2rem;
`;

export default InstructorAddModal;
