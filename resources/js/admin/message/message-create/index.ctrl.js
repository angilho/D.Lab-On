import * as api from "@common/api";
import * as XLSX from "xlsx";

export const getDefaultMessage = () => ({
	from: "031-526-9313",
	title: "",
	description: ""
});

export const handleSendMessage = (message, messageToList, callback) => {
	if (!validateMessage(message, messageToList)) return;

	api.sendMessage({
		...message,
		to: messageToList
	}).then(response => {
		if (response.status !== 201) {
			alert("SMS 발송에 실패하였습니다.");
			return;
		}

		alert("SMS를 발송하였습니다.");
		callback();
	});
};

export const validateMessage = (message, messageToList) => {
	if (!message.title) {
		alert("SMS 메세지 제목이 없습니다.");
		return false;
	}
	if (!message.description) {
		alert("SMS 메세지 내용이 없습니다.");
		return false;
	}
	if (!message.from) {
		alert("SMS 메세지 발신번호가 없습니다.");
		return false;
	}
	if (messageToList.length === 0) {
		alert("SMS 메세지 수신자 번호가 없습니다.");
		return false;
	}
	return true;
};

/**
 * File이 Binary Stream으로 로드되었을 때 발생하는 이벤트
 */
export const handleOnFileLoad = (e, rABS, callback) => {
	try {
		/* Parse data */
		let bstr = e.target.result;
		let wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
		/* Get first worksheet */
		let wsname = wb.SheetNames[0];
		let ws = wb.Sheets[wsname];
		/* Convert array of arrays */
		let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

		callback(data);
	} catch (e) {
		console.log(e);
	}
};
