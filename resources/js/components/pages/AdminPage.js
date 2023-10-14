import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import Breadcrumb from "@components/breadcrumb";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import Sidebar from "../sidebar";
import AdminSideBarMenu from "../../constants/AdminSideBarMenu";
import InstructorSideBarMenu from "@constants/InstructorSideBarMenu";
import AdminSideBarNonPermissionMenu from "../../constants/AdminSideBarNonPermissionMenu";

const AdminPage = props => {
	const history = useHistory();
	const location = useLocation();
	const [menuIndex, setMenuIndex] = useState(0);

	useEffect(() => {
		const unlisten = history.listen(() => {
			window.scrollTo(0, 0);
		});
		return () => {
			unlisten();
		};
	}, []);

	useEffect(() => {
		if (!hasPermissionMenu()) {
			alert("권한이 없습니다.");
			history.goBack();
			return;
		}
		getPermissionMenus().forEach((value, idx) => {
			if (location.pathname.includes(value.link)) setMenuIndex(idx);
		});
	}, [location]);

	useEffect(() => {
		document.title = props.title || "";
	}, [props.title]);

	const hasPermissionMenu = () => {
		let hasPermission = false;
		AdminSideBarMenu.forEach(value => {
			if (location.pathname.includes(value.link)) {
				hasPermission = userInfo.admin_menu_permissions.some(
					menuPermission => menuPermission.menu_id === value.id
				);
			}
		});
		// 강사권한의 경우 admin_menu_permissions 를 체크하지 않고 해당 메뉴로 들어갈 수 있다
		if (userInfo && userInfo.is_instructor) {
			InstructorSideBarMenu.forEach(value => {
				if (location.pathname.includes(value.link)) {
					hasPermission = true;
				}
			});
		}
		// 예외 링크 (메뉴명과 분리된 링크들)
		AdminSideBarNonPermissionMenu.forEach(value => {
			if (location.pathname.includes(value.link)) {
				hasPermission = true;
			}
		});
		return hasPermission;
	};

	const getPermissionMenus = () => {
		if (userInfo && userInfo.is_instructor) {
			return InstructorSideBarMenu;
		}
		if (!userInfo || !userInfo.admin_menu_permissions) {
			return [];
		}
		return AdminSideBarMenu.filter(menu => {
			return userInfo.admin_menu_permissions.some(menuPermission => menuPermission.menu_id === menu.id);
		});
	};

	const renderBackButton = () => {
		return (
			<Button
				secondary
				size="large"
				className="mr-3"
				onClick={() => {
					history.goBack();
				}}
			>
				<ArrowBackRoundedIcon />
				뒤로가기
			</Button>
		);
	};

	return (
		<AdminContainer>
			<div className="container">
				<Row>
					<Col md={3}>
						<Sidebar
							menu={getPermissionMenus()}
							menuIndex={menuIndex}
							user={userInfo}
							userName={userInfo.name}
						/>
					</Col>
					<Col>
						{props.backButton && renderBackButton()}
						<Breadcrumb title={props.title} />
						<Text h5>{props.title}</Text>
						{props.children}
					</Col>
				</Row>
			</div>
		</AdminContainer>
	);
};

const AdminContainer = styled.div`
	padding-bottom: 12.5rem;
`;

export default AdminPage;
