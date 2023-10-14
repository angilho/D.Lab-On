import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import Separator from "@components/elements/Separator";
import Switch from "react-switch";
import CourseSection from "./components/CourseSection";
import CourseSectionModal from "./components/CourseSectionModal";

import CourseType from "@constants/CourseType";

import * as ctrl from "./index.ctrl";

const AdminCourseCreate = ({ id = null }) => {
	const history = useHistory();
	const [initialized, setInitialized] = useState(false);
	const [course, setCourse] = useState(ctrl.getDefaultCourse());
	const [sections, setSections] = useState([]);

	const [sectionModal, setSectionModal] = useState({
		show: false,
		courseType: 0,
		section: null,
		updateIdx: null
	});

	const [thumbnailFilename, setThumbnailFilename] = useState("");

	useEffect(() => {
		if (id) {
			ctrl.getCourse(id, callbackGetCourse);
		} else {
			setInitialized(true);
		}
	}, []);

	const callbackGetCourse = course => {
		setCourse({ ...course, sections: null, thumbnail: course.thumbnail });
		setThumbnailFilename(course.thumbnail.org_filename);
		setSections(course.sections.filter(section => !section.closed));
		setInitialized(true);
	};

	const goEliceCourse = () => {
		if (course.elice_course_id) window.open(`https://dlabon.elice.io/courses/${course.elice_course_id}`);
		else alert("엘리스 코스 아이디를 입력해 주세요.");
	};

	/**
	 * 신규 수업을 생성한다.
	 */
	const newCourseSection = () => {
		let sectionModal = {
			show: true,
			courseType: course.type,
			section: ctrl.getDefaultSection(),
			updateIdx: null
		};
		setSectionModal(sectionModal);
	};

	const onAddCourseSection = section => {
		if (ctrl.validateAddCourseSection(section, course.type)) {
			setSections([...sections, section]);
			setSectionModal({ show: false });
		}
	};

	const onUpdateCourseSection = (index, changedSection) => {
		if (ctrl.validateAddCourseSection(changedSection, course.type)) {
			let newSections = sections.map((section, i) => {
				if (index == i) {
					return changedSection;
				}
				return section;
			});
			setSections(newSections);
			setSectionModal({ show: false });
		}
	};

	const onShowUpdateCourseSectionModal = targetIdx => {
		let sectionModal = {
			show: true,
			courseType: course.type,
			section: sections.filter((_, idx) => idx == targetIdx)[0],
			updateIdx: targetIdx
		};
		setSectionModal(sectionModal);
	};

	const onDeleteCourseSection = targetIdx => {
		if (!confirm("선택한 수업을 삭제하시겠습니까?")) {
			return;
		}
		let newSections = sections.filter((_, idx) => idx != targetIdx);
		setSections(newSections);
	};

	return (
		<React.Fragment>
			<Row>
				<Col md={6}>
					<FormLabel required>과목 이름</FormLabel>
					<FormControl
						type="text"
						placeholder="과목명"
						value={course.name}
						onChange={event => setCourse({ ...course, name: event.currentTarget.value })}
					/>
				</Col>
				<Col md={6}>
					<FormLabel required>과목 유형</FormLabel>
					<FormControl
						className="w-100 m-0"
						as="select"
						value={course.type}
						onChange={event => {
							if (sections.length > 0) {
								if (confirm("과목 유형 변경 시 수업 정보를 다시 설정해야 합니다.\n진행하시겠습니까?")) {
									setCourse({
										...course,
										type: event.currentTarget.value
									});
									setSections([]);
								}
							} else {
								setCourse({
									...course,
									type: event.currentTarget.value
								});
							}
						}}
					>
						<option value={CourseType.REGULAR}>라이브 클래스</option>
						<option value={CourseType.ONEONONE}>1:1 클래스</option>
						<option value={CourseType.PACKAGE}>1:1 패키지</option>
						<option value={CourseType.VOD}>VOD 클래스</option>
					</FormControl>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col md={6}></Col>
				{course.type === CourseType.VOD && (
					<Col md={3}>
						<FormLabel required>보충수업</FormLabel>
						<Switch
							checked={course.support_class}
							onChange={checked => {
								setCourse({ ...course, support_class: checked, b2b_class: false });
							}}
						/>
					</Col>
				)}
				<Col md={3}>
					<FormLabel required>B2B여부</FormLabel>
					<Switch
						checked={course.b2b_class}
						onChange={checked => {
							setCourse({ ...course, b2b_class: checked, support_class: false });
						}}
					/>
				</Col>
			</Row>
			<Row>
				<Col md={6}>
					<FormLabel>커리큘럼 키워드 (쉼표구분)</FormLabel>
					<FormControl
						type="text"
						placeholder="ex) 얼리버드, 무료강의 등"
						value={course.curriculum_keyword ?? ""}
						onChange={event => setCourse({ ...course, curriculum_keyword: event.currentTarget.value })}
					/>
				</Col>
				<Col md={6}>
					<FormLabel>커리큘럼 대상 키워드 (쉼표구분)</FormLabel>
					<FormControl
						type="text"
						placeholder="ex) 초급, 전연령 등"
						value={course.curriculum_target_keyword ?? ""}
						onChange={event =>
							setCourse({ ...course, curriculum_target_keyword: event.currentTarget.value })
						}
					/>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<FormLabel>과목소개(커리큘럼 표시용, 60자 내외)</FormLabel>
					<FormControl
						className="w-100"
						as="textarea"
						value={course.short_description ?? ""}
						placeholder="과목소개"
						onChange={event => setCourse({ ...course, short_description: event.currentTarget.value })}
					/>
				</Col>
			</Row>

			<FormLabel required>썸네일 이미지</FormLabel>
			<FormControl
				type="file"
				label={thumbnailFilename}
				data-browse="찾기"
				custom
				onChange={event => {
					setThumbnailFilename(event.currentTarget.files[0].name);
					setCourse({ ...course, thumbnail: event.currentTarget.files[0] });
				}}
			/>
			<Row>
				<Col md={6}>
					{course.thumbnail && course.thumbnail.filename && (
						<img className="img-fluid" src={`/storage/files/${course.thumbnail.filename}`} />
					)}
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<Row>
						<Col align="right" md={4}>
							<FormLabel required>썸네일에 수강 신청 공개 & 비공개 표시</FormLabel>
							<Text p5>수강신청 목록에서 공개 & 비공개 시킵니다.</Text>
						</Col>
						<Col className="align-self-center">
							<Switch
								checked={course.closed}
								onChange={checked => {
									setCourse({ ...course, closed: checked });
								}}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Separator />
			<Row>
				<Col md={6}>
					<FormLabel required>대상</FormLabel>
					<FormControl
						type="text"
						placeholder="대상"
						value={course.student_target}
						onChange={event => setCourse({ ...course, student_target: event.currentTarget.value })}
					/>
				</Col>
				<Col md={6}>
					<FormLabel>Elice 과목 아이디</FormLabel>
					<Row>
						<Col>
							<FormControl
								className="w-100"
								type="text"
								placeholder="Elice 과목 아이디"
								value={course.elice_course_id ?? ""}
								disabled={course.type === CourseType.VOD}
								onChange={event => setCourse({ ...course, elice_course_id: event.currentTarget.value })}
							/>
						</Col>
						<Col>
							<Button
								primary
								size="large"
								disabled={course.type === CourseType.VOD}
								onClick={() => goEliceCourse()}
							>
								Elice로 이동하기
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col>
					<FormLabel required>수강료</FormLabel>
					<FormControl
						type="number"
						value={course.price}
						onChange={event =>
							setCourse({
								...course,
								price: event.currentTarget.value ?? parseInt(event.currentTarget.value)
							})
						}
					/>
				</Col>
				<Col>
					<FormLabel>
						할인된 수강료<small className="text-muted ml-2">할인을 적용하지 않는 경우 0</small>
					</FormLabel>
					<FormControl
						type="number"
						value={course.discount_price}
						onChange={event =>
							setCourse({
								...course,
								discount_price: event.currentTarget.value ?? parseInt(event.currentTarget.value)
							})
						}
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<FormLabel required>할인 정보</FormLabel>
					<FormControl
						type="text"
						value={course.discount_text ? course.discount_text : ""}
						onChange={event =>
							setCourse({
								...course,
								discount_text: event.currentTarget.value
							})
						}
					/>
				</Col>
				<Col>
					<FormLabel required>앨리스 연동 여부</FormLabel>
					<Switch
						checked={course.enable_elice_course}
						disabled={course.type === CourseType.VOD}
						onChange={checked => {
							setCourse({ ...course, enable_elice_course: checked });
						}}
					/>
				</Col>
			</Row>
			<Separator />
			<FormLabel required>수업 진행 시간</FormLabel>
			<Row className="align-items-center">
				<Col md={2} xs={2}>
					<FormControl
						className="w-100 m-0"
						as="select"
						value={course.duration_hour}
						onChange={event =>
							setCourse({
								...course,
								duration_hour: parseInt(event.currentTarget.value)
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
					<Text p3>시간</Text>
				</Col>
				<Col xs={2} md={2}>
					<FormControl
						className="w-100 m-0"
						as="select"
						value={course.duration_minute}
						onChange={event =>
							setCourse({
								...course,
								duration_minute: parseInt(event.currentTarget.value)
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
					<Text p3>분</Text>
				</Col>
			</Row>
			<Row className="mt-20">
				<Col>
					<FormLabel required>수업 주차</FormLabel>
					<Text p2 className="d-inline mr-3">
						총
					</Text>
					<FormControl
						className="m-0 d-inline w-25"
						type="number"
						value={course.duration_week}
						onChange={event =>
							setCourse({
								...course,
								duration_week: event.currentTarget.value ?? parseInt(event.currentTarget.value)
							})
						}
					/>
					<Text p2 className="d-inline ml-3">
						주
					</Text>
				</Col>
			</Row>
			<Separator />
			<FormLabel required>
				<span>수업 요일과 시간 옵션 생성</span>
				<small className="text-muted ml-2">최소 하나 이상의 수업이 생성되어야 합니다.</small>
			</FormLabel>
			<div className="row mt-4">
				<div className="col-12">
					{course.type !== CourseType.VOD &&
						sections.map((section, idx) => {
							return (
								<CourseSection
									key={idx}
									idx={idx}
									section={section}
									courseType={course.type}
									onShowUpdateCourseSectionModal={onShowUpdateCourseSectionModal}
									onDeleteCourseSection={onDeleteCourseSection}
								/>
							);
						})}
				</div>
			</div>
			<Row>
				<Col align="right">
					<Button primary disabled={course.type === CourseType.VOD} onClick={() => newCourseSection()}>
						+ 수업 추가하기
					</Button>
				</Col>
			</Row>
			<Separator />
			<FormLabel required>디랩 과목 코드</FormLabel>
			<FormControl
				className="w-100"
				type="text"
				value={course.dlab_course_code}
				placeholder="[DLAB_정규수업_커리큘럼] 문서에 정의된 과목코드 (ex. RG1-DR-LTI) 입력"
				onChange={event => setCourse({ ...course, dlab_course_code: event.currentTarget.value })}
			/>
			<Row className="mt-5 mb-5 align-self-center">
				{!id ? (
					<React.Fragment>
						<Col md={3}>
							<Button
								primary
								size="large"
								className="w-100"
								onClick={() =>
									ctrl.handleCreate(course, sections, () =>
										history.push({ pathname: "/admin/courses" })
									)
								}
							>
								확인
							</Button>
						</Col>
						<Col md={3}>
							<Link to={"/admin/courses"}>
								<Button secondary size="large" className="w-100">
									취소
								</Button>
							</Link>
						</Col>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Col>
							<SaveButton
								danger
								size="large"
								onClick={() =>
									ctrl.handleDelete(id, () => history.push({ pathname: "/admin/courses" }))
								}
							>
								삭제
							</SaveButton>
							{course.type === CourseType.VOD && (
								<SaveButton
									primary
									size="large"
									onClick={() =>
										ctrl.handleCopy(id, () => history.push({ pathname: "/admin/courses" }))
									}
								>
									과목 복제
								</SaveButton>
							)}
						</Col>
						<Col className="d-flex justify-content-end">
							<Link to={"/admin/courses"}>
								<SaveButton secondary size="large">
									취소
								</SaveButton>
							</Link>
							<SaveButton
								primary
								size="large"
								className="ml-3"
								onClick={() =>
									ctrl.handleUpdate(id, course, sections, () =>
										history.push({ pathname: "/admin/courses" })
									)
								}
							>
								수정
							</SaveButton>
						</Col>
					</React.Fragment>
				)}
			</Row>
			{sectionModal.show && (
				<CourseSectionModal
					initSection={sectionModal.section}
					courseType={sectionModal.courseType}
					show={sectionModal.show}
					updateIdx={sectionModal.updateIdx}
					onHide={() => setSectionModal({ show: false })}
					onAddCourseSection={section => onAddCourseSection(section)}
					onUpdateCourseSection={(targetIdx, section) => onUpdateCourseSection(targetIdx, section)}
				/>
			)}
		</React.Fragment>
	);
};

const SaveButton = styled(Button)`
	@media only screen and (max-width: 767.98px) {
		width: 100%;
		height: 2.25rem;
	}
	@media only screen and (min-width: 768px) {
		width: 8rem;
	}
`;

export default AdminCourseCreate;
