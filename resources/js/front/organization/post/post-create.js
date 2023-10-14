import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { Row, Col, Form } from "react-bootstrap";
import styled from "styled-components";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import AttachmentIcon from "@mui/icons-material/Attachment";
import useSizeDetector from "@hooks/useSizeDetector";
import * as ctrl from "./post.ctrl";
import * as api from "@common/api";

import { Editor } from "@tinymce/tinymce-react";

const OrganizationPostCreate = ({ organization_id, post_id, admin }) => {
	const history = useHistory();
	const descriptionEditorRef = useRef();
	const [initialized, setInitialized] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [attachmentFile, setAttachmentFile] = useState(null);
	const [comments, setComments] = useState([]);
	const SizeDetector = useSizeDetector();
	const isEdit = !!post_id;

	useEffect(() => {
		// postId가 전달된 경우에는 편집 상태이다.
		if (isEdit) {
			ctrl.getOrganizationPost(organization_id, post_id, result => {
				setTitle(result.title);
				setDescription(result.description);
				setIsPrivate(result.private);
				setComments(result.comments);
				if (result.attachment) {
					setAttachmentFile({ ...result.attachment, name: result.attachment.org_filename });
				}
				setInitialized(true);
			});
		} else {
			setInitialized(true);
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

	const createPost = () => {
		ctrl.createOrganizationPost(
			organization_id,
			{
				user_id: userInfo.id,
				title,
				description,
				attachment_file: attachmentFile,
				private: isPrivate,
				order: admin ? 1 : 0
			},
			() => {
				alert("저장이 완료되었습니다.");
				navigateToList();
			}
		);
	};

	const updatePost = () => {
		ctrl.updateOrganizationPost(
			organization_id,
			post_id,
			{
				title,
				description,
				attachment_file: attachmentFile,
				private: isPrivate
			},
			() => {
				alert("수정이 완료되었습니다.");
				navigateToList();
			}
		);
	};

	const deletePost = () => {
		if (comments.length !== 0) {
			alert("댓글이 있는 글은 삭제하실 수 없습니다.");
			return;
		}
		if (confirm("정말 삭제하시겠습니까?")) {
			ctrl.deleteOrganizationPost(organization_id, post_id, () => {
				alert("삭제가 완료되었습니다.");
				navigateToList();
			});
		}
	};

	const navigateToList = () => {
		if (admin) {
			ctrl.navigateAdminPostList(history, organization_id);
		} else {
			ctrl.navigatePostList(history, organization_id);
		}
	};

	/**
	 * 상단 UI
	 * @returns
	 */
	const renderTop = () => {
		return (
			<CreateTopContainer>
				{SizeDetector.isDesktop ? (
					<Row noGutters className="align-items-center h-100">
						<CreateItemHeader>제목</CreateItemHeader>
						<Col className="h-100">
							<TitleFormControl
								className="w-100"
								type="text"
								value={title}
								placeholder="제목을 입력해 주세요."
								onChange={event => {
									setTitle(event.currentTarget.value);
								}}
							/>
						</Col>
						<CreatePrivateHeader>
							<Form.Check
								type="checkbox"
								label="비공개"
								inline
								checked={isPrivate}
								id="private"
								onChange={event => setIsPrivate(event.currentTarget.checked)}
							/>
						</CreatePrivateHeader>
					</Row>
				) : (
					<React.Fragment>
						<Row noGutters className="align-items-center">
							<CreateItemHeader>제목</CreateItemHeader>
							<CreatePrivateHeader>
								<Form.Check
									type="checkbox"
									label="비공개"
									inline
									checked={isPrivate}
									id="private"
									onChange={event => setIsPrivate(event.currentTarget.checked)}
								/>
							</CreatePrivateHeader>
						</Row>
						<Row noGutters className="align-items-center mt-8">
							<Col>
								<TitleFormControl
									className="w-100"
									type="text"
									value={title}
									placeholder="제목을 입력해 주세요."
									onChange={event => {
										setTitle(event.currentTarget.value);
									}}
								/>
							</Col>
						</Row>
					</React.Fragment>
				)}
			</CreateTopContainer>
		);
	};

	/**
	 * 첨부파일 UI
	 * @returns
	 */
	const renderAttachment = () => {
		return (
			<React.Fragment>
				{SizeDetector.isDesktop ? (
					<Row className="align-items-center mt-20">
						<CreateItemHeader>첨부파일</CreateItemHeader>
						<Col>
							<AttachmentFile>
								<StyledAttachmentIcon />
								<FileFormControl
									type="file"
									label={attachmentFile ? attachmentFile.name : ""}
									data-browse="파일선택"
									custom
									onChange={event => {
										setAttachmentFile(event.currentTarget.files[0]);
									}}
								/>
							</AttachmentFile>
						</Col>
					</Row>
				) : (
					<React.Fragment>
						<Row className="mt-16">
							<CreateItemHeader>첨부파일</CreateItemHeader>
						</Row>
						<Row className="mt-8">
							<Col>
								<AttachmentFile>
									<StyledAttachmentIcon />
									<FileFormControl
										type="file"
										label={attachmentFile ? attachmentFile.name : ""}
										data-browse="파일선택"
										custom
										onChange={event => {
											setAttachmentFile(event.currentTarget.files[0]);
										}}
									/>
								</AttachmentFile>
							</Col>
						</Row>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	};

	/**
	 * 저장 버튼
	 * @returns
	 */
	const renderSaveButtons = () => {
		return (
			<Row className={SizeDetector.isDesktop ? "mt-60" : "mt-40"}>
				<Col className="d-flex justify-content-end">
					<SaveButton primary size="large" onClick={() => createPost()}>
						저장
					</SaveButton>
				</Col>
			</Row>
		);
	};

	/**
	 * 수정 버튼
	 * @returns
	 */
	const renderUpdateButtons = () => {
		return (
			<Row className={SizeDetector.isDesktop ? "mt-60" : "mt-40"}>
				<Col>
					<SaveButton danger size="large" onClick={() => deletePost()}>
						삭제
					</SaveButton>
				</Col>
				<Col className="d-flex justify-content-end">
					<SaveButton secondary size="large" onClick={() => navigateToList()}>
						취소
					</SaveButton>
					<SaveButton primary size="large" onClick={() => updatePost()}>
						수정
					</SaveButton>
				</Col>
			</Row>
		);
	};

	return (
		<PostCreateContainer className="container">
			{renderTop()}
			<Row className="mt-20">
				<Col>
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
									"image | help",
								content_style:
									'body { font-family:"Noto Sans"; Helvetica,Arial,sans-serif; font-size:16px }',
								image_title: false,
								automatic_uploads: true,
								convert_urls: false,
								file_picker_types: "image",
								file_picker_callback: onEditorImageUpload
							}}
							initialValue=""
							value={description}
							onInit={(evt, editor) => (descriptionEditorRef.current = editor)}
							onEditorChange={(newValue, editor) => setDescription(newValue)}
						/>
					</EditorContainer>
				</Col>
			</Row>
			{renderAttachment()}
			{isEdit ? renderUpdateButtons() : renderSaveButtons()}
		</PostCreateContainer>
	);
};

const PostCreateContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1.875rem 1rem 2.5rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 2.5rem 1.5rem 3.75rem 1.5rem;
	}
`;

const CreateTopContainer = styled.div`
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
	@media only screen and (max-width: 767.98px) {
		padding-bottom: 0.563rem;
	}
	@media only screen and (min-width: 768px) {
		padding-bottom: 0.938rem;
		height: 3rem;
	}
`;

const CreateItemHeader = styled(Col)`
	font-family: "Noto Sans KR";
	font-weight: 700;
	display: flex;
	align-items: center;
	height: 100%;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.875rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		min-width: 7rem;
		max-width: 7rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const TitleFormControl = styled(FormControl)`
	border: none;
	margin: 0;
	height: 100%;
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const CreatePrivateHeader = styled(Col)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	height: 100%;
	min-width: 6rem;
	max-width: 6rem;
	div {
		justify-content: flex-end;
	}
	@media only screen and (max-width: 767.98px) {
		font-size: 0.875rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const AttachmentFile = styled.div`
	display: flex;
	align-items: center;
	border: 0.063rem solid #dcdcdc;
	border-radius: 0 0.25rem 0.25rem 0;
	@media only screen and (max-width: 767.98px) {
		height: 2.25rem;
	}
	@media only screen and (min-width: 768px) {
		height: 3rem;
	}
`;

const StyledAttachmentIcon = styled(AttachmentIcon)`
	display: inline-block;
	font-size: 1.5rem !important;
	@media only screen and (max-width: 767.98px) {
		margin-left: 0.5rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 0.75rem;
	}
`;

const FileFormControl = styled(FormControl)`
	border: none;
	margin: 0;

	width: 100%;
	max-width: 100%;
	margin-left: 0.75rem;

	@media only screen and (max-width: 767.98px) {
		height: 2.25rem;

		.custom-file-label::after {
			font-size: 1rem;
			line-height: 1.75rem;
			padding-top: 0.25rem;
		}
	}
	@media only screen and (min-width: 768px) {
		height: 3rem;

		.custom-file-label::after {
			font-size: 1.125rem;
			line-height: 2rem;
			padding-top: 0.563rem;
			width: 8rem;
			text-align: center;
		}
	}

	font-family: "Noto Sans KR";
	font-weight: 400;

	.custom-file-label {
		border: none;
		background-color: transparent;
		height: 100%;
		margin: 0;
		display: flex;
		align-items: center;
	}
	.custom-file-label::after {
		height: 100%;
		background-color: transparent;
		color: ${({ theme }) => theme.colors.primary};
		border: 0.063rem solid ${({ theme }) => theme.colors.primary};
		border-radius: 0.25rem;
	}
	.custom-file-input {
		height: 100%;
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const SaveButton = styled(Button)`
	@media only screen and (max-width: 767.98px) {
		width: 100%;
		height: 2.25rem;
	}
	@media only screen and (min-width: 768px) {
		width: 8rem;
	}
`;

const EditorContainer = styled.div`
	width: 100%;
	height: 400px;
	margin-top: 8px;
`;

export default OrganizationPostCreate;
