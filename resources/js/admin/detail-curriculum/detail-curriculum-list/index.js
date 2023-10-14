import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import styled, { css } from "styled-components";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminDetailCurriculumList = ({}) => {
	const history = useHistory();
	const [detailCurriculumCategories, setDetailCurriculumCategories] = useState([]);
	const [allChecked, setAllChecked] = useState(false);

	useEffect(() => {
		ctrl.getDetailCurriculumCategories("", callbackGetDetailCurriculumCategories);
	}, []);

	const callbackGetDetailCurriculumCategories = result => {
		setDetailCurriculumCategories(
			result.map(e => {
				e.selected = false;
				return e;
			})
		);
		setAllChecked(false);
	};

	const onAllChecked = () => {
		if (allChecked) {
			setAllChecked(false);
		} else {
			setAllChecked(true);
		}

		let checkedDetailCurriculumCategories = detailCurriculumCategories.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setDetailCurriculumCategories(checkedDetailCurriculumCategories);
	};

	const onClickCurriculumCategoryUp = curriculumCategoryId => {
		let reorderCurriculumCategories = detailCurriculumCategories.map(curriculumCategory => {
			return { id: curriculumCategory.id, order: curriculumCategory.order };
		});
		reorderCurriculumCategories.forEach((curriculumCategory, index) => {
			if (curriculumCategory.id == curriculumCategoryId && index != 0) {
				curriculumCategory.order--;
				reorderCurriculumCategories[index - 1].order++;
			}
		});
		ctrl.handleReorder(reorderCurriculumCategories, () => history.go(0));
	};

	const onClickCurriculumCategoryDown = curriculumCategoryId => {
		let reorderCurriculumCategories = detailCurriculumCategories.map(curriculumCategory => {
			return { id: curriculumCategory.id, order: curriculumCategory.order };
		});
		reorderCurriculumCategories.forEach((curriculumCategory, index) => {
			if (curriculumCategory.id == curriculumCategoryId && index != detailCurriculumCategories.length - 1) {
				curriculumCategory.order++;
				reorderCurriculumCategories[index + 1].order--;
			}
		});
		ctrl.handleReorder(reorderCurriculumCategories, () => history.go(0));
	};

	const onDeleteCurriculumCategories = () => {
		let deletedDetailCurriculumCategoryIds = detailCurriculumCategories.filter(e => e.selected).map(e => e.id);
		ctrl.handleDelete(deletedDetailCurriculumCategoryIds, () => {
			ctrl.getDetailCurriculumCategories("", callbackGetDetailCurriculumCategories);
		});
	};

	return (
		<React.Fragment>
			<Row className="mt-20">
				<Col align="right">
					<Button
						primary
						size="large"
						onClick={() => {
							history.push({
								pathname: `/admin/detail_curriculums/create`
							});
						}}
					>
						신규등록
					</Button>
					<Button danger size="large" className="ml-16" onClick={onDeleteCurriculumCategories}>
						선택 삭제
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<CurriculumCategoryTable striped bordered hover>
						<thead>
							<tr>
								<th>
									<Checkbox checked={allChecked} onChange={onAllChecked} label="" />
								</th>
								<th>커리큘럼명</th>
								<th>생성일</th>
								<th>과목수</th>
								<th style={{ width: "200px" }}>Action</th>
							</tr>
						</thead>
						<tbody>
							{detailCurriculumCategories.map((detailCurriculumCategory, index) => {
								return (
									<tr key={index}>
										<td>
											<Checkbox
												checked={detailCurriculumCategory.selected}
												onChange={value => {
													let changedDetailCurriculumCategories = detailCurriculumCategories.map(
														e => {
															if (e.id === detailCurriculumCategory.id) {
																e.selected = value;
															}
															return e;
														}
													);
													setDetailCurriculumCategories(changedDetailCurriculumCategories);
												}}
												label=""
											/>
										</td>
										<td>{detailCurriculumCategory.title}</td>
										<td>
											{detailCurriculumCategory.created_at
												? util.convertDateTimeStr(detailCurriculumCategory.created_at)
												: "-" || "-"}
										</td>
										<td>{detailCurriculumCategory.curriculum_courses?.length ?? 0}</td>
										<td>
											<Button
												secondary
												onClick={() => onClickCurriculumCategoryUp(detailCurriculumCategory.id)}
												disabled={index === 0}
											>
												↑
											</Button>
											<Button
												secondary
												onClick={() =>
													onClickCurriculumCategoryDown(detailCurriculumCategory.id)
												}
												disabled={index === detailCurriculumCategories.length - 1}
											>
												↓
											</Button>
											<Button
												secondary
												onClick={() => {
													history.push({
														pathname: `/admin/detail_curriculums/${detailCurriculumCategory.id}/edit`
													});
												}}
											>
												상세보기
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</CurriculumCategoryTable>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const CurriculumCategoryTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default AdminDetailCurriculumList;
