import React from "react";

import Button from "@components/elements/Button";

const AdminTablePagination = ({ links, firstPageUrl, lastPageUrl, onChange }) => {
	if (!links || links.length === 0) return null;
	return links.map((pageLink, idx) => {
		if (idx === 0)
			return (
				<React.Fragment key={idx}>
					<Button secondary onClick={() => onChange(firstPageUrl)}>
						{"<<"}
					</Button>
					<Button secondary onClick={() => onChange(links[0].url)}>
						{"<"}
					</Button>
				</React.Fragment>
			);

		if (idx === links.length - 1) {
			return (
				<React.Fragment key={idx}>
					<Button secondary onClick={() => onChange(links[links.length - 1].url)}>
						{">"}
					</Button>
					<Button secondary onClick={() => onChange(lastPageUrl)}>
						{">>"}
					</Button>
				</React.Fragment>
			);
		}

		return (
			<Button
				primary={pageLink.active}
				secondary={!pageLink.active}
				key={idx}
				onClick={() => onChange(pageLink.url)}
			>
				{pageLink.label}
			</Button>
		);
	});
};

export default AdminTablePagination;
