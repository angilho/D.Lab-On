import React from "react";
import styled from "styled-components";

const NotAllow = () => {
	return <Container>이전 강의의 퀴즈를 통과해야 학습이 가능합니다.</Container>;
};

const Container = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1.875rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 2.5rem 1.5rem;
	}
`;

export default NotAllow;
