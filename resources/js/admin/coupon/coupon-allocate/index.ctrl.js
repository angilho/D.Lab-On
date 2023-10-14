import * as api from "@common/api";
import * as XLSX from "xlsx";

export const userCouponImport = (coupons, callback) => {
	api.userCouponImport(coupons)
		.then(response => {
			if (response.status === 206) {
				alert("일부 회원 쿠폰지급에 실패하였습니다.");
				alert("실패한 회원 아이디 : " + response.data.failed_user_coupons);
				return;
			}
			if (response.status !== 201) {
				alert("회원 쿠폰지급에 실패하였습니다.");
				return;
			}

			alert("회원 쿠폰지급을 완료하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("회원 쿠폰지급에 실패하였습니다.");
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
