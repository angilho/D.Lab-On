import * as api from "@common/api";

export const deleteCart = (userId, cartId, callback) => {
	api.deleteCart(userId, cartId)
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};
