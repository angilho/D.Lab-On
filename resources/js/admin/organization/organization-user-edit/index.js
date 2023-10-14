import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";

import * as ctrl from "./index.ctrl";

const AdminOrganizationUserEdit = ({ user_id }) => {
	let history = useHistory();
	const [user, setUser] = useState({});

	useEffect(() => {
		ctrl.getOrganizationUser(user_id, callbackGetUser);
	}, []);

	const callbackGetUser = user => {
		setUser({
			...user,
			...user.user_metadata
		});
	};

	const callbackUpdateUser = () => {
		history.goBack();
	};

	const updateUser = () => {
		if (!ctrl.validateUser(user)) {
			return;
		}
		ctrl.updateUser(user_id, user, callbackUpdateUser);
	};

	return (
		<Row>
			<Col align="center" md={6}>
				<div className="mt-32">
					<FormLabel required>이름</FormLabel>
					<FormControl
						className="w-100"
						type="text"
						value={user.name || ""}
						onChange={event => setUser({ ...user, name: event.currentTarget.value })}
					/>
				</div>
				<div>
					<FormLabel required>전화번호</FormLabel>
					<div className="input-group mb-10">
						<FormControl className="w-100" type="text" value={user.phone || ""} disabled={true} />
					</div>
				</div>
				<div>
					<FormLabel required>아이디</FormLabel>
					<FormControl className="w-100" type="text" value={user.user_login || ""} disabled={true} />
				</div>
				<div>
					<FormLabel required className="mt-20">
						이메일
					</FormLabel>
					<FormControl
						className="w-100 mb-0"
						type="email"
						placeholder="이메일"
						name="email"
						value={user.email || ""}
						onChange={event => setUser({ ...user, email: event.currentTarget.value })}
					/>
				</div>
				<div>
					<FormLabel>기업명</FormLabel>
					<FormControl className="w-100" type="text" value={user.organization?.name || ""} disabled={true} />
				</div>
				<div className="mt-40">
					<Button primary size="large" className="w-100 m-0" onClick={updateUser}>
						<span>{"수정내용 저장"}</span>
					</Button>
				</div>
			</Col>
		</Row>
	);
};

export default AdminOrganizationUserEdit;
