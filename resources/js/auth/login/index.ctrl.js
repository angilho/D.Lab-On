import * as api from "@common/api";
import Cookies from "js-cookie";

export const login = (userLogin, userPassword, remember, failedCallback) => {
	api.csrfCookie().then(res => {
		api.login(userLogin, userPassword, remember)
			.then(response => {
				if (response.status === 200) {
					Cookies.set("api_token", response.data.api_token, { expires: 365 });
					window.location.href = "/";
					return;
				}
			})
			.catch(err => {
				console.warn(err);
				failedCallback();
			});
	});
};
