import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import RoleType from "@constants/RoleType";
import CreateInstructorModal from "../modal/instructor-create";

import * as ctrl from "./index.ctrl";

const InstructorList = props => {
	const [instructors, setInstructors] = useState([]);
	const [showCreateInstructorModal, setShowCreateInstructorModal] = useState(false);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getInstructors("", setInstructors);
	}, []);

	const onClickPageItem = url => {
		if (url) {
			url += `&filter[role]=${RoleType.INSTRUCTOR}`;
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setInstructors);
		}
	};

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		ctrl.getInstructors(keyword, setInstructors);
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="이름, 아이디, 이메일, 전화번호 검색" onClick={onClickSearch} />
				</Col>
				<Col md={4} align="right">
					<Button primary size="large" className="w-100" onClick={() => setShowCreateInstructorModal(true)}>
						강사추가
					</Button>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					<InstructorTable striped bordered hover>
						<thead>
							<tr>
								<th>사원번호</th>
								<th>이름</th>
								<th>연락처</th>
								<th>이메일</th>
								<th>강의명</th>
							</tr>
						</thead>
						<tbody>
							{instructors.data &&
								instructors.data.map((instructor, _) => {
									return (
										<tr key={_}>
											<td>{instructor.instructor_metadata.employee_number}</td>
											<td>
												<Link to={`/admin/instructors/${instructor.id}`}>
													{instructor.name || "-"}
												</Link>
											</td>
											<td>{instructor.phone || "-"}</td>
											<td>{instructor.email || "-"}</td>
											<td>-</td>
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
			<CreateInstructorModal
				show={showCreateInstructorModal}
				onHide={() => setShowCreateInstructorModal(false)}
			/>
		</React.Fragment>
	);
};

const InstructorTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default InstructorList;
