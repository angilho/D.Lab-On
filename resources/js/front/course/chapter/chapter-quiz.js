import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import styled, { css } from "styled-components";

import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import ChapterContent from "./components/ChapterContent";
import NotAllow from "./components/NotAllow";
import LearningStatus from "@constants/LearningStatus";
import QuizPassImage from "@images/chapter/quiz_pass.png";
import useSizeDetector from "@hooks/useSizeDetector";

import * as ctrl from "./chapter.ctrl";

const ChapterQuiz = ({ course, chapters, chapterId, courseLearnings }) => {
	const [currentChapter, setCurrentChapter] = useState({});
	const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
	const [currentQuestions, setCurrentQuestions] = useState([]);
	const [agreement, setAgreement] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [quizPassed, setQuizPassed] = useState(null);
	const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
	const [courseInitialized, setCourseInitialized] = useState(false);
	const [learningInitialized, setLearningInitialized] = useState(false);
	const SizeDetector = useSizeDetector();

	useEffect(() => {
		let targetChapter, targetChapterIdx;
		chapters.forEach((chapter, chapterIdx) => {
			if (chapter.id == chapterId) {
				targetChapter = chapter;
				targetChapterIdx = chapterIdx;
			}
		});
		resetAnswers(targetChapter);
		setSubmitted(false);
		setQuizPassed(null);
		setCurrentChapter(targetChapter);
		setCurrentChapterIdx(targetChapterIdx);
		setCurrentQuestions(targetChapter.quiz.questions);
		setCourseInitialized(true);
	}, [chapterId]);

	useEffect(() => {
		if (!courseInitialized) return;

		let quizCompleted = false;
		courseLearnings.forEach(courseLearning => {
			if (courseLearning.id == chapterId) {
				// 퀴즈를 완료한 경우에는 제출 결과를 얻어와서 표시한다.
				if (
					courseLearning.quiz_learnings.length !== 0 &&
					courseLearning.quiz_learnings[0].status === LearningStatus.COMPLETE &&
					courseLearning.quiz_learnings.legnth == currentQuestions.length
				) {
					quizCompleted = true;
					getQuizSubmissions(courseLearning.quiz_learnings[0].quiz_id);
					return;
				}
			}
		});
		if (!quizCompleted) {
			setLearningInitialized(true);
		}
	}, [courseInitialized, courseLearnings]);

	/**
	 * 퀴즈 제출 결과를 얻는다.
	 * @param {int} quizId
	 */
	const getQuizSubmissions = quizId => {
		ctrl.getQuizSubmissions(userInfo.id, course.id, chapterId, quizId, result => {
			let questions = result.map(submission => submission.question);
			currentQuestions.forEach(question => {
				let resultQuestion = result.filter(resultQuestion => resultQuestion.question_id === question.id)[0];
				let resultAnswer = question.answers.filter(
					resultAnswer => resultAnswer.id == resultQuestion.answer_id
				)[0];
				resultAnswer.selected = true;
			});
			callbackResult({ questions });
			setSubmitted(true);
			setLearningInitialized(true);
		});
	};

	/**
	 * 모든 퀴즈 답변 정보를 초기화 한다.
	 * @param {object} chapter
	 */
	const resetAnswers = chapter => {
		chapter.quiz.questions.forEach(question => {
			question.correctCommentary = null;
			question.correctAnswer = null;
			question.incorrectCommentary = null;
			question.incorrectAnswer = null;
			question.answers.forEach(answer => {
				answer.selected = false;
				answer.correct = null;
				answer.incorrect = null;
			});
		});
	};

	/**
	 * 선택한 답변을 모은다.
	 * @returns
	 */
	const getAnswers = () => {
		let answers = currentQuestions.map(question => {
			let answerId = question.answers.filter(answer => answer.selected)[0].id;
			return {
				question_id: question.id,
				answer_id: answerId
			};
		});
		return answers;
	};

	/**
	 * 퀴즈를 제출한다.
	 */
	const submitQuiz = () => {
		if (!agreement) {
			alert("서약에 동의해주세요");
			return;
		}
		setSubmitted(true);
		window.scrollTo(0, 0);
		ctrl.submitQuiz(userInfo.id, course.id, chapterId, currentChapter.quiz.id, getAnswers(), callbackResult);
	};

	/**
	 * 퀴즈를 다시 푼다.
	 */
	const resetQuiz = () => {
		resetAnswers(currentChapter);
		setSubmitted(false);
		setQuizPassed(null);
		window.scrollTo(0, 0);
	};

	/**
	 * 퀴즈 답안 정보를 받아서 얼마나 맞추었는지 확인한다.
	 * @param {object} result
	 */
	const callbackResult = result => {
		let resultQuestions = result.questions;
		let correctCount = 0;
		let questionsWithCommentary = currentQuestions.map(question => {
			let resultQuestion = resultQuestions.filter(resultQuestion => resultQuestion.id === question.id)[0];
			question.answers.forEach(answer => {
				let resultAnswer = resultQuestion.answers.filter(resultAnswer => resultAnswer.id == answer.id)[0];
				if (resultAnswer.correct) {
					question.correctCommentary = resultAnswer.commentary;
					question.correctAnswer = answer.answer;
					answer.correct = true;
				}

				if (answer.selected) {
					if (resultAnswer.correct) {
						correctCount++;
					} else {
						answer.incorrect = true;
						question.incorrectCommentary = resultAnswer.commentary;
						question.incorrectAnswer = answer.answer;
					}
				}
			});
			return question;
		});
		setCorrectAnswerCount(correctCount);
		setCurrentQuestions(questionsWithCommentary);

		let requiredCorrectCount = currentChapter.quiz.required_correct_count;
		let passed = correctCount >= requiredCorrectCount;
		setQuizPassed(passed);
	};

	/**
	 * 답변을 선택 한다.
	 * @param {int} questionIdx
	 * @param {int} answerIdx
	 */
	const selectAnswer = (questionIdx, answerIdx) => {
		// 제출한 이후에는 선택할 수 없다.
		if (submitted) return;

		let targetQuestion = currentQuestions[questionIdx];
		targetQuestion.answers.forEach((answer, idx) => (answer.selected = idx === answerIdx));
		setCurrentQuestions([
			...currentQuestions.slice(0, questionIdx),
			targetQuestion,
			...currentQuestions.slice(questionIdx + 1)
		]);
	};

	/**
	 * 모든 퀴즈의 답변이 선택되었는지 확인한다.
	 */
	const checkAllAnswered = () => {
		let allAnswered = true;
		currentQuestions.forEach(question => {
			let answered = question.answers.filter(answer => answer.selected === true);
			if (answered.length === 0) {
				allAnswered = false;
			}
		});
		return allAnswered;
	};

	/**
	 * 해당 챕터에 포함된 퀴즈를 표시하는 UI
	 * @returns
	 */
	const renderQuiz = () => {
		return (
			<React.Fragment>
				{submitted && quizPassed !== null && renderQuizSubmissionResult()}
				{!submitted && renderQuizDescription()}
				{renderQuestions(currentQuestions)}
				{renderButtons()}
			</React.Fragment>
		);
	};

	/**
	 * 퀴즈의 결과를 나타내는 화면
	 */
	const renderQuizSubmissionResult = () => {
		return (
			<QuizResultContainer>
				<Row noGutters className="align-items-center">
					{quizPassed && (
						<Col md="auto" xs="auto">
							<QuizPassIcon src={QuizPassImage}></QuizPassIcon>
						</Col>
					)}
					{quizPassed && (
						<Col className="ml-32">
							<QuizResultTitle>퀴즈 통과!</QuizResultTitle>
							<QuizResultText>{`축하합니다! 총 ${currentQuestions.length}문제 중 ${correctAnswerCount}문제를 맞추셨습니다.`}</QuizResultText>
						</Col>
					)}
					{!quizPassed && (
						<Col className={SizeDetector.isDesktop ? "ml-32 mt-16" : "ml-32"}>
							<QuizResultTitle>퀴즈 통과 실패</QuizResultTitle>
							<QuizResultText>{`총 ${currentQuestions.length}문제 중 ${correctAnswerCount}문제를 맞추셨습니다.`}</QuizResultText>
						</Col>
					)}
				</Row>
			</QuizResultContainer>
		);
	};

	/**
	 * 퀴즈의 안내문을 표시하는 UI
	 */
	const renderQuizDescription = () => {
		return (
			<QuizDescriptionContainer>
				<Row noGutters className="align-items-center">
					<Col>
						<QuizDescriptionText>
							본인은 이번 퀴즈에 응시하며 어떠한 부정행위도 하지 않을 것을 서약합니다.
						</QuizDescriptionText>
						<QuizDescriptionText>아래의 퀴즈를 풀며 자신의 실력을 확인해 봅시다!</QuizDescriptionText>
					</Col>
				</Row>
				<Row>
					<Col className="d-flex justify-content-end">
						<Checkbox
							checked={agreement}
							onChange={value => {
								setAgreement(value);
							}}
						>
							<QuizDescriptionText className={SizeDetector.isDesktop ? "ml-10" : "ml-4"}>
								서약에 동의하면 체크해주세요.
							</QuizDescriptionText>
						</Checkbox>
					</Col>
				</Row>
			</QuizDescriptionContainer>
		);
	};

	/**
	 * 퀴즈 UI
	 * @param {object} chapter
	 * @returns
	 */
	const renderQuestions = questions => {
		return (
			<React.Fragment>
				{questions.map((question, questionIdx) => {
					return (
						<QuestionContainer key={questionIdx}>
							<Row noGutters>
								<Col>
									<QuestionText>{`Q${questionIdx + 1}. ${question.question}`}</QuestionText>
								</Col>
							</Row>
							<Row>
								<Col className="d-flex justify-content-center">
									{renderQuestionImage(question.question_image)}
								</Col>
							</Row>
							{renderAnswers(question, questionIdx)}
							{renderCommentary(question)}
						</QuestionContainer>
					);
				})}
			</React.Fragment>
		);
	};

	/**
	 * 질문에 포함된 이미지를 표시한다.
	 * @param {object} questionImage
	 * @returns
	 */
	const renderQuestionImage = questionImage => {
		if (!questionImage) return null;

		return <QuestionImage src={`/storage/files/${questionImage.filename}`} />;
	};

	/**
	 * 답변을 표시한다.
	 * @param {object} question
	 * @param {int} questionIdx
	 * @returns
	 */
	const renderAnswers = (question, questionIdx) => {
		return (
			<div className="mt-20">
				{question.answers.map((answer, answerIdx) => {
					return (
						<React.Fragment key={answerIdx}>
							<AnswerRoundContainer
								key={answerIdx}
								noGutters
								className="align-items-center"
								onClick={() => selectAnswer(questionIdx, answerIdx)}
								selected={answer.selected}
								correct={answer.correct ? "true" : null}
								incorrect={answer.incorrect ? "true" : null}
							>
								<Col>
									<AnswerText>{`${String.fromCharCode(answerIdx + 65)}. ${
										answer.answer
									}`}</AnswerText>
								</Col>
							</AnswerRoundContainer>
							<Row>
								<Col className="d-flex justify-content-center">
									{renderQuestionImage(answer.answer_image)}
								</Col>
							</Row>
						</React.Fragment>
					);
				})}
			</div>
		);
	};

	/**
	 * 해설을 표시한다.
	 * @param {object} question
	 */
	const renderCommentary = question => {
		// 해설이 없는 경우 표시하지 않는다.
		if (!question.correctCommentary && !question.incorrectCommentary) return null;

		return (
			<div className={SizeDetector.isDesktop ? "pt-8" : "mt-10"}>
				{question.incorrectCommentary && (
					<CommentaryContainer background="rgba(244, 84, 48, 0.1)">
						<Row noGutters>
							<CommentaryKey>오답:</CommentaryKey>
							<CommentaryValue>{question.incorrectAnswer}</CommentaryValue>
						</Row>
						<Row noGutters className={SizeDetector.isDesktop ? "mt-10" : "mt-6"}>
							<CommentaryKey>해설:</CommentaryKey>
							<CommentaryValue>{question.incorrectCommentary}</CommentaryValue>
						</Row>
					</CommentaryContainer>
				)}
				{question.correctCommentary && (
					<CommentaryContainer background="rgba(40, 212, 110, 0.1)">
						<Row noGutters>
							<CommentaryKey>정답:</CommentaryKey>
							<CommentaryValue>{question.correctAnswer}</CommentaryValue>
						</Row>
						<Row noGutters className={SizeDetector.isDesktop ? "mt-10" : "mt-6"}>
							<CommentaryKey>해설:</CommentaryKey>
							<CommentaryValue>{question.correctCommentary}</CommentaryValue>
						</Row>
					</CommentaryContainer>
				)}
			</div>
		);
	};

	/**
	 * 퀴즈 제출 버튼을 표시한다.
	 * @returns
	 */
	const renderButtons = () => {
		// 제출하고 나면 버튼을 없앤다.
		if (submitted && quizPassed !== false) return null;

		return (
			<QuizSubmitButtonContainer>
				{!submitted && (
					<QuizSubmitButton disabled={!checkAllAnswered()} primary onClick={() => submitQuiz()}>
						제출
					</QuizSubmitButton>
				)}
				{submitted && quizPassed === false && (
					<QuizSubmitButton primary onClick={() => resetQuiz()}>
						재시도
					</QuizSubmitButton>
				)}
			</QuizSubmitButtonContainer>
		);
	};

	/**
	 * 이전 강의를 통과하지 못한 경우
	 * @returns
	 */
	const renderNotAllow = () => {
		return <NotAllow />;
	};

	if (!courseInitialized || !learningInitialized) return null;

	let beforeChapterQuizCompleted = ctrl.checkBeforeChapterQuizCompleted(courseLearnings, currentChapterIdx);
	let chapterTitle = submitted ? `${currentChapterIdx + 1}강퀴즈 - 정답 및 해설` : `${currentChapterIdx + 1}강퀴즈`;
	return (
		<ChapterContent
			title={chapterTitle}
			renderFunction={beforeChapterQuizCompleted ? renderQuiz : renderNotAllow}
		/>
	);
};

const QuizDescriptionContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.875rem;
		margin-left: 1rem;
		margin-right: 1rem;
		margin-bottom: 0.625rem;
		padding: 1rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 2.5rem;
		margin-left: 1.5rem;
		margin-right: 1.5rem;
		margin-bottom: 1.25rem;
		padding: 1.25rem;
	}
	border: 0.063rem solid ${({ theme }) => theme.colors.primary};
	border-radius: 0.25rem;
`;

const QuizDescriptionText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.75rem;
		line-height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
`;

const QuizResultContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		margin-top: 1.875rem;
		margin-left: 1rem;
		margin-right: 1rem;
		margin-bottom: 0.625rem;
		padding: 0.625rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 2.5rem;
		margin-left: 1.5rem;
		margin-right: 1.5rem;
		margin-bottom: 1.25rem;
		padding: 0.625rem;
	}
	border: 0.063rem solid ${({ theme }) => theme.colors.primary};
	border-radius: 0.25rem;
`;

const QuizPassIcon = styled.img`
	@media only screen and (max-width: 767.98px) {
		margin-left: 0.625rem;
		width: 3.75rem;
		height: 3.75rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 4.375rem;
		width: 10rem;
		height: 10rem;
	}
`;

const QuizResultTitle = styled(Text)`
	font-family: BMDOHYEON;
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		font-size: 0.875rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.25rem;
		line-height: 1.375rem;
	}
`;

const QuizResultText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		margin-top: 0.125rem;
		font-size: 0.75rem;
		line-height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

const QuestionContainer = styled.div`
	@media only screen and (max-width: 767.98px) {
		padding-top: 1.875rem;
		padding-bottom: 0.625rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	@media only screen and (min-width: 768px) {
		padding-top: 2.5rem;
		padding-bottom: 1.25rem;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}
`;

const QuestionText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 700;
	@media only screen and (max-width: 767.98px) {
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		font-size: 1.313rem;
		line-height: 2.125rem;
	}
`;

const QuestionImage = styled.img`
	margin: 1.25rem 0;
	height: auto;
	@media only screen and (max-width: 767.98px) {
		min-width: 16rem;
		max-width: 50%;
	}
	@media only screen and (min-width: 768px) {
		min-width: 25.625rem;
		max-width: 50%;
	}
`;

const AnswerRoundContainer = styled(Row)`
	cursor: pointer;
	background: #ffffff;
	border: 0.063rem solid ${({ theme }) => theme.colors.gray};
	border-radius: 1.969rem;
	@media only screen and (max-width: 767.98px) {
		height: 2.625rem;
		&:not(:last-child) {
			margin-bottom: 0.625rem;
		}
	}
	@media only screen and (min-width: 768px) {
		height: 3.5rem;
		&:not(:last-child) {
			margin-bottom: 0.75rem;
		}
	}
	${props =>
		props.selected &&
		css`
			color: ${({ theme }) => theme.colors.primary};
			border: 0.063rem solid ${({ theme }) => theme.colors.primary};
		`}
	${props =>
		props.correct &&
		css`
			color: #ffffff;
			background-color: #28d46e;
			border: 0.063rem solid #28d46e;
		`}
		${props =>
			props.incorrect &&
			css`
				color: #ffffff;
				background-color: #f45430;
				border: 0.063rem solid #f45430;
			`}
`;

const AnswerText = styled(Text)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		margin-left: 1.25rem;
		font-size: 0.875rem;
		line-height: 1.375rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 2rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

const CommentaryContainer = styled.div`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		margin-top: 0.625rem;
		padding: 1rem;
		font-size: 0.75rem;
		line-height: 1.25rem;
	}
	@media only screen and (min-width: 768px) {
		margin-top: 1.25rem;
		padding-top: 1.5rem;
		padding-left: 2rem;
		padding-right: 2rem;
		padding-bottom: 1.875rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	border-radius: 0.25rem;
	${props =>
		props.background &&
		css`
			background-color: ${props.background};
		`}
`;

const CommentaryKey = styled(Col)`
	@media only screen and (max-width: 767.98px) {
		min-width: 1.625rem;
		max-width: 1.625rem;
	}
	@media only screen and (min-width: 768px) {
		min-width: 2.5rem;
		max-width: 2.5rem;
	}
`;

const CommentaryValue = styled(Col)`
	@media only screen and (max-width: 767.98px) {
		margin-left: 0.375rem;
	}
	@media only screen and (min-width: 768px) {
		margin-left: 1rem;
	}
`;

const QuizSubmitButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
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

const QuizSubmitButton = styled(Button)`
	font-family: "Noto Sans KR";
	font-weight: 400;
	@media only screen and (max-width: 767.98px) {
		width: 6.313rem;
		height: 2.25rem;
		font-size: 1rem;
		line-height: 1.75rem;
	}
	@media only screen and (min-width: 768px) {
		width: 7.5rem;
		height: 3rem;
		padding: 0.438rem 1.875rem;
		font-size: 1.125rem;
		line-height: 2rem;
	}
`;

export default ChapterQuiz;
