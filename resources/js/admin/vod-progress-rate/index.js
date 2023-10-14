import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import AdminSearch from "@components/adminSearch";
import Button from "@components/elements/Button";
import CourseType from "../../constants/CourseType";
import AdminTablePagination from "../../components/adminTablePagination";
import * as ctrl from "./index.ctrl";
import styled from "styled-components";

const AdminVodProgressRate = ({}) => {
	const [courses, setCourses] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		onClickSearch("");
	}, []);

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text,
			"filter[course_type]": CourseType.VOD
		};
		ctrl.getCourses(query, setCourses);
	};

	const onClickPageItem = url => {
		if (url) {
			url += `&filter[course_type]=${CourseType.VOD}`;
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setCourses);
		}
	};

	const onClickDownloadVodCourseProgress = courseId => {
		window.location.href = `/admin/export/vod_progress_rate/${courseId}`;
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={10}>
					<AdminSearch placeholder="과목명,과목코드" onClick={onClickSearch} />
				</Col>
			</Row>

			<Row className="mt-20">
				<Col>
					<CourseTable striped bordered hover>
						<thead>
							<tr>
								<th>과목코드</th>
								<th width="70%">과목명</th>
								<ActionContainer>액션</ActionContainer>
							</tr>
						</thead>
						<tbody>
							{courses.data &&
								courses.data.map((course, _) => {
									return (
										<tr key={_}>
											<td>{course.dlab_course_code}</td>
											<td>{course.name}</td>
											<BtnContainer>
												<CourseTableButton
													secondary
													onClick={() => onClickDownloadVodCourseProgress(course.id)}
												>
													통계
												</CourseTableButton>
											</BtnContainer>
										</tr>
									);
								})}
						</tbody>
					</CourseTable>
					<div className="mt-20">
						<AdminTablePagination
							links={courses.links}
							firstPageUrl={courses.first_page_url}
							lastPageUrl={courses.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const CourseTable = styled(Table)`
	font-size: 13px;
`;

const CourseTableButton = styled(Button)`
	font-size: 13px;
`;

const BtnContainer = styled.td`
	text-align: center;
`;

const ActionContainer = styled.th`
	text-align: center;
	min-width: 70px;
`;

export default AdminVodProgressRate;
