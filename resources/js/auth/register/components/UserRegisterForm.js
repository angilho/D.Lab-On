import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import styled, { css } from "styled-components";
import DatePicker from "react-datepicker";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import ProfileImage from "@components/elements/ProfileImage";
import RoleType from "@constants/RoleType";
import Campus from "@constants/Campus";
import useSizeDetector from "@hooks/useSizeDetector";
import * as util from "@common/util";

const UserRegisterForm = ({
	isAdmin,
	isChild,
	align,
	registerUserHandler,
	parentDataHandler,
	onRegister,
	onRegisterOtherChild
}) => {
	const {
		user,
		setUser,
		smsRequest,
		errors,
		disables,
		canSubmit,
		handleChange,
		handleParentPhoneData,
		handleParentEmailData,
		handleProfileImage,
		searchAddress,
		sendSmsCode,
		searchSchool,
		verifySmsCode,
		handleKeyUp,
		isUpdate
	} = registerUserHandler;

	const [useSchoolEtc, setUseSchoolEtc] = useState(false);
	const [showPhoneModify, setShowPhoneModify] = useState(false);
	const SizeDetector = useSizeDetector();

	// 업데이트 상황에서는 사용자 정보가 로드되기 전 상태라면 화면에 표시하지 않는다.
	if (isUpdate && (!user || !user.id)) return null;

	const onModifyPhone = () => {
		setShowPhoneModify(true);
	};

	const renderPhone = () => {
		if (isUpdate) {
			if (isAdmin) {
				return (
					<div className={SizeDetector.isDesktop ? "input-group mb-10" : "input-group"}>
						<WithButtonControl
							className="form-control"
							type="text"
							placeholder="전화번호"
							maxLength="13"
							name="phone"
							value={user.phone || ""} //전화번호 자동 변경을 위해 value 넣어줌
							onKeyUp={handleKeyUp}
							onChange={handleChange}
							admin={isAdmin}
							error={user.phone && user.phone.length > 0 && errors.phone}
						/>
					</div>
				);
			}

			return (
				<div className={SizeDetector.isDesktop ? "input-group mb-10" : "input-group"}>
					<WithButtonControl
						className="form-control"
						type="text"
						placeholder="전화번호"
						maxLength="13"
						name="phone"
						defaultValue={user.phone || ""} //전화번호 자동 변경을 위해 value 넣어줌
						disabled={true}
					/>
					<div className="input-group-append">
						<Button
							type="button"
							className="input-group-text"
							secondary
							size="large"
							onClick={onModifyPhone}
							style={{ marginLeft: "1px" }}
						>
							수정
						</Button>
					</div>
				</div>
			);
		}

		return (
			<div className={SizeDetector.isDesktop ? "input-group mb-10" : "input-group"}>
				<WithButtonControl
					className="form-control"
					type="text"
					placeholder="전화번호"
					maxLength="13"
					name="phone"
					value={user.phone || ""} //전화번호 자동 변경을 위해 value 넣어줌
					onKeyUp={handleKeyUp}
					onChange={handleChange}
					admin={isAdmin}
					error={user.phone && user.phone.length > 0 && errors.phone}
				/>
				<div className="input-group-append">
					<Button
						type="button"
						className="input-group-text"
						secondary
						size="large"
						onClick={sendSmsCode}
						disabled={isAdmin}
					>
						문자 인증
					</Button>
				</div>
			</div>
		);
	};

	return (
		<Row>
			<Col align={align ? align : "center"}>
				<StyledForm>
					<div className="d-flex justify-content-center">
						<ProfileImageContainer>
							<ProfileImage
								user={user}
								gender={user.gender}
								edit={isUpdate}
								handleChangeProfile={handleProfileImage}
							/>
						</ProfileImageContainer>
					</div>
					<div className="mt-32">
						<FormLabel required>이름</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="이름"
							name="name"
							value={user.name || ""}
							onChange={handleChange}
						/>
					</div>
					{isChild && (
						<div className={SizeDetector.isDesktop ? "mb-20" : ""}>
							<FormLabel required>성별</FormLabel>
							<div align="left">
								<Form.Check
									className="d-inline align-"
									type="radio"
									label="남"
									name="gender"
									value="m"
									onChange={handleChange}
									checked={user.gender === "m"}
								/>
								<Form.Check
									className="d-inline ml-10"
									type="radio"
									label="여"
									name="gender"
									value="f"
									onChange={handleChange}
									checked={user.gender === "f"}
								/>
							</div>
						</div>
					)}
					<div>
						{isChild ? (
							<Row xs={2} md={2}>
								<Col md={6}>
									<FormLabel required>전화번호</FormLabel>
								</Col>
								{/**학생 직접 등록 혹은 업데이트가 아닐 경우에는 학부모와 동일 체크박스를 없앤다. */}
								{!isUpdate && isChild && parentDataHandler && (
									<Col align="right">
										<Form.Check
											id="same-phone"
											label="학부모와 동일"
											className={SizeDetector.isDesktop ? "" : "mt-40 mb-20"}
											onChange={event => {
												let value = parentDataHandler("phone");
												handleParentPhoneData(value, event.currentTarget.checked);
											}}
										/>
									</Col>
								)}
							</Row>
						) : (
							<FormLabel required>전화번호</FormLabel>
						)}
						{renderPhone()}
						{showPhoneModify && (
							<React.Fragment>
								<FormLabel required>변경할 전화번호</FormLabel>
								<div className={SizeDetector.isDesktop ? "input-group mb-10" : "input-group"}>
									<WithButtonControl
										className="form-control"
										type="text"
										placeholder="전화번호"
										maxLength="13"
										name="phone"
										value={user.phone || ""} //전화번호 자동 변경을 위해 value 넣어줌
										onKeyUp={handleKeyUp}
										onChange={handleChange}
										admin={isAdmin}
										error={user.phone && user.phone.length > 0 && errors.phone}
									/>
									<div className="input-group-append">
										<Button
											type="button"
											className="input-group-text"
											secondary
											size="large"
											onClick={sendSmsCode}
											disabled={isAdmin}
										>
											문자 인증
										</Button>
									</div>
								</div>
							</React.Fragment>
						)}
						{user.phone && user.phone.length > 0 && errors.phone && (
							<Text p5 className="text-danger mt-10">
								전화번호 형식이 맞지 않습니다.
							</Text>
						)}
					</div>
					<div>
						{smsRequest && (
							<React.Fragment>
								<FormLabel required className={SizeDetector.isDesktop ? "mt-20" : ""}>
									인증번호 확인
								</FormLabel>
								<div className="input-group mb-10">
									<WithButtonControl
										className="form-control"
										type="number"
										maxLength="6"
										name="verify_code"
										placeholder="인증번호 6자리"
										onChange={handleChange}
										disabled={disables.verify_code}
									/>
									<div className="input-group-append">
										<Button
											type="button"
											className="input-group-text"
											secondary
											size="large"
											onClick={verifySmsCode}
											disabled={disables.verify_code}
										>
											인증 확인
										</Button>
									</div>
								</div>
								{!disables.verify_code && (
									<div className="mt-10">
										<Row>
											<Col md="auto">
												<Text p3>인증번호를 받지 못하셨나요?</Text>
											</Col>
											<Col>
												<Text
													p3
													className="justify-content-end"
													underline
													cursor
													onClick={sendSmsCode}
												>
													인증번호 재전송
												</Text>
											</Col>
										</Row>
									</div>
								)}
							</React.Fragment>
						)}
					</div>
					{isChild && (
						<div className={SizeDetector.isDesktop ? "mt-20" : ""}>
							<Row xs={2} md={2} className={SizeDetector.isDesktop ? "mt-20" : ""}>
								<Col xs={3} md={3}>
									<FormLabel required>학교</FormLabel>
								</Col>
								<Col xs={9} md={9} align="right">
									<Form.Check
										id="no-school"
										label="학교 검색이 안될 시 체크해주세요"
										className={SizeDetector.isDesktop ? "" : "mt-40 mb-20"}
										onChange={event => setUseSchoolEtc(!useSchoolEtc)}
										checked={useSchoolEtc}
									/>
								</Col>
							</Row>
							{!useSchoolEtc && (
								<div className="input-group mb-10">
									<WithButtonControl
										className="form-control"
										type="text"
										placeholder="학교"
										name="school"
										onChange={handleChange}
										value={user.school || ""}
										disabled={disables.school}
									/>
									<div className="input-group-append">
										<Button
											type="button"
											className="input-group-text"
											secondary
											size="large"
											onClick={searchSchool}
										>
											학교 검색
										</Button>
									</div>
								</div>
							)}
							{useSchoolEtc && (
								<FormControl
									className="w-100"
									type="text"
									placeholder="학교"
									name="school_etc"
									value={user.school_etc || ""}
									onChange={handleChange}
								/>
							)}
						</div>
					)}
					{isChild && (
						<div>
							<FormLabel required>학년</FormLabel>
							<FormControl
								className="w-100"
								as="select"
								placeholder="학년"
								name="grade"
								value={user.grade}
								onChange={handleChange}
							>
								<option value={1}>초등학교 1학년</option>
								<option value={2}>초등학교 2학년</option>
								<option value={3}>초등학교 3학년</option>
								<option value={4}>초등학교 4학년</option>
								<option value={5}>초등학교 5학년</option>
								<option value={6}>초등학교 6학년</option>
								<option value={7}>중학교 1학년</option>
								<option value={8}>중학교 2학년</option>
								<option value={9}>중학교 3학년</option>
								<option value={10}>고등학교 1학년</option>
								<option value={11}>고등학교 2학년</option>
								<option value={12}>고등학교 3학년</option>
								<option value={13}>고등학교 졸업</option>
								<option value={14}>기타</option>
							</FormControl>
						</div>
					)}
					<div className={SizeDetector.isDesktop ? "mt-20" : ""}>
						{isChild ? (
							<FormLabel required>학생 아이디 (학생 회원 로그인시 사용)</FormLabel>
						) : (
							<FormLabel required>아이디</FormLabel>
						)}

						<FormControl
							className="w-100 form-control"
							type="text"
							placeholder="아이디"
							name="user_login"
							value={user.user_login || ""}
							disabled={disables.user_login}
							onChange={handleChange}
						/>
					</div>
					{/**업데이트일 경우에는 보여줄 필요가 없다 */
					!isUpdate ? (
						<div>
							<FormLabel required>비밀번호</FormLabel>
							<FormControl
								className="w-100"
								type="password"
								name="password"
								autoComplete="on"
								placeholder="비밀번호 (영문, 숫자, 특수문자 조합 최소 8자)"
								onChange={handleChange}
							/>
							<FormLabel required>비밀번호 확인</FormLabel>
							<FormControl
								className="w-100 mb-0"
								type="password"
								placeholder="비밀번호 확인"
								name="password_confirm"
								autoComplete="on"
								onKeyUp={handleKeyUp}
								onChange={handleChange}
								error={errors.password}
							/>
							{errors.password && (
								<Text p5 className="text-danger mt-10">
									입력하신 비밀번호와 다릅니다. 다시 확인해 주세요.
								</Text>
							)}
						</div>
					) : null}
					<div>
						{(isChild && isUpdate) || (isChild && !isUpdate && parentDataHandler) ? (
							<Row xs={2} md={2} className={SizeDetector.isDesktop ? "mt-20" : ""}>
								<Col md={6}>
									<FormLabel>이메일</FormLabel>
								</Col>
								{!isUpdate && parentDataHandler && (
									<Col md={6} align="right">
										<Form.Check
											id="no-email"
											label="이메일 없음"
											className={SizeDetector.isDesktop ? "" : "mt-40 mb-20"}
											onChange={event => {
												handleParentEmailData(event.currentTarget.checked);
											}}
										/>
									</Col>
								)}
							</Row>
						) : (
							<FormLabel required className={SizeDetector.isDesktop ? "mt-20" : ""}>
								이메일
							</FormLabel>
						)}
						<FormControl
							className="w-100 mb-0"
							type="email"
							placeholder="이메일"
							name="email"
							onKeyUp={handleKeyUp}
							value={user.email || ""}
							onChange={handleChange}
							disabled={disables.email}
							error={user.email && user.email.length > 0 && errors.email}
						/>
						{user.email && user.email.length > 0 && errors.email && (
							<Text p5 className="text-danger mt-10">
								이메일 형식이 잘못되었습니다.
							</Text>
						)}
					</div>
					<div>
						<FormLabel required className={SizeDetector.isDesktop ? "mt-20" : ""}>
							생년월일
						</FormLabel>
						<Row>
							<Col md={4} xs={4}>
								<FormControl
									className="w-100 p-0 m-0"
									as="select"
									name="birthday[year]"
									value={user.birthday ? parseInt(user.birthday.year) : 1950}
									onChange={handleChange}
								>
									{[...Array(70).keys()].map(idx => {
										return (
											<option key={idx} value={idx + 1950}>
												{idx + 1950}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col className="p-0 m-0 align-self-center">
								<Text p3>년</Text>
							</Col>
							<Col md={3} xs={3}>
								<FormControl
									className="w-100 p-0 m-0"
									as="select"
									name="birthday[month]"
									value={user.birthday ? parseInt(user.birthday.month) : 1}
									onChange={handleChange}
								>
									{[...Array(12).keys()].map(idx => {
										return (
											<option key={idx} value={idx + 1}>
												{idx + 1}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col className="p-0 m-0 align-self-center">
								<Text p3>월</Text>
							</Col>
							<Col md={3} xs={3}>
								<FormControl
									className="w-100 p-0 m-0"
									as="select"
									name="birthday[day]"
									value={user.birthday ? parseInt(user.birthday.day) : 1}
									onChange={handleChange}
								>
									{[...Array(31).keys()].map(idx => {
										return (
											<option key={idx} value={idx + 1}>
												{idx + 1}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col className="p-0 m-0 align-self-center">
								<Text p3>일</Text>
							</Col>
						</Row>
					</div>
					<FormLabel required className={SizeDetector.isDesktop ? "mt-10" : ""}>
						주소
					</FormLabel>
					<div className="input-group mb-10">
						<WithButtonControl
							className="form-control"
							size="lg"
							type="text"
							placeholder="주소"
							name="address"
							value={user.address || ""}
							disabled={disables.address}
							onChange={handleChange}
						/>
						<div className="input-group-append">
							<Button
								type="button"
								className="input-group-text"
								secondary
								size="large"
								onClick={searchAddress}
							>
								주소 검색
							</Button>
						</div>
					</div>

					<div>
						<FormControl
							className="w-100"
							size="lg"
							type="text"
							placeholder="상세주소 입력"
							name="address_detail"
							value={user.address_detail || ""}
							onChange={handleChange}
						/>
					</div>
					{!isUpdate && (!isChild || (isChild && !parentDataHandler)) && (
						<div className={`d-flex flex-column align-items-start mb-40`}>
							<FormLabel required>어떻게 디랩온을 알게 되었나요?</FormLabel>
							<Form.Check
								type="radio"
								label="지인 소개"
								value="지인 소개"
								id="radio-inflow-path-1"
								name="inflow_path"
								checked={user.inflow_path === "지인 소개"}
								onChange={handleChange}
							/>
							<Form.Check
								type="radio"
								label="재원생"
								value="재원생"
								name="inflow_path"
								id="radio-inflow-path-2"
								checked={user.inflow_path === "재원생"}
								onChange={handleChange}
							/>
							<Form.Check
								type="radio"
								label="검색"
								value="검색"
								name="inflow_path"
								id="radio-inflow-path-3"
								checked={user.inflow_path === "검색"}
								onChange={handleChange}
							/>
							<Form.Check
								type="radio"
								label="기타"
								value="기타"
								name="inflow_path"
								id="radio-inflow-path-5"
								checked={user.inflow_path === "기타"}
								onChange={handleChange}
							/>
							{user.inflow_path === "기타" && (
								<FormControl
									className="mt-10 mb-10 w-100"
									type="text"
									placeholder="기타"
									name="inflow_path_etc"
									onChange={handleChange}
								/>
							)}
							<Form.Check
								type="radio"
								label="에듀플러스위크"
								value="에듀플러스위크"
								name="inflow_path"
								id="radio-inflow-path-6"
								checked={user.inflow_path === "에듀플러스위크"}
								onChange={handleChange}
							/>
							<Form.Check
								type="radio"
								label="해당 없음"
								value="해당 없음"
								id="radio-inflow-path-4"
								name="inflow_path"
								onChange={handleChange}
							/>
						</div>
					)}
					{isUpdate && user.role === RoleType.INSTRUCTOR && (
						<React.Fragment>
							<FormLabel>사원번호</FormLabel>
							<FormControl
								className="w-100 form-control"
								type="text"
								value={user.employee_number || ""}
								disabled={true}
							/>
							<FormLabel required>재직기간</FormLabel>
							<Row className="align-items-center">
								<Col md={5}>
									<StyledDatePicker
										selected={user.start_at_date}
										onChange={date => {
											setUser({
												...user,
												start_at: util.getFormatDate(date, "-"),
												start_at_date: date
											});
										}}
										dateFormat="yyyy-MM-dd"
									/>
								</Col>
								<Col md={2} className="text-center">
									~
								</Col>
								<Col md={5}>
									<StyledDatePicker
										selected={user.end_at_date}
										onChange={date => {
											setUser({
												...user,
												end_at: util.getFormatDate(date, "-"),
												end_at_date: date
											});
										}}
										dateFormat="yyyy-MM-dd"
									/>
								</Col>
							</Row>
							<FormLabel required className="mt-3">
								성별
							</FormLabel>
							<div key="inline-radio-2" className="mb-1 text-left">
								<Form.Check
									inline
									label="남자"
									type="radio"
									id="gender-male"
									onChange={event => setUser({ ...user, gender: "m" })}
									checked={user.gender == "m"}
								/>
								<Form.Check
									inline
									label="여자"
									type="radio"
									id="gender-female"
									onChange={event => setUser({ ...user, gender: "f" })}
									checked={user.gender == "f"}
								/>
							</div>
						</React.Fragment>
					)}
					<Row>
						<Col>
							<FormLabel required>디랩코딩학원</FormLabel>
							<FormControl
								className="w-100 p-0 m-0"
								as="select"
								name="campus"
								value={user.campus}
								onChange={handleChange}
							>
								{Campus.allCampus().map((value, idx) => {
									return (
										<option key={idx} value={value}>
											{Campus.convertToString(value)}
										</option>
									);
								})}
							</FormControl>
						</Col>
					</Row>
					{/**뷰 버그 수정 */}
					{isChild ? (
						<div className={SizeDetector.isDesktop ? "mt-40" : ""}>
							<Button
								primary
								size="large"
								className="w-100 m-0"
								disabled={!canSubmit}
								onClick={onRegister}
							>
								<span>{!isUpdate ? "가입하기" : "수정내용 저장"}</span>
							</Button>

							{onRegisterOtherChild && (
								<Button
									secondary
									size="large"
									className="w-100 m-0 mt-10"
									disabled={!canSubmit}
									onClick={onRegisterOtherChild}
								>
									<span>가입 완료 및 자녀 추가 등록</span>
								</Button>
							)}
						</div>
					) : (
						<div className={SizeDetector.isDesktop ? "mt-40" : ""}>
							<SizeDetector.Desktop>
								<Button
									primary
									size="large"
									className="w-100 m-0"
									disabled={!canSubmit}
									onClick={onRegister}
								>
									<span>{!isUpdate ? "가입하기" : "수정내용 저장"}</span>
								</Button>
							</SizeDetector.Desktop>
							<SizeDetector.Mobile>
								<Button
									primary
									size="large"
									className="w-100 fixed-bottom rounded-0"
									disabled={!canSubmit}
									onClick={onRegister}
								>
									<span>{!isUpdate ? "가입하기" : "수정내용 저장"}</span>
								</Button>
							</SizeDetector.Mobile>
						</div>
					)}
				</StyledForm>
			</Col>
		</Row>
	);
};

const WithButtonControl = styled(FormControl)`
	border-right: 1px solid ${({ theme }) => theme.colors.primary};
	&:disabled {
		border-right: 0px;
	}
	${props =>
		props.admin &&
		css`
			border-right: 1px solid ${({ theme }) => theme.colors.gray};
		`}
`;

const StyledForm = styled.div`
	max-width: 378px;
`;

const ProfileImageContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		width: 160px;
		height: 160px;
	}
	@media only screen and (min-width: 768px) {
		width: 220px;
		height: 220px;
	}
`;

const StyledDatePicker = styled(DatePicker)`
	border: 0.063rem solid #e1e1e1;
	padding: 1px 2px 1px 2px;
	text-indent: 1rem;
	border-radius: 0.25rem;
	width: 100%;
	height: 3rem;
`;

export default UserRegisterForm;
