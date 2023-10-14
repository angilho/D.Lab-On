import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";

import FormLabel from "@components/elements/FormLabel";
import FormControl from "@components/elements/FormControl";
import Text from "@components/elements/Text";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import ChapterQuiz from "./components/ChapterQuiz";

import * as ctrl from "./index.ctrl";

const AdminCourseDesignChapter = ({ course_id }) => {
	const history = useHistory();

	const [totalChapter, setTotalChapter] = useState(1);
	const [chapters, setChapters] = useState([]);
	const [isEdit, setIsEdit] = useState(false);
	const [quizEdit, setQuizEdit] = useState(null);

	useEffect(() => {
		// 해당 코스에 있는 챕터를 불러온다.
		ctrl.getCourseChapters(course_id, callbackGetChapter, callbackChapterNotExist);
		window.scrollTo(0, 0);
	}, []);

	/**
	 * 챕터 목록을 얻어와 state에 설정한다.
	 * @param {array} chapters
	 */
	const callbackGetChapter = chapters => {
		chapters.forEach(chapter => {
			chapter.resources.forEach(resource => {
				resource.filename = resource.file.org_filename;
			});
			chapter.quiz.questions.forEach(question => {
				if (question.question_image) question.question_image_filename = question.question_image.org_filename;
				question.answers.forEach(answer => {
					if (answer.answer_image) answer.answer_image_filename = answer.answer_image.org_filename;
				});
			});
		});

		setIsEdit(true);
		setTotalChapter(chapters.length);
		setChapters(chapters);
	};

	/**
	 * 챕터 목록이 없는 경우 총 강의 개수 만큼 chapter를 생성해서 초기화 한다.
	 */
	const callbackChapterNotExist = () => {
		let initChapters = [];
		for (let i = 0; i < totalChapter; i++) {
			initChapters.push(ctrl.getDefaultChapter());
		}
		setChapters(initChapters);
	};

	/**
	 * 총 강의 개수를 업데이트 한다.
	 * @param {int} nextTotalChapter
	 */
	const changeTotalChapter = nextTotalChapter => {
		if (totalChapter < nextTotalChapter) {
			// 총 강의 개수가 늘어나면 늘어난 갯수만큼 챕터를 생성한다.
			let newChapters = [];
			for (let i = 0; i < nextTotalChapter - totalChapter; i++) {
				newChapters.push(ctrl.getDefaultChapter());
			}
			setTotalChapter(nextTotalChapter);
			setChapters(chapters.concat(newChapters));
		} else if (totalChapter > nextTotalChapter) {
			// 총 강의 개수가 줄어들면 사용자에게 경고를 표시하고 마지막 챕터부터 줄인다.
			if (confirm("총 강의가 줄어들면 이전 데이터가 삭제됩니다. 계속하시겠습니까?")) {
				chapters.splice(nextTotalChapter);
				setTotalChapter(nextTotalChapter);
				setChapters(chapters);
			}
		}
	};

	/**
	 * 저장 버튼 클릭 이벤트 핸들러
	 */
	const onCreateOrUpdate = () => {
		if (isEdit) {
			ctrl.handleUpdate(course_id, chapters, () => history.push({ pathname: "/admin/courses" }));
		} else {
			ctrl.handleCreate(course_id, chapters, () => history.push({ pathname: "/admin/courses" }));
		}
	};

	/**
	 * 퀴즈 편집 UI로 변경한다.
	 * @param {int} chapterIdx
	 */
	const designQuiz = chapterIdx => {
		setQuizEdit({ chapterIdx, quiz: chapters[chapterIdx].quiz });
	};

	/**
	 * 퀴즈 편집 완료
	 * @param {object} quiz
	 */
	const onQuizUpdateConfirm = (chapterIdx, quiz) => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.quiz = quiz;
		updateChapter(chapterIdx, targetChapter);
		setQuizEdit(null);
		window.scrollTo(0, 0);
	};

	/**
	 * 퀴즈 편집 취소
	 */
	const onQuizUpdateCancel = () => {
		setQuizEdit(null);
		window.scrollTo(0, 0);
	};

	/**
	 * 대상 index의 챕터 state를 변경한다.
	 * @param {int} chapterIdx
	 * @param {object} changedChapter
	 */
	const updateChapter = (chapterIdx, changedChapter) => {
		setChapters([...chapters.slice(0, chapterIdx), changedChapter, ...chapters.slice(chapterIdx + 1)]);
	};

	/**
	 * 챕터에 포함된 교안 개수를 추가한다.
	 * @param {int} chapterIdx
	 */
	const addResource = chapterIdx => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.resources.push(ctrl.getDefaultResource());
		updateChapter(chapterIdx, targetChapter);
	};

	/**
	 * 교안 비밀번호를 업데이트 한다.
	 * @param {int} chapterIdx
	 * @param {int} resourceIdx
	 * @param {string} password
	 */
	const updateResourcePassword = (chapterIdx, resourceIdx, password) => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.resources.forEach((resource, idx) => {
			if (idx === resourceIdx) {
				resource.resource_password = password;
			}
		});
		updateChapter(chapterIdx, targetChapter);
	};

	/**
	 * 챕터에 포함된 교안을 제거한다.
	 * @param {int} chapterIdx
	 * @param {int} resourceIdx
	 */
	const removeResource = (chapterIdx, resourceIdx) => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.resources = targetChapter.resources.filter((_, idx) => {
			return idx !== resourceIdx;
		});
		updateChapter(chapterIdx, targetChapter);
	};

	/**
	 * 챕터에 포함된 교안 파일을 선택했을 때 해당 파일을 state에 저장한다.
	 * @param {int} chapterIdx
	 * @param {int} resourceIdx
	 * @param {file} resourceFile
	 */
	const selectResourceFile = (chapterIdx, resourceIdx, resourceFile) => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.resources.forEach((resource, idx) => {
			if (idx === resourceIdx) {
				resource.file = resourceFile;
				resource.filename = resourceFile.name;
			}
		});
		updateChapter(chapterIdx, targetChapter);
	};

	/**
	 * 챕터에 포함된 동영상을 추가한다.
	 * @param {int} chapterIdx
	 */
	const addVod = chapterIdx => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.vods.push(ctrl.getDefaultVod());
		updateChapter(chapterIdx, targetChapter);
	};

	/**
	 * 챕터에 포함된 동영상을 제거한다.
	 * @param {int} chapterIdx
	 * @param {int} vodIdx
	 */
	const removeVod = (chapterIdx, vodIdx) => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.vods = targetChapter.vods.filter((_, idx) => {
			return idx !== vodIdx;
		});
		updateChapter(chapterIdx, targetChapter);
	};

	const updateChapterVod = (chapterIdx, vodIdx, vod) => {
		let targetChapter = chapters[chapterIdx];
		targetChapter.vods = [...targetChapter.vods.slice(0, vodIdx), vod, ...targetChapter.vods.slice(vodIdx + 1)];
		updateChapter(chapterIdx, targetChapter);
	};

	/**
	 * 전체 챕터 개수 UI
	 * @returns React.Fragment
	 */
	const renderTotalChapter = () => {
		return (
			<Row className="align-items-center">
				<Col xs="auto" md="auto">
					<Text p2>총 강의 개수 선택</Text>
				</Col>
				<Col xs={2} md={2}>
					<FormControl
						className="w-100 m-0"
						as="select"
						value={totalChapter}
						onChange={event => changeTotalChapter(parseInt(event.currentTarget.value))}
					>
						{[...Array(20).keys()].map(idx => {
							return (
								<option key={idx} value={idx + 1}>
									{idx + 1}강
								</option>
							);
						})}
					</FormControl>
				</Col>
			</Row>
		);
	};

	/**
	 * 챕터 Header UI
	 * @param {int} chapterIdx
	 * @returns React.Fragment
	 */
	const renderChapterHeader = chapterIdx => {
		return (
			<React.Fragment>
				<Row>
					<Col>
						<h3>{`${chapterIdx + 1}강`}</h3>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button primary onClick={() => designQuiz(chapterIdx)}>
							퀴즈 작성
						</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	/**
	 * 퀴즈 합격 시 다음 강 진행 여부 UI
	 * @param {int} chapterIdx
	 * @param {object} chapter
	 * @returns React.Fragment
	 */
	const renderNeedQuizPass = (chapterIdx, chapter) => {
		return (
			<Row className="align-items-center mt-1">
				<Col>
					<Checkbox
						checked={chapter.need_quiz_pass}
						onChange={value => {
							chapter.need_quiz_pass = value;
							updateChapter(chapterIdx, chapter);
						}}
					>
						<Text p3 className="ml-1">
							퀴즈 합격 시 다음 강 진행
						</Text>
					</Checkbox>
				</Col>
			</Row>
		);
	};

	/**
	 * 교안 업로드 UI
	 * @param {int} chapterIdx
	 * @param {object} chapter
	 * @returns React.Fragment
	 */
	const renderChapterResources = (chapterIdx, chapter) => {
		return (
			<React.Fragment>
				<Row className="mt-20">
					<Col>
						<FormLabel>자료 업로드</FormLabel>
					</Col>
				</Row>
				{chapter.resources.map((resource, resourceIdx) => {
					return (
						<Row className="align-items-center" key={resourceIdx}>
							<Col md="auto">
								<FormControl
									type="file"
									label={resource.filename}
									data-browse="찾기"
									custom
									onChange={event => {
										selectResourceFile(chapterIdx, resourceIdx, event.currentTarget.files[0]);
									}}
								/>
							</Col>
							<Col>
								<FormControl
									className="w-100"
									type="text"
									value={resource.resource_password ?? ""}
									placeholder="자료 비밀번호"
									onChange={event => {
										updateResourcePassword(chapterIdx, resourceIdx, event.currentTarget.value);
									}}
								/>
							</Col>
							<Col>
								<ResourceRemoveButton
									secondary
									onClick={() => {
										removeResource(chapterIdx, resourceIdx);
									}}
								>
									-
								</ResourceRemoveButton>
							</Col>
						</Row>
					);
				})}
				<Row>
					<Col>
						<Button
							secondary
							onClick={() => {
								addResource(chapterIdx);
							}}
						>
							+ 자료 추가
						</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	/**
	 * 챕터 기본 정보 UI
	 * @param {int} chapterIdx
	 * @param {object} chapter
	 * @returns React.Fragment
	 */
	const renderChapterInfo = (chapterIdx, chapter) => {
		return (
			<React.Fragment>
				<Row className="mt-20">
					<Col>
						<h5>강의 정보</h5>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormControl
							className="w-100"
							type="text"
							value={chapter.title}
							placeholder={`${chapterIdx + 1}강의 제목을 적어주세요`}
							onChange={event => {
								chapter.title = event.currentTarget.value;
								updateChapter(chapterIdx, chapter);
							}}
						/>
						<FormControl
							className="w-100"
							as="textarea"
							value={chapter.description ? chapter.description : ""}
							placeholder={`${chapterIdx + 1}강의 안내문을 적어주세요`}
							onChange={event => {
								chapter.description = event.currentTarget.value;
								updateChapter(chapterIdx, chapter);
							}}
						/>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	/**
	 * 챕터에 속한 동영상 목록 UI
	 * @param {int} chapterIdx
	 * @param {object} chapter
	 * @returns React.Fragment
	 */
	const renderChapterVods = (chapterIdx, chapter) => {
		return (
			<React.Fragment>
				<Row className="mt-20">
					<Col>
						<h5>동영상 정보</h5>
					</Col>
				</Row>
				{chapter.vods.map((vod, vodIdx) => {
					return (
						<VodContainer key={vodIdx}>
							<Row className="align-items-center">
								<Col md={10}>
									<FormLabel>동영상 제목</FormLabel>
									<FormControl
										className="w-100 mb-6"
										type="text"
										value={vod.title}
										placeholder={`${vodIdx + 1} 동영상 제목`}
										onChange={event => {
											vod.title = event.currentTarget.value;
											updateChapterVod(chapterIdx, vodIdx, vod);
										}}
									/>
								</Col>
								{vodIdx !== 0 && (
									<Col>
										<ResourceRemoveButton
											className="mb-6"
											secondary
											onClick={() => {
												removeVod(chapterIdx, vodIdx);
											}}
										>
											-
										</ResourceRemoveButton>
									</Col>
								)}
							</Row>
							<Row className="align-items-center">
								<Col md={10}>
									<FormLabel>강의 URL</FormLabel>
									<FormControl
										className="w-100 mb-6"
										type="text"
										value={vod.vod_url}
										placeholder={`${vodIdx + 1} 강의 URL`}
										onChange={event => {
											vod.vod_url = event.currentTarget.value;
											updateChapterVod(chapterIdx, vodIdx, vod);
										}}
									/>
								</Col>
							</Row>
							<Row className="align-items-center">
								<Col md={10}>
									<FormLabel>강의 설명</FormLabel>
									<FormControl
										className="w-100"
										as="textarea"
										value={vod.description ? vod.description : ""}
										placeholder={`${vodIdx + 1} 강의 설명`}
										onChange={event => {
											vod.description = event.currentTarget.value;
											updateChapterVod(chapterIdx, vodIdx, vod);
										}}
									/>
								</Col>
							</Row>
							<Row className="align-items-center">
								<Col md={10}>
									<FormLabel>강의 설명 URL</FormLabel>
									<FormControl
										className="w-100 mb-6"
										type="text"
										value={vod.description_url}
										placeholder={`${vodIdx + 1} 강의 설명 URL`}
										onChange={event => {
											vod.description_url = event.currentTarget.value;
											updateChapterVod(chapterIdx, vodIdx, vod);
										}}
									/>
								</Col>
							</Row>
						</VodContainer>
					);
				})}
				<Row>
					<Col>
						<Button
							secondary
							onClick={() => {
								addVod(chapterIdx);
							}}
						>
							+ 동영상 추가
						</Button>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	const renderChapterDesign = () => {
		return (
			<React.Fragment>
				{renderTotalChapter()}
				<StyledSeparator />
				{chapters.map((chapter, chapterIdx) => {
					return (
						<React.Fragment key={chapterIdx}>
							{renderChapterHeader(chapterIdx)}
							{renderNeedQuizPass(chapterIdx, chapter)}
							{renderChapterResources(chapterIdx, chapter)}
							{renderChapterInfo(chapterIdx, chapter)}
							{renderChapterVods(chapterIdx, chapter)}
							<StyledSeparator />
						</React.Fragment>
					);
				})}
				<Row className="justify-content-end">
					<Col md={3}>
						<Button primary size="large" className="w-100" onClick={onCreateOrUpdate}>
							저장
						</Button>
					</Col>
					<Col md={3}>
						<Link to={"/admin/courses"}>
							<Button secondary size="large" className="w-100">
								취소
							</Button>
						</Link>
					</Col>
				</Row>
			</React.Fragment>
		);
	};

	const renderQuizDesign = () => {
		return <ChapterQuiz chapterQuiz={quizEdit} onConfirm={onQuizUpdateConfirm} onCancel={onQuizUpdateCancel} />;
	};

	return <React.Fragment>{quizEdit ? renderQuizDesign() : renderChapterDesign()}</React.Fragment>;
};

const StyledSeparator = styled.hr`
	margin-top: 1rem;
	margin-bottom: 1rem;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const ResourceRemoveButton = styled(Button)`
	margin-bottom: 1.25rem;
`;

const VodContainer = styled.div`
	padding: 8px;
	border-radius: 5px;
	border: 1px solid ${({ theme }) => theme.colors.gray};
	margin-bottom: 12px;
`;

export default AdminCourseDesignChapter;
