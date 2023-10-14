import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import AdminSearch from "@components/adminSearch";
import Button from "@components/elements/Button";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";
import AdminTablePagination from "../../../components/adminTablePagination";
import styled from "styled-components";
import CourseType from "@constants/CourseType";
import CourseClass from "@constants/CourseClass";
import FormControl from "@components/elements/FormControl";

const AdminCourseList = ({}) => {
	const history = useHistory();
	const [courses, setCourses] = useState([]);
	const [courseType, setCourseType] = useState("all");
	const [courseClass, setCourseClass] = useState("all");
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getCourses("", setCourses);
	}, []);

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text
		};
		if (courseType != "all") {
			query["filter[course_type]"] = courseType;
		}
		if (courseClass != "all") {
			query["filter[course_class]"] = courseClass;
		}
		ctrl.getCourses(query, setCourses);
	};

	const onClickCourseDesignChapter = courseId => {
		history.push({ pathname: `/admin/courses/${courseId}/design/chapter` });
	};

	const onClickCoursePostList = courseId => {
		history.push({ pathname: `/admin/courses/${courseId}/posts` });
	};

	const onClickCourseDescription = courseId => {
		history.push({ pathname: `/admin/courses/${courseId}/description` });
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			if (courseType != "all") {
				url += `&filter[course_type]=${courseType}`;
			}
			if (courseClass != "all") {
				url += `&filter[course_class]=${courseClass}`;
			}
			ctrl.getPaginationLink(url, setCourses);
		}
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={2}>
					<FormControl className="w-100 p-0 m-0" as="select" onChange={e => setCourseClass(e.target.value)}>
						<option value={"all"}>전체</option>
						<option value={CourseClass.SUPPORT}>{CourseClass.convertToString(CourseClass.SUPPORT)}</option>
						<option value={CourseClass.B2B}>{CourseClass.convertToString(CourseClass.B2B)}</option>
					</FormControl>
				</Col>
				<Col md={3}>
					<FormControl className="w-100 p-0 m-0" as="select" onChange={e => setCourseType(e.target.value)}>
						<option value={"all"}>전체</option>
						<option value={CourseType.REGULAR}>{CourseType.convertToString(CourseType.REGULAR)}</option>
						<option value={CourseType.ONEONONE}>{CourseType.convertToString(CourseType.ONEONONE)}</option>
						<option value={CourseType.PACKAGE}>{CourseType.convertToString(CourseType.PACKAGE)}</option>
						<option value={CourseType.VOD}>{CourseType.convertToString(CourseType.VOD)}</option>
					</FormControl>
				</Col>
				<Col md={5}>
					<AdminSearch placeholder="과목명,과목코드" onClick={onClickSearch} />
				</Col>
				<Col align="right">
					<Link to="/admin/courses/create">
						<Button primary size="large" className="w-100">
							과목추가
						</Button>
					</Link>
				</Col>
			</Row>

			<Row className="mt-20">
				<Col>
					<CourseTable striped bordered hover>
						<thead>
							<tr>
								<th>
									D.LAB ON
									<br />
									코드
								</th>
								<th width="20%">타입</th>
								<th width="20%">과목명</th>
								<th width="12%">
									가격
									<br />
									(할인적용가)
								</th>
								<th width="12%">가격</th>
								<th width="12%">할인가격</th>
								<th width="10%">엘리스 과목 ID</th>
								<th style={{ minWidth: "90px" }}>과목 설계</th>
								<th style={{ minWidth: "100px" }}>강좌 게시판</th>
								<th style={{ minWidth: "65px" }}>과목 상세</th>
							</tr>
						</thead>
						<tbody>
							{courses.data &&
								courses.data.map((course, _) => {
									return (
										<tr key={_}>
											<td>{course.dlab_course_code}</td>
											<td>{CourseType.convertToString(course.type)}</td>
											<td>
												<Link to={`/admin/courses/${course.id}/edit`}>
													<span className="text-primary" role="button">
														{course.name}
													</span>
												</Link>
											</td>
											<td>
												{course.price - course.discount_price === 0
													? "무료강의"
													: util.addNumberComma(course.price - course.discount_price) + "원"}
											</td>
											<td>
												{course.price === 0
													? "무료강의"
													: util.addNumberComma(course.price) + "원"}
											</td>
											<td>{util.addNumberComma(course.discount_price)}원</td>
											<td>{course.elice_course_id}</td>
											<td>
												{course.type === CourseType.VOD && (
													<CourseTableButton
														secondary
														onClick={() => onClickCourseDesignChapter(course.id)}
													>
														과목 설계
													</CourseTableButton>
												)}
											</td>
											<td>
												{course.type === CourseType.VOD && (
													<CourseTableButton
														secondary
														onClick={() => onClickCoursePostList(course.id)}
													>
														게시물 관리
													</CourseTableButton>
												)}
											</td>
											<td>
												{course.has_description ? (
													<CourseTableButton
														primary
														onClick={() => onClickCourseDescription(course.id)}
													>
														관리
													</CourseTableButton>
												) : (
													<CourseTableButton
														secondary
														onClick={() => onClickCourseDescription(course.id)}
													>
														관리
													</CourseTableButton>
												)}
											</td>
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
	font-size: 12px;
`;

const CourseTableButton = styled(Button)`
	font-size: 13px;
`;

export default AdminCourseList;
