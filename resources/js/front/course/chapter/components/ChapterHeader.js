import React from "react";
import { Row, Col } from "react-bootstrap";
import Text from "@components/elements/Text";
import useSizeDetector from "@hooks/useSizeDetector";

const ChapterHeader = ({ courseName }) => {
	const SizeDetector = useSizeDetector();

	return (
		<Row>
			<Col md={12}>
				<Text h4 className="text-white">
					{SizeDetector.isDesktop && (
						<React.Fragment>{courseName} 수업에 오신 것을 환영합니다.</React.Fragment>
					)}
					{!SizeDetector.isDesktop && (
						<React.Fragment>
							{courseName} 수업에
							<br /> 오신 것을 환영합니다.
						</React.Fragment>
					)}
				</Text>
			</Col>
		</Row>
	);
};

export default ChapterHeader;
