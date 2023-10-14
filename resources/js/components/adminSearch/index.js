import React, { useState } from "react";
import styled from "styled-components";

import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";

const AdminSearch = ({ placeholder, onClick }) => {
	const [text, setText] = useState("");

	const handleKeyDown = e => {
		if (e.key === "Enter") onClick(text);
	};

	return (
		<div className="input-group">
			<WithButtonControl
				className="form-control"
				type="text"
				placeholder={placeholder}
				name="school"
				onChange={e => setText(e.currentTarget.value)}
				onKeyDown={handleKeyDown}
				value={text}
			/>
			<div className="input-group-append">
				<Button type="button" className="input-group-text" secondary size="large" onClick={() => onClick(text)}>
					검색
				</Button>
			</div>
		</div>
	);
};

const WithButtonControl = styled(FormControl)`
	border-right: 1px solid ${({ theme }) => theme.colors.primary};
	&:disabled {
		border-right: 0px;
	}
`;

export default AdminSearch;
