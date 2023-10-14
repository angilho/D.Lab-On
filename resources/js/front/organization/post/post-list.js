import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col, Table } from "react-bootstrap";
import styled, { css } from "styled-components";

import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import AdminTablePagination from "@components/adminTablePagination";
import useSizeDetector from "@hooks/useSizeDetector";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";

import * as util from "@common/util";
import * as ctrl from "./post.ctrl";

const OrganizationPostList = ({ organization_id, admin }) => {
	const history = useHistory();
	const [posts, setPosts] = useState({ data: [] });
	const [keyword, setKeyword] = useState("");
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		if (!userInfo.id) history.push({ pathname: "/login" });

		ctrl.getOrganizationPosts(organization_id, null, result => {
			setPosts(result);
		});
	}, []);

	const search = () => {
		ctrl.getOrganizationPosts(organization_id, keyword, result => {
			setPosts(result);
		});
	};

	const onClickPageItem = url => {
		if (url) ctrl.getPaginationLink(url, setPosts);
	};

	/**
	 * 게시글 확인 페이지로 이동한다.
	 * @param {object} post
	 */
	const gotoPost = post => {
		// 비공개 글은 작성자 혹은 운영자만 확인 가능
		if (post.private && post.user_id !== userInfo.id && userInfo.is_admin === false) {
			alert("비밀글은 작성자와 관리자만 확인 가능합니다.");
			return;
		}
		if (admin) {
			ctrl.navigateAdminPost(history, organization_id, post.id);
		} else {
			ctrl.navigatePost(history, organization_id, post.id);
		}
	};

	/**
	 * 게시판 공지사항 작성 버튼
	 */
	const renderCreateNoticeButton = () => {
		return (
			<PostWriteButton
				primary
				className="float-right mb-3"
				onClick={() => ctrl.navigateAdminPostCreate(history, organization_id)}
			>
				공지 등록
			</PostWriteButton>
		);
	};

	/**
	 * Table Header
	 * @returns
	 */
	const renderTableHeader = () => {
		return (
			<TableHeader>
				<tr>
					<TableHeaderCol width="60px" className="text-center">
						번호
					</TableHeaderCol>
					<TableHeaderCol>제목</TableHeaderCol>
					<TableHeaderCol width="100px" className="text-center">
						작성자
					</TableHeaderCol>
					<TableHeaderCol width="100px" className="text-center">
						등록일
					</TableHeaderCol>
				</tr>
			</TableHeader>
		);
	};

	/**
	 * Table Column
	 * @param {int} postIdx
	 * @param {object} post
	 * @returns
	 */
	const renderTableColumn = (postIdx, post) => {
		let postCreatedAt = util.getFormatDate(post.created_at);
		return (
			<tr key={postIdx}>
				<TableDataCol className="text-center">{`${posts.from + postIdx}`}</TableDataCol>
				<TableDataCol
					role="button"
					className={SizeDetector.isDesktop ? "" : "d-flex align-items-center"}
					onClick={() => gotoPost(post)}
					confirm={post.order !== 0}
				>
					{post.private && <StyledLockIcon />}
					{post.order !== 0 && "[공지] "}
					{post.title}
					{`[${post.comments.length}]`}
				</TableDataCol>
				<TableDataCol className="text-center">{post.user.name}</TableDataCol>
				<TableDataCol className="text-center">{postCreatedAt}</TableDataCol>
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
					<TableNoData>게시판 글이 없습니다.</TableNoData>
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
								<PostWriteButton
									primary
									onClick={() => ctrl.navigatePostCreate(history, organization_id)}
								>
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
										onClick={() => ctrl.navigatePostCreate(history, organization_id)}
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
		<PostListContainer className="container">
			{admin && renderCreateNoticeButton()}
			<PostListTable>
				{renderTableHeader()}
				<tbody>
					{posts.data.map((post, postIdx) => {
						return renderTableColumn(postIdx, post);
					})}
				</tbody>
			</PostListTable>
			{posts.data.length === 0 ? renderNoData() : null}
			{posts.data.length !== 0 && (
				<div className="d-flex justify-content-center mt-30">
					<div className="mt-30 d-flex justify-content-center">
						<AdminTablePagination
							links={posts.links}
							firstPageUrl={posts.first_page_url}
							lastPageUrl={posts.last_page_url}
							onChange={onClickPageItem}
						/>
					</div>
				</div>
			)}
			{renderButtons()}
		</PostListContainer>
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

export default OrganizationPostList;
