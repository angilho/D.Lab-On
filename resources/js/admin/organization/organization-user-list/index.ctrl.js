import * as api from "@common/api";
import * as XLSX from "xlsx";

export const getOrganizationUsers = (query, callback) => {
	api.getOrganizationUsers(query)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const getPaginationLink = (link, callback) => {
	api.getPaginationLink(link)
		.then(response => {
			if (response.data) callback(response.data);
		})
		.catch(err => console.error(err));
};

export const createOrganizationUserImport = (users, callback) => {
	api.createOrganizationUserImport(users)
		.then(response => {
			if (response.status === 206) {
				alert("일부 B2B 회원 추가에 실패하였습니다.");
				alert("실패한 회원이 포함된 열 : " + response.data.failed_users);
				return;
			}
			if (response.status !== 201) {
				alert("B2B 회원 추가에 실패하였습니다.");
				return;
			}

			alert("B2B 회원을 추가하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("B2B 회원 추가에 실패하였습니다.");
		});
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
