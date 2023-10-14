import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import Text from "@components/elements/Text";
import TextAnchor from "@components/elements/TextAnchor";
import Button from "@components/elements/Button";
import Checkbox from "@components/elements/Checkbox";
import useSizeDetector from "@hooks/useSizeDetector";
import * as util from "@common/util";

const Agreement = ({}) => {
	const location = useLocation();
	const history = useHistory();
	const SizeDetector = useSizeDetector();

	const [dlabOn, setDlabOn] = useState(false);
	const [privacy, setPrivacy] = useState(false);
	const [promotion, setPromotion] = useState(false);
	const [nextReserved, setNextReserved] = useState(false);
	const [nextEnable, setNextEnable] = useState(false);

	useEffect(() => {
		if (!location.state || typeof location.state.registerGeneral === "undefined") {
			alert("잘못된 접근입니다.");
			history.goBack();
		}
	}, []);

	const agreeAll = () => {
		setDlabOn(true);
		setPrivacy(true);
		setPromotion(true);
		setNextReserved(true);
	};

	useEffect(() => {
		setNextEnable(dlabOn && privacy);
	}, [dlabOn, privacy]);

	useEffect(() => {
		if (dlabOn && privacy && promotion && nextReserved) {
			goRegisterForm();
		}
	}, [dlabOn, privacy, promotion, nextReserved]);

	const goRegisterForm = () => {
		let pathname = location.state.registerGeneral ? "/register/user" : "/register/child";
		history.push({
			pathname,
			state: {
				dlabOn,
				privacy,
				promotion,
				registerGeneral: location.state.registerGeneral //일반 사용자 가입인지 학생 가입인지 판별하는 변수
			}
		});
	};

	return (
		<div className="container">
			<Row className="mt-60 justify-content-center">
				<Col align="center">
					<Container>
						<Text h5 className="mb-40">
							약관 동의
						</Text>
						<SizeDetector.Desktop>
							<Button primary size="large" className="w-100" onClick={() => agreeAll()}>
								모두 동의하고 넘어가기
							</Button>
							<Text className="mt-40 mb-10">이용약관 동의</Text>
						</SizeDetector.Desktop>

						<ThickLine />
						<AgreementBox>
							<Checkbox checked={dlabOn} onChange={value => setDlabOn(value)} name="agreements[dlab_on]">
								<Text
									p2
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									className="d-inline ml-10"
								>
									디랩온 이용약관 동의
								</Text>
								<RequiredText
									p2
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									className="d-inline"
								>
									&nbsp;(필수)
								</RequiredText>
								<ShowPolicyText
									p3
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									target="_blank"
									href={`/static/policy/terms_of_service.html?v=${appVersion}`}
								>
									{"약관 보기 >"}
								</ShowPolicyText>
							</Checkbox>
						</AgreementBox>

						<ThinLine />
						<AgreementBox>
							<Checkbox
								checked={privacy}
								onChange={value => setPrivacy(value)}
								name="agreements[privacy]"
							>
								<Text
									p2
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									className="d-inline ml-10"
								>
									개인정보 수집 및 이용 동의
								</Text>
								<RequiredText
									p2
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									className="d-inline"
								>
									&nbsp;(필수)
								</RequiredText>
								<ShowPolicyText
									p3
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									target="_blank"
									href={`/static/policy/privacy_statement.html?v=${appVersion}`}
								>
									{"약관 보기 >"}
								</ShowPolicyText>
							</Checkbox>
						</AgreementBox>
						<ThinLine />
						<AgreementBox>
							<Checkbox
								type="checkbox"
								checked={promotion}
								onChange={value => setPromotion(!value)}
								name="agreements[promotion]"
							>
								<Text
									p2
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									className="d-inline ml-10"
								>
									프로모션 정보 수신 동의
								</Text>
								<NotRequiredText
									p2
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									className="d-inline"
								>
									&nbsp;(선택)
								</NotRequiredText>
								<ShowPolicyText
									p3
									fontWeight={!SizeDetector.isDesktop ? 400 : null}
									fontSize={!SizeDetector.isDesktop ? 1 : null}
									lineHeight={!SizeDetector.isDesktop ? 1.75 : null}
									target="_blank"
									href={`/static/policy/promotion.html?v=${appVersion}`}
								>
									{"약관 보기 >"}
								</ShowPolicyText>
							</Checkbox>
						</AgreementBox>

						<ThickLine />
						<Button
							secondary
							size="large"
							className={`w-100 ${SizeDetector.isDesktop ? "mt-40" : "mt-24"}`}
							disabled={!nextEnable}
							onClick={event => {
								event.preventDefault();
								goRegisterForm();
							}}
						>
							선택 동의하고 넘어가기
						</Button>
						<SizeDetector.Mobile>
							<Button primary size="large" className="w-100 mt-12 ml-0" onClick={() => agreeAll()}>
								모두 동의하고 넘어가기
							</Button>
						</SizeDetector.Mobile>
					</Container>
				</Col>
			</Row>
		</div>
	);
};

const AgreementBox = styled.div`
	margin-top: 10px;
	margin-bottom: 10px;
`;

const Container = styled.div`
	@media only screen and (min-width: 768px) {
		width: 23.125rem;
	}
`;

const ThickLine = styled.hr`
	border-width: 0.125rem;
	margin-top: 0;
	margin-bottom: 0;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const ThinLine = styled.hr`
	margin-top: 0;
	margin-bottom: 0;
	background-color: ${({ theme }) => theme.colors.gray};
`;

const RequiredText = styled(Text)`
	color: ${({ theme }) => theme.colors.secondary};
`;

const NotRequiredText = styled(Text)`
	color: ${({ theme }) => theme.colors.gray};
`;

const ShowPolicyText = styled(TextAnchor)`
	color: ${({ theme }) => theme.colors.gray3};
	margin-left: auto;
`;

export default Agreement;
