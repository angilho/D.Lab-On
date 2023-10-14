import * as api from "@common/api";

export const getPayment = (userId, paymentId, callback) => {
	api.getPayment(userId, paymentId)
		.then(response => {
			if (response.data) {
				callback(response.data);
			}
		})
		.catch(err => {
			console.error(err);
		});
};

export const createPayment = (coupon, method, user, callback) => {
	api.createPayment(user.id, coupon, method)
		.then(response => {
			if (response.data && response.data.id) {
				// 무료 결재인 경우는 바로 등록 처리를 진행한다.
				if (response.data.price === 0) {
					api.completePayment(user.id, response.data.id, null, response.data.merchant_uid)
						.then(result => {
							if (result.data) {
								callback({ id: response.data.id });
							}
						})
						.catch(err => {
							alert("무료결제정보 생성 중 오류가 발생하였습니다.");
							callback(false);
						});
					return;
				}
				IMP.init(response.data.iamport_user_code);
				// IMP.request_pay(param, callback) 호출
				IMP.request_pay(
					{
						// param
						pg: response.data.pg,
						pay_method: method,
						merchant_uid: response.data.merchant_uid,
						name: response.data.name,
						amount: response.data.price,
						buyer_email: user.email,
						buyer_name: user.name,
						buyer_tel: user.phone,
						buyer_addr: user.address,
						m_redirect_url: `${window.location.origin}/payment`
					},
					rsp => paymentResponse(rsp, user.id, response.data.id, response.data.merchant_uid, callback)
				);
			} else {
				alert("결제정보 생성 중 오류가 발생하였습니다.");
				callback(false);
			}
		})
		.catch(err => {
			alert("결제정보 생성 중 오류가 발생하였습니다.");
			console.error(err);
		});
};

/**
 * 모바일에서 결제가 완료되고 호출되는 함수
 */
export const paymentCompleteMobile = (userId, merchantUid, impUid, impSuccess, errorMsg, callback) => {
	//merchantUid를 이용해 요청한 payment Object를 찾는다.
	let query = {
		"filter[merchant_uid]": merchantUid
	};

	api.getPayments(userId, query)
		.then(res => {
			if (res.data && res.data.length > 0) {
				if (!impSuccess) {
					// 결제 실패 시 payment 정보를 제거하고 paymentItem들을 지워준다.
					api.deletePayment(userId, res.data[0].id)
						.then(() => {
							callback(false);
						})
						.catch(err => {
							console.error(err);
							callback(false);
						});
					alert(errorMsg);
				} else {
					paymentResponse(
						{
							success: impSuccess,
							imp_uid: impUid
						},
						userId,
						res.data[0].id,
						merchantUid,
						callback
					);
				}
			} else {
				alert("결제 정보를 불러올 수 없습니다.");
				callback(false);
			}
		})
		.catch(err => {
			console.warn(err);
		});
};

/**
 * 결제창 callback function
 * @param {} rsp 결제 관련 response
 * @param {} userId 결제자 아이디
 * @param {} paymentId 결제 정보 아이디
 */
const paymentResponse = (rsp, userId, paymentId, merchantUid, callback) => {
	if (rsp.success) {
		// 결제 성공 시 로직
		//결제 성공 시 결제 정보 등록하고 Enrollment 등록
		//결제 위변조 검사 필요함.
		api.completePayment(userId, paymentId, rsp.imp_uid, merchantUid)
			.then(result => {
				if (result.data) {
					callback(result.data);
				}
			})
			.catch(err => {
				console.warn(err);
			});
	} else {
		// 결제 실패 시 payment 정보를 제거하고 paymentItem들을 지워준다.
		api.deletePayment(userId, paymentId)
			.then(() => {
				callback(false);
			})
			.catch(err => {
				console.error(err);
				callback(false);
			});
		alert(rsp.error_msg);
	}
};

export const getUserCoupons = (user_id, callback) => {
	api.getUserCoupons(user_id)
		.then(({ data }) => {
			if (data) {
				const coupons = data.filter(({ coupon }) => {
					return coupon.used == false && new Date(coupon.end_at) > new Date();
				});
				callback(coupons);
			}
		})
		.catch(err => {
			console.warn(err);
		});
};
