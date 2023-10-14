import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Tabs, Tab, Row, Col, Table } from "react-bootstrap";
import styled from "styled-components";
import AdminSearch from "@components/adminSearch";
import AdminTablePagination from "@components/adminTablePagination";
import Button from "@components/elements/Button";
import * as util from "@common/util";
import * as ctrl from "./index.ctrl";

const AdminSupportList = () => {
	const [tabKey, setTabKey] = useState("notice");
	const [notices, setNotices] = useState([]);
	const [faqs, setFaqs] = useState([]);
	const [faqCategories, setFaqCategories] = useState([]);
	const [noticeFilterKeyword, setNoticeFilterKeyword] = useState("");
	const [faqFilterKeyword, setFaqFilterKeyword] = useState("");

	useEffect(() => {
		ctrl.getFaqCategories(faqCategories => {
			let faqCategoriesForId = [];
			faqCategories.map(faqCategory => (faqCategoriesForId[faqCategory.id] = faqCategory.name));
			setFaqCategories(faqCategoriesForId);
		});
	}, []);

	useEffect(() => {
		switch (tabKey) {
			case "notice":
				ctrl.getNotices("", setNotices);
				break;
			case "faq":
				ctrl.getFaqs("", setFaqs);
				break;
		}
	}, [tabKey]);

	const onClickNoticeSearch = keyword => {
		setNoticeFilterKeyword(keyword);
		ctrl.getNotices(keyword, setNotices);
	};

	const onClickNoticePageItem = url => {
		if (url) {
			if (noticeFilterKeyword) {
				url += `&keyword=${noticeFilterKeyword}`;
			}
			ctrl.getPaginationLink(url, setNotices);
		}
	};

	const onClickFaqSearch = keyword => {
		setFaqFilterKeyword(keyword);
		ctrl.getFaqs(keyword, setFaqs);
	};

	const onClickFaqPageItem = url => {
		if (url) {
			if (faqFilterKeyword) {
				url += `&keyword=${faqFilterKeyword}`;
			}
			ctrl.getPaginationLink(url, setFaqs);
		}
	};

	const renderNoticeList = () => {
		return (
			<React.Fragment>
				<Row className="mt-40">
					<Col md={8}>
						<AdminSearch placeholder="제목" onClick={onClickNoticeSearch} />
					</Col>
					<Col align="right">
						<Link to="/admin/notices/create">
							<Button primary size="large" className="w-100">
								공지 작성하기
							</Button>
						</Link>
					</Col>
				</Row>
				<Row className="mt-20">
					<Col>
						<NoticeTable striped bordered hover>
							<thead>
								<tr>
									<th>번호</th>
									<th>제목</th>
									<th>작성자</th>
									<th>작성일</th>
									<th>조회수</th>
								</tr>
							</thead>
							<tbody>
								{notices.data &&
									notices.data.map((notice, idx) => {
										return (
											<tr key={idx}>
												<td>{notices.from + idx}</td>
												<td>
													<Link to={`/admin/notices/${notice.id}`}>{notice.title}</Link>
												</td>
												<td>{notice.user.name}</td>
												<td>{util.getFormatDate(notice.created_at)}</td>
												<td>{notice.view_count}</td>
											</tr>
										);
									})}
							</tbody>
						</NoticeTable>
						<div className="mt-20">
							<AdminTablePagination
								links={notices.links}
								firstPageUrl={notices.first_page_url}
								lastPageUrl={notices.last_page_url}
								onChange={onClickNoticePageItem}
							/>
						</div>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	const renderFaqList = () => {
		return (
			<React.Fragment>
				<Row className="mt-40">
					<Col md={8}>
						<AdminSearch placeholder="제목" onClick={onClickFaqSearch} />
					</Col>
					<Col align="right">
						<Link to="/admin/faqs/create">
							<Button primary size="large" className="w-100">
								FAQ 작성하기
							</Button>
						</Link>
					</Col>
				</Row>
				<Row className="mt-20">
					<Col>
						<NoticeTable striped bordered hover>
							<thead>
								<tr>
									<th>번호</th>
									<th>카테고리</th>
									<th>제목</th>
									<th>작성일</th>
								</tr>
							</thead>
							<tbody>
								{faqs.data &&
									faqs.data.map((faq, idx) => {
										return (
											<tr key={idx}>
												<td>{faqs.from + idx}</td>
												<td>{faqCategories[faq.faq_category_id]}</td>
												<td>
													<Link to={`/admin/faqs/${faq.id}`}>{faq.name}</Link>
												</td>
												<td>{util.getFormatDate(faq.created_at)}</td>
											</tr>
										);
									})}
							</tbody>
						</NoticeTable>
						<div className="mt-20">
							<AdminTablePagination
								links={faqs.links}
								firstPageUrl={faqs.first_page_url}
								lastPageUrl={faqs.last_page_url}
								onChange={onClickFaqPageItem}
							/>
						</div>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<Tabs activeKey={tabKey} className="mt-3 mb-3" onSelect={k => setTabKey(k)}>
			<Tab eventKey={"notice"} title="공지사항">
				{renderNoticeList()}
			</Tab>
			<Tab eventKey={"faq"} title="FAQ">
				{renderFaqList()}
			</Tab>
		</Tabs>
	);
};

const NoticeTable = styled(Table)`
	font-size: ${({ theme }) => theme.fontSizes.p3};
`;

export default AdminSupportList;
