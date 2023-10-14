import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";

import useSizeDetector from "@hooks/useSizeDetector";

const UserFind = ({ path }) => {
	const history = useHistory();
	const SizeDetector = useSizeDetector();

	return (
		<div className="container">
			<Row className="justify-content-center">
				<Col md={4}>
					<Text h5 className="mt-60 mb-40">
						아이디/비밀번호 찾기
					</Text>
					<Text fontWeight={300} fontSize={SizeDetector.isDesktop ? 0.813 : 0.825} className="mb-10">
						아이디가 기억나지 않으시나요?
					</Text>
					<Button
						size="large"
						secondary
						className="w-100"
						onClick={() =>
							history.push(
								{
									pathname: "/user/find/id/phone"
								},
								{
									path
								}
							)
						}
					>
						휴대폰 인증으로 아이디 찾기
					</Button>
					<div>
						<Button
							size="large"
							secondary
							className="w-100 mt-10 mb-40"
							onClick={() =>
								history.push(
									{
										pathname: "/user/find/id/email"
									},
									{
										path
									}
								)
							}
						>
							이메일 인증으로 아이디 찾기
						</Button>
					</div>
					<Text fontWeight={300} fontSize={SizeDetector.isDesktop ? 0.813 : 0.825} className="mb-10">
						비밀번호가 기억나지 않으시나요?
					</Text>
					<Button
						size="large"
						secondary
						className="w-100"
						onClick={() => history.push({ pathname: "/user/find/password/email" })}
					>
						이메일로 비밀번호 찾기
					</Button>
				</Col>
			</Row>
		</div>
	);
};

export default UserFind;
