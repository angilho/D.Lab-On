import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import girl from "@images/elements/profileImage/girl.png";
import boy from "@images/elements/profileImage/boy.png";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import ProfileChangeModal from "@components/modal/ProfileChangeModal";

const ProfileImage = ({ user, gender, edit, handleChangeProfile, ...props }) => {
	const [showProfileChangeModal, setShowProfileChangeModal] = useState(false);
	const [profileImageFile, setProfileImageFile] = useState(null);
	const [image, setImage] = useState(null);
	const inputFile = useRef(null);

	useEffect(() => {
		// 사용자 프로필 이미지를 사용하는 경우
		if (user && user.use_default_profile === false) {
			setImage(`/storage/files/${user.profile_image.filename}`);
		} else {
			setImage(gender === "m" ? boy : girl);
		}
	}, []);

	useEffect(() => {
		if (!profileImageFile) return;

		// 용량 2MB 제한
		if (profileImageFile.size > 2 * 1024 * 1024) {
			alert("2MB 이하 용량을 가진 파일을 선택하여 주십시오.");
			setProfileImageFile(null);
			setImage(gender === "m" ? boy : girl);
			return;
		}
		setImage(URL.createObjectURL(profileImageFile));
		handleChangeProfile(false, profileImageFile);
	}, [profileImageFile]);

	const onChangeProfile = () => {
		setShowProfileChangeModal(true);
	};

	const onChangeImage = () => {
		setShowProfileChangeModal(false);
		inputFile.current.click();
	};

	const onChangeDefault = () => {
		setShowProfileChangeModal(false);
		setImage(gender === "m" ? boy : girl);
		handleChangeProfile(true, null);
	};

	return (
		<div className="position-relative w-100 h-100">
			<ProfileImageContainer>
				<StyledProfileImage width={props.width} height={props.height} src={image} />
			</ProfileImageContainer>
			{edit && (
				<React.Fragment>
					<PhotoCameraIconContainer onClick={onChangeProfile}>
						<PhotoCameraRoundedIcon style={{ fontSize: 18 }} />
					</PhotoCameraIconContainer>
					<input
						type="file"
						id="file"
						accept="image/*"
						ref={inputFile}
						style={{ display: "none" }}
						onChange={event => setProfileImageFile(event.currentTarget.files[0])}
					/>
				</React.Fragment>
			)}
			<ProfileChangeModal
				show={showProfileChangeModal}
				onHide={() => setShowProfileChangeModal(false)}
				onChangeImage={onChangeImage}
				onChangeDefault={onChangeDefault}
			/>
		</div>
	);
};

const ProfileImageContainer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	border-radius: 50%;
`;

const StyledProfileImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const PhotoCameraIconContainer = styled.div`
	position: absolute;
	bottom: 0;
	right: 24px;

	width: 34px;
	height: 34px;

	display: flex;
	justify-content: center;
	align-items: center;

	background-color: white;
	border-radius: 50%;
	box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);

	cursor: pointer;
`;

export default ProfileImage;
