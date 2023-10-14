import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled, { css } from "styled-components";
import { Row, Col, Table } from "react-bootstrap";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import CoursePostType from "@constants/CoursePostType";
import CoursePostStatus from "@constants/CoursePostStatus";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminVodCoursePostList = () => {
	const history = useHistory();
	const [initialized, setInitialized] = useState(false);
	const [vodCoursePosts, setVodCoursePosts] = useState({});
	const [filterKeyword, setFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getVodCoursePosts(null, result => {
			setVodCoursePosts(result);
			setInitialized(true);
		});
	}, []);

	const onClickSearch = keyword => {
		setFilterKeyword(keyword);
		ctrl.getVodCoursePosts(keyword, result => {
			setVodCoursePosts(result);
		});
	};

	const onClickPageItem = url => {
		if (url) {
			if (filterKeyword) {
				url += `&keyword=${filterKeyword}`;
			}
			ctrl.getPaginationLink(url, setVodCoursePosts);
		}
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
	};

	if (!initialized) return null;

	return (
		<React.Fragment>
			<Row className="mt-40">
				<Col md={8}>
					<AdminSearch placeholder="검색어를 입력하세요" onClick={onClickSearch} />
				</Col>
			</Row>
			<PostListContainer className="mt-40">
				<PostListTable striped bordered hover>
					<thead>
						<tr>
							<th width="60px" className="text-center">
								번호
							</th>
							<th width="100px" className="text-center">
								과목명
							</th>
							<th width="70px" className="text-center">
								유형
							</th>
							<th className="text-center">제목</th>
							<th width="100px" className="text-center">
								상태
							</th>
							<th width="100px" className="text-center">
								작성자
							</th>
							<th width="100px" className="text-center">
								등록일
							</th>
							<th width="70px" className="text-center">
								조회수
							</th>
							<th width="70px" className="text-center">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{vodCoursePosts.data &&
							vodCoursePosts.data.map((post, postIdx) => {
								let postType = getPostType(post.type);
								let postStatus = getPostStatus(post.type, post.status);
								let postCreatedAt = util.getFormatDate(post.created_at);
								return (
									<tr key={postIdx}>
										<td className="text-center">{`${vodCoursePosts.from + postIdx}`}</td>
										<td>{post.course.name}</td>
										<td className="text-center">{postType}</td>
										<td>{post.title}</td>
										<TableDataCol className="text-center" confirm={postStatus.confirm}>
											{postStatus.status}
										</TableDataCol>
										<td className="text-center">{post.user.name}</td>
										<td className="text-center">{postCreatedAt}</td>
										<td className="text-center">{post.view_count}</td>
										<td
											className="text-center"
											role="button"
											onClick={() => ctrl.navigateAdminVodCoursePost(history, post.id)}
										>
											답변
										</td>
									</tr>
								);
							})}
					</tbody>
				</PostListTable>
				<div className="mt-20">
					<AdminTablePagination
						links={vodCoursePosts.links}
						firstPageUrl={vodCoursePosts.first_page_url}
						lastPageUrl={vodCoursePosts.last_page_url}
						onChange={onClickPageItem}
					/>
				</div>
			</PostListContainer>
		</React.Fragment>
	);
};

const PostListContainer = styled.div``;

const PostListTable = styled(Table)`
	font-size: 13px;
`;

const TableDataCol = styled.td`
	${props =>
		props.confirm &&
		css`
			color: ${({ theme }) => theme.colors.primary};
		`}
`;

export default AdminVodCoursePostList;
