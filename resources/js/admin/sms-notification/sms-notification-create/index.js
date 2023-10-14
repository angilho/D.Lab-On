import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UserSearchModal from "./components/UserSearchModal";
import CourseSearchModal from "./components/CourseSearchModal";
import SmsNotificationType from "@constants/SmsNotificationType";
import CourseType from "@constants/CourseType";

import * as utils from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminSmsNotificationCreate = ({ sms_notification_id }) => {
	const history = useHistory();
	const excelFile = useRef(null);

	const [smsNotification, setSmsNotification] = useState(ctrl.getDefaultSmsNotification());
	const [messageTo, setMessageTo] = useState("");
	const [messageToList, setMessageToList] = useState([]);
	const [messageToExcelFile, setMessageToExcelFile] = useState(null);
	const [smsReceiverList, setSmsReceiverList] = useState([]);
	const [showUserSearchModal, setShowUserSearchModal] = useState(false);
	const [showCourseSearchModal, setShowCourseSearchModal] = useState(false);

	const isEdit = sms_notification_id ? true : false;

	useEffect(() => {
		if (isEdit) {
			ctrl.getSmsNotification(sms_notification_id, data => {
				setSmsNotification({
					...data,
					course_type: data.course.type,
					course_section_name: `${data.course.name}(${data.course.dlab_course_code}, ID:${data.section_id})`,
					start_at_date: new Date(data.start_at),
					end_at_date: new Date(data.end_at)
				});
				if (data.receiver === "part") {
					setSmsReceiverList(data.receiver_list);
				}
			});
		}
	}, []);

	const addMessageTo = phone => {
		if (!utils.validatePhoneNumber(phone)) {
			alert("휴대폰 번호를 확인하여 주십시오");
			return;
		}
		setMessageToList([...new Set([...messageToList, phone])]);
		setMessageTo("");
	};

	const onClickAddMessageTo = () => {
		addMessageTo(messageTo);
	};

	const onClickPasteMessageTo = () => {
		navigator.clipboard
			.readText()
			.then(text => {
				// 클립보드에 있는 내용 중 핸드폰 번호를 줄바꿈으로 구분하여 가져온다.
				let clipboardMessageToList = text
					.split("\n")
					.filter(phoneNumber => utils.validatePhoneNumber(phoneNumber));
				if (clipboardMessageToList.length !== 0) {
					setMessageToList([...new Set(messageToList.concat(clipboardMessageToList))]);
				}
			})
			.catch(err => {
				console.error("Failed to read clipboard contents: ", err);
			});
	};

	const onClickExcelFileUpload = () => {
		excelFile.current.click();
	};

	const onClickExcelFileDownload = () => {
		window.location.href = "/static/sample/sample_sms.xlsx";
	};

	useEffect(() => {
		if (!messageToExcelFile || !messageToExcelFile.name.includes("xls")) return;

		try {
			let fileReader = new FileReader();

			const rABS = !!fileReader.readAsBinaryString;
			fileReader.onload = e => ctrl.handleOnFileLoad(e, rABS, parseExcelFile);
			if (rABS) fileReader.readAsBinaryString(messageToExcelFile);
		} catch (e) {
			console.log(e);
			alert("잘못된 엑셀 파일을 업로드 하였습니다.");
		}
	}, [messageToExcelFile]);

	const parseExcelFile = excelData => {
		// 파싱한 Excel 정보에서 헤더가 없을 경우
		if (excelData.length == 0 || !excelData[0]) {
			alert("잘못된 엑셀 파일을 업로드 하였습니다.");
		}
		// 헤더를 뺀다.
		excelData.splice(0, 1);
		// 핸드폰 번호 validation 후 추가한다.
		let excelMessageToList = excelData.filter(phoneNumber => utils.validatePhoneNumber(phoneNumber));
		if (excelMessageToList.length !== 0) {
			let flattenExcelMessageToList = excelMessageToList.map(e => {
				return e[0];
			});
			setMessageToList([...new Set(messageToList.concat(flattenExcelMessageToList))]);
		}
	};

	const onClickRemoveMessageTo = index => {
		setMessageToList([...new Set([...messageToList.slice(0, index), ...messageToList.slice(index + 1)])]);
	};

	const downloadSmsNotificationHistory = () => {
		ctrl.handleExportSmsNotificationHistory(sms_notification_id);
	};

	const addSmsReceiver = user => {
		setSmsReceiverList([...smsReceiverList, { user: { id: user.id, name: user.name }, phone: user.phone }]);
	};

	const deleteReceiver = receiverIdx => {
		if (confirm("삭제하시겠습니까?")) {
			setSmsReceiverList([...smsReceiverList.slice(0, receiverIdx), ...smsReceiverList.slice(receiverIdx + 1)]);
		}
	};

	return (
		<div className="mt-3">
			<section>
				<Row>
					<Col>
						<FormLabel required>노티명</FormLabel>
						<FormControl
							type="text"
							placeholder="노티명을 입력하여 주세요"
							value={smsNotification.name}
							onChange={event =>
								setSmsNotification({ ...smsNotification, name: event.currentTarget.value })
							}
						/>
					</Col>
				</Row>
			</section>
			<section>
				<Row>
					<Col>
						<FormLabel required>과목</FormLabel>
						<FormControl
							className="d-inline"
							type="text"
							placeholder="과목을 검색해 주세요"
							disabled
							value={smsNotification.course_section_name}
						/>
						<CourseSearchButton primary size="large" onClick={() => setShowCourseSearchModal(true)}>
							검색
						</CourseSearchButton>
					</Col>
				</Row>
			</section>
			<section>
				<Row>
					<Col>
						<FormLabel required>수신자</FormLabel>
						<div key="inline-radio" className="mb-1">
							<Form.Check
								inline
								label="과목수강자 전원"
								type="radio"
								id="receiver-all"
								onChange={event => setSmsNotification({ ...smsNotification, receiver: "all" })}
								checked={smsNotification.receiver == "all"}
							/>
							<Form.Check
								inline
								label="과목수강자 일부"
								type="radio"
								id="receiver-part"
								onChange={event => setSmsNotification({ ...smsNotification, receiver: "part" })}
								checked={smsNotification.receiver == "part"}
							/>
						</div>
					</Col>
				</Row>
			</section>
			{!isEdit && smsNotification.receiver == "part" && (
				<section className="mt-3">
					<h4>수신자 편집</h4>
					<Row>
						<Col>
							<FormLabel required>휴대폰 번호</FormLabel>
						</Col>
					</Row>
					<Row>
						<Col md="auto">
							<FormControl
								type="text"
								placeholder="010-1111-1111"
								value={messageTo}
								onKeyUp={() => setMessageTo(utils.toKoreanPhoneNumber(messageTo))}
								onChange={event => setMessageTo(event.currentTarget.value)}
							/>
						</Col>
						<Col md={2}>
							<Button secondary size="large" className="w-100" onClick={onClickAddMessageTo}>
								추가
							</Button>
						</Col>
					</Row>
					<Row noGutters>
						<ButtonContainer className="mr-2" md={2}>
							<Button secondary className="w-100" onClick={onClickPasteMessageTo}>
								복사하여 붙여넣기
							</Button>
						</ButtonContainer>
						<ButtonContainer className="mr-2" md={2}>
							<Button secondary className="w-100" onClick={onClickExcelFileUpload}>
								엑셀 업로드
							</Button>
							<input
								type="file"
								id="file"
								ref={excelFile}
								style={{ display: "none" }}
								onChange={event => setMessageToExcelFile(event.currentTarget.files[0])}
							/>
						</ButtonContainer>
						<ButtonContainer className="mr-2" md={2}>
							<Button secondary className="w-100" onClick={onClickExcelFileDownload}>
								엑셀 양식 다운로드
							</Button>
						</ButtonContainer>
						<ButtonContainer md={2}>
							<Button secondary className="w-100" onClick={() => setShowUserSearchModal(true)}>
								회원 검색
							</Button>
						</ButtonContainer>
					</Row>
					<Row className="mt-3">
						<Col md={8}>
							<MessageToList>
								{messageToList.map((messageTo, index) => {
									return (
										<div className="d-flex align-items-center" key={index}>
											<MessageToItem>{messageTo}</MessageToItem>
											<CloseRoundedIcon
												className="ml-1 cursor-pointer"
												style={{ fontSize: 16 }}
												onClick={() => onClickRemoveMessageTo(index)}
											/>
										</div>
									);
								})}
							</MessageToList>
						</Col>
						<Col md={4}>
							<h4>선택된 수신자</h4>
							<Text h5 primary>
								{messageToList.length} 명
							</Text>
						</Col>
					</Row>
				</section>
			)}
			{isEdit && smsNotification.receiver == "all" && (
				<section className="mt-3">
					<h4>SMS 수신리스트</h4>
					<Button primary size="large" onClick={() => downloadSmsNotificationHistory()}>
						발송내역 다운로드
					</Button>
				</section>
			)}
			{isEdit && smsNotification.receiver == "part" && (
				<section className="mt-3">
					<h4>SMS 수신리스트</h4>
					<Button primary size="large" onClick={() => setShowUserSearchModal(true)}>
						수신자 추가
					</Button>
					<Button primary size="large" onClick={() => downloadSmsNotificationHistory()}>
						발송내역 다운로드
					</Button>
					<ReceiverTable striped bordered hover className="mt-3">
						<thead>
							<tr>
								<th>번호</th>
								<th>이름</th>
								<th>수신번호</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{smsReceiverList.map((receiver, idx) => {
								return (
									<tr key={idx}>
										<td>{idx + 1}</td>
										<td>{receiver.user?.name ?? "-"}</td>
										<td>{receiver.phone}</td>
										<td>
											<DeleteAction onClick={() => deleteReceiver(idx)}>삭제</DeleteAction>
										</td>
									</tr>
								);
							})}
						</tbody>
					</ReceiverTable>
				</section>
			)}
			<section className="mt-3">
				<Row>
					<Col md={6}>
						<FormLabel required>예약발송 타입</FormLabel>
						<FormControl
							className="w-100 p-0 m-0"
							as="select"
							name="campus"
							value={smsNotification.type}
							onChange={event =>
								setSmsNotification({ ...smsNotification, type: event.currentTarget.value })
							}
						>
							{smsNotification.course_type !== null && smsNotification.course_type !== CourseType.VOD && (
								<option value={SmsNotificationType.COURSE_THREE_DAY_BEFORE}>
									{SmsNotificationType.convertToString(SmsNotificationType.COURSE_THREE_DAY_BEFORE)}
								</option>
							)}
							{smsNotification.course_type !== null && smsNotification.course_type !== CourseType.VOD && (
								<option value={SmsNotificationType.COURSE_ONE_DAY_BEFORE}>
									{SmsNotificationType.convertToString(SmsNotificationType.COURSE_ONE_DAY_BEFORE)}
								</option>
							)}
							{smsNotification.course_type === CourseType.REGULAR && (
								<option value={SmsNotificationType.REGULAR_LESSON_BEFORE}>
									{SmsNotificationType.convertToString(SmsNotificationType.REGULAR_LESSON_BEFORE)}
								</option>
							)}
							{smsNotification.course_type === CourseType.VOD && (
								<option value={SmsNotificationType.VOD_END_ONE_MONTH_BEFORE}>
									{SmsNotificationType.convertToString(SmsNotificationType.VOD_END_ONE_MONTH_BEFORE)}
								</option>
							)}
							{smsNotification.course_type === CourseType.VOD && (
								<option value={SmsNotificationType.VOD_END_ONE_WEEK_BEFORE}>
									{SmsNotificationType.convertToString(SmsNotificationType.VOD_END_ONE_WEEK_BEFORE)}
								</option>
							)}
							{smsNotification.course_type === CourseType.VOD && (
								<option value={SmsNotificationType.VOD_ENCOURAGE}>
									{SmsNotificationType.convertToString(SmsNotificationType.VOD_ENCOURAGE)}
								</option>
							)}
						</FormControl>
					</Col>
				</Row>
			</section>
			<section className="mt-3">
				<Row>
					<Col md={6}>
						<FormLabel required>예약발송 기간</FormLabel>
						<Row className="align-items-center">
							<Col md={5}>
								<StyledDatePicker
									selected={smsNotification.start_at_date}
									onChange={date => {
										setSmsNotification({
											...smsNotification,
											start_at: utils.getFormatDate(date, "-"),
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
									selected={smsNotification.end_at_date}
									onChange={date => {
										setSmsNotification({
											...smsNotification,
											end_at: utils.getFormatDate(date, "-"),
											end_at_date: date
										});
									}}
									dateFormat="yyyy-MM-dd"
								/>
							</Col>
						</Row>
					</Col>
				</Row>
			</section>
			{smsNotification.type !== SmsNotificationType.REGULAR_LESSON_BEFORE && (
				<section className="mt-3">
					<Row>
						<Col md={3}>
							<FormLabel required>예약발송 시간</FormLabel>
							<FormControl
								className="w-100 p-0 m-0"
								as="select"
								name="campus"
								value={smsNotification.reserved_hour}
								onChange={event =>
									setSmsNotification({ ...smsNotification, reserved_hour: event.currentTarget.value })
								}
							>
								{[...Array(13).keys()].map(idx => {
									return <option key={idx} value={idx + 9}>{`${utils.pad(idx + 9)}:00`}</option>;
								})}
							</FormControl>
						</Col>
					</Row>
				</section>
			)}
			<hr className="mt-5" />
			<section className="mt-5">
				<h4>SMS 발송 문구</h4>
				<Row>
					<Col>
						<FormLabel required>제목</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="제목을 입력해 주세요"
							value={smsNotification.sms_title}
							onChange={event =>
								setSmsNotification({ ...smsNotification, sms_title: event.currentTarget.value })
							}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>내용</FormLabel>
						<FormControl
							className="w-100"
							as="textarea"
							value={smsNotification.sms_description}
							placeholder="내용을 입력해 주세요"
							onChange={event =>
								setSmsNotification({ ...smsNotification, sms_description: event.currentTarget.value })
							}
						/>
					</Col>
				</Row>
				<Row className="mt-3 mb-3 justify-content-end">
					{isEdit && (
						<React.Fragment>
							<Col md={2}>
								<Button
									danger
									size="large"
									className="w-100"
									onClick={() =>
										ctrl.handleDelete(sms_notification_id, () =>
											history.push({ pathname: "/admin/sms_notifications" })
										)
									}
								>
									알림삭제
								</Button>
							</Col>
							<Col md={2}>
								<Button
									primary
									size="large"
									className="w-100"
									onClick={() =>
										ctrl.handleUpdate(sms_notification_id, smsNotification, smsReceiverList, () =>
											history.push({ pathname: "/admin/sms_notifications" })
										)
									}
								>
									저장
								</Button>
							</Col>
						</React.Fragment>
					)}
					{!isEdit && (
						<Col md={2}>
							<Button
								primary
								size="large"
								className="w-100"
								onClick={() =>
									ctrl.handleCreate(smsNotification, messageToList, () =>
										history.push({ pathname: "/admin/sms_notifications" })
									)
								}
							>
								전송예약
							</Button>
						</Col>
					)}
				</Row>
			</section>
			<UserSearchModal
				show={showUserSearchModal}
				onHide={() => setShowUserSearchModal(false)}
				handleAdd={user => {
					setShowUserSearchModal(false);
					if (isEdit) {
						addSmsReceiver(user);
					} else {
						addMessageTo(user.phone);
					}
				}}
			/>
			<CourseSearchModal
				show={showCourseSearchModal}
				onHide={() => setShowCourseSearchModal(false)}
				handleAdd={(course, section) => {
					setShowCourseSearchModal(false);
					let defaultType;
					switch (course.type) {
						case CourseType.REGULAR:
						case CourseType.ONEONONE:
						case CourseType.PACKAGE:
							defaultType = SmsNotificationType.COURSE_THREE_DAY_BEFORE;
							break;
						case CourseType.VOD:
							defaultType = SmsNotificationType.VOD_END_ONE_MONTH_BEFORE;
							break;
					}
					setSmsNotification({
						...smsNotification,
						type: defaultType,
						course_id: course.id,
						section_id: section.id,
						course_type: course.type,
						course_section_name: `${course.name}(${course.dlab_course_code}, ID:${section.id})`
					});
				}}
			/>
		</div>
	);
};

const CourseSearchButton = styled(Button)`
	width: 100px;
	margin-left: 16px;
`;

const StyledDatePicker = styled(DatePicker)`
	border: 0.063rem solid #e1e1e1;
	padding: 1px 2px 1px 2px;
	text-indent: 1rem;
	border-radius: 0.25rem;
	width: 100%;
	height: 3rem;
`;

const MessageToList = styled.ul`
	height: 200px;
	padding: 1rem;
	list-style: none;
	border: 1px solid gray;
	overflow-y: auto;
`;

const MessageToItem = styled.li`
	& + & {
		margin-top: 0.5rem;
	}
`;

const ButtonContainer = styled(Col)`
	min-width: 170px;
`;

const ReceiverTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

const DeleteAction = styled.span`
	color: blue;
	text-decoration: underline;
	cursor: pointer;
`;

export default AdminSmsNotificationCreate;
