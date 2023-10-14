import SmsNotificationType from "@constants/SmsNotificationType";

import * as api from "@common/api";
import * as XLSX from "xlsx";

export const getDefaultSmsNotification = () => ({
	type: SmsNotificationType.COURSE_THREE_DAY_BEFORE,
	name: "",
	course_id: null,
	section_id: null,
	course_type: null,
	course_section_name: "",
	receiver: "all",
	start_at: "",
	start_at_date: null,
	end_at: "",
	end_at_date: null,
	reserved_hour: 9,
	reserved_minute: 0,
	sms_title: "",
	sms_description: ""
});

export const getSmsNotification = (smsNotificationId, callback) => {
	api.getSmsNotification(smsNotificationId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (smsNotification, messageToList, callback) => {
	if (!validateSmsNotification(smsNotification, messageToList)) return;

	api.createSmsNotification({
		...smsNotification,
		receiver_list: messageToList
	})
		.then(response => {
			if (response.status !== 201) {
				alert("SMS 노티 등록에 실패하였습니다.");
				return;
			}

			alert("SMS 노티를 등록하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("SMS 노티 등록에 실패하였습니다.");
		});
};

export const handleUpdate = (smsNotificationId, smsNotification, smsReceiverList, callback) => {
	let messageToList = smsReceiverList.map(receiver => {
		return { user_id: receiver.user.id, phone: receiver.phone };
	});
	if (!validateSmsNotification(smsNotification, messageToList)) return;

	api.updateSmsNotification(smsNotificationId, {
		...smsNotification,
		receiver_list: messageToList
	})
		.then(response => {
			if (response.status !== 201) {
				alert("SMS 노티 수정에 실패하였습니다.");
				return;
			}

			alert("SMS 노티를 수정하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("SMS 노티 수정에 실패하였습니다.");
		});
};

export const handleDelete = (smsNotificationId, callback) => {
	if (confirm("SMS 노티를 삭제하시겠습니까?")) {
		api.deleteSmsNotification(smsNotificationId)
			.then(response => {
				if (response.status !== 204) {
					alert("SMS 노티 삭제에 실패하였습니다.");
					return;
				}

				alert("SMS 노티를 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				console.error(err);
				alert("SMS 노티 삭제에 실패하였습니다.");
			});
	}
};

export const validateSmsNotification = (smsNotification, messageToList) => {
	if (!smsNotification.name) {
		alert("노티명이 없습니다.");
		return false;
	}
	if (!smsNotification.course_id || !smsNotification.section_id) {
		alert("노티 대상 과목이 없습니다.");
		return false;
	}
	if (!smsNotification.start_at) {
		alert("예약발송 시작일이 없습니다.");
		return false;
	}
	if (!smsNotification.end_at) {
		alert("예약발송  종료일이 없습니다.");
		return false;
	}
	if (smsNotification.receiver === "part" && messageToList.length === 0) {
		alert("메세지 수신자 번호가 없습니다.");
		return false;
	}
	if (!smsNotification.sms_title) {
		alert("SMS 발송 문구 제목이 없습니다.");
		return false;
	}
	if (!smsNotification.sms_description) {
		alert("SMS 발송 문구 내용이 없습니다.");
		return false;
	}
	if (smsNotification.start_at_date < new Date()) {
		alert("시작시간을 현재보다 미래의 시간을 입력하세요.");
		return false;
	}
	if (smsNotification.end_at_date < new Date()) {
		alert("종료시간을 현재보다 미래의 시간을 입력하세요.");
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

export const handleExportSmsNotificationHistory = smsNotificationId => {
	window.location.href = `/admin/export/sms_notification_histories/${smsNotificationId}`;
};
