import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { Tabs, Tab } from "react-bootstrap";
import Text from "@components/elements/Text";
import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import CourseType from "@constants/CourseType";

import * as ctrl from "./index.ctrl";
import * as api from "@common/api";

import { Editor } from "@tinymce/tinymce-react";

const AdminCourseDescription = ({ course_id }) => {
	const history = useHistory();
	const [course, setCourse] = useState({});

	const [desktopIntroFile, setDesktopIntroFile] = useState(null);
	const [desktopIntroFilename, setDesktopIntroFilename] = useState("");
	const [desktopCourseDescription, setDesktopCourseDescription] = useState("");
	const [desktopCourseCurriculum, setDesktopCourseCurriculum] = useState("");
	const [desktopOperation, setDesktopOperation] = useState("");
	const [desktopRefund, setDesktopRefund] = useState("");

	const [mobileIntroFile, setMobileIntroFile] = useState(null);
	const [mobileIntroFilename, setMobileIntroFilename] = useState("");
	const [mobileCourseDescription, setMobileCourseDescription] = useState("");
	const [mobileCourseCurriculum, setMobileCourseCurriculum] = useState("");
	const [mobileOperation, setMobileOperation] = useState("");
	const [mobileRefund, setMobileRefund] = useState("");

	const [descriptionTab, setDescriptionTab] = useState(1);
	const [curriculumTab, setCurriculumTab] = useState(1);
	const [operationTab, setOperationTab] = useState(1);
	const [refundTab, setRefundTab] = useState(1);

	useEffect(() => {
		ctrl.getCourse(course_id, result => {
			setCourse(result);
			if (result.has_description) {
				let courseDescription = result.course_description;
				setDesktopIntroFilename(courseDescription.desktop_intro_image.org_filename);
				setDesktopCourseDescription(courseDescription.desktop_course_description);
				setDesktopCourseCurriculum(courseDescription.desktop_course_curriculum);
				setDesktopOperation(courseDescription.desktop_operation);
				setDesktopRefund(courseDescription.desktop_refund);

				setMobileIntroFilename(courseDescription.mobile_intro_image.org_filename);
				setMobileCourseDescription(courseDescription.mobile_course_description);
				setMobileCourseCurriculum(courseDescription.mobile_course_curriculum);
				setMobileOperation(courseDescription.mobile_operation);
				setMobileRefund(courseDescription.mobile_refund);
			}
		});
	}, []);

	const onEditorImageUpload = (callback, value, meta) => {
		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.onchange = function() {
			let file = this.files[0];
			(async () => {
				let formData = new FormData();
				formData.append("file", file);
				api.createFile(formData)
					.then(res => {
						let url = `/storage/files/${res.data.filename}`;
						callback(url, { alt: file.name, title: file.name });
					})
					.catch(err => {
						console.error(err);
					});
			})();
		};
		input.click();
	};

	const onClickCancel = () => {
		history.push({ pathname: `/admin/courses` });
	};

	const onClickSave = () => {
		ctrl.createCourseDescription(
			course_id,
			{
				desktop_intro_image_file: desktopIntroFile,
				desktop_course_description: desktopCourseDescription,
				desktop_course_curriculum: desktopCourseCurriculum,
				desktop_operation: desktopOperation,
				desktop_refund: desktopRefund,
				mobile_intro_image_file: mobileIntroFile,
				mobile_course_description: mobileCourseDescription,
				mobile_course_curriculum: mobileCourseCurriculum,
				mobile_operation: mobileOperation,
				mobile_refund: mobileRefund
			},
			() => {
				history.push({ pathname: `/admin/courses` });
			}
		);
	};

	return (
		<React.Fragment>
			<section className="mt-3">
				<Text h5>과목기본정보</Text>
				<Text p2>{`과목이름: ${course?.name ?? ""}`}</Text>
				<Text p2>{`과목유형: ${CourseType.convertToString(course.type)}`}</Text>
				<Text p2>{`디랩과목코드: ${course?.dlab_course_code ?? "-"}`}</Text>
			</section>
			<section className="mt-5">
				<Text h5>수업 안내 이미지 등록</Text>
				<FormLabel required>데스크톱 이미지 등록</FormLabel>
				<FormControl
					type="file"
					label={desktopIntroFilename}
					data-browse="찾기"
					custom
					onChange={event => {
						setDesktopIntroFilename(event.currentTarget.files[0].name);
						setDesktopIntroFile(event.currentTarget.files[0]);
					}}
				/>
				<FormLabel required>모바일 이미지 등록</FormLabel>
				<FormControl
					type="file"
					label={mobileIntroFilename}
					data-browse="찾기"
					custom
					onChange={event => {
						setMobileIntroFilename(event.currentTarget.files[0].name);
						setMobileIntroFile(event.currentTarget.files[0]);
					}}
				/>
			</section>
			<section className="mt-5">
				<Text h5>과목소개</Text>
				<Tabs activeKey={descriptionTab} className="mt-3 mb-3" onSelect={tab => setDescriptionTab(tab)}>
					<Tab eventKey={1} title="데스크톱">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={desktopCourseDescription}
								onEditorChange={(newValue, editor) => setDesktopCourseDescription(newValue)}
							/>
						</EditorContainer>
					</Tab>
					<Tab eventKey={2} title="모바일">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={mobileCourseDescription}
								onEditorChange={(newValue, editor) => setMobileCourseDescription(newValue)}
							/>
						</EditorContainer>
					</Tab>
				</Tabs>
			</section>
			<section className="mt-5">
				<Text h5>커리큘럼</Text>
				<Tabs activeKey={curriculumTab} className="mt-3 mb-3" onSelect={tab => setCurriculumTab(tab)}>
					<Tab eventKey={1} title="데스크톱">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={desktopCourseCurriculum}
								onEditorChange={(newValue, editor) => setDesktopCourseCurriculum(newValue)}
							/>
						</EditorContainer>
					</Tab>
					<Tab eventKey={2} title="모바일">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={mobileCourseCurriculum}
								onEditorChange={(newValue, editor) => setMobileCourseCurriculum(newValue)}
							/>
						</EditorContainer>
					</Tab>
				</Tabs>
			</section>
			<section className="mt-5">
				<Text h5>운영방법</Text>
				<Tabs activeKey={operationTab} className="mt-3 mb-3" onSelect={tab => setOperationTab(tab)}>
					<Tab eventKey={1} title="데스크톱">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={desktopOperation}
								onEditorChange={(newValue, editor) => setDesktopOperation(newValue)}
							/>
						</EditorContainer>
					</Tab>
					<Tab eventKey={2} title="모바일">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={mobileOperation}
								onEditorChange={(newValue, editor) => setMobileOperation(newValue)}
							/>
						</EditorContainer>
					</Tab>
				</Tabs>
			</section>
			<section className="mt-5">
				<Text h5>환불방법</Text>
				<Tabs activeKey={refundTab} className="mt-3 mb-3" onSelect={tab => setRefundTab(tab)}>
					<Tab eventKey={1} title="데스크톱">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={desktopRefund}
								onEditorChange={(newValue, editor) => setDesktopRefund(newValue)}
							/>
						</EditorContainer>
					</Tab>
					<Tab eventKey={2} title="모바일">
						<EditorContainer>
							<Editor
								apiKey={process.env.MIX_TINYMCE_API_KEY}
								init={{
									language: "ko_KR",
									language_url: "/lib/tinymce/langs/ko_KR.js",
									placeholder: "내용을 입력해 주세요",
									height: "100%",
									menubar: false,
									plugins: [
										"advlist autolink lists link image charmap print preview anchor",
										"searchreplace visualblocks code fullscreen",
										"insertdatetime media table paste code help wordcount"
									],
									toolbar:
										"formatselect | " +
										"bold italic underline forecolor backcolor | alignleft aligncenter " +
										"alignright alignjustify | bullist numlist outdent indent | " +
										"image | code | help",
									content_style:
										'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
									image_title: false,
									automatic_uploads: true,
									convert_urls: false,
									file_picker_types: "image",
									file_picker_callback: onEditorImageUpload
								}}
								initialValue=""
								value={mobileRefund}
								onEditorChange={(newValue, editor) => setMobileRefund(newValue)}
							/>
						</EditorContainer>
					</Tab>
				</Tabs>
			</section>
			<section className="mt-5">
				<ButtonContainer>
					<SaveButton secondary size="large" onClick={onClickCancel}>
						취소
					</SaveButton>
					<SaveButton primary size="large" onClick={onClickSave}>
						저장
					</SaveButton>
				</ButtonContainer>
			</section>
		</React.Fragment>
	);
};

const EditorContainer = styled.div`
	width: 100%;
	height: 400px;
	margin-top: 8px;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const SaveButton = styled(Button)`
	width: 8rem;
`;

export default AdminCourseDescription;
