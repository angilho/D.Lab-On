import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FormControl from "@components/elements/FormControl";
import Button from "@components/elements/Button";
import Text from "@components/elements/Text";
import styled from "styled-components";
import CouponAllocateTable from "./components/coupon-allocate-table";

import * as ctrl from "./index.ctrl";

const AdminCouponAllocate = () => {
	const history = useHistory();
	const [allocatedCoupons, setAllocatedCoupons] = useState([]);
	const excelFile = useRef(null);
	const [couponAllocateExcelFile, setCouponAllocateExcelFile] = useState(null);

	const [allChecked, setAllChecked] = useState(false);
	const [userLogin, setUserLogin] = useState("");
	const [couponCode, setCouponCode] = useState("");

	const onClickExcelFileUpload = () => {
		excelFile.current.click();
	};

	const onClickExcelFileDownload = () => {
		window.location.href = "/static/sample/sample_coupon_allocate.xlsx";
	};

	useEffect(() => {
		if (!couponAllocateExcelFile || !couponAllocateExcelFile.name.includes("xls")) return;

		try {
			let fileReader = new FileReader();

			const rABS = !!fileReader.readAsBinaryString;
			fileReader.onload = e => ctrl.handleOnFileLoad(e, rABS, parseExcelFile);
			if (rABS) fileReader.readAsBinaryString(couponAllocateExcelFile);
		} catch (e) {
			console.log(e);
			alert("잘못된 엑셀 파일을 업로드 하였습니다.");
		}
	}, [couponAllocateExcelFile]);

	const parseExcelFile = excelData => {
		// 파싱한 Excel 정보에서 헤더가 없을 경우
		if (excelData.length == 0 || !excelData[0]) {
			alert("잘못된 엑셀 파일을 업로드 하였습니다.");
		}
		// 헤더를 뺀다.
		excelData.splice(0, 1);

		// coupon allocate 정보를 추가한다.
		let filteredData = excelData
			.filter(data => data.length == 2)
			.map(data => {
				return {
					user_login: data[0],
					coupon_code: data[1],
					selected: false
				};
			});
		if (filteredData.length !== 0) {
			setAllocatedCoupons([...allocatedCoupons, ...filteredData]);
		}
	};

	const onAllocateOneCoupon = () => {
		setAllocatedCoupons([...allocatedCoupons, { user_login: userLogin, coupon_code: couponCode, selected: false }]);
		setUserLogin("");
		setCouponCode("");
	};

	const onAllocateSelectedCoupons = () => {
		if (allocatedCoupons.filter(e => e.selected).length === 0) {
			alert("지급할 쿠폰 항목이 없습니다.");
			return;
		}

		ctrl.userCouponImport(
			allocatedCoupons.filter(e => e.selected),
			() => history.push({ pathname: "/admin/coupons" })
		);
	};

	const onDeleteSelectedCoupons = () => {
		if (confirm("삭제하시겠습니까?")) {
			let remainCoupons = allocatedCoupons.filter(e => !e.selected);
			setAllocatedCoupons(remainCoupons);
		}
	};

	const onAllChecked = () => {
		if (allChecked) {
			setAllChecked(false);
		} else {
			setAllChecked(true);
		}

		let checkAllocatedCoupons = allocatedCoupons.map(e => {
			e.selected = !allChecked;
			return e;
		});
		setAllocatedCoupons(checkAllocatedCoupons);
	};

	const onChangeCheckboxStatus = (value, idx) => {
		let changedAllocation = allocatedCoupons.map(e => e);
		changedAllocation[idx].selected = value;
		setAllocatedCoupons(changedAllocation);
	};

	return (
		<React.Fragment>
			<Row className="mt-3">
				<Col>
					<Text>엑셀 파일 업로드를 통해서 관리자는 회원에게 쿠폰을 지급할 수 있습니다.</Text>
					<Text>쿠폰 지급시에는 회원 아이디와 쿠폰 코드가 필요합니다.</Text>
				</Col>
			</Row>
			<CouponAllocateContainer className="mt-5">
				<h4>일괄추가</h4>
				<Row>
					<Col>
						<Row>
							<Col>
								<Button primary onClick={onClickExcelFileDownload}>
									쿠폰지급 양식 다운로드
								</Button>
								<Button primary onClick={onClickExcelFileUpload}>
									쿠폰지급 파일 업로드
								</Button>
								<input
									type="file"
									id="file"
									ref={excelFile}
									style={{ display: "none" }}
									onChange={event => setCouponAllocateExcelFile(event.currentTarget.files[0])}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
				<h4 className="mt-5">개별추가</h4>
				<Row className="mt-3">
					<Col md={4}>
						<Row>
							<Col>
								<FormControl
									className="w-100"
									type="text"
									placeholder="회원아이디"
									value={userLogin}
									onChange={event => setUserLogin(event.currentTarget.value)}
								/>
							</Col>
						</Row>
					</Col>
					<Col md={4}>
						<Row>
							<Col>
								<FormControl
									className="w-100"
									type="text"
									placeholder="쿠폰코드"
									value={couponCode}
									onChange={event => setCouponCode(event.currentTarget.value)}
								/>
							</Col>
						</Row>
					</Col>
					<Col md={2} className="">
						<Button primary className="w-100" onClick={onAllocateOneCoupon}>
							추가
						</Button>
					</Col>
				</Row>
			</CouponAllocateContainer>
			<Row className="justify-content-end mt-3">
				<Col md={2}>
					<Button primary className="w-100" onClick={onAllocateSelectedCoupons}>
						추가
					</Button>
				</Col>
				<Col md={2}>
					<Button danger className="w-100" onClick={onDeleteSelectedCoupons}>
						선택삭제
					</Button>
				</Col>
			</Row>
			<CouponAllocateTable
				allocatedCoupons={allocatedCoupons}
				onAllChecked={onAllChecked}
				allChecked={allChecked}
				onChangeCheckboxStatus={onChangeCheckboxStatus}
			/>
		</React.Fragment>
	);
};

const CouponAllocateContainer = styled.div`
	border: 1px solid gray;
	border-radius: 0.5rem;
	padding: 1rem;
`;

export default AdminCouponAllocate;
