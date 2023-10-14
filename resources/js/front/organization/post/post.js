import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import FormControl from "@components/elements/FormControl";
import useSizeDetector from "@hooks/useSizeDetector";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from "@mui/icons-material/Delete";

import * as util from "@common/util";
import * as ctrl from "./post.ctrl";

const OrganizationPost = ({ organization_id, post_id, admin }) => {
	const history = useHistory();
	const [initialized, setInitialized] = useState(false);
	const [post, setPost] = useState({});
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [comment, setComment] = useState("");
	const [commentFile, setCommentFile] = useState(null);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		ctrl.getOrganizationPost(organization_id, post_id, result => {
			// 비공개 글은 작성자 혹은 운영자만 확인 가능
			if (result.private && result.user_id !== userInfo.id && userInfo.is_admin === false) {
				history.goBack();
				return;
			}
			setPost(result);
			setInitialized(true);
		});
	}, [post_id]);

	const cancelComment = () => {
		setComment("");
		setCommentFile(null);
		setShowCommentForm(false);
	};

	const createComment = () => {
		ctrl.createComment(userInfo.id, organization_id, post_id, comment, commentFile, () => {
			alert("답변 저장이 완료되었습니다.");
			setComment("");
			setCommentFile(null);
			setShowCommentForm(false);
			ctrl.getOrganizationPost(organization_id, post_id, result => {
				setPost(result);
			});
		});
	};

	const deleteComment = commentId => {
		if (confirm("정말 삭제하시겠습니까?")) {
			ctrl.deleteComment(organization_id, post_id, commentId, () => {
				alert("댓글을 삭제하였습니다.");
				ctrl.getOrganizationPost(organization_id, post_id, result => {
					setPost(result);
				});
			});
		}
	};

	const navigateToEdit = () => {
		if (admin) {
			ctrl.navigateAdminPostEdit(history, organization_id, post_id);
		} else {
			ctrl.navigatePostEdit(history, organization_id, post_id);
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
	 * 작성자, 작성일 UI
	 * @returns
	 */
	const renderAuthor = () => {
		let postCreatedAt = util.getFormatDate(post.created_at);
		return <PostAuthorContainer>{`${postCreatedAt} ${post.user.name}`}</PostAuthorContainer>;
	};

	/**
	 * 제목 UI
	 * @returns
	 */
	const renderTitle = () => {
		return (
			<PostItemContainer>
				{SizeDetector.isDesktop ? (
					<Row className="align-items-center">
						<ItemHeader>제목</ItemHeader>
						<Col>
							<TitleText>{post.title}</TitleText>
						</Col>
					</Row>
				) : (
					<React.Fragment>
						<Row>
							<ItemHeader>제목</ItemHeader>
						</Row>
						<Row className="mt-8">
							<Col>
								<TitleText>{post.title}</TitleText>
							</Col>
						</Row>
					</React.Fragment>
				)}
			</PostItemContainer>
		);
	};

	/**
	 * 첨부파일 UI
	 * @returns
	 */
	const renderAttachment = attachment => {
		return (
			<PostItemContainer>
				{SizeDetector.isDesktop ? (
					<Row className="align-items-center">
						<ItemHeader>첨부파일</ItemHeader>
						<Col>
							<AttachmentFile>
								<StyledAttachmentIcon />
								<AttachmentFilenameText p3>{attachment.org_filename}</AttachmentFilenameText>
								<a href={`/storage/files/${attachment.filename}`} download={attachment.org_filename}>
									<AttachmentFileDownloadButton secondary>
										{SizeDetector.isDesktop ? "파일 다운로드" : "다운로드"}
									</AttachmentFileDownloadButton>
								</a>
							</AttachmentFile>
						</Col>
					</Row>
				) : (
					<React.Fragment>
						<Row>
							<ItemHeader>첨부파일</ItemHeader>
						</Row>
						<Row className="mt-8">
							<Col>
								<AttachmentFile>
									<StyledAttachmentIcon />
									<AttachmentFilenameText p3>{attachment.org_filename}</AttachmentFilenameText>
									<a
										href={`/storage/files/${attachment.filename}`}
										download={attachment.org_filename}
									>
										<AttachmentFileDownloadButton secondary>
											{SizeDetector.isDesktop ? "파일 다운로드" : "다운로드"}
										</AttachmentFileDownloadButton>
									</a>
								</AttachmentFile>
							</Col>
						</Row>
					</React.Fragment>
				)}
			</PostItemContainer>
		);
	};

	/**
	 * 첨부파일 사진 표시 UI
	 * @returns
	 */
	const renderAttachmentImage = attachment => {
		return (
			<AttachmentImageContainer>
				{SizeDetector.isDesktop ? (
					<React.Fragment>
						<Row>
							<ItemHeader>첨부사진</ItemHeader>
						</Row>
						<Row className="align-items-center">
							<Col>
								<AttachmentImage src={`/storage/files/${attachment.filename}`} />
							</Col>
						</Row>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Row>
							<ItemHeader>첨부사진</ItemHeader>
						</Row>
						<Row className="mt-8">
							<Col>
								<AttachmentImage src={`/storage/files/${attachment.filename}`} />
							</Col>
						</Row>
					</React.Fragment>
				)}
			</AttachmentImageContainer>
		);
	};

	/**
	 * 내용 UI
	 * @returns
	 */
	const renderDescription = description => {
		return (
			<DescriptionContainer>
				<DescriptionText dangerouslySetInnerHTML={{ __html: description }}></DescriptionText>
			</DescriptionContainer>
		);
	};

	/**
	 * 답변 UI
	 */
	const renderComments = () => {
		return (
			<React.Fragment>
				<CommentHeader className="mt-20">댓글</CommentHeader>
				{post.comments.map((comment, commentIdx) => {
					return (
						<CommentContainer key={commentIdx}>
							<CommentAuthorContainer>
								<span>{comment.user.name}</span>
								{(comment.user_id === userInfo.id || userInfo.is_admin === true) && (
									<StyledDeleteIcon onClick={() => deleteComment(comment.id)} />
								)}
							</CommentAuthorContainer>
							<DescriptionText>{comment.comment}</DescriptionText>
							{comment.attachment && renderAttachmentImage(comment.attachment)}
						</CommentContainer>
					);
				})}
			</React.Fragment>
		);
	};

	/**
	 * 답변 작성을 위한 UI
	 * @returns
	 */
	const renderCommentForm = () => {
		return (
			<CommentFormContainer className="mt-20">
				<Row>
					<Col>
						<TextAreaFormControl
							className="w-100"
							as="textarea"
							value={comment}
							placeholder="답변의 내용을 입력해 주세요"
							onChange={event => {
								setComment(event.currentTarget.value);
							}}
							rows={5}
						/>
					</Col>
				</Row>
				<Row className="align-items-center mt-20">
					<ItemHeader>사진선택</ItemHeader>
					<Col>
						<AttachmentFile>
							<StyledAttachmentIcon />
							<FileFormControl
								type="file"
								label={commentFile ? commentFile.name : ""}
								data-browse="사진선택"
								custom
								accept="image/*"
								onChange={event => {
									setCommentFile(event.currentTarget.files[0]);
								}}
							/>
						</AttachmentFile>
					</Col>
				</Row>
				<Row className="mt-20">
					<Col className="d-flex justify-content-end">
						<ReplyButton secondary size="large" onClick={() => cancelComment()}>
							취소
						</ReplyButton>
						<ReplyButton primary size="large" onClick={() => createComment()}>
							답변하기
						</ReplyButton>
					</Col>
				</Row>
			</CommentFormContainer>
		);
	};

	/**
	 * 버튼
	 * @returns
	 */
	const renderButtons = () => {
		return (
			<Row className={SizeDetector.isDesktop ? "mt-60" : "mt-40"}>
				<Col>
					<ReplyButton primary size="large" onClick={() => setShowCommentForm(true)}>
						답변 달기
					</ReplyButton>
				</Col>
				<Col className="d-flex justify-content-end">
					{(userInfo.id === post.user_id || userInfo.is_admin) && (
						<ReplyButton primary size="large" onClick={navigateToEdit}>
							수정/삭제
						</ReplyButton>
					)}
					<ReplyButton secondary size="large" onClick={navigateToList}>
						확인
					</ReplyButton>
				</Col>
			</Row>
		);
	};
	if (!initialized) return null;

	return (
		<PostContainer className="container" border={admin ? true : false}>
			{renderAuthor()}
			{renderTitle()}
			{post.attachment && renderAttachment(post.attachment)}
			{renderDescription(post.description)}
			{post.comments.length !== 0 && renderComments()}
			{showCommentForm && renderCommentForm()}
			{renderButtons()}
		</PostContainer>
	);
};

const PostContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1.875rem 1rem 2.5rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 1.25rem 1.5rem 3.75rem 1.5rem;
	}
	${props =>
		props.border &&
		css`
			margin-top: 1.25rem;
			border: 0.063rem solid ${({ theme }) => theme.colors.gray};
		`}
`;

const CommentFormContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 1.25rem;
	}
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
`;

const PostAuthorContainer = styled.div`
	color: ${({ theme }) => theme.colors.gray3};
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.875rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const PostItemContainer = styled.div`
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};
	@media only screen and (max-width: 767.98px) {
		margin-top: 1rem;
		padding-bottom: 1rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1.25rem;
		padding-bottom: 1rem;
	}
`;

const CommentContainer = styled.div`
	border: 1px solid ${({ theme }) => theme.colors.gray};
	padding: 1rem;
	margin-top: 1rem;
`;

const CommentHeader = styled.div`
	font-family: "Noto Sans KR";
	font-weight: 700;
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

const CommentAuthorContainer = styled.div`
	color: ${({ theme }) => theme.colors.gray3};
	font-family: "Noto Sans KR";
	font-weight: 400;
	display: flex;
	align-items: center;
`;

const StyledDeleteIcon = styled(DeleteIcon)`
	cursor: pointer;
	font-size: 1.2rem !important;
`;

const ItemHeader = styled(Col)`
	font-family: "Noto Sans KR";
	font-weight: 700;
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

const TitleText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
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

const AttachmentFilenameText = styled(Text)`
	display: inline-block;
	text-overflow: ellipsis;
	overflow: hidden;
	@media only screen and (max-width: 767.98px) {
		width: calc(100% - 7.313rem);
		margin-left: 0.5rem;
		padding-right: 0.5rem;
	}
	@media only screen and (min-width: 768px) {
		width: calc(100% - 10.4rem);
		margin-left: 0.75rem;
		padding-right: 0.75rem;
	}
`;

const AttachmentFileDownloadButton = styled(Button)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		width: 6.313rem;
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		width: 10.4rem;
		height: 3rem;
		padding: 0.438rem 1.875rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

const AttachmentImageContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1rem;
		padding-bottom: 1rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1.25rem;
		padding-bottom: 1rem;
	}
`;

const AttachmentImage = styled.img`
	max-width: 100%;
`;

const DescriptionContainer = styled(PostItemContainer)`
	overflow: scroll;
`;

const DescriptionText = styled(Text)`
	display: block;
	font-family: "Noto Sans KR";
	font-weight: 400;
	white-space: pre-line;
	p {
		margin-bottom: 0;
	}
	@media only screen and (max-width: 767.98px) {
		font-size: 0.875rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
	}
`;

const ReplyButton = styled(Button)`
	@media only screen and (max-width: 767.98px) {
		width: 100%;
		height: 2.25rem;
	}
	@media only screen and (min-width: 768px) {
		width: 8rem;
	}
`;

const TextAreaFormControl = styled(FormControl)`
	border: none;
	border-bottom: 0.063rem solid ${({ theme }) => theme.colors.gray};

	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
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

export default OrganizationPost;
