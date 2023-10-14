import { useState, useEffect } from "react";
import * as api from "@common/api";
import * as util from "@common/util";
import usePhoneVerificationHandler from "./usePhoneVerificationHandler";

const useRegisterUser = ({ initialValues, isUpdate, isAdmin }) => {
	const [user, setUser] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [disables, setDisables] = useState({});
	const [canSubmit, setCanSubmit] = useState(true);
	const phoneVerificationHandler = usePhoneVerificationHandler({
		phone: user.phone,
		verifyCode: user.verify_code,
		checkUniqueNumber: true,
		handleConfirm: verifiedUser => {
			if (verifiedUser) {
				setUser({ ...user, phone_verify: true });
				setDisables({ ...disables, phone: true, verify_code: true });
			}
		}
	});
	const exceptionEmailString = "이메일 없음";

	useEffect(() => {
		let disables = {};
		if (isUpdate) {
			disables.phone = true;
			disables.user_login = true;
		}

		//기본적으로 작성 못하게 막아주어야 할 폼들
		disables.address = true;
		disables.school = true;

		setDisables(disables);
	}, []);

	/**
	 * 학생 등록 시 체크박스 클릭에 따라 disable이 바뀌면서 값도 함께 바뀌므로 validation을 체크하자
	 */
	useEffect(() => {
		validate();
	}, [disables]);

	useEffect(() => {
		//Button Enable을 위함(업데이트가 아닐때만 최종 validation을 위해 사용하자)
		if (isUpdate) {
			// 전화번호가 바뀐 경우에는 submit 여부를 체크해야 한다.
			if (user.phone_verify === false) {
				setCanSubmit(false);
			} else {
				setCanSubmit(true);
			}
			return;
		}

		if (registerEnable() && Object.keys(errors).length === 0) {
			if (user.email === exceptionEmailString) user.email = "";
			setCanSubmit(true);
		} else {
			setCanSubmit(false);
		}
	}, [user, errors]);

	const registerEnable = () => {
		let enable =
			user.name &&
			user.phone &&
			user.phone_verify &&
			user.user_login &&
			user.password &&
			user.password_confirm &&
			user.address &&
			user.address_detail;

		return enable;
	};

	const handleChange = event => {
		const { name, value } = event.currentTarget;
		//nested object 일 경우 (생년월일 처리)
		if (name.includes("[") && name.includes("]")) {
			let depth1Name = name.substring(0, name.lastIndexOf("["));
			let realName = name.substring(name.lastIndexOf("[") + 1, name.lastIndexOf("]"));

			setUser({
				...user,
				[depth1Name]: {
					...user[depth1Name],
					[realName]: value
				}
			});
		} else {
			// 운영자가 아닌 경우 전화번호를 수정한 경우 다시 인증을 받도록 한다.
			let phoneVerify = user.phone_verify;
			if (isUpdate && !isAdmin && name == "phone") {
				phoneVerify = false;
			}
			setUser({ ...user, [name]: value, phone_verify: phoneVerify });
		}
	};

	/**
	 * 학생 등록에서만 사용되는 Phone 체크박스 로직
	 */
	const handleParentPhoneData = (value, isChecked) => {
		if (isChecked) {
			setUser({ ...user, phone: value, phone_verify: true });
			setDisables({ ...disables, phone: true });
			return;
		}

		setUser({ ...user, phone: "", phone_verify: false });
		setDisables({ ...disables, phone: false });
	};

	/**
	 * 학생 등록에서만 사용되는 Email 체크박스 로직
	 */
	const handleParentEmailData = isChecked => {
		if (isChecked) {
			setUser({ ...user, email: exceptionEmailString });
			setDisables({ ...disables, email: true });
			return;
		}

		setUser({ ...user, email: "" });
		setDisables({ ...disables, email: false });
	};

	/**
	 * 프로필 이미지 교체
	 */
	const handleProfileImage = (useDefault, profileImageFile) => {
		setUser({ ...user, use_default_profile: useDefault, profile_image: profileImageFile });
	};

	const validate = () => {
		let errors = {};
		//전화번호
		if (user.phone && user.phone.length <= 12) {
			errors.phone = true;
		}

		//비밀번호 중복 확인
		if (user.password_confirm && user.password !== user.password_confirm) {
			errors.password = true;
		}

		//이메일 형식 검사
		if (user.email && user.email !== exceptionEmailString) {
			if (!util.validateEmail(user.email)) {
				errors.email = true;
			}
		}

		if (Object.keys(errors).length !== 0) {
			setErrors({ ...errors });
		} else {
			setErrors({});
		}
	};

	const handleKeyUp = () => {
		//휴대폰번호 -를 추가해서 표시하기 위함
		let phone = util.toKoreanPhoneNumber(user.phone);
		setUser({ ...user, phone: phone });

		validate();
	};

	/**
	 * 주소 검색 팝업 띄우는 로직
	 */
	const searchAddress = () => {
		window.open("/thirdParty/searchAddress", "pop", "width=570,height=420, scrollbars=yes, resizable=yes");
		window.jusoCallBack = (address, address_detail) => {
			setUser({ ...user, address, address_detail });
		};
	};

	const searchSchool = () => {
		window.open("/thirdParty/searchSchool", "pop", "width=800,height=420, scrollbars=yes, resizable=yes");
		window.schoolCallback = school => {
			if (school) {
				setUser({ ...user, school });
				setDisables({ ...disables, school: true });
			} else {
				alert("올바른 학교를 선택해 주세요.");
				return;
			}
		};
	};

	return {
		user,
		setUser,
		isUpdate,
		errors,
		disables,
		canSubmit,
		searchSchool,
		handleParentPhoneData,
		handleParentEmailData,
		handleProfileImage,
		handleChange,
		handleKeyUp,
		searchAddress,
		smsRequest: phoneVerificationHandler.smsRequest,
		sendSmsCode: phoneVerificationHandler.sendSmsCode,
		verifySmsCode: phoneVerificationHandler.verifySmsCode
	};
};

export default useRegisterUser;
