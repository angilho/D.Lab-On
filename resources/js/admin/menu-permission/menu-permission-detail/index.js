import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import Checkbox from "@components/elements/Checkbox";
import Button from "@components/elements/Button";

import UserSearchModal from "./components/UserSearchModal";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminMenuPermissionDetail = ({ menu_id }) => {
	const [menu, setMenu] = useState({});
	const [permissionUsers, setPermissionUsers] = useState([]);
	const [allChecked, setAllChecked] = useState(false);
	const [showUserSearchModal, setShowUserSearchModal] = useState(false);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		getMenuPermission();
	}, []);

	const getMenuPermission = () => {
		ctrl.getMenuPermission(menu_id, menuPermission => {
			setMenu(menuPermission.menu);
			setPermissionUsers(
				menuPermission.menu_permissions.map(user => {
					return {
						...user,
						selected: false
					};
				})
			);
			setInitialized(true);
		});
	};

	const onAllChecked = () => {
		if (allChecked) {
			setAllChecked(false);
		} else {
			setAllChecked(true);
		}

		let checkedPermissionUsers = permissionUsers.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setPermissionUsers(checkedPermissionUsers);
	};

	const onAddUser = user => {
		if (permissionUsers.some(permissionUser => permissionUser.user.user_login == user.user_login)) {
			alert("이미 추가된 사용자 입니다.");
			return;
		}
		setPermissionUsers([...permissionUsers, { selected: false, user: user }]);
	};

	const onDeleteUser = () => {
		if (confirm("선택한 사용자를 삭제하시겠습니까?")) {
			setPermissionUsers(permissionUsers.filter(permissionUser => !permissionUser.selected));
			setAllChecked(false);
		}
	};

	const onSavePermissionUsers = () => {
		ctrl.handleUpdate(menu.id, { user_ids: permissionUsers.map(permissionUser => permissionUser.user.id) }, () =>
			getMenuPermission()
		);
	};

	if (!initialized) return null;

	return (
		<div className="mt-3">
			<section>
				<h4>{`메뉴명: ${menu?.name ?? "-"}`}</h4>
			</section>
			<Row className="mt-20">
				<Col align="right">
					<MenuButton primary size="large" onClick={onDeleteUser}>
						삭제
					</MenuButton>
					<MenuButton danger size="large" className="ml-16" onClick={() => setShowUserSearchModal(true)}>
						사용자 추가
					</MenuButton>
				</Col>
			</Row>
			<section className="mt-3">
				<PermissionUserTable striped bordered hover>
					<thead>
						<tr>
							<th>
								<Checkbox checked={allChecked} onChange={onAllChecked} label="" />
							</th>
							<th>이름</th>
							<th>아이디</th>
							<th>등록일</th>
						</tr>
					</thead>
					<tbody>
						{permissionUsers &&
							permissionUsers.map((permissionUser, idx) => {
								return (
									<tr key={idx}>
										<td>
											<Checkbox
												checked={permissionUser.selected}
												onChange={value => {
													let changedPermissionUsers = permissionUsers.map(e => {
														if (e.id === permissionUser.id) {
															e.selected = value;
														}
														return e;
													});
													setPermissionUsers(changedPermissionUsers);
												}}
												label=""
											/>
										</td>
										<td>{permissionUser.user.name}</td>
										<td>{permissionUser.user.user_login}</td>
										<td>
											{permissionUser.created_at
												? util.getFormatDate(permissionUser.created_at)
												: util.getFormatDate(new Date())}
										</td>
									</tr>
								);
							})}
					</tbody>
				</PermissionUserTable>
			</section>
			<section className="mt-3">
				<Row className="mt-20">
					<Col align="right">
						<MenuButton primary size="large" onClick={onSavePermissionUsers}>
							저장
						</MenuButton>
					</Col>
				</Row>
			</section>
			<UserSearchModal
				show={showUserSearchModal}
				onHide={() => setShowUserSearchModal(false)}
				handleAdd={user => {
					setShowUserSearchModal(false);
					onAddUser(user);
				}}
			/>
		</div>
	);
};

const MenuButton = styled(Button)`
	width: 120px;
`;

const PermissionUserTable = styled(Table)``;

export default AdminMenuPermissionDetail;
