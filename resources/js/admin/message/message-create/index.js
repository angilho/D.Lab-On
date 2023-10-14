import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UserSearchModal from "./components/UserSearchModal";
import * as utils from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminMessageCreate = () => {
	const history = useHistory();
	const [message, setMessage] = useState(ctrl.getDefaultMessage());
	const [messageTo, setMessageTo] = useState("");
	const [messageToList, setMessageToList] = useState([]);
	const [messageToExcelFile, setMessageToExcelFile] = useState(null);
	const excelFile = useRef(null);
	const [showUserSearchModal, setShowUserSearchModal] = useState(false);

	const addMessageTo = phone => {
		if (!utils.validatePhoneNumber(phone)) {
			alert("휴대폰 번호를 확인하여 주십시오");
			return;
		}
		setMessageToList([...messageToList, phone]);
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
			setMessageToList([...new Set(messageToList.concat(excelMessageToList))]);
		}
	};

	const onClickRemoveMessageTo = index => {
		setMessageToList([...new Set([...messageToList.slice(0, index), ...messageToList.slice(index + 1)])]);
	};

	return (
		<div className="mt-3">
			<section>
				<h4>발신 정보</h4>
				<Row>
					<Col>
						<FormLabel required>발신 번호</FormLabel>
						<FormControl
							type="text"
							placeholder="010-1111-1111"
							disabled
							value={message.from}
							onKeyUp={() => setMessage({ ...message, from: utils.toKoreanPhoneNumber(message.from) })}
							onChange={event => setMessage({ ...message, from: event.currentTarget.value })}
						/>
					</Col>
				</Row>
			</section>
			<hr />
			<section>
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
			<hr />
			<section>
				<h4>SMS 발송 문구</h4>
				<Row>
					<Col>
						<FormLabel required>제목</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="제목을 입력해 주세요"
							value={message.title}
							onChange={event => setMessage({ ...message, title: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormLabel required>내용</FormLabel>
						<FormControl
							className="w-100"
							as="textarea"
							value={message.description ? message.description : ""}
							placeholder="내용을 입력해 주세요"
							onChange={event => setMessage({ ...message, description: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row className="mt-3 mb-3 justify-content-end">
					<Col md={2}>
						<Button
							primary
							size="large"
							className="w-100"
							onClick={() =>
								ctrl.handleSendMessage(message, messageToList, () =>
									history.push({ pathname: "/admin/messages" })
								)
							}
						>
							전송하기
						</Button>
					</Col>
				</Row>
			</section>
			<UserSearchModal
				show={showUserSearchModal}
				onHide={() => setShowUserSearchModal(false)}
				handleAdd={phone => {
					setShowUserSearchModal(false);
					addMessageTo(phone);
				}}
			/>
		</div>
	);
};

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

export default AdminMessageCreate;
