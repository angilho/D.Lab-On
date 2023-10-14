import React, { useState, useEffect } from "react";
import Button from "@components/elements/Button";

const AdminFilter = ({ filters, onChange }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return filters.map((name, index) => {
		return (
			<Button
				key={index}
				primary={index === selectedIndex}
				secondary={index !== selectedIndex}
				onClick={() => {
					setSelectedIndex(index);
					onChange(index);
				}}
			>
				{name}
			</Button>
		);
	});
};

export default AdminFilter;
