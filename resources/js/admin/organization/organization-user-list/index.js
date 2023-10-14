import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import Button from "@components/elements/Button";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";

import * as ctrl from "./index.ctrl";

const AdminOrganizationUserList = () => {
	const [users, setUsers] = useState([]);
	const excelFile = useRef(null);
	const [usersExcelFile, setUsersExcelFile] = useState(null);
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getOrganizationUsers("", setUsers);
	}, []);

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&filter[search]=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setUsers);
		}
	};

	const onClickSearch = text => {
		setFilterKeyword(text);
		let query = {
			"filter[search]": text
		};

		ctrl.getOrganizationUsers(query, setUsers);
	};

	const onClickExcelFileUpload = () => {
		excelFile.current.click();
	};

	const onClickExcelFileDownload = () => {
		window.location.href = "/static/sample/sample_b2b_users.xlsx";
	};

	useEffect(() => {
		if (!usersExcelFile || !usersExcelFile.name.includes("xls")) return;

		try {
			let fileReader = new FileReader();

			const rABS = !!fileReader.readAsBinaryString;
			fileReader.onload = e => ctrl.handleOnFileLoad(e, rABS, parseExcelFile);
			if (rABS) fileReader.readAsBinaryString(usersExcelFile);
		} catch (e) {
			console.log(e);
			alert("잘못된 엑셀 파일을 업로드 하였습니다.");
		}
	}, [usersExcelFile]);

	const parseExcelFile = excelData => {
		// 파싱한 Excel 정보에서 헤더가 없을 경우
		if (excelData.length == 0 || !excelData[0]) {
			alert("잘못된 엑셀 파일을 업로드 하였습니다.");
		}
		// 헤더를 뺀다.
		excelData.splice(0, 1);

		// 사용자 데이터를 추출하여 사용자 추가 API 요청을 보낸다.
		ctrl.createOrganizationUserImport(excelData, () => {
			ctrl.getOrganizationUsers("", setUsers);
		});
	};

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="이름, 아이디, 이메일, 전화번호 검색" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-3 justify-content-end">
				<Col md={3} align="right">
					<Button secondary size="large" className="w-100" onClick={onClickExcelFileDownload}>
						회원추가 샘플다운로드
					</Button>
				</Col>
				<Col md={3} align="right">
					<Button primary size="large" className="w-100" onClick={onClickExcelFileUpload}>
						회원추가 업로드
					</Button>
					<input
						type="file"
						id="file"
						ref={excelFile}
						style={{ display: "none" }}
						onChange={event => setUsersExcelFile(event.currentTarget.files[0])}
					/>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					<UserTable striped bordered hover>
						<thead>
							<tr>
								<th style={{ width: "80px" }}>번호</th>
								<th style={{ width: "150px" }}>기업명</th>
								<th style={{ width: "150px" }}>이름</th>
								<th style={{ width: "200px" }}>아이디</th>
								<th style={{ width: "200px" }}>이메일</th>
								<th style={{ width: "200px" }}>전화번호</th>
							</tr>
						</thead>
						<tbody>
							{users.data &&
								users.data.map((user, idx) => {
									return (
										<tr key={idx}>
											<td>{users.from + idx}</td>
											<td>{user.organization.name || "-"}</td>
											<td>{user.name || "-"}</td>
											<td>
												<Link to={`/admin/organization_users/${user.id}`}>
													{user.user_login || "-"}
												</Link>
											</td>
											<td>{user.email || "-"}</td>
											<td>{user.phone || "-"}</td>
										</tr>
									);
								})}
						</tbody>
					</UserTable>
					<div className="mt-20">
						<AdminTablePagination
							links={users.links}
							firstPageUrl={users.first_page_url}
							lastPageUrl={users.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const UserTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default AdminOrganizationUserList;
