import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import CurriculumCourseSearchModal from "./components/CurriculumCourseSearchModal";
import styled from "styled-components";

import * as ctrl from "./index.ctrl";

const AdminDetailCurriculumCreate = ({ detail_curriculum_category_id }) => {
	const history = useHistory();
	const [detailCurriculumCategory, setDetailCurriculumCategory] = useState(ctrl.getDefaultDetailCurriculumCategory());
	const [showCurriculumCourseSearchModal, setShowCurriculumCourseSearchModal] = useState(false);

	const isEdit = detail_curriculum_category_id ? true : false;

	useEffect(() => {
		if (isEdit) {
			ctrl.getDetailCurriculumCategory(detail_curriculum_category_id, result => {
				result.curriculum_courses = result.curriculum_courses
					.filter(data => data.course !== null)
					.map(data => {
						return {
							id: data.course.id,
							name: data.course.name,
							dlab_course_code: data.course.dlab_course_code,
							order: data.order
						};
					});
				setDetailCurriculumCategory(result);
			});
		}
	}, []);

	const addCurriculumCourse = course => {
		let curriculumCourses = detailCurriculumCategory.curriculum_courses;
		curriculumCourses.push({
			id: course.id,
			name: course.name,
			dlab_course_code: course.dlab_course_code,
			order: curriculumCourses.length + 1
		});
		setDetailCurriculumCategory({ ...detailCurriculumCategory, curriculum_courses: curriculumCourses });
	};

	const onClickCurriculumCourselUp = courseId => {
		let curriculumCourses = detailCurriculumCategory.curriculum_courses.map(curriculumCourse => curriculumCourse);
		curriculumCourses.forEach((curriculumCourse, index) => {
			if (curriculumCourse.id == courseId && index != 0) {
				curriculumCourse.order--;
				curriculumCourses[index - 1].order++;
			}
		});
		curriculumCourses = curriculumCourses.sort((a, b) => a.order - b.order);
		setDetailCurriculumCategory({ ...detailCurriculumCategory, curriculum_courses: curriculumCourses });
	};

	const onClickCurriculumCourseDown = courseId => {
		let curriculumCourses = detailCurriculumCategory.curriculum_courses.map(curriculumCourse => curriculumCourse);
		curriculumCourses.forEach((curriculumCourse, index) => {
			if (curriculumCourse.id == courseId && index != curriculumCourses.length - 1) {
				curriculumCourse.order++;
				curriculumCourses[index + 1].order--;
			}
		});
		curriculumCourses = curriculumCourses.sort((a, b) => a.order - b.order);
		setDetailCurriculumCategory({ ...curriculumCategory, curriculum_courses: curriculumCourses });
	};

	const onClickCurriculumCourseDelete = courseId => {
		let curriculumCourses = detailCurriculumCategory.curriculum_courses.filter(
			curriculumCourse => curriculumCourse.id != courseId
		);
		curriculumCourses = curriculumCourses.sort((a, b) => a.order - b.order);
		curriculumCourses.forEach((curriculumCourse, index) => {
			curriculumCourse.order = index + 1;
		});
		setDetailCurriculumCategory({ ...detailCurriculumCategory, curriculum_courses: curriculumCourses });
	};

	return (
		<React.Fragment>
			<Row className="mt-3">
				<Col md={6}>
					<FormLabel required>커리큘럼 제목</FormLabel>
					<FormControl
						className="w-100"
						type="text"
						placeholder="커리큘럼 제목"
						value={detailCurriculumCategory.title}
						onChange={event =>
							setDetailCurriculumCategory({
								...detailCurriculumCategory,
								title: event.currentTarget.value
							})
						}
					/>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col md={12}>
					<FormLabel required>커리큘럼 소개</FormLabel>
					<TextAreaFormControl
						className="w-100"
						as="textarea"
						rows={5}
						value={detailCurriculumCategory.description}
						placeholder="내용을 입력해 주세요"
						onChange={event =>
							setDetailCurriculumCategory({
								...detailCurriculumCategory,
								description: event.currentTarget.value
							})
						}
					/>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col md={6}>
					<FormLabel required>커리큘럼 해시태그</FormLabel>
					<FormControl
						className="w-100"
						type="text"
						placeholder="#메타버스,#가상세계"
						value={detailCurriculumCategory.tag}
						onChange={event =>
							setDetailCurriculumCategory({ ...detailCurriculumCategory, tag: event.currentTarget.value })
						}
					/>
				</Col>
			</Row>
			<Row className="mt-3 align-items-center">
				<Col md={"auto"}>
					<h5 className="mb-0">커리큘럼 과목</h5>
				</Col>
				<Col>
					<Button primary onClick={() => setShowCurriculumCourseSearchModal(true)}>
						과목추가
					</Button>
				</Col>
			</Row>
			{detailCurriculumCategory.curriculum_courses.map((course, index) => {
				return (
					<Row className="mt-1" key={index}>
						<Col md={"auto"}>
							<CurriculumCourseContainer>
								<span className="mr-10">{course.name}</span>
								<span className="mr-10">{`(${course.dlab_course_code})`}</span>
								<Button
									secondary
									onClick={() => onClickCurriculumCourselUp(course.id)}
									disabled={index === 0}
								>
									↑
								</Button>
								<Button
									secondary
									onClick={() => onClickCurriculumCourseDown(course.id)}
									disabled={index === detailCurriculumCategory.curriculum_courses.length - 1}
								>
									↓
								</Button>
								<Button danger onClick={() => onClickCurriculumCourseDelete(course.id)}>
									X
								</Button>
							</CurriculumCourseContainer>
						</Col>
					</Row>
				);
			})}

			<Row className="mt-5 mb-5 align-self-center">
				<Col md={2}>
					<Button
						primary
						size="large"
						className="w-100"
						onClick={() => {
							if (isEdit) {
								ctrl.handleUpdate(detailCurriculumCategory, () =>
									history.push({ pathname: "/admin/detail_curriculums" })
								);
							} else {
								ctrl.handleCreate(detailCurriculumCategory, () =>
									history.push({ pathname: "/admin/detail_curriculums" })
								);
							}
						}}
					>
						저장
					</Button>
				</Col>
				<Col md={2}>
					<Link to={"/admin/detail_curriculums"}>
						<Button secondary size="large" className="w-100">
							취소
						</Button>
					</Link>
				</Col>
			</Row>
			<CurriculumCourseSearchModal
				show={showCurriculumCourseSearchModal}
				onHide={() => setShowCurriculumCourseSearchModal(false)}
				handleAdd={course => {
					setShowCurriculumCourseSearchModal(false);
					addCurriculumCourse(course);
				}}
			/>
		</React.Fragment>
	);
};

const TextAreaFormControl = styled(FormControl)`
	border: 0.063rem solid #e1e1e1;
	border-radius: 0.25rem;
	text-indent: 0rem;
	padding: 1rem;

	&::placeholder {
		color: #e1e1e1;
	}
`;

const CurriculumCourseContainer = styled.div`
	padding: 10px;
	border: 1px solid #e1e1e1;
	border-radius: 0.25rem;
`;

export default AdminDetailCurriculumCreate;
