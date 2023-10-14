import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import CourseType from "@constants/CourseType";
import * as api from "@common/api";
import * as util from "@common/util";

const EnrollmentAddModal = ({ show, onHide, handleAdd }) => {
	const [courseList, setCourseList] = useState([]);

	useEffect(() => {
		if (show === false) {
			setCourseList([]);
		}
	}, [show]);

	const onClickSearch = keyword => {
		api.getCourses({
			"filter[search]": keyword
		})
			.then(response => {
				setCourseList(response.data);
			})
			.catch(err => console.error(err));
	};

	const onClickPageItem = url => {
		if (url) {
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
				<Modal.Title>과목 검색</Modal.Title>
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
									<th>타입</th>
									<th>과목ID</th>
									<th>과목명</th>
									<th>차수ID</th>
									<th>시작일</th>
									<th>종료일</th>
									<th>시간정보</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{courseList.data &&
									courseList.data.map((course, idx) => {
										return course.sections.map((section, sectionIdx) => {
											let isRegularCourse = course.type === CourseType.REGULAR;
											let time = !isRegularCourse
												? "시간 협의"
												: `${util.pad(section.start_hour)}:${util.pad(
														section.start_minute
												  )} ~ ${util.pad(section.end_hour)}:${util.pad(section.end_minute)}`;

											return (
												<tr key={sectionIdx}>
													<td>{CourseType.convertToString(course.type)}</td>
													<td>{course.dlab_course_code}</td>
													<td>{course.name}</td>
													<td>{section.id}</td>
													<td>{util.convertDateTimeStr(section.start_at || "")}</td>
													<td>{util.convertDateTimeStr(section.end_at || "")}</td>
													<td>{time}</td>
													<td>
														<AddButton
															primary
															size="small"
															className="w-100"
															onClick={() => handleAdd(course, section)}
														>
															추가
														</AddButton>
													</td>
												</tr>
											);
										});
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
	font-size: 14px;
`;

const AddButton = styled(Button)`
	font-size: 14px;
	height: 2rem;
`;

export default EnrollmentAddModal;
