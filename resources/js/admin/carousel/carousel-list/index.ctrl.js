import * as api from "@common/api";

export const getDefaultCarousel = () => ({
	desktop_image_file: null,
	mobile_image_file: null,
	url: "",
	new_tab: true,
	background_color: ""
});

export const getCarousels = callback => {
	api.getCarousels()
		.then(response => {
			callback(response.data);
		})
		.catch(err => console.error(err));
};

export const handleCreate = (carousel, callback) => {
	if (!validateCarousel(carousel, false)) return;

	api.createCarousel(carousel)
		.then(response => {
			if (response.status !== 201) {
				alert("캐러셀 추가에 실패하였습니다.");
				return;
			}

			alert("캐러셀을 추가하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("캐러셀 추가에 실패하였습니다.");
		});
};

export const handleReorder = (carousels, callback) => {
	api.reorderCarousels({ carousels })
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("캐러셀 순서 조절에 실패하였습니다.");
				return;
			}
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("캐러셀 순서 조절에 실패하였습니다.");
		});
};

export const handleUpdate = (carouselId, carousel, callback) => {
	if (!validateCarousel(carousel, true)) return;

	api.updateCarousel(carouselId, carousel)
		.then(response => {
			if (response.status !== 201 && response.status !== 204) {
				alert("캐러셀 갱신에 실패하였습니다.");
				return;
			}

			alert("캐러셀 정보를 갱신하였습니다.");
			callback();
		})
		.catch(err => {
			console.error(err);
			alert("캐러셀 갱신에 실패하였습니다.");
		});
};

export const handleDelete = (carouselId, callback) => {
	if (confirm("정말 삭제하시겠습니까?")) {
		api.deleteCarousel(carouselId)
			.then(response => {
				if (response.status !== 204) {
					alert("캐러셀 삭제에 실패하였습니다.");
					return;
				}

				alert("캐러셀을 삭제하였습니다.");
				callback();
			})
			.catch(err => {
				console.error(err);
				alert("캐러셀 삭제에 실패하였습니다.");
			});
	}
};

export const validateCarousel = (carousel, edit) => {
	if (!edit && !carousel.desktop_image_file) {
		alert("데스크톱 캐러셀 이미지 파일이 없습니다.");
		return false;
	}
	if (!edit && !carousel.mobile_image_file) {
		alert("모바일 캐러셀 이미지 파일이 없습니다.");
		return false;
	}
	if (!carousel.url) {
		alert("링크가 없습니다.");
		return false;
	}
	if (!carousel.background_color) {
		alert("배경색이 없습니다.");
		return false;
	}

	return true;
};
