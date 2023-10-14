import React, { useState, useRef, useEffect } from "react";
import { Form, Row, Col, Modal } from "react-bootstrap";

import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

import Text from "@components/elements/Text";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Separator from "@components/elements/Separator";

import CourseType from "@constants/CourseType";
import CourseTargetGroup from "@constants/CourseTargetGroup";
import CourseTargetGrade from "@constants/CourseTargetGrade";

import DaySelector from "./DaySelector";

const CourseSectionModal = ({
	initSection,
	show,
	updateIdx,
	onHide,
	courseType,
	onUpdateCourseSection,
	onAddCourseSection
}) => {
	const [section, setSection] = useState(initSection);
	const [gradeArr, setGradeArr] = useState([]);

	const dateRangePickerRef = useRef();
	const courseRecruitDateRangePickerRef = useRef();

	useEffect(() => {
		onChangeTargetGroup(section.target_group, false);
	}, [section.target_group]);

	const onChangeTargetGroup = (targetGroup, initTargetGrade) => {
		let gradeArr = [];
		switch (targetGroup) {
			//초등부
			case CourseTargetGroup.ELEMENTRY_SCHOOL:
				gradeArr = CourseTargetGrade.ELEMENTRY_SCHOOL;
				if (initTargetGrade) setSection({ ...section, target_group: targetGroup, target_grade: "1" });
				break;
			//중등부, 고등부
			case CourseTargetGroup.MIDDLE_SCHOOL:
				gradeArr = CourseTargetGrade.MIDDLE_SCHOOL;
				if (initTargetGrade) setSection({ ...section, target_group: targetGroup, target_grade: "1" });
				break;
			case CourseTargetGroup.HIGH_SCHOOL:
				gradeArr = CourseTargetGrade.HIGH_SCHOOL;
				if (initTargetGrade) setSection({ ...section, target_group: targetGroup, target_grade: "1" });
				break;
			case CourseTargetGroup.MIDDLE_AND_HIGH_SCHOOL:
				gradeArr = CourseTargetGrade.MIDDLE_AND_HIGH_SCHOOL;
				if (initTargetGrade) setSection({ ...section, target_group: targetGroup, target_grade: "전체" });
				break;
			default:
				gradeArr = CourseTargetGrade.GENERAL;
				if (initTargetGrade) setSection({ ...section, target_group: targetGroup, target_grade: "비고" });
				break;
		}

		setGradeArr(gradeArr);
	};

	const renderTargetGrade = () => {
		return (
			<React.Fragment>
				{gradeArr.map((value, _) => {
					return (
						<option value={value} key={_}>
							{value}
						</option>
					);
				})}
			</React.Fragment>
		);
	};

	const renderCourseTime = () => {
		return (
			<React.Fragment>
				<Row className="align-items-center" align={"left"}>
					<Col md={2}>
						<FormLabel required>수업 주기</FormLabel>
					</Col>
					<Col md={4}>
						<FormControl
							className="w-100 m-0"
							as="select"
							value={section.cycle_week}
							onChange={event =>
								setSection({
									...section,
									cycle_week: parseInt(event.currentTarget.value)
								})
							}
						>
							<option value="1">주1</option>
							<option value="2">주2</option>
							<option value="3">주3</option>
							<option value="4">주4</option>
							<option value="5">주5</option>
						</FormControl>
					</Col>

					<Col md="auto" className="pl-0">
						<Text p3>회</Text>
					</Col>
					<Col md={5}>
						<DaySelector
							maxSelection={section.cycle_week}
							value={section.duration_day}
							onChange={selected => {
								setSection({
									...section,
									duration_day: selected
								});
							}}
						/>
					</Col>
				</Row>
				<Row className="align-items-center mt-3">
					<Col md={2}>
						<FormLabel required>수업 시작 시간</FormLabel>
					</Col>
					<Col md={7}>
						<Row className="align-items-center">
							<Col xs={4} md={4}>
								<FormControl
									className="w-100 m-0"
									as="select"
									value={section.start_hour}
									onChange={event =>
										setSection({
											...section,
											start_hour: parseInt(event.currentTarget.value)
										})
									}
								>
									{[...Array(24).keys()].map(idx => {
										return (
											<option key={idx} value={idx}>
												{idx}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>시</Text>
							</Col>
							<Col xs={4} md={4}>
								<FormControl
									className="w-100 m-0"
									as="select"
									value={section.start_minute}
									onChange={event =>
										setSection({
											...section,
											start_minute: parseInt(event.currentTarget.value)
										})
									}
								>
									{[...Array(12).keys()].map(idx => {
										return (
											<option key={idx} value={idx * 5}>
												{idx * 5}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>분 부터</Text>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="align-items-center mt-3">
					<Col md={2}>
						<FormLabel required>수업 종료 시간</FormLabel>
					</Col>
					<Col md={7}>
						<Row className="align-items-center">
							<Col xs={4} md={4}>
								<FormControl
									className="w-100 m-0"
									as="select"
									value={section.end_hour}
									onChange={event =>
										setSection({
											...section,
											end_hour: parseInt(event.currentTarget.value)
										})
									}
								>
									{[...Array(24).keys()].map(idx => {
										return (
											<option key={idx} value={idx}>
												{idx}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>시</Text>
							</Col>
							<Col xs={4} md={4}>
								<FormControl
									className="w-100 m-0"
									as="select"
									value={section.end_minute}
									onChange={event =>
										setSection({
											...section,
											end_minute: parseInt(event.currentTarget.value)
										})
									}
								>
									{[...Array(12).keys()].map(idx => {
										return (
											<option key={idx} value={idx * 5}>
												{idx * 5}
											</option>
										);
									})}
								</FormControl>
							</Col>
							<Col xs="auto" md="auto" className="pl-0">
								<Text p3>분 까지</Text>
							</Col>
						</Row>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<Modal show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					<Text h4>수업 생성</Text>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col md={6}>
						<FormLabel required>대상</FormLabel>
						<Row className="align-items-center">
							<Col md={6}>
								<FormControl
									className="w-100 m-0"
									as="select"
									value={section.target_group}
									onChange={event => onChangeTargetGroup(parseInt(event.currentTarget.value), true)}
								>
									<option value="0">초등부</option>
									<option value="1">중등부</option>
									<option value="2">고등부</option>
									<option value="4">중고등부</option>
									<option value="3">일반</option>
								</FormControl>
							</Col>
							<Col md={4}>
								<FormControl
									className="w-100 m-0"
									as="select"
									value={section.target_grade}
									onChange={event =>
										setSection({
											...section,
											target_grade: event.currentTarget.value
										})
									}
								>
									{renderTargetGrade()}
								</FormControl>
							</Col>
							<Col md="auto" className="pl-0">
								<Text p3>학년</Text>
							</Col>
						</Row>
					</Col>
					<Col md={6}>
						<FormLabel required>수업 정원</FormLabel>
						<FormControl
							className="w-100"
							type="number"
							value={section.max_student}
							onChange={event =>
								setSection({
									...section,
									max_student: event.currentTarget.value ?? parseInt(event.currentTarget.value)
								})
							}
						/>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<FormLabel required>수업 시작/종료일</FormLabel>
						<DateRangePicker
							ref={dateRangePickerRef}
							initialSettings={{
								locale: {
									format: "YYYY/MM/DD",
									applyLabel: "확인",
									cancelLabel: "취소"
								},
								startDate: section.start_at ?? new Date(),
								endDate: section.end_at ?? new Date()
							}}
							onCallback={(start, end) =>
								setSection({
									...section,
									start_at: start.local().format("YYYY-MM-DD"),
									end_at: end.local().format("YYYY-MM-DD")
								})
							}
						>
							<input type="text" className="form-control" />
						</DateRangePicker>
					</Col>
					<Col md={6}>
						<FormLabel required>수업 모집 시작/종료일</FormLabel>
						<DateRangePicker
							ref={courseRecruitDateRangePickerRef}
							initialSettings={{
								locale: {
									format: "YYYY/MM/DD",
									applyLabel: "확인",
									cancelLabel: "취소"
								},
								startDate: section.recruit_start_at ?? new Date(),
								endDate: section.recruit_end_at ?? new Date()
							}}
							onCallback={(start, end) =>
								setSection({
									...section,
									recruit_start_at: start.local().format("YYYY-MM-DD"),
									recruit_end_at: end.local().format("YYYY-MM-DD")
								})
							}
						>
							<input type="text" className="form-control" />
						</DateRangePicker>
					</Col>
				</Row>
				<Separator />
				{/**라이브 클래스과정일 경우에만 수업 일시, 시간, 요일을 설정할 수 있다. */}
				{courseType === CourseType.REGULAR ? (
					renderCourseTime()
				) : (
					<Text p1 className="justify-content-center">
						수업 일시, 시간, 요일 협의
					</Text>
				)}
				<Separator />
				<Row>
					<Col md={6}>
						<FormLabel required>Zoom URL</FormLabel>
						<FormControl
							className="w-100"
							type="text"
							placeholder="Zoom URL"
							value={section.zoom_url}
							onChange={event => setSection({ ...section, zoom_url: event.currentTarget.value })}
						/>
					</Col>
					<Col md={6}>
						<FormLabel>Zoom 비밀번호</FormLabel>
						<FormControl
							className="w-100"
							type="password"
							placeholder="Zoom 비밀번호"
							value={section.zoom_password ?? ""}
							onChange={event => setSection({ ...section, zoom_password: event.currentTarget.value })}
						/>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<FormLabel>Zoom ID</FormLabel>
						<Form.Control
							className="w-100"
							size="md"
							type="text"
							placeholder="Zoom ID"
							value={section.zoom_id ?? ""}
							onChange={event => setSection({ ...section, zoom_id: event.currentTarget.value })}
						/>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				{updateIdx === null ? (
					<Button primary size="large" className="w-25" onClick={() => onAddCourseSection(section)}>
						저장
					</Button>
				) : (
					<Button
						primary
						size="large"
						className="w-25"
						onClick={() => onUpdateCourseSection(updateIdx, section)}
					>
						수정
					</Button>
				)}

				<Button secondary size="large" className="w-25" onClick={() => onHide()}>
					닫기
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CourseSectionModal;
