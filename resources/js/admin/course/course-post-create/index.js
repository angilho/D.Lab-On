import React, { useState, useEffect } from "react";
import PostCreate from "../../../front/course/chapter/post-create";

import * as ctrl from "./index.ctrl";

const AdminCoursePostCreate = ({ course_id, post_id }) => {
	const [initialized, setInitialized] = useState(false);
	const [course, setCourse] = useState({});

	useEffect(() => {
		ctrl.getCourse(course_id, result => {
			setCourse(result);
			setInitialized(true);
		});
	}, []);

	if (!initialized) return null;

	return (
		<React.Fragment>
			<PostCreate course={course} postId={post_id} admin={true} />
		</React.Fragment>
	);
};

export default AdminCoursePostCreate;
