import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "../../../components/adminTablePagination";
import Button from "@components/elements/Button";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminOrganizationList = ({}) => {
	const history = useHistory();
	const [organizations, setOrganizations] = useState([]);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getOrganizations("", callbackGetOrganizations);
	}, []);

	const callbackGetOrganizations = dataWithPaginate => {
		setOrganizations(dataWithPaginate);
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, callbackGetOrganizations);
		}
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text
		};
		ctrl.getOrganizations(query, callbackGetOrganizations);
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="기업명,접속링크" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col align="right">
					<Button
						primary
						size="large"
						onClick={() => {
							history.push({
								pathname: `/admin/organizations/create`
							});
						}}
					>
						신규등록
					</Button>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<OrganizationTable striped bordered hover>
						<thead>
							<tr>
								<th>번호</th>
								<th>기업명</th>
								<th>접속링크</th>
								<th>등록일</th>
								<th style={{ width: "200px" }}>Action</th>
							</tr>
						</thead>
						<tbody>
							{organizations.data &&
								organizations.data.length > 0 &&
								organizations.data.map((organization, _) => {
									return (
										<tr key={_}>
											<td>{organization.id}</td>
											<td>{organization.name}</td>
											<td>{organization.path}</td>
											<td>
												{organization.created_at
													? util.convertDateTimeStr(organization.created_at)
													: "-" || "-"}
											</td>
											<td>
												<Button
													secondary
													onClick={() => {
														history.push({
															pathname: `/admin/organizations/${organization.id}/edit`
														});
													}}
												>
													상세보기
												</Button>
												<Button
													secondary
													onClick={() => {
														history.push({
															pathname: `/admin/organizations/${organization.id}/posts`
														});
													}}
												>
													게시판관리
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</OrganizationTable>
					<div className="mt-20">
						<AdminTablePagination
							links={organizations.links}
							firstPageUrl={organizations.first_page_url}
							lastPageUrl={organizations.last_page_url}
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

export default AdminOrganizationList;
