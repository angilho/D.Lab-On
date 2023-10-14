import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminOrganizationCreate = ({ organization_id }) => {
	const history = useHistory();
	const [organization, setOrganization] = useState(ctrl.getDefaultOrganization());

	const isEdit = organization_id ? true : false;

	useEffect(() => {
		if (isEdit) {
			ctrl.getOrganization(organization_id, data => {
				setOrganization({
					...data,
					start_at_date: new Date(data.start_at),
					end_at_date: new Date(data.end_at)
				});
			});
		}
	}, []);

	return (
		<React.Fragment>
			<Row className="mt-3">
				<Col md={6}>
					<FormLabel required>기업명</FormLabel>
					<FormControl
						className="w-100"
						type="text"
						placeholder="기업명"
						value={organization.name}
						disabled={isEdit}
						onChange={event => setOrganization({ ...organization, name: event.currentTarget.value })}
					/>
				</Col>
			</Row>
			<Row>
				<Col md={6}>
					<FormLabel required>사용기간</FormLabel>
					<Row className="align-items-center">
						<Col md={5}>
							<StyledDatePicker
								selected={organization.start_at_date}
								onChange={date => {
									setOrganization({
										...organization,
										start_at: util.getFormatDate(date, "-"),
										start_at_date: date
									});
								}}
								dateFormat="yyyy-MM-dd"
							/>
						</Col>
						<Col md={2} className="text-center">
							~
						</Col>
						<Col md={5}>
							<StyledDatePicker
								selected={organization.end_at_date}
								onChange={date => {
									setOrganization({
										...organization,
										end_at: util.getFormatDate(date, "-"),
										end_at_date: date
									});
								}}
								dateFormat="yyyy-MM-dd"
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col md={6}>
					<FormLabel required>접속링크</FormLabel>
					<Row className="align-items-center">
						<Col md={3} className="pr-0">
							<span>dlabon.com/</span>
						</Col>
						<Col md={9}>
							<FormControl
								className="w-100 mb-0"
								type="text"
								placeholder=""
								value={organization.path}
								disabled={isEdit}
								onChange={event =>
									setOrganization({ ...organization, path: event.currentTarget.value })
								}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col md={6}>
					<FormLabel>메모</FormLabel>
					<TextAreaFormControl
						className="w-100"
						as="textarea"
						rows={5}
						value={organization.memo}
						placeholder="내용을 입력해 주세요"
						onChange={event => setOrganization({ ...organization, memo: event.currentTarget.value })}
					/>
				</Col>
			</Row>

			<Row className="mt-5 mb-5 align-self-center">
				{isEdit && (
					<Col md={2}>
						<Button
							danger
							size="large"
							className="w-100"
							onClick={() =>
								ctrl.handleDelete(organization.id, () =>
									history.push({ pathname: "/admin/organizations" })
								)
							}
						>
							삭제
						</Button>
					</Col>
				)}
				<Col md={2}>
					<Button
						primary
						size="large"
						className="w-100"
						onClick={() => {
							if (isEdit) {
								ctrl.handleUpdate(organization, () =>
									history.push({ pathname: "/admin/organizations" })
								);
							} else {
								ctrl.handleCreate(organization, () =>
									history.push({ pathname: "/admin/organizations" })
								);
							}
						}}
					>
						저장
					</Button>
				</Col>
				<Col md={2}>
					<Link to={"/admin/organizations"}>
						<Button secondary size="large" className="w-100">
							취소
						</Button>
					</Link>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const StyledDatePicker = styled(DatePicker)`
	border: 0.063rem solid #e1e1e1;
	padding: 1px 2px 1px 2px;
	text-indent: 1rem;
	border-radius: 0.25rem;
	width: 100%;
	height: 3rem;
`;

const TextAreaFormControl = styled(FormControl)`
	border: 0.063rem solid #e1e1e1;
	border-radius: 0.25rem;
	text-indent: 0rem;
	padding: 1rem;

	&::placeholder {
		color: #e1e1e1;
	}
`;

export default AdminOrganizationCreate;
