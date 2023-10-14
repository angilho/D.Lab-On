import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import useRegisterUser from "@hooks/useRegisterUser";
import useSizeDetector from "@hooks/useSizeDetector";

import UserRegisterForm from "../../../auth/register/components/UserRegisterForm";
import * as RegisterChildCtrl from "../../../auth/register/child/index.ctrl";

const ChildCreate = ({ parentId }) => {
	const history = useHistory();
	const [parent, setParent] = useState({});
	const SizeDetector = useSizeDetector();
	const registerChildrenHandler = useRegisterUser({
		initialValues: {
			// 부모 ID 정보를 child state에 설정한다.
			...RegisterChildCtrl.getDefaultChild(),
			parentId,
			phone_verify: false
		}
	});

	// 약관 동의 정보 체크를 위한 사용자 정보 획득
	useEffect(() => {
		RegisterChildCtrl.getUser(parentId, callbackGetUser);
	}, []);

	const callbackGetUser = user => {
		// 아이는 5명 이상 등록할 수 없다
		if (user.children && user.children.length === 5) {
			alert("자녀는 최대 5명까지 등록 가능합니다.");
			history.goBack();
		}

		setParent(user);
	};

	const registerChild = e => {
		e.preventDefault();
		RegisterChildCtrl.handleCreate(parentId, registerChildrenHandler.user, callbackRegisterUser);
	};

	const callbackRegisterUser = user => {
		if (user.id) {
			if (SizeDetector.isDesktop) {
				history.push({
					pathname: "/mypage/children"
				});
			} else {
				history.push({
					pathname: "/mypage/children",
					state: {
						contentHide: false,
						sidebarHide: true
					}
				});
			}
		}
	};

	const parentDataHandler = param => {
		return parent[param];
	};

	return (
		<Row>
			<Col>
				<UserRegisterForm
					title="자녀(학생 회원) 등록"
					isChild
					registerUserHandler={registerChildrenHandler}
					onRegister={registerChild}
					parentDataHandler={parentDataHandler}
				/>
			</Col>
		</Row>
	);
};

export default ChildCreate;
