import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col, Table } from "react-bootstrap";
import styled, { css } from "styled-components";

import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import ChapterContent from "./components/ChapterContent";
import TablePagination from "./components/TablePagination";
import CoursePostType from "@constants/CoursePostType";
import CoursePostStatus from "@constants/CoursePostStatus";
import useSizeDetector from "@hooks/useSizeDetector";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";

import * as util from "@common/util";
import * as ctrl from "./chapter.ctrl";

const PostList = ({ course, admin }) => {
	const history = useHistory();
	const [coursePosts, setCoursePosts] = useState({ data: [] });
	const [keyword, setKeyword] = useState("");
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		ctrl.getCoursePosts(course.id, null, result => {
			setCoursePosts(result);
		});
	}, [course]);

	const search = () => {
		ctrl.getCoursePosts(course.id, keyword, result => {
			setCoursePosts(result);
		});
	};

	/**
	 * 강좌게시판 글 유형을 구한다.
	 * @param {CoursePostType} type
	 * @returns
	 */
	const getPostType = type => {
		switch (type) {
			case CoursePostType.QUESTION:
				return "질문";
			case CoursePostType.ASSIGNMENT:
				return "과제";
			case CoursePostType.NOTICE:
				return "공지";
		}
		return "-";
	};

	/**
	 * 강좌게시판 글 상태를 구한다.
	 * @param {CoursePostTyle} type
	 * @param {CoursePostStatus} status
	 * @returns
	 */
	const getPostStatus = (type, status) => {
		if (type === CoursePostType.QUESTION) {
			switch (status) {
				case CoursePostStatus.NONE:
					return { status: "미답변", confirm: false };
				case CoursePostStatus.CONFIRM:
					return { status: "답변완료", confirm: true };
			}
		}

		if (type === CoursePostType.ASSIGNMENT) {
			switch (status) {
				case CoursePostStatus.NONE:
					return { status: "미확인", confirm: false };
				case CoursePostStatus.CONFIRM:
					return { status: "확인", confirm: true };
			}
		}

		if (type === CoursePostType.NOTICE) {
			switch (status) {
				case CoursePostStatus.NONE:
					return { status: "", confirm: false };
			}
		}
	};

	const onClickPageItem = url => {
		if (url) ctrl.getPaginationLink(url, setCoursePosts);
	};

	/**
	 * 게시글 확인 페이지로 이동한다.
	 * @param {object} post
	 */
	const gotoPost = post => {
		// 비공개 글은 작성자 혹은 운영자만 확인 가능
		if (post.private && post.user_id !== userInfo.id && userInfo.is_admin === false) {
			alert("비공개 글 입니다.");
			return;
		}
		ctrl.navigatePost(history, course.id, post.id);
	};

	/**
	 * 강좌 게시판 전체 목록 UI
	 * @returns
	 */
	const renderPostList = () => {
		return (
			<PostListContainer>
				{admin && renderCreateNoticeButton()}
				<PostListTable>
					{admin ? renderTableHeaderAdmin() : renderTableHeaderFront()}
					<tbody>
						{coursePosts.data.map((post, postIdx) => {
							let postType = getPostType(post.type);
							let postStatus = getPostStatus(post.type, post.status);
							return admin
								? renderTableColumnAdmin(postIdx, post, postType, postStatus)
								: renderTableColumnFront(postIdx, post, postType, postStatus);
						})}
					</tbody>
				</PostListTable>
				{coursePosts.data.length === 0 ? renderNoData() : null}
				<div className={`d-flex justify-content-center ${SizeDetector.isDesktop ? "mt-40" : "mt-30"}`}>
					<TablePagination
						links={coursePosts.links}
						firstPageUrl={coursePosts.first_page_url}
						lastPageUrl={coursePosts.last_page_url}
						onChange={onClickPageItem}
					/>
				</div>
				{renderButtons()}
			</PostListContainer>
		);
	};

	/**
	 * 강좌 게시판 공지사항 작성 버튼
	 */
	const renderCreateNoticeButton = () => {
		return (
			<PostWriteButton
				primary
				className="float-right mb-3"
				onClick={() => ctrl.navigateAdminPostCreate(history, course.id)}
			>
				공지 등록
			</PostWriteButton>
		);
	};

	/**
	 * Front에서 사용하기 위한 Table Header
	 * @returns
	 */
	const renderTableHeaderFront = () => {
		return (
			<TableHeader>
				<tr>
					<TableHeaderCol width={SizeDetector.isDesktop ? "60px" : "50px"} className="text-center">
						번호
					</TableHeaderCol>
					<TableHeaderCol width={SizeDetector.isDesktop ? "70px" : "50px"} className="text-center">
						유형
					</TableHeaderCol>
					<TableHeaderCol>제목</TableHeaderCol>
					<TableHeaderCol width={SizeDetector.isDesktop ? "100px" : "70px"} className="text-center">
						상태
					</TableHeaderCol>
					{SizeDetector.isDesktop ? (
						<React.Fragment>
							<TableHeaderCol width="100px" className="text-center">
								작성자
							</TableHeaderCol>
							<TableHeaderCol width="100px" className="text-center">
								등록일
							</TableHeaderCol>
							<TableHeaderCol width="100px" className="text-center">
								조회수
							</TableHeaderCol>
						</React.Fragment>
					) : null}
				</tr>
			</TableHeader>
		);
	};

	/**
	 * Admin에서 사용하기 위한 Table Header
	 * @returns
	 */
	const renderTableHeaderAdmin = () => {
		return (
			<TableHeader>
				<tr>
					<TableHeaderCol width="60px" className="text-center">
						번호
					</TableHeaderCol>
					<TableHeaderCol width="70px" className="text-center">
						유형
					</TableHeaderCol>
					<TableHeaderCol>제목</TableHeaderCol>
					<TableHeaderCol width="100px" className="text-center">
						상태
					</TableHeaderCol>
					<TableHeaderCol width="100px" className="text-center">
						작성자
					</TableHeaderCol>
					<TableHeaderCol width="100px" className="text-center">
						등록일
					</TableHeaderCol>
					<TableHeaderCol width="100px" className="text-center">
						조회수
					</TableHeaderCol>
					<TableHeaderCol width="70px" className="text-center">
						Action
					</TableHeaderCol>
				</tr>
			</TableHeader>
		);
	};

	/**
	 * Admin에서 사용하기 위한 Table Column
	 * @param {int} postIdx
	 * @param {object} post
	 * @param {string} postType
	 * @param {string} postStatus
	 * @returns
	 */
	const renderTableColumnAdmin = (postIdx, post, postType, postStatus) => {
		let postCreatedAt = util.getFormatDate(post.created_at);
		return (
			<tr key={postIdx}>
				<TableDataCol className="text-center">{`${coursePosts.from + postIdx}`}</TableDataCol>
				<TableDataCol className="text-center">{postType}</TableDataCol>
				<TableDataCol>{post.title}</TableDataCol>
				<TableDataCol className="text-center" confirm={postStatus.confirm}>
					{postStatus.status}
				</TableDataCol>
				<TableDataCol className="text-center">{post.user.name}</TableDataCol>
				<TableDataCol className="text-center">{postCreatedAt}</TableDataCol>
				<TableDataCol className="text-center">{post.view_count}</TableDataCol>
				{post.type !== CoursePostType.NOTICE && (
					<TableDataCol
						className="text-center"
						role="button"
						onClick={() => ctrl.navigateAdminPost(history, course.id, post.id)}
					>
						답변
					</TableDataCol>
				)}
				{post.type === CoursePostType.NOTICE && (
					<TableDataCol
						className="text-center"
						role="button"
						onClick={() => ctrl.navigateAdminPostEdit(history, course.id, post.id)}
					>
						수정
					</TableDataCol>
				)}
			</tr>
		);
	};

	/**
	 * Front에서 사용하기 위한 Table Column
	 * @param {int} postIdx
	 * @param {object} post
	 * @param {string} postType
	 * @param {string} postStatus
	 * @returns
	 */
	const renderTableColumnFront = (postIdx, post, postType, postStatus) => {
		let postCreatedAt = util.getFormatDate(post.created_at);
		return (
			<tr key={postIdx}>
				<TableDataCol className="text-center">{`${coursePosts.from + postIdx}`}</TableDataCol>
				<TableDataCol className="text-center">{postType}</TableDataCol>
				<TableDataCol role="button" onClick={() => gotoPost(post)}>
					{post.private && post.user_id !== userInfo.id && userInfo.is_admin === false && <StyledLockIcon />}
					{post.title}
				</TableDataCol>
				<TableDataCol className="text-center" confirm={postStatus.confirm}>
					{postStatus.status}
				</TableDataCol>
				{SizeDetector.isDesktop ? (
					<React.Fragment>
						<TableDataCol className="text-center">{post.user.name}</TableDataCol>
						<TableDataCol className="text-center">{postCreatedAt}</TableDataCol>
						<TableDataCol className="text-center">{post.view_count}</TableDataCol>
					</React.Fragment>
				) : null}
			</tr>
		);
	};

	/**
	 * 게시판에 글이 없는 경우 표시하는 UI
	 * @returns
	 */
	const renderNoData = () => {
		return (
			<Row>
				<Col>
					<TableNoData>강좌게시판 글이 없습니다.</TableNoData>
				</Col>
			</Row>
		);
	};

	/**
	 * 검색 버튼, 작성하기 버튼 UI
	 * @returns
	 */
	const renderButtons = () => {
		return (
			<React.Fragment>
				{SizeDetector.isDesktop ? (
					<Row className="mt-40">
						<Col>
							<SearchButtonContainer>
								<SearchKeywordFormControl
									type="text"
									value={keyword}
									placeholder="검색어를 입력하세요"
									onChange={event => {
										setKeyword(event.currentTarget.value);
									}}
									onKeyDown={event => {
										// 엔터키 입력시 검색
										if (event.keyCode === 13) search();
									}}
								/>
								<SearchButton secondary onClick={() => search()}>
									<StyledSearchIcon />
								</SearchButton>
							</SearchButtonContainer>
						</Col>
						{admin ? null : (
							<Col className="d-flex justify-content-end">
								<PostWriteButton primary onClick={() => ctrl.navigatePostCreate(history, course.id)}>
									작성하기
								</PostWriteButton>
							</Col>
						)}
					</Row>
				) : (
					<React.Fragment>
						<Row className="mt-30 mb-10">
							<Col>
								<SearchButtonContainer>
									<SearchKeywordFormControl
										type="text"
										value={keyword}
										placeholder="검색어를 입력하세요"
										onChange={event => {
											setKeyword(event.currentTarget.value);
										}}
									/>
									<SearchButton secondary>
										<StyledSearchIcon />
									</SearchButton>
								</SearchButtonContainer>
							</Col>
						</Row>
						{admin ? null : (
							<Row>
								<Col>
									<PostWriteButton
										primary
										onClick={() => ctrl.navigatePostCreate(history, course.id)}
									>
										작성하기
									</PostWriteButton>
								</Col>
							</Row>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			{admin ? renderPostList() : <ChapterContent title="강좌게시판" renderFunction={renderPostList} />}
		</React.Fragment>
	);
};

const PostListContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding: 1.875rem 1rem 2.5rem 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding: 2.5rem 1.5rem 3.75rem 1.5rem;
	}
`;

const PostListTable = styled(Table)``;

const StyledLockIcon = styled(LockIcon)`
	@media only screen and (max-width: 767.98px) {
		font-size: 1rem !important;
		margin-bottom: 3px;
		margin-right: 2px;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.25rem !important;
		margin-bottom: 4px;
		margin-right: 2px;
	}
`;

const TableHeader = styled.thead`
	background-color: #f0f0f0;
`;

const TableHeaderCol = styled.th`
	border: none !important;
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 0.875rem;
		line-height: 1.313rem;
	}
`;

const TableDataCol = styled.td`
	border-top: none;
	border-bottom: 0.063rem solid #dcdcdc;
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
	${props =>
		props.confirm &&
		css`
			color: ${({ theme }) => theme.colors.primary};
		`}
`;

const TableNoData = styled.div`
	border-bottom: 0.063rem solid #dcdcdc;
	font-family: "Noto Sans KR";
	font-weight: 400;
	text-align: center;
	margin-bottom: 1rem;
	padding-bottom: 1rem;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const SearchButtonContainer = styled.div``;

const SearchKeywordFormControl = styled(FormControl)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	float: left;
	margin-bottom: 0;
	border-radius: 0.25rem 0 0 0.25rem;
	@media only screen and (max-width: 767.98px) {
		width: calc(100% - 2.625rem);
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		width: 15.313rem;
		height: 3rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

const SearchButton = styled(Button)`
	border-radius: 0 0.25rem 0.25rem 0;
	@media only screen and (max-width: 767.98px) {
		width: 2.625rem;
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		width: 3.5rem;
		height: 3rem;
	}
`;

const StyledSearchIcon = styled(SearchIcon)`
	@media only screen and (max-width: 767.98px) {
		font-size: 1.125rem !important;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.5rem !important;
	}
`;

const PostWriteButton = styled(Button)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		width: 100%;
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		width: 9.375rem;
		height: 3rem;
		padding: 0.438rem 1.875rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

export default PostList;
