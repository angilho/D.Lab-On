import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import CourseType from "@constants/CourseType";
import * as api from "@common/api";

const EnrollmentAddModal = ({ show, onHide, handleAdd }) => {
	const [courseList, setCourseList] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		if (show === false) {
			setCourseList([]);
		}
	}, [show]);

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		api.getCourses({
			"filter[search]": keyword,
			"filter[support_class]": true,
			"filter[course_type]": CourseType.VOD
		})
			.then(response => {
				setCourseList(response.data);
			})
			.catch(err => console.error(err));
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			url += `&filter[support_class]=true`;
			url += `&filter[course_type]=${CourseType.VOD}`;
			api.getPaginationLink(url)
				.then(response => {
					if (response.data) setCourseList(response.data);
				})
				.catch(err => console.error(err));
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>보충수업 과목 검색</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col>
						<AdminSearch placeholder="과목명, 코드 검색" onClick={onClickSearch} />
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<CourseTable striped bordered hover>
							<thead>
								<tr>
									<th>번호</th>
									<th>강의코드</th>
									<th>타입</th>
									<th>강의명</th>
									<th>차시</th>
									<th>선택</th>
								</tr>
							</thead>
							<tbody>
								{courseList.data &&
									courseList.data.map((course, idx) => {
										return (
											<tr key={idx}>
												<td>{idx + 1}</td>
												<td>{course.dlab_course_code}</td>
												<td>{CourseType.convertToString(course.type)}</td>
												<td>{course.name}</td>
												<td>{"VOD 클래스"}</td>
												<td>
													<AddButton
														primary
														size="small"
														className="w-100"
														onClick={() => handleAdd(course)}
													>
														추가
													</AddButton>
												</td>
											</tr>
										);
									})}
							</tbody>
						</CourseTable>
						<div className="mt-20">
							<AdminTablePagination
								links={courseList.links}
								firstPageUrl={courseList.first_page_url}
								lastPageUrl={courseList.last_page_url}
								onChange={onClickPageItem}
							/>
						</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

const CourseTable = styled(Table)`
	font-size: 12px;
`;

const AddButton = styled(Button)`
	font-size: 14px;
	height: 2rem;
`;

export default EnrollmentAddModal;
