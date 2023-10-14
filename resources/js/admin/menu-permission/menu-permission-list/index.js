import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import Button from "@components/elements/Button";

import * as ctrl from "./index.ctrl";

const AdminMenuPermissionList = ({}) => {
	const history = useHistory();
	const [menuPermissions, setMenuPermissions] = useState([]);

	useEffect(() => {
		ctrl.getMenuPermissions("", setMenuPermissions);
	}, []);

	const onClickSearch = keyword => {
		ctrl.getMenuPermissions(keyword, setMenuPermissions);
	};

	const onClickManageMenuPermission = menuId => {
		history.push({ pathname: `/admin/menu_permissions/${menuId}` });
	};

	return (
		<React.Fragment>
			<Row className="mt-40 justify-content-start">
				<Col md={8}>
					<AdminSearch placeholder="메뉴명" onClick={onClickSearch} />
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<MenuTable striped bordered hover>
						<thead>
							<tr>
								<th>ID</th>
								<th>어드민 메뉴명</th>
								<th>사용자 추가</th>
							</tr>
						</thead>
						<tbody>
							{menuPermissions &&
								menuPermissions.map((menuPermission, idx) => {
									return (
										<tr key={idx}>
											<td>{menuPermission.id}</td>
											<td>{menuPermission.name}</td>
											<td>
												<Button
													secondary
													onClick={() => onClickManageMenuPermission(menuPermission.id)}
												>
													사용자 관리
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</MenuTable>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const MenuTable = styled(Table)``;

export default AdminMenuPermissionList;
