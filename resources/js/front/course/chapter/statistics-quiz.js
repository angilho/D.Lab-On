import React from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap";
import ChapterContent from "./components/ChapterContent";
import LearningStatus from "@constants/LearningStatus";

import * as util from "@common/util";

const StatisticsQuiz = ({ course, courseLearnings }) => {
	/**
	 * 퀴즈 통계를 표시하는 UI
	 * @returns
	 */
	const renderStatisticsQuiz = () => {
		return (
			<StatisticsContainer>
				<StatisticsTable>
					<TableHeader>
						<tr>
							<TableHeaderCol>항목</TableHeaderCol>
							<TableHeaderCol width="30%" className="text-center">
								상태
							</TableHeaderCol>
							<TableHeaderCol width="20%" className="text-center">
								통과일
							</TableHeaderCol>
						</tr>
					</TableHeader>
					<tbody>
						{courseLearnings.map((courseLearning, _) => {
							let status, passedAt;
							if (courseLearning.quiz_learnings.length === 0) {
								status = "-";
								passedAt = "-";
							} else {
								let quizLearning = courseLearning.quiz_learnings[0];
								status = quizLearning.status === LearningStatus.COMPLETE ? "통과" : "실패";
								status += ` (${Math.floor(
									(quizLearning.correct_answer / quizLearning.total_question) * 100
								)}%)`;

								passedAt =
									quizLearning.status === LearningStatus.COMPLETE
										? util.getFormatDate(quizLearning.passed_at)
										: "-";
							}

							return (
								<tr key={_}>
									<TableDataCol>{`${_ + 1}강 퀴즈`}</TableDataCol>
									<TableDataCol className="text-center">{status}</TableDataCol>
									<TableDataCol className="text-center">{passedAt}</TableDataCol>
								</tr>
							);
						})}
					</tbody>
				</StatisticsTable>
			</StatisticsContainer>
		);
	};

	return <ChapterContent title={`${course.name} 퀴즈`} renderFunction={renderStatisticsQuiz} />;
};

const StatisticsContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 1.875rem;
		padding-bottom: 2.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 2.5rem;
		padding-bottom: 3.75rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`;

const StatisticsTable = styled(Table)``;

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
`;

export default StatisticsQuiz;
