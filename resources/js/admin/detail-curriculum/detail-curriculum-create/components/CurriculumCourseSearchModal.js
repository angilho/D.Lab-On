import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import * as api from "@common/api";

const CurriculumCourseSearchModal = ({ show, onHide, handleAdd }) => {
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
		<Modal show={show} onHide={onHide} size="lg">
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
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>과목명</th>
									<th>과목코드</th>
									<th>선택</th>
								</tr>
							</thead>
							<tbody>
								{courseList.data &&
									courseList.data.map((course, idx) => {
										return (
											<tr key={idx}>
												<td>{course.name}</td>
												<td>{course.dlab_course_code}</td>
												<td>
													<Button
														primary
														size="small"
														className="w-100"
														onClick={() => handleAdd(course)}
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

export default CurriculumCourseSearchModal;
