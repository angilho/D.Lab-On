import React from "react";
import Carousel from "react-bootstrap/Carousel";
import styled, { css, keyframes } from "styled-components";

const ImageFader = ({ images }) => {
	return (
		<Carousel indicators={false} controls={false} fade interval={3000} autoPlay={true}>
			{images.map((data, idx) => {
				return (
					<Carousel.Item key={idx}>
						<StyledImg src={images[idx]}></StyledImg>
					</Carousel.Item>
				);
			})}
		</Carousel>
	);
};

const StyledImg = styled.img`
	width: 100%;
`;
export default ImageFader;
