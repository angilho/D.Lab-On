import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Table } from "react-bootstrap";
import AdminFilter from "@components/adminFilter";
import AdminSearch from "@components/adminSearch";
import Button from "@components/elements/Button";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";
import AdminTablePagination from "../../../components/adminTablePagination";

const AdminEnrollmentList = ({}) => {
	const history = useHistory();
	const [enrollments, setEnrollments] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getEnrollments("", callbackGetEnrollments);
	}, []);

	const callbackGetEnrollments = dataWithPaginate => {
		setEnrollments(dataWithPaginate);
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[user.name]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, callbackGetEnrollments);
		}
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[user.name]": text
		};
		ctrl.getEnrollments(query, callbackGetEnrollments);
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="수강생 이름" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>{/* <AdminFilter filters={["전체"]} onChange={onChangeFilter} /> */}</Col>
				<Col align="right">
					<Button primary onClick={() => ctrl.handleExport()}>
						목록 다운로드
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>신청일</th>
								<th>수강생</th>
								<th>이메일</th>
								<th>전화번호</th>
								<th>학교</th>
								<th>학년</th>
								<th>과목명</th>
							</tr>
						</thead>
						<tbody>
							{enrollments.data &&
								enrollments.data.length > 0 &&
								enrollments.data.map((enrollment, _) => {
									let userName = "-";
									let phone = "-";
									let school = "일반";
									let grade = "일반";
									let courseName = "-";
									let email = "";
									if (enrollment.user) {
										if (enrollment.user.user_metadata) {
											school = enrollment.user.user_metadata.school;
											grade = enrollment.user.user_metadata.grade_str;
										}
										userName = enrollment.user.name;
										email = enrollment.user.email;
										phone = enrollment.user.phone;
									}

									if (enrollment.course) courseName = enrollment.course.name;

									return (
										<tr key={_}>
											<td>
												{enrollment.created_at
													? util.convertDateTimeStr(enrollment.created_at)
													: "-" || "-"}
											</td>
											<td>
												<Button
													secondary
													onClick={() => {
														if (enrollment.user) {
															history.push({
																pathname: `/admin/users/${enrollment.user.id}`
															});
														}
													}}
												>
													{userName}
												</Button>
											</td>
											<td>{email}</td>
											<td>{phone}</td>
											<td>{school}</td>
											<td>{grade}</td>
											<td>
												<Button
													secondary
													onClick={() => {
														if (enrollment.course) {
															history.push({
																pathname: `/admin/courses/${enrollment.course.id}/edit`
															});
														}
													}}
												>
													{courseName}
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					<div className="mt-20">
						<AdminTablePagination
							links={enrollments.links}
							firstPageUrl={enrollments.first_page_url}
							lastPageUrl={enrollments.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

export default AdminEnrollmentList;
