import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import FormControl from "@components/elements/FormControl";
import FormLabel from "@components/elements/FormLabel";
import Button from "@components/elements/Button";
import * as ctrl from "./index.ctrl";
import * as api from "@common/api";

import { Editor } from "@tinymce/tinymce-react";

const AdminNoticeCreate = ({ notice_id }) => {
	const history = useHistory();
	const descriptionEditorRef = useRef();
	const [notice, setNotice] = useState(null);

	const isEdit = notice_id ? true : false;

	useEffect(() => {
		if (isEdit) {
			ctrl.getNotice(notice_id, setNotice);
		} else {
			setNotice(ctrl.getDefaultNotice());
		}
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

	return (
		<React.Fragment>
			<Row className="mt-3">
				<Col>
					<FormLabel required>제목</FormLabel>
					<FormControl
						className="w-100"
						type="text"
						placeholder="제목을 입력해 주세요"
						value={notice?.title ?? ""}
						onChange={event => setNotice({ ...notice, title: event.currentTarget.value })}
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<FormLabel required>내용</FormLabel>
					<EditorContainer>
						<Editor
							apiKey={process.env.MIX_TINYMCE_API_KEY}
							init={{
								language: "ko_KR",
								language_url: "/lib/tinymce/langs/ko_KR.js",
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
							value={notice?.description ?? ""}
							onInit={(evt, editor) => (descriptionEditorRef.current = editor)}
							onEditorChange={(newValue, editor) => setNotice({ ...notice, description: newValue })}
						/>
					</EditorContainer>
				</Col>
			</Row>
			<Row className="mt-3 mb-3 justify-content-end">
				<Col md={2}>
					<Link to="/admin/supports">
						<Button secondary size="large" className="w-100">
							취소
						</Button>
					</Link>
				</Col>
				{isEdit ? (
					<React.Fragment>
						<Col md={2}>
							<Button
								danger
								size="large"
								className="w-100"
								onClick={() =>
									ctrl.handleDelete(notice_id, () => history.push({ pathname: "/admin/supports" }))
								}
							>
								삭제
							</Button>
						</Col>
						<Col md={2}>
							<Button
								primary
								size="large"
								className="w-100"
								onClick={() =>
									ctrl.handleUpdate(notice_id, notice, () =>
										history.push({ pathname: "/admin/supports" })
									)
								}
							>
								수정
							</Button>
						</Col>
					</React.Fragment>
				) : (
					<Col md={2}>
						<Button
							primary
							size="large"
							className="w-100"
							onClick={() =>
								ctrl.handleCreate(notice, () => history.push({ pathname: "/admin/supports" }))
							}
						>
							저장
						</Button>
					</Col>
				)}
			</Row>
		</React.Fragment>
	);
};

const EditorContainer = styled.div`
	width: 100%;
	height: 600px;
	margin-top: 8px;
`;

export default AdminNoticeCreate;
