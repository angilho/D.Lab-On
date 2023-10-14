import React from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";

const ProfileChangeModal = ({ show, onHide, onChangeImage, onChangeDefault }) => {
	return (
		<Modal size="sm" centered show={show} onHide={onHide}>
			<StyledModalHeader closeButton></StyledModalHeader>
			<StyledModalBody>
				<StyledModalTitle>프로필 사진 변경</StyledModalTitle>
				<div className="text-center mt-32">
					<MenuText onClick={onChangeImage}>앨범에서 사진 선택</MenuText>
					<MenuText onClick={onChangeDefault}>기본 프로필로 변경</MenuText>
				</div>
			</StyledModalBody>
		</Modal>
	);
};

const StyledModalHeader = styled(Modal.Header)`
	padding: 8px 16px 0px 16px;
	border-bottom: none;
	height: 32px;

	@media only screen and (max-width: 767.98px) {
		.close {
			position: absolute;
			right: 20px;
			top: 20px;
			z-index: 10;
		}
	}
	@media only screen and (min-width: 768px) {
		.close {
			position: absolute;
			right: 20px;
			top: 16px;
			z-index: 10;
		}
	}
`;

const StyledModalTitle = styled(Modal.Title)`
	font-size: 18px;
	text-align: center;
	font-weight: 700;
`;

const StyledModalBody = styled(Modal.Body)`
	padding: 0px 24px 32px 24px;
`;

const MenuText = styled.div`
	font-size: 16px;
	line-height: 25px;
	cursor: pointer;
	@media only screen and (max-width: 767.98px) {
		& + & {
			margin-top: 16px;
		}
	}
	@media only screen and (min-width: 768px) {
		& + & {
			margin-top: 16px;
		}
	}
`;

export default ProfileChangeModal;
