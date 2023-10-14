import React, { useState, useEffect } from "react";
import Post from "../../../front/course/chapter/post";

import * as ctrl from "./index.ctrl";

const AdminVodCoursePost = ({ post_id }) => {
	const [initialized, setInitialized] = useState(false);
	const [coursePost, setCoursePost] = useState({});

	useEffect(() => {
		ctrl.getVodCoursePost(post_id, result => {
			setCoursePost(result);
			setInitialized(true);
		});
	}, []);

	if (!initialized) return null;

	return (
		<React.Fragment>
			<Post course={coursePost.course} postId={post_id} admin={true} from="vod_course_post" />
		</React.Fragment>
	);
};

export default AdminVodCoursePost;
