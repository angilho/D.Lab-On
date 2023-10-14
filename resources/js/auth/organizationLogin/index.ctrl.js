import * as api from "@common/api";
import Cookies from "js-cookie";

export const login = (userLogin, userPassword, path, remember, failedCallback) => {
	api.csrfCookie().then(res => {
		api.organizationLogin(userLogin, userPassword, path, remember)
			.then(response => {
				if (response.status === 200) {
					Cookies.set("api_token", response.data.api_token, { expires: 365 });
					window.location.href = "/mycodingspace";
					return;
				}
			})
			.catch(err => {
				console.warn(err);
				failedCallback();
			});
	});
};
