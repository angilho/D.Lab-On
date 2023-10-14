import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";
import useSizeDetector from "@hooks/useSizeDetector";

import ChildEdit from "./ChildEdit";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import ProfileImage from "@components/elements/ProfileImage";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";

import * as ctrl from "./ChildList.ctrl";

const ChildCard = ({ child, children, onClickDelete, onClickEdit, ...props }) => {
	const SizeDetector = useSizeDetector();
	let birthday = child.user_info
		? `${child.user_info.birthday.year}.${child.user_info.birthday.month}.${child.user_info.birthday.day}`
		: "-";
	let gender = child.user_metadata ? child.user_metadata.gender : "m";

	const onMasqueradeLogin = () => {
		if (confirm(`${child.user_info.name} 으로 로그인 하시겠습니까?`)) {
			ctrl.masqueradeLogin(child.user_info.id);
		}
	};

	return (
		<React.Fragment>
			<SizeDetector.Desktop>
				<StyledContainer>
					<Row className="align-items-center" noGutters>
						{!child.user_info && !child.user_metadata && children}
						<ProfileCol className="d-flex align-self-start justify-content-start">
							<ProfileImageContainer>
								<ProfileImage user={child.user_info} gender={gender} />
							</ProfileImageContainer>
						</ProfileCol>
						<Col>
							<Row>
								<Col md={8} className="d-flex">
									<ChildNameContainer className="d-inline-block">
										<ChlidName>
											{child.user_info
												? `${child.user_info.name}(${child.user_info.user_login})`
												: "등록된 자녀 정보가 없습니다."}
										</ChlidName>
										<TextUnderLine />
									</ChildNameContainer>
								</Col>
								<Col>
									{child.user_info && (
										<div className="d-inline-block">
											<LoginButton
												secondary
												className="d-flex align-items-center justify-content-center mt-6"
												onClick={onMasqueradeLogin}
											>
												로그인
												<LoginRoundedIcon style={{ fontSize: 18 }} className="ml-4" />
											</LoginButton>
										</div>
									)}
								</Col>
							</Row>
							<Row>
								<Col md={4}>
									<Text p4>생일</Text>
									<Text p2>{birthday}</Text>
								</Col>
								<Col>
									<Text p4>학교</Text>
									<Text p2>{child.user_metadata ? child.user_metadata.school : "-"}</Text>
								</Col>
								<Col>
									<Text p4>학년</Text>
									<Text p2>{child.user_metadata ? child.user_metadata.grade_str : "-"}</Text>
								</Col>
							</Row>
							<Row className="mt-12">
								<Col md={4} className="flex-grow-1">
									<Text p4>휴대폰 번호</Text>
									<Text p2>{child.user_info ? child.user_info.phone : "-"}</Text>
								</Col>
								<Col>
									<Text p4>주소</Text>
									<Text p2>{child.user_info ? child.user_info.address : "-"}</Text>
									<Text p4>{child.user_info ? child.user_info.address_detail : "-"}</Text>
								</Col>
							</Row>
						</Col>
						<Col md={1} className="align-self-start d-flex align-items-end flex-column">
							<StyledIconBtnContainer onClick={() => onClickEdit(child.child_id)}>
								<EditRoundedIcon style={{ fontSize: 18, color: "#AAAAAA" }} />
							</StyledIconBtnContainer>
							<StyledIconBtnContainer onClick={() => onClickDelete(child.child_id)} className="mt-8">
								<PersonRemoveRoundedIcon style={{ fontSize: 18, color: "#AAAAAA" }} />
							</StyledIconBtnContainer>
						</Col>
					</Row>
				</StyledContainer>
			</SizeDetector.Desktop>
			<SizeDetector.Mobile>
				<StyledContainer>
					<Row>
						{!child.user_info && !child.user_metadata && children}
						<Col xs="auto" className="d-flex align-self-start justify-content-start">
							<ProfileImageContainer>
								<ProfileImage user={child.user_info} gender={gender} />
							</ProfileImageContainer>
						</Col>
						<ChildRightInfoContainer xs="auto">
							<Text h5>{child.user_info ? `${child.user_info.name}` : ""}</Text>
							<ChildUserLoginText className="mb-8">
								{child.user_info ? `(${child.user_info.user_login})` : ""}
							</ChildUserLoginText>

							<Text p4>생일</Text>
							<Text p2 fontWeight={500}>
								{birthday}
							</Text>

							<Text p4 className="mt-4">
								휴대폰 번호
							</Text>
							<Text p2 fontWeight={500}>
								{child.user_info ? child.user_info.phone : "-"}
							</Text>
						</ChildRightInfoContainer>
					</Row>
					<Row>
						<Col>
							<Separator />
						</Col>
					</Row>
					<Row>
						<Col xs="auto">
							<InfoLeftContainer>
								<Text p4 className="mb-10" fontSize={0.75}>
									학교
								</Text>
								<Text p2 fontSize={1} fontWeight={500}>
									{child.user_metadata ? child.user_metadata.school : "-"}
								</Text>
							</InfoLeftContainer>
						</Col>
						<Col>
							<Text p4 className="mb-10" fontSize={0.75}>
								학년
							</Text>
							<Text p2 fontSize={1} fontWeight={500}>
								{child.user_metadata ? child.user_metadata.grade_str : "-"}
							</Text>
						</Col>
					</Row>
					<AddressRow>
						<Col>
							<Text p4 className="mb-10" fontSize={0.75}>
								주소
							</Text>
							<Text p2 fontSize={1} fontWeight={500}>
								{child.user_info ? child.user_info.address : "-"}
							</Text>
							<Text p4>{child.user_info ? child.user_info.address_detail : "-"}</Text>
						</Col>
					</AddressRow>
					<Row className="mt-20">
						<Col noGutters className="d-flex align-items-center justify-content-between">
							<LoginButton
								secondary
								className="d-flex align-items-center justify-content-center"
								onClick={onMasqueradeLogin}
							>
								로그인
								<LoginRoundedIcon style={{ fontSize: 18 }} />
							</LoginButton>
							<div className="d-flex">
								<StyledIconBtnContainer className="ml-20" onClick={() => onClickEdit(child.child_id)}>
									<EditRoundedIcon style={{ fontSize: 18, color: "#AAAAAA" }} />
								</StyledIconBtnContainer>
								<StyledIconBtnContainer className="ml-8" onClick={() => onClickDelete(child.child_id)}>
									<PersonRemoveRoundedIcon style={{ fontSize: 18, color: "#AAAAAA" }} />
								</StyledIconBtnContainer>
							</div>
						</Col>
					</Row>
				</StyledContainer>
			</SizeDetector.Mobile>
		</React.Fragment>
	);
};

const ChildList = ({ parentId }) => {
	const SizeDetector = useSizeDetector();
	const history = useHistory();
	const [children, setChildren] = useState([]);
	const [editChildId, setEditChildId] = useState(null);

	useEffect(() => {
		ctrl.getChildren(parentId, user => setChildren(user.children));
	}, []);

	const onClickAddChild = mobile => {
		let state = { sidebarHide: false, contentsHide: false };
		if (mobile) {
			state.sidebarHide = true;
		}
		history.push({ pathname: "/mypage/child/create", state });
	};

	const onClickDeleteChild = childId => {
		if (
			confirm(
				"자녀 등록을 해지하실 경우,\r\n\
자녀의 수강현황 및 정보를 확인하실 수 없습니다.\r\n\
그래도 해지 하시겠습니까?\r\n\
*자녀의 탈퇴를 원하실 경우, 자녀의 아이디로 로그인 후 회원탈퇴 과정이 필요합니다."
			)
		) {
			ctrl.deleteChild(parentId, childId, res => {
				if (res) location.reload();
			});
		}
	};

	const onClickEditChild = childId => {
		setEditChildId(childId);
	};

	// 편집 대상 자녀가 있으면 <ChildEdit>를 표시한다.
	if (editChildId) {
		return <ChildEdit child_id={editChildId} />;
	}

	return (
		<Row>
			<Col>
				{children.map((child, idx) => {
					return (
						<ChildCard
							key={idx}
							child={child}
							onClickDelete={childId => onClickDeleteChild(childId)}
							onClickEdit={childId => onClickEditChild(childId)}
						/>
					);
				})}
				{children.length !== 5 && (
					<React.Fragment>
						<SizeDetector.Desktop>
							<ChildCard child={{}}>
								<StyledAddChildContainer onClick={() => onClickAddChild(false)}>
									<StyledAddChildInside>
										<AddRoundedIcon style={{ fontSize: 44 }} />
										<Text h5 primary>
											자녀 추가하기
										</Text>
									</StyledAddChildInside>
								</StyledAddChildContainer>
							</ChildCard>
						</SizeDetector.Desktop>
						<SizeDetector.Mobile>
							<Button
								secondary
								size="large"
								className="w-100 mt-24"
								onClick={() => onClickAddChild(true)}
							>
								새 자녀 정보 등록
							</Button>
						</SizeDetector.Mobile>
					</React.Fragment>
				)}
			</Col>
		</Row>
	);
};

const StyledContainer = styled.div`
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
	& + & {
		margin-top: 1.25rem;
	}

	@media only screen and (max-width: 767.98px) {
		padding: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 2rem;
	}
`;

const StyledAddChildContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 15.75rem;
	z-index: 1;
	color: ${({ theme }) => theme.colors.primary};
	cursor: pointer;
	background-color: rgba(255, 255, 255, 0.8);
`;

const StyledAddChildInside = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const TextUnderLine = styled.hr`
	margin-top: 0rem;
	height: 0.125rem;
	min-width: 0rem;
	background-color: ${({ theme }) => theme.colors.primary};
`;

const ChildNameContainer = styled.div`
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ChlidName = styled.span`
	font-size: 21px;
	font-weight: 700;
	line-height: 42px;
`;

const StyledIconBtnContainer = styled.div`
	cursor: pointer;
	width: 34px;
	height: 34px;
	border: 1px solid #aaaaaa;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Separator = styled.hr`
	font-size: 14px;
	line-height: 25px;
	height: 0.3px;
	min-width: 0rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const LoginButton = styled(Button)`
	font-weight: 700;
	font-size: ${({ theme }) => theme.fontSizes.p3};

	@media only screen and (max-width: 767.98px) {
		width: 152px;
		height: 34px;
	}
	@media only screen and (min-width: 768px) {
		width: 85px;
		height: 31px;
	}
`;

const ProfileImageContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		width: 111px;
		height: 111px;
	}
	@media only screen and (min-width: 768px) {
		width: 168px;
		height: 168px;
	}
`;

const ProfileCol = styled.div`
	width: 168px;
	margin-right: 32px;
`;

const ChildRightInfoContainer = styled(Col)`
	max-width: calc(100% - 150px);
`;

const ChildUserLoginText = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14px;
	line-height: 25px;
	font-family: Noto Sans KR;
`;

const AddressRow = styled(Row)`
	margin-top: 20px;
`;

const InfoLeftContainer = styled.div`
	width: 111px;
`;

export default ChildList;
