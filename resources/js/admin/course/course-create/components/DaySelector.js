import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

const DaySelector = ({ value, ...props }) => {
	const [selectedArr, setSelectedArr] = useState([]);
	const day = ["월", "화", "수", "목", "금", "토"];

	useEffect(() => {
		let newSelectedArr = value.map(_ => day.indexOf(_));
		setSelectedArr(newSelectedArr);
	}, [value]);

	const onChange = selectedIdx => {
		let newArr = [...selectedArr];

		//이미 선택된 값이 있다면 지금 선택한 값이 있는지 확인해서 있을 경우 지워준다.
		if (selectedArr.some(idx => selectedIdx == idx)) {
			newArr = newArr.filter(item => item != selectedIdx);
		} else {
			//밖에서 선택한 길이만큼만 선택하도록 한다.
			if (props.maxSelection > selectedArr.length) {
				newArr.push(selectedIdx);
			}
		}

		setSelectedArr(newArr);

		let result = newArr.sort().map(selectedIdx => day[selectedIdx]);
		if (props.onChange && result.length != 0) {
			props.onChange(result);
		}
	};

	return (
		<Row>
			{day.map((data, _) => {
				let activated = selectedArr.some(selectedIdx => selectedIdx == _);

				return (
					<Col key={_}>
						<StyledCircle onClick={() => onChange(_)} className={activated ? "selected" : ""}>
							{data}
						</StyledCircle>
					</Col>
				);
			})}
		</Row>
	);
};

const StyledCircle = styled.div`
	border-radius: 50%;
	border: 0.063rem solid ${({ theme }) => theme.colors.secondary};
	text-align: center;
	cursor: pointer;
	color: ${({ theme }) => theme.colors.secondary};

	&.selected {
		background-color: ${({ theme }) => theme.colors.primary};
		color: ${({ theme }) => theme.colors.white};
		border: none;
	}
`;

export default DaySelector;
