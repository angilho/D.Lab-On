import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import styled from "styled-components";

import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";

import * as ctrl from "../index.ctrl";

const ChapterQuiz = ({ chapterQuiz, onConfirm, onCancel }) => {
	const [quiz, setQuiz] = useState(chapterQuiz.quiz);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	/**
	 * 총 질문 개수를 업데이트 한다.
	 * @param {int} nextTotalQuestion
	 */
	const changeTotalQuestion = nextTotalQuestion => {
		if (quiz.questions.length < nextTotalQuestion) {
			// 총 질문 개수가 늘어나면 늘어난 갯수만큼 질문을 생성한다.
			let newQuestions = [];
			for (let i = 0; i < nextTotalQuestion - quiz.questions.length; i++) {
				newQuestions.push(ctrl.getDefaultQuizQuestion());
			}
			setQuiz({
				...quiz,
				questions: quiz.questions.concat(newQuestions)
			});
		} else if (quiz.questions.length > nextTotalQuestion) {
			// 총 퀴즈 개수가 줄어들면 사용자에게 경고를 표시하고 마지막 퀴즈부터 줄인다.
			if (confirm("총 문항수가 줄어들면 이전 데이터가 삭제됩니다. 계속하시겠습니까?")) {
				quiz.questions.splice(nextTotalQuestion);
				setQuiz({
					...quiz,
					questions: quiz.questions
				});
			}
		}
	};

	/**
	 * 대상 index의 질문 state를 변경한다.
	 * @param {int} questionIdx
	 * @param {object} changedQuestion
	 */
	const updateQuestion = (questionIdx, changedQuestion) => {
		setQuiz({
			...quiz,
			questions: [
				...quiz.questions.slice(0, questionIdx),
				changedQuestion,
				...quiz.questions.slice(questionIdx + 1)
			]
		});
	};

	/**
	 * 대상 index의 답변 state를 변경한다.
	 * @param {int} questionIdx
	 * @param {int} answerIdx
	 * @param {object} answer
	 */
	const updateAnswer = (questionIdx, answerIdx, answer) => {
		let targetQuestion = quiz.questions[questionIdx];
		targetQuestion.answers = [
			...targetQuestion.answers.slice(0, answerIdx),
			answer,
			...targetQuestion.answers.slice(answerIdx + 1)
		];
		updateQuestion(questionIdx, targetQuestion);
	};

	/**
	 * 질문에 포함된 답변을 추가한다.
	 * @param {int} questionIdx
	 */
	const addAnswer = questionIdx => {
		let targetQuestion = quiz.questions[questionIdx];
		targetQuestion.answers.push(ctrl.getDefaultQuestionAnswer());
		updateQuestion(questionIdx, targetQuestion);
	};

	/**
	 * 챕터에 포함된 동영상을 제거한다.
	 * @param {int} questionIdx
	 * @param {int} answerIdx
	 */
	const removeAnswer = (questionIdx, answerIdx) => {
		let targetQuestion = quiz.questions[questionIdx];
		targetQuestion.answers = targetQuestion.answers.filter((_, idx) => {
			return idx !== answerIdx;
		});
		updateQuestion(questionIdx, targetQuestion);
	};

	/**
	 * 퀴즈 업데이트 확인
	 */
	const onQuizUpdateConfirm = () => {
		onConfirm(chapterQuiz.chapterIdx, quiz);
	};

	/**
	 * 퀴즈 업데이트 취소
	 */
	const onQuizUpdateCancel = () => {
		onCancel();
	};

	/**
	 * 퀴즈 기본 정보 UI
	 * @returns React.Fragment
	 */
	const renderQuizInfo = () => {
		return (
			<Row>
				<Col md={6}>
					<Row className="align-items-center">
						<Col xs="auto" md="auto">
							<Text p2>문항 수 선택</Text>
						</Col>
						<Col xs={4} md={4}>
							<FormControl
								className="w-100 m-0"
								as="select"
								value={quiz.questions.length}
								onChange={event => changeTotalQuestion(parseInt(event.currentTarget.value))}
							>
								{[...Array(10).keys()].map(idx => {
									return (
										<option key={idx} value={idx + 1}>
											{idx + 1}개
										</option>
									);
								})}
							</FormControl>
						</Col>
					</Row>
				</Col>
				<Col md={6}>
					<Row className="align-items-center">
						<Col xs="auto" md="auto">
							<Text p2>최소 정답 수 선택</Text>
						</Col>
						<Col xs={4} md={4}>
							<FormControl
								className="w-100 m-0"
								as="select"
								value={quiz.required_correct_count}
								onChange={event =>
									setQuiz({ ...quiz, required_correct_count: parseInt(event.currentTarget.value) })
								}
							>
								{[...Array(10).keys()].map(idx => {
									return (
										<option key={idx} value={idx + 1}>
											{idx + 1}개
										</option>
									);
								})}
							</FormControl>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	};

	/**
	 * 퀴즈 질문 UI
	 * @returns React.Fragment
	 */
	const renderQuestions = () => {
		return (
			<React.Fragment>
				{quiz.questions.map((question, questionIdx) => {
					return (
						<React.Fragment key={questionIdx}>
							<Text h6>{`${questionIdx + 1}번`}</Text>
							<FormLabel>질문</FormLabel>
							<FormControl
								className="w-100"
								as="textarea"
								value={question.question}
								placeholder="질문의 내용을 입력해 주세요"
								onChange={event => {
									question.question = event.currentTarget.value;
									updateQuestion(questionIdx, question);
								}}
							/>
							<FormLabel>질문 이미지</FormLabel>
							<FormControl
								type="file"
								label={question.question_image_filename ? question.question_image_filename : ""}
								data-browse="찾기"
								custom
								onChange={event => {
									question.question_image_file = event.currentTarget.files[0];
									question.question_image_filename = event.currentTarget.files[0].name;
									updateQuestion(questionIdx, question);
								}}
							/>
							{renderQuestionAnswers(question, questionIdx)}
							<StyledSeparator />
						</React.Fragment>
					);
				})}
			</React.Fragment>
		);
	};

	/**
	 * 퀴즈 답변 UI
	 * @param {object} question
	 * @param {int} questionIdx
	 * @returns React.Fragment
	 */
	const renderQuestionAnswers = (question, questionIdx) => {
		return (
			<React.Fragment>
				{question.answers.map((answer, answerIdx) => {
					return (
						<Card className="p-2 mt-2" key={answerIdx}>
							<Row className="align-items-center">
								<Col md="auto">
									<Text h6>{`Answer ${answerIdx + 1}`}</Text>
								</Col>
								{answerIdx !== 0 && (
									<Col className="pl-0">
										<Button
											secondary
											onClick={() => {
												removeAnswer(questionIdx, answerIdx);
											}}
										>
											-
										</Button>
									</Col>
								)}
							</Row>
							<Row className="align-items-center mt-1">
								<Col>
									<Checkbox
										checked={answer.correct}
										onChange={value => {
											answer.correct = value;
											updateAnswer(questionIdx, answerIdx, answer);
										}}
									>
										<Text p2 className="ml-1">
											정답여부
										</Text>
									</Checkbox>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormLabel>답변</FormLabel>
									<FormControl
										className="w-100"
										type="text"
										value={answer.answer}
										placeholder="답변을 입력해 주세요"
										onChange={event => {
											answer.answer = event.currentTarget.value;
											updateAnswer(questionIdx, answerIdx, answer);
										}}
									/>
									<FormLabel>답변 이미지</FormLabel>
									<FormControl
										type="file"
										label={answer.answer_image_filename ? answer.answer_image_filename : ""}
										data-browse="찾기"
										custom
										onChange={event => {
											answer.answer_image_file = event.currentTarget.files[0];
											answer.answer_image_filename = event.currentTarget.files[0].name;
											updateAnswer(questionIdx, answerIdx, answer);
										}}
									/>
									<FormLabel>해설</FormLabel>
									<FormControl
										className="w-100"
										as="textarea"
										value={answer.commentary ? answer.commentary : ""}
										placeholder="해설을 입력해 주세요"
										onChange={event => {
											answer.commentary = event.currentTarget.value;
											updateAnswer(questionIdx, answerIdx, answer);
										}}
									/>
								</Col>
							</Row>
						</Card>
					);
				})}
				<Row>
					<Col>
						<Button
							className="mt-3"
							secondary
							onClick={() => {
								addAnswer(questionIdx);
							}}
						>
							+ 답변 추가
						</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<Row className="mt-2">
				<Col>
					<Text h6>퀴즈 정보</Text>
				</Col>
			</Row>
			<StyledSeparator />
			{renderQuizInfo()}
			{renderQuestions()}
			<Row className="justify-content-end">
				<Col md={3}>
					<Button primary size="large" className="w-100" onClick={onQuizUpdateConfirm}>
						확인
					</Button>
				</Col>
				<Col md={3}>
					<Button secondary size="large" className="w-100" onClick={onQuizUpdateCancel}>
						취소
					</Button>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const StyledSeparator = styled.hr`
	margin-top: 1rem;
	margin-bottom: 1rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

export default ChapterQuiz;
