import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Table } from "react-bootstrap";
import FormControl from "@components/elements/FormControl";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "../../../components/adminTablePagination";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import Campus from "@constants/Campus";
import * as ctrl from "./index.ctrl";
import * as util from "@common/util";

const AdminSupportClassEnrollmentList = ({}) => {
	const history = useHistory();
	const [enrollments, setEnrollments] = useState([]);
	const [allChecked, setAllChecked] = useState(false);
	const [filterCampus, setFilterCampus] = useState(-1);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getSupportClassEnrollments("", callbackGetEnrollments);
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
			if (filterCampus != -1) {
				url += `&campus=${filterCampus}`;
			}
			ctrl.getPaginationLink(url, callbackGetEnrollments);
		}
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text
		};
		if (filterCampus != -1) {
			query.campus = filterCampus;
		}
		ctrl.getSupportClassEnrollments(query, callbackGetEnrollments);
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
		ctrl.deleteSupportClassEnrollments(deletedEnrollmentIds, () => onClickSearch(""));
	};

	const onClickExportHistory = () => {
		ctrl.handleExportHistory();
	};

	const extendSupportClassPeriod = () => {
		let slectedEnrollmentIds = enrollments.data.filter(e => e.selected).map(e => e.id);
		if (slectedEnrollmentIds.length === 0) {
			alert("선택한 항목이 없습니다.");
			return;
		}

		ctrl.supportClassEnrollmentExtend(slectedEnrollmentIds, supportClassEnrollments => {
			setEnrollments({
				...enrollments,
				data: enrollments.data.map(e => {
					supportClassEnrollments.map(s => {
						if (s.enrollment_id == e.id) {
							e.support_class_enrollment = s;
						}
					});
					e.selected = false;
					return e;
				})
			});
			setAllChecked(false);
		});
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="아이디, 이름, 강의ID, 강의명" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col md={4}>
					<FormControl
						className="w-100 p-0 m-0"
						as="select"
						name="campus"
						value={filterCampus}
						onChange={event => setFilterCampus(event.currentTarget.value)}
					>
						<option value={-1}>전체</option>
						{Campus.allCampus()
							.filter(c => c !== 0)
							.map((value, idx) => {
								return (
									<option key={idx} value={value}>
										{Campus.convertToString(value)}
									</option>
								);
							})}
					</FormControl>
				</Col>
				<Col align="right">
					<Button primary size="large" onClick={extendSupportClassPeriod}>
						기간연장
					</Button>
					<Button primary size="large" onClick={onClickExportHistory}>
						보충이력 다운로드
					</Button>
					<Button
						primary
						size="large"
						onClick={() =>
							history.push({
								pathname: `/admin/support_classes/create`
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
								<th>센터명</th>
								<th>아이디</th>
								<th>이름</th>
								<th>강의ID</th>
								<th>강의명</th>
								<th>마감일</th>
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
											<td>{Campus.convertToString(enrollment.user.campus)}</td>
											<td>{enrollment.user.user_login}</td>
											<td>{enrollment.user.name}</td>
											<td>{enrollment.course.dlab_course_code}</td>
											<td>{enrollment.course.name}</td>
											<td>
												{enrollment.support_class_enrollment !== null
													? util.getFormatDate(
															enrollment.support_class_enrollment.class_end_at
													  )
													: "-"}
											</td>
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

export default AdminSupportClassEnrollmentList;
