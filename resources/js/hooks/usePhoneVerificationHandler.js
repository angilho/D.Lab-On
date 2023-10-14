import { useState, useEffect } from "react";
import * as api from "@common/api";

const usePhoneVerificationHandler = ({ phone, verifyCode, checkUniqueNumber, handleConfirm }) => {
	const [smsRequest, setSmsRequest] = useState(false);
	const [successInfo, setSuccessInfo] = useState(null);

	useEffect(() => {
		//문자인증 Rechaptcha를 위한 Obj
		if (!window.RecaptchaVerifier) {
			setTimeout(function() {
				try {
					window.RecaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
						size: "invisible",
						callback: response => {
							// reCAPTCHA solved, allow signInWithPhoneNumber.
							sendSmsCode();
						}
					});
				} catch (e) {
					console.log(e);
				}
			}, 1000);
		}
	}, []);

	const sendSmsCode = () => {
		if (!phone) return;

		if (!checkUniqueNumber) {
			sendSmsCodeToFirebase();
			return;
		}

		//전송 보내기 전 이미 있는 핸드폰인지 검사한다.
		api.checkUserPhone(phone)
			.then(res => {
				if (res.status === 204) {
					sendSmsCodeToFirebase();
				}
			})
			.catch(err => {
				console.error(err);
			});
	};

	const sendSmsCodeToFirebase = () => {
		const phoneNumber = `+82 ${phone}`;
		const appVerifier = window.RecaptchaVerifier;

		firebase
			.auth()
			.signInWithPhoneNumber(phoneNumber, appVerifier)
			.then(result => {
				setSmsRequest(true);
				window.confirmationResult = result;
			})
			.catch(error => {
				console.error(error);
				if (error.code === "auth/too-many-requests") {
					alert("너무 많은 요청을 보냈습니다. 잠시 후에 다시 시도해 주세요.");
				} else {
					alert("SMS 전송에 실패하였습니다.");
				}
			});
	};

	const verifySmsCode = () => {
		//이미 인증 성공을 했는데 또 보내는 경우 handleConfirm만 보내주자.
		if (successInfo) {
			handleConfirm(successInfo);
		}

		if (!verifyCode) {
			alert("인증번호를 올바르게 입력해 주세요.");
			return;
		}

		// SMS sent. Prompt user to type the code from the message, then sign the
		// user in with confirmationResult.confirm(code).
		window.confirmationResult
			.confirm(verifyCode)
			.then(res => {
				if (res.user) {
					setSuccessInfo(res.user);
					handleConfirm(res.user);
				} else alert("인증에 실패하였습니다.");
			})
			.catch(err => {
				console.error(err);
				if (err.code === "auth/invalid-verification-code") {
					alert("인증번호가 올바르지 않습니다.");
					return;
				}
			});
	};

	return {
		smsRequest,
		sendSmsCode,
		verifySmsCode
	};
};

export default usePhoneVerificationHandler;
