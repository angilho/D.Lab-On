import React, { useState, useEffect } from "react";
import PostList from "../../../front/course/chapter/post-list";

import * as ctrl from "./index.ctrl";

const AdminCoursePostList = ({ course_id }) => {
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
			<PostList course={course} admin={true} />
		</React.Fragment>
	);
};

export default AdminCoursePostList;
