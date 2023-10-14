import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Table } from "react-bootstrap";
import AdminSearch from "@components/adminSearch";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import * as ctrl from "./index.ctrl";
import AdminTablePagination from "../../../components/adminTablePagination";

const AdminOrganizationEnrollmentList = ({}) => {
	const history = useHistory();
	const [enrollments, setEnrollments] = useState([]);
	const [allChecked, setAllChecked] = useState(false);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getOrganizationEnrollments("", callbackGetEnrollments);
	}, []);

	const callbackGetEnrollments = result => {
		setEnrollments({
			...result,
			data: result.data.map(e => {
				e.selected = false;
				return e;
			})
		});
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, callbackGetEnrollments);
		}
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text
		};
		ctrl.getOrganizationEnrollments(query, callbackGetEnrollments);
	};

	const onAllChecked = () => {
		if (allChecked) {
			setAllChecked(false);
		} else {
			setAllChecked(true);
		}

		let checkedEnrollments = enrollments.data.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setEnrollments({ ...enrollments, data: checkedEnrollments });
	};

	const onDeleteEnrollments = () => {
		if (!confirm("선택한 학생의 수강신청을 삭제하시겠습니까?")) {
			return;
		}

		let deletedEnrollmentIds = enrollments.data.filter(e => e.selected).map(e => e.id);
		if (deletedEnrollmentIds.length === 0) {
			alert("선택한 학생이 없습니다.");
			return;
		}
		ctrl.deleteOrganizationEnrollments(deletedEnrollmentIds, () => onClickSearch(""));
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="기업명, 아이디, 이름, 강의ID, 강의명" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col align="right">
					<Button
						primary
						size="large"
						onClick={() =>
							history.push({
								pathname: `/admin/organization_enrollments/create`
							})
						}
					>
						수강등록
					</Button>
					<Button size="large" danger onClick={onDeleteEnrollments}>
						선택 삭제
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<OrganizationTable striped bordered hover>
						<thead>
							<tr>
								<th>
									<Checkbox checked={allChecked} onChange={onAllChecked} label="" />
								</th>
								<th>번호</th>
								<th>기업명</th>
								<th>아이디</th>
								<th>이름</th>
								<th>강의ID</th>
								<th>강의명</th>
							</tr>
						</thead>
						<tbody>
							{enrollments.data &&
								enrollments.data.length > 0 &&
								enrollments.data.map((enrollment, idx) => {
									return (
										<tr key={idx}>
											<td>
												<Checkbox
													checked={enrollment.selected}
													onChange={value => {
														let changedEnrollments = enrollments.data.map(e => {
															if (e.id === enrollment.id) {
																e.selected = value;
															}
															return e;
														});
														setEnrollments({
															...enrollments,
															data: changedEnrollments
														});
													}}
													label=""
												/>
											</td>
											<td>{enrollments.from + idx}</td>
											<td>{enrollment.user.organization.name}</td>
											<td>{enrollment.user.user_login}</td>
											<td>{enrollment.user.name}</td>
											<td>{enrollment.course.dlab_course_code}</td>
											<td>{enrollment.course.name}</td>
										</tr>
									);
								})}
						</tbody>
					</OrganizationTable>
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

const OrganizationTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default AdminOrganizationEnrollmentList;
