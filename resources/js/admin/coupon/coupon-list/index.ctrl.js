import * as api from "@common/api";

export const getAllCoupons = callback => {
	api.getCoupons()
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

export const handleExport = () => {
	window.location.href = "/admin/export/coupons";
};

export const handleExportUsage = () => {
	window.location.href = "/admin/export/coupon_usages";
};

export const deleteCoupons = (couponIds, callback) => {
	api.deleteCoupons(couponIds)
		.then(response => {
			if (response.status !== 204) {
				alert("쿠폰 삭제에 실패하였습니다.");
				return;
			}

			alert("쿠폰을 삭제하였습니다.");
			callback();
		})
		.catch(err => {
			alert("쿠폰 삭제에 실패하였습니다.");
			console.error(err);
		});
};
