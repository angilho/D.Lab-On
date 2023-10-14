import * as api from "@common/api";

export const getUserCoupons = (user_id, callback) => {
	api.getUserCoupons(user_id)
		.then(res => {
			if (res.data) {
				callback(res.data);
			}
		})
		.catch(err => {
			console.warn(err);
		});
};
