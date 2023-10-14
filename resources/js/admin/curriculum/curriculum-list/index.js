import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import styled, { css } from "styled-components";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminCurriculumList = ({}) => {
	const history = useHistory();
	const [curriculumCategories, setCurriculumCategories] = useState([]);
	const [allChecked, setAllChecked] = useState(false);

	useEffect(() => {
		ctrl.getCurriculumCategories("", callbackGetCurriculumCategories);
	}, []);

	const callbackGetCurriculumCategories = result => {
		setCurriculumCategories(
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

		let checkedCurriculumCategories = curriculumCategories.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setCurriculumCategories(checkedCurriculumCategories);
	};

	const onClickCurriculumCategoryUp = curriculumCategoryId => {
		let reorderCurriculumCategories = curriculumCategories.map(curriculumCategory => {
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
		let reorderCurriculumCategories = curriculumCategories.map(curriculumCategory => {
			return { id: curriculumCategory.id, order: curriculumCategory.order };
		});
		reorderCurriculumCategories.forEach((curriculumCategory, index) => {
			if (curriculumCategory.id == curriculumCategoryId && index != curriculumCategories.length - 1) {
				curriculumCategory.order++;
				reorderCurriculumCategories[index + 1].order--;
			}
		});
		ctrl.handleReorder(reorderCurriculumCategories, () => history.go(0));
	};

	const onDeleteCurriculumCategories = () => {
		let deletedCurriculumCategoryIds = curriculumCategories.filter(e => e.selected).map(e => e.id);
		ctrl.handleDelete(deletedCurriculumCategoryIds, () => {
			ctrl.getCurriculumCategories("", callbackGetCurriculumCategories);
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
								pathname: `/admin/curriculums/create`
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
							{curriculumCategories.map((curriculumCategory, index) => {
								return (
									<tr key={index}>
										<td>
											<Checkbox
												checked={curriculumCategory.selected}
												onChange={value => {
													let changedCurriculumCategories = curriculumCategories.map(e => {
														if (e.id === curriculumCategory.id) {
															e.selected = value;
														}
														return e;
													});
													setCurriculumCategories(changedCurriculumCategories);
												}}
												label=""
											/>
										</td>
										<td>{curriculumCategory.title}</td>
										<td>
											{curriculumCategory.created_at
												? util.convertDateTimeStr(curriculumCategory.created_at)
												: "-" || "-"}
										</td>
										<td>{curriculumCategory.curriculum_courses?.length ?? 0}</td>
										<td>
											<Button
												secondary
												onClick={() => onClickCurriculumCategoryUp(curriculumCategory.id)}
												disabled={index === 0}
											>
												↑
											</Button>
											<Button
												secondary
												onClick={() => onClickCurriculumCategoryDown(curriculumCategory.id)}
												disabled={index === curriculumCategories.length - 1}
											>
												↓
											</Button>
											<Button
												secondary
												onClick={() => {
													history.push({
														pathname: `/admin/curriculums/${curriculumCategory.id}/edit`
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

export default AdminCurriculumList;
