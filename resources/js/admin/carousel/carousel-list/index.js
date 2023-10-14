import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import styled, { css } from "styled-components";

import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminCarouselList = ({}) => {
	const history = useHistory();
	const [carousels, setCarousels] = useState([]);
	const [newCarousel, setNewCarousel] = useState(ctrl.getDefaultCarousel);

	useEffect(() => {
		ctrl.getCarousels(carousels => {
			carousels = carousels.map(carousel => {
				return { ...carousel, showDetail: false };
			});
			setCarousels(carousels);
		});
	}, []);

	const changeCarousel = (carouselId, props) => {
		let updatedCarousels = carousels.map(carousel => {
			if (carousel.id == carouselId) {
				return { ...carousel, ...props };
			}
			return carousel;
		});
		setCarousels(updatedCarousels);
	};

	const onClickCarousel = carouselId => {
		let updatedCarousels = carousels.map(carousel => {
			if (carousel.id == carouselId) {
				carousel.showDetail = !carousel.showDetail;
			} else {
				carousel.showDetail = false;
			}
			return carousel;
		});
		setCarousels(updatedCarousels);
	};

	const onClickCarouselUp = carouselId => {
		let reorderCarousels = carousels.map(carousel => {
			return { id: carousel.id, order: carousel.order };
		});
		reorderCarousels.forEach((carousel, index) => {
			if (carousel.id == carouselId && index != 0) {
				carousel.order--;
				reorderCarousels[index - 1].order++;
			}
		});
		ctrl.handleReorder(reorderCarousels, () => history.go(0));
	};

	const onClickCarouselDown = carouselId => {
		let reorderCarousels = carousels.map(carousel => {
			return { id: carousel.id, order: carousel.order };
		});
		reorderCarousels.forEach((carousel, index) => {
			if (carousel.id == carouselId && index != carousels.length - 1) {
				carousel.order++;
				reorderCarousels[index + 1].order--;
			}
		});
		ctrl.handleReorder(reorderCarousels, () => history.go(0));
	};

	const onClickCreateCarousel = () => {
		ctrl.handleCreate(newCarousel, () => history.go(0));
	};

	const onClickUpdateCarousel = carouselId => {
		let targetCarousel = carousels.filter(carousel => carousel.id == carouselId)[0];
		ctrl.handleUpdate(carouselId, targetCarousel, () => history.go(0));
	};

	const onClickDeleteCarousel = carouselId => {
		ctrl.handleDelete(carouselId, () => history.go(0));
	};

	return (
		<React.Fragment>
			<section>
				<Row className="mt-20">
					<Col>
						<h5>캐러셀 목록</h5>
					</Col>
				</Row>
				{carousels.map((carousel, index) => {
					return (
						<React.Fragment key={index}>
							<Row className="mt-10">
								<Col className="d-flex">
									<span className="mr-10">{carousel.order}</span>
									<CarouselImage
										pointer
										src={`/storage/files/${carousel.desktop_image.filename}`}
										onClick={() => onClickCarousel(carousel.id)}
									/>
									<div className="d-flex flex-column justify-content-center ml-10">
										<Button
											className="w-100"
											secondary
											onClick={() => onClickCarouselUp(carousel.id)}
											disabled={index === 0}
										>
											↑
										</Button>
										<Button
											className="w-100 ml-0 mt-10"
											secondary
											onClick={() => onClickCarouselDown(carousel.id)}
											disabled={index === carousels.length - 1}
										>
											↓
										</Button>
									</div>
								</Col>
							</Row>
							{carousel.showDetail && (
								<CarouselContainer className="mt-10">
									<Row className="align-items-center">
										<Col md="auto">
											<FormLabel required>데스크톱 캐러셀 이미지</FormLabel>
											<CarouselImage src={`/storage/files/${carousel.desktop_image.filename}`} />
										</Col>
									</Row>
									<Row className="align-items-center mt-10">
										<Col md="auto">
											<FormLabel required>모바일 캐러셀 이미지</FormLabel>
											<CarouselImage src={`/storage/files/${carousel.mobile_image.filename}`} />
										</Col>
									</Row>
									<Row className="align-items-center">
										<Col>
											<FormLabel required>링크</FormLabel>
											<FormControl
												className="w-100 mb-6"
												type="text"
												value={carousel.url}
												placeholder={"https://dlabon.com/courses/1"}
												onChange={event =>
													changeCarousel(carousel.id, { url: event.currentTarget.value })
												}
											/>
										</Col>
									</Row>
									<Row className="align-items-center">
										<Col>
											<Checkbox
												className="align-items-center"
												checked={carousel.new_tab}
												onChange={value => changeCarousel(carousel.id, { new_tab: value })}
											>
												<FormLabel className="ml-10 mb-0">새탭으로 열기</FormLabel>
											</Checkbox>
										</Col>
									</Row>
									<Row className="align-items-center mt-10">
										<Col>
											<FormLabel required>배경색</FormLabel>
											<FormControl
												className="w-100 mb-6"
												type="text"
												value={carousel.background_color}
												placeholder={"#FFFFFF"}
												onChange={event =>
													changeCarousel(carousel.id, {
														background_color: event.currentTarget.value
													})
												}
											/>
										</Col>
									</Row>
									<Row className="align-items-center mt-10">
										<Col>
											<FormLabel required>순서</FormLabel>
											<FormControl
												className="w-100 mb-6"
												type="text"
												value={carousel.order}
												disabled
											/>
										</Col>
									</Row>
									<Row className="mt-10">
										<Col className="col-2">
											<Button
												className="w-100"
												primary
												size="large"
												onClick={() => onClickUpdateCarousel(carousel.id)}
											>
												캐러셀 수정
											</Button>
										</Col>
										<Col className="col-2">
											<Button
												className="w-100"
												danger
												size="large"
												onClick={() => onClickDeleteCarousel(carousel.id)}
											>
												캐러셀 삭제
											</Button>
										</Col>
									</Row>
								</CarouselContainer>
							)}
						</React.Fragment>
					);
				})}
			</section>

			<section>
				<Row className="mt-40">
					<Col>
						<h5>캐러셀 추가</h5>
					</Col>
				</Row>
				<NewCarouselContainer>
					<Row className="align-items-center">
						<Col md="auto">
							<FormLabel required>데스크톱 캐러셀 이미지</FormLabel>
							<FormControl
								type="file"
								label={newCarousel.desktop_image_file?.name || ""}
								data-browse="찾기"
								custom
								onChange={event =>
									setNewCarousel({ ...newCarousel, desktop_image_file: event.currentTarget.files[0] })
								}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md="auto">
							<FormLabel required>모바일 캐러셀 이미지</FormLabel>
							<FormControl
								type="file"
								label={newCarousel.mobile_image_file?.name || ""}
								data-browse="찾기"
								custom
								onChange={event =>
									setNewCarousel({ ...newCarousel, mobile_image_file: event.currentTarget.files[0] })
								}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col>
							<FormLabel required>링크</FormLabel>
							<FormControl
								className="w-100 mb-6"
								type="text"
								value={newCarousel.url}
								placeholder={"https://dlabon.com/courses/1"}
								onChange={event => setNewCarousel({ ...newCarousel, url: event.currentTarget.value })}
							/>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col>
							<Checkbox
								className="align-items-center"
								checked={newCarousel.new_tab}
								onChange={value => setNewCarousel({ ...newCarousel, new_tab: value })}
							>
								<FormLabel className="ml-10 mb-0">새탭으로 열기</FormLabel>
							</Checkbox>
						</Col>
					</Row>
					<Row className="align-items-center mt-10">
						<Col>
							<FormLabel required>배경색</FormLabel>
							<FormControl
								className="w-100 mb-6"
								type="text"
								value={newCarousel.background_color}
								placeholder={"#FFFFFF"}
								onChange={event =>
									setNewCarousel({ ...newCarousel, background_color: event.currentTarget.value })
								}
							/>
						</Col>
					</Row>
					<Row className="mt-10">
						<Col className="col-2">
							<Button className="w-100" primary size="large" onClick={onClickCreateCarousel}>
								캐러셀 추가
							</Button>
						</Col>
					</Row>
				</NewCarouselContainer>
			</section>
		</React.Fragment>
	);
};

const CarouselImage = styled.img`
	width: auto;
	height: 100px;

	${props =>
		props.pointer &&
		css`
			cursor: pointer;
		`}
`;

const CarouselContainer = styled.div`
	padding: 8px;
	border-radius: 5px;
	border: 1px solid ${({ theme }) => theme.colors.gray};
	margin-bottom: 12px;
`;

const NewCarouselContainer = styled.div`
	padding: 8px;
	border-radius: 5px;
	border: 1px solid ${({ theme }) => theme.colors.gray};
	margin-bottom: 12px;
`;

export default AdminCarouselList;
