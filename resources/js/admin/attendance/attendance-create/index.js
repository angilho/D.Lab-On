import React, { useState } from "react";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import CourseAddModal from "./modal/course-add";
import InstructorAddModal from "./modal/instructor-add";
import styled from "styled-components";
import * as ctrl from "./index.ctrl";

const AttendanceCreate = () => {
	const history = useHistory();
	const [showAddCourseModal, setShowAddCourseModal] = useState(false);
	const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
	const [course, setCourse] = useState({});
	const [instructor, setInstructor] = useState({});
	const [totalAttendanceSection, setTotalAttendanceSection] = useState(1);
	const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);

	const onAddInstructorHandler = instructor => {
		setInstructor({ instructor_id: instructor.id, name: instructor.name });
		setShowAddInstructorModal(false);
	};

	const onAddCourseHandler = (course, section) => {
		setCourse({ course_id: course.id, code: course.dlab_course_code, section_id: section.id });
		setShowAddCourseModal(false);
	};

	const onClickAddAttendance = () => {
		if (!course.course_id || !course.section_id || !instructor.instructor_id) {
			return alert("필수 항목을 입력하지 않았습니다.");
		}
		if (disabledSubmitBtn) {
			return;
		}
		setDisabledSubmitBtn(true);
		var createAttendanceInfo = {
			course_id: course.course_id,
			section_id: course.section_id,
			instructor_id: instructor.instructor_id,
			total_attendance_section: totalAttendanceSection
		};
		ctrl.createAttendaceCourses(createAttendanceInfo, res => {
			if (res.status == 201) {
				alert("출결 등록을 완료하였습니다.");
				history.push({ pathname: "/admin/attendances" });
			} else {
				alert("출결 등록에 실패하였습니다.");
				setCourse({});
				setInstructor({});
				setTotalAttendanceSection(1);
				setDisabledSubmitBtn(false);
			}
		});
	};

	return (
		<React.Fragment>
			<Row className="mb-5 mt-5">
				<Col>
					<FormLabel required>과목</FormLabel>
					<div className="input-group">
						<WithButtonControl
							className="form-control"
							type="text"
							placeholder="과목 검색"
							value={course.code || ""}
							disabled
						/>
						<div className="input-group-append">
							<Button
								type="button"
								className="input-group-text"
								secondary
								size="large"
								onClick={() => setShowAddCourseModal(true)}
							>
								검색
							</Button>
						</div>
					</div>
				</Col>
			</Row>
			<Row className="mb-5">
				<Col>
					<FormLabel required>강사</FormLabel>
					<div className="input-group">
						<WithButtonControl
							className="form-control"
							type="text"
							placeholder="강사 검색"
							value={instructor.name || ""}
							disabled
						/>
						<div className="input-group-append">
							<Button
								type="button"
								className="input-group-text"
								secondary
								size="large"
								onClick={() => setShowAddInstructorModal(true)}
							>
								검색
							</Button>
						</div>
					</div>
				</Col>
			</Row>
			<Row className="mb-5">
				<Col>
					<FormLabel required>수업횟수 선택</FormLabel>
					<FormControl
						as="select"
						value={totalAttendanceSection}
						onChange={e => {
							setTotalAttendanceSection(e.target.value);
						}}
					>
						{[...Array(20).keys()].map(idx => {
							return (
								<option key={idx} value={idx + 1}>
									{idx + 1}
								</option>
							);
						})}
					</FormControl>
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col md={3}>
					<Button
						className="w-100"
						type="button"
						primary
						size="large"
						onClick={onClickAddAttendance}
						disabled={disabledSubmitBtn}
					>
						츨결등록
					</Button>
				</Col>
			</Row>
			<CourseAddModal
				show={showAddCourseModal}
				onHide={() => {
					setShowAddCourseModal(false);
				}}
				handleAdd={onAddCourseHandler}
			/>
			<InstructorAddModal
				show={showAddInstructorModal}
				onHide={() => {
					setShowAddInstructorModal(false);
				}}
				handleAdd={onAddInstructorHandler}
			/>
		</React.Fragment>
	);
};

const WithButtonControl = styled(FormControl)`
	border-right: 1px solid ${({ theme }) => theme.colors.primary};
	&:disabled {
		border-right: 0px;
	}
`;

export default AttendanceCreate;
