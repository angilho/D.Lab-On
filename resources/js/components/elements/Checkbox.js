import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "./Text";

//TODO: 수정필요(디자인)
const Checkbox = ({ label, children, checked, onChange, large, fontWeight, ...props }) => {
	const [chk, setChked] = useState(checked || false);

	const onChangeChecked = () => {
		setChked(!chk);
		onChange(!chk);
	};

	useEffect(() => {
		setChked(checked);
	}, [checked]);

	return (
		<Styled className="d-flex" onClick={onChangeChecked}>
			<StyledInput type="checkbox" checked={chk} onChange={onChangeChecked} {...props}></StyledInput>
			{label && (
				<Text p3 fontWeight={fontWeight} className="d-inline ml-2">
					{label || ""}
				</Text>
			)}
			{children}
		</Styled>
	);
};

export default Checkbox;

const Styled = styled.div`
	cursor: pointer;
	align-items: center;
`;

const StyledInput = styled.input`
	cursor: pointer;
`;
