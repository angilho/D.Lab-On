import * as util from "@common/util";
import axios from "axios";
import Cookies from "js-cookie";

const serialize = (formData, data, parentKey) => {
	if (!(formData instanceof FormData)) return;
	if (!(data instanceof Object)) return;

	Object.keys(data).forEach(key => {
		const val = data[key];
		if (val === null) return;
		if (parentKey) key = `${parentKey}[${key}]`;
		if (val instanceof Object && !(val instanceof File) && !Array.isArray(val)) {
			return serialize(formData, val, key);
		}
		if (Array.isArray(val)) {
			val.forEach((v, idx) => {
				if (v instanceof Object) {
					serialize(formData, v, `${key}[${idx}]`);
				} else {
					formData.append(`${key}[${idx}]`, v);
				}
			});
		} else {
			formData.append(key, val);
		}
	});
};

const serializeQuery = (params, prefix) => {
	const query = Object.keys(params).map(key => {
		const value = params[key];

		if (params.constructor === Array) key = `${prefix}[]`;
		else if (params.constructor === Object) key = prefix ? `${prefix}[${key}]` : key;

		if (typeof value === "object") return serializeQuery(value, key);
		else return `${key}=${encodeURIComponent(value)}`;
	});

	return [].concat.apply([], query).join("&");
};

export const getPaginationLink = link => {
	return fetchWithError(link, "GET");
};

export const getCourse = courseId => {
	return fetchWithError(`/api/v1/courses/${courseId}`, "GET");
};

export const getPopup = key => {
	if (!key) key = "index";
	return fetchWithError(`/static/popup/${key}.html?v=${appVersion}`, "GET");
};

export const getEventPage = name => {
	return fetchWithError(`/static/event/${name}/index.html`, "GET");
};

export const getCourseIntroDetail = (courseId, isDesktop) => {
	return isDesktop
		? fetchWithError(`/static/courses/${courseId}/intro.html`, "GET")
		: fetchWithError(`/static/courses/${courseId}/mobile/intro.html`, "GET");
};

export const getCourseDetail = (courseId, isDesktop) => {
	return isDesktop
		? fetchWithError(`/static/courses/${courseId}/index.html`, "GET")
		: fetchWithError(`/static/courses/${courseId}/mobile/index.html`, "GET");
};

export const getCourses = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/courses?${query}`, "GET");
};

export const createCourse = (course, sections) => {
	let form = new FormData();

	Object.keys(course).forEach(key => {
		if (course[key] !== undefined && course[key] !== null) form.append(key, course[key]);
	});
	sections.forEach(section => {
		form.append("sections[]", JSON.stringify(section));
	});

	return fetchWithError("/api/v1/courses", "POST", form);
};

export const updateCourse = (courseId, course, sections) => {
	let form = new FormData();

	Object.keys(course).forEach(key => {
		if (course[key] !== undefined && course[key] !== null) form.append(key, course[key]);
	});
	sections.forEach(section => {
		form.append("sections[]", JSON.stringify(section));
	});

	return fetchWithError(`/api/v1/courses/${courseId}`, "PUT", form);
};

export const deleteCourse = courseId => {
	return fetchWithError(`/api/v1/courses/${courseId}`, "DELETE");
};

export const copyCourse = courseId => {
	return fetchWithError(`/api/v1/courses/${courseId}/copy`, "POST");
};

export const searchCourse = keyword => {
	return fetchWithError(`/api/v1/courses?keyword=${keyword}`, "GET");
};

export const getCourseChapters = courseId => {
	return fetchWithError(`/api/v1/courses/${courseId}/chapters`, "GET");
};

export const getCourseChaptersAdmin = courseId => {
	return fetchWithError(`/api/v1/courses/${courseId}/chapters/admin`, "GET");
};

export const createCourseChapters = (courseId, chapters) => {
	let form = new FormData();
	serialize(form, { chapters });
	return fetchWithError(`/api/v1/courses/${courseId}/chapters`, "POST", form);
};

export const updateCourseChapters = (courseId, chapters) => {
	let form = new FormData();
	serialize(form, { chapters });
	return fetchWithError(`/api/v1/courses/${courseId}/chapters`, "PUT", form);
};

export const getCoursePosts = (courseId, keyword) => {
	let apiUrl = `/api/v1/courses/${courseId}/posts`;
	if (keyword) apiUrl += `?keyword=${keyword}`;
	return fetchWithError(apiUrl, "GET");
};

export const getCoursePost = (courseId, postId) => {
	return fetchWithError(`/api/v1/courses/${courseId}/posts/${postId}`, "GET");
};

export const createCoursePost = (courseId, post) => {
	let form = new FormData();
	serialize(form, post);
	return fetchWithError(`/api/v1/courses/${courseId}/posts`, "POST", form);
};

export const updateCoursePost = (courseId, postId, post) => {
	let form = new FormData();
	serialize(form, post);
	return fetchWithError(`/api/v1/courses/${courseId}/posts/${postId}`, "PUT", form);
};

export const deleteCoursePost = (courseId, postId) => {
	return fetchWithError(`/api/v1/courses/${courseId}/posts/${postId}`, "DELETE");
};

export const createCoursePostComment = (courseId, postId, comment) => {
	let form = new FormData();
	serialize(form, comment);
	return fetchWithError(`/api/v1/courses/${courseId}/posts/${postId}/comments`, "POST", form);
};

export const getUser = userId => {
	return fetchWithError(`/api/v1/users/${userId}`, "GET");
};

export const getUsers = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/users?${query}`, "GET");
};

export const createUser = user => {
	let form = new FormData();
	serialize(form, user);
	return fetchWithError("/api/v1/users", "POST", form);
};

export const updateUserPassword = body => {
	return fetchWithError("/api/v1/users/password", "PUT", body);
};

export const updateUser = (userId, user) => {
	let body = new FormData();
	serialize(body, user);
	return fetchWithError(`/api/v1/users/${userId}`, "PUT", body);
};

export const deleteUser = userId => {
	return fetchWithError(`/api/v1/users/${userId}`, "DELETE");
};

export const checkUser = (email, password) => {
	let body = new FormData();
	serialize(body, { email, password });
	return fetchWithError(`/api/v1/users/check`, "POST", body);
};

export const checkUserPhone = phone => {
	let body = new FormData();
	serialize(body, { phone });
	return fetchWithError(`/api/v1/users/check/phone`, "POST", body);
};

export const findUserIdByPhone = body => {
	return fetchWithError(`/api/v1/users/find/id/phone`, "POST", body);
};

export const findUserIdByEmail = body => {
	return fetchWithError(`/api/v1/users/find/id/email`, "POST", body);
};

export const createChild = (userId, child) => {
	let body = new FormData();
	serialize(body, child);
	return fetchWithError(`/api/v1/users/${userId}/children`, "POST", body);
};

export const deleteChild = (parentId, childId) => {
	return fetchWithError(`/api/v1/users/${parentId}/children/${childId}`, "DELETE");
};

export const getChildren = userId => {
	return fetchWithError(`/api/v1/users/${userId}/children`, "GET");
};

export const getEnrollments = query => {
	if (query) {
		query = serializeQuery(query);
	} else {
		query = "";
	}
	return fetchWithError(`/api/v1/users/enrollments?${query}`, "GET");
};

export const getUserEnrollments = (userId, query) => {
	if (query) {
		query = serializeQuery(query);
	} else {
		query = "";
	}
	return fetchWithError(`/api/v1/users/${userId}/enrollments?${query}`, "GET");
};

export const getUserCertificateEnrollments = userId => {
	return fetchWithError(`/api/v1/users/${userId}/certificates`, "GET");
};

export const getCoursesEnrollments = () => {
	return fetchWithError(`/api/v1/courses/enrollments`, "GET");
};

export const getCourseEnrollments = courseId => {
	return fetchWithError(`/api/v1/courses/${courseId}/enrollments`, "GET");
};

export const createEnrollment = enrollment => {
	let body = new FormData();
	serialize(body, enrollment);
	return fetchWithError(`/api/v1/enrollments`, "POST", body);
};

export const getDashboard = () => {
	return fetchWithError("/api/v1/dashboards", "GET");
};

export const createCart = (userId, body) => {
	return fetchWithError(`/api/v1/users/${userId}/carts`, "POST", body);
};

export const getCart = userId => {
	return fetchWithError(`/api/v1/users/${userId}/carts`, "GET");
};

export const deleteCart = (userId, cartId) => {
	return fetchWithError(`/api/v1/users/${userId}/carts/${cartId}`, "DELETE");
};

export const getPayments = (userId, query) => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/users/${userId}/payments?${query}`, "GET");
};

export const getAllPayments = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/payments?${query}`, "GET");
};

export const getPayment = (userId, paymentId) => {
	return fetchWithError(`/api/v1/users/${userId}/payments/${paymentId}`, "GET");
};

export const createPayment = (userId, coupon, method) => {
	let form = new FormData();
	form.append("method", method);
	if (coupon && coupon.id) form.append("coupon_id", coupon.id);

	return fetchWithError(`/api/v1/users/${userId}/payments`, "POST", form);
};

export const updatePayment = (userId, paymentId, body) => {
	let form = new FormData();
	serialize(form, body);
	return fetchWithError(`/api/v1/users/${userId}/payments/${paymentId}`, "PUT", form);
};

export const deletePayment = (userId, paymentId) => {
	return fetchWithError(`/api/v1/users/${userId}/payments/${paymentId}`, "DELETE");
};

export const completePayment = (userId, paymentId, impUid, merchantUid) => {
	let form = new FormData();
	form.append("imp_uid", impUid);
	form.append("merchant_uid", merchantUid);

	return fetchWithError(`/api/v1/users/${userId}/payments/${paymentId}/complete`, "POST", form);
};

export const getFaqCategories = () => {
	return fetchWithError(`/api/v1/faq_categories`, "GET");
};

export const getEliceCourseSsoUrl = eliceId => {
	return fetchWithError(`/api/v1/elice/courses/${eliceId}/sso`, "GET");
};

/**
 * Learning API
 */
export const getCourseLearnings = (userId, courseId) => {
	return fetchWithError(`/api/v1/users/${userId}/course_learnings/${courseId}`, "GET");
};

export const createVodLearning = (userId, courseId, chapterId, vodId, status) => {
	let body = new FormData();
	serialize(body, { status });
	return fetchWithError(
		`/api/v1/users/${userId}/course_learnings/${courseId}/chapters/${chapterId}/vods/${vodId}`,
		"POST",
		body
	);
};

export const submitQuizAnswer = (userId, courseId, chapterId, quizId, answers) => {
	let body = new FormData();
	serialize(body, { answers });
	return fetchWithError(
		`/api/v1/users/${userId}/course_learnings/${courseId}/chapters/${chapterId}/quiz/${quizId}/submissions`,
		"POST",
		body
	);
};

export const getQuizSubmissions = (userId, courseId, chapterId, quizId) => {
	return fetchWithError(
		`/api/v1/users/${userId}/course_learnings/${courseId}/chapters/${chapterId}/quiz/${quizId}/submissions`,
		"GET"
	);
};

/**
 * Coupon API
 */

export const createCoupon = coupon => {
	let form = new FormData();
	serialize(form, coupon);
	return fetchWithError("/api/v1/coupons", "POST", form);
};

export const getCoupons = () => {
	return fetchWithError(`/api/v1/coupons`, "GET");
};

export const checkCoupon = code => {
	return fetchWithError(`/api/v1/coupons/${code}`, "GET");
};

export const getUserCoupons = user_id => {
	return fetchWithError(`/api/v1/users/${user_id}/coupons`, "GET");
};

export const deleteCoupons = couponIds => {
	let form = new FormData();
	serialize(form, { coupon_ids: couponIds });
	return fetchWithError(`/api/v1/coupons/delete`, "POST", form);
};

export const userCouponImport = coupons => {
	let form = new FormData();
	serialize(form, { coupons: coupons });
	return fetchWithError(`/api/v1/coupons/user_coupon_import`, "POST", form);
};

/**
 * Auth API
 */
export const login = (userLogin, userPassword, remember) => {
	let form = new FormData();
	form.append("user_login", userLogin);
	form.append("password", userPassword);
	if (remember) form.append("remember", true);

	return fetchWithError(`/login`, "POST", form);
};

export const organizationLogin = (userLogin, userPassword, path, remember) => {
	let form = new FormData();
	form.append("user_login", userLogin);
	form.append("password", userPassword);
	form.append("path", path);
	if (remember) form.append("remember", true);

	return fetchWithError(`/login`, "POST", form);
};

export const csrfCookie = () => {
	return axios.get("/sanctum/csrf-cookie");
};

export const masqueradeLogin = childId => {
	let form = new FormData();
	form.append("child_id", childId);
	return fetchWithError(`/masquerade_login`, "POST", form);
};

/**
 * Password Forgot API
 */
export const passwordForgot = email => {
	let form = new FormData();
	form.append("email", email);
	return fetchWithError(`/api/v1/password/forgot`, "POST", form);
};

/**
 * Message API
 */
export const getMessages = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/messages?${query}`, "GET");
};

export const getMessage = messageId => {
	return fetchWithError(`/api/v1/messages/${messageId}`, "GET");
};

export const sendMessage = message => {
	let form = new FormData();
	serialize(form, message);
	return fetchWithError("/api/v1/messages/send", "POST", form);
};

/**
 * 공지사항 API
 */
export const getNotices = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/notices?${query}`, "GET");
};

export const getNotice = noticeId => {
	return fetchWithError(`/api/v1/notices/${noticeId}`, "GET");
};

export const createNotice = notice => {
	let form = new FormData();
	serialize(form, notice);
	return fetchWithError(`/api/v1/notices`, "POST", form);
};

export const updateNotice = (noticeId, notice) => {
	let form = new FormData();
	serialize(form, notice);
	return fetchWithError(`/api/v1/notices/${noticeId}`, "PUT", form);
};

export const deleteNotice = noticeId => {
	return fetchWithError(`/api/v1/notices/${noticeId}`, "DELETE");
};

/**
 * FAQ API
 */
export const getFaqs = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/faqs?${query}`, "GET");
};

export const getFaq = faqId => {
	return fetchWithError(`/api/v1/faqs/${faqId}`, "GET");
};

export const createFaq = faq => {
	let form = new FormData();
	serialize(form, faq);
	return fetchWithError(`/api/v1/faqs`, "POST", form);
};

export const updateFaq = (faqId, faq) => {
	let form = new FormData();
	serialize(form, faq);
	return fetchWithError(`/api/v1/faqs/${faqId}`, "PUT", form);
};

export const deleteFaq = faqId => {
	return fetchWithError(`/api/v1/faqs/${faqId}`, "DELETE");
};

/**
 * B2B API
 */
export const getOrganizations = query => {
	if (query) query = "?" + serializeQuery(query);
	return fetchWithError(`/api/v1/organizations${query}`, "GET");
};

export const getOrganization = organizationId => {
	return fetchWithError(`/api/v1/organizations/${organizationId}`, "GET");
};

export const createOrganization = organization => {
	let form = new FormData();
	serialize(form, organization);
	return fetchWithError("/api/v1/organizations", "POST", form);
};

export const updateOrganization = (organizationId, organization) => {
	let form = new FormData();
	serialize(form, organization);
	return fetchWithError(`/api/v1/organizations/${organizationId}`, "PUT", form);
};

export const deleteOrganization = organizationId => {
	return fetchWithError(`/api/v1/organizations/${organizationId}`, "DELETE");
};

export const getOrganizationUsers = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/organization_users?${query}`, "GET");
};

export const getOrganizationUser = userId => {
	return fetchWithError(`/api/v1/organization_users/${userId}`, "GET");
};

export const createOrganizationUserImport = users => {
	let form = new FormData();
	serialize(form, { users });
	return fetchWithError("/api/v1/organization_user_import", "POST", form);
};

export const getOrganizationEnrollments = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/organization_enrollments?${query}`, "GET");
};

export const deleteOrganizationEnrollments = enrollmentIds => {
	let form = new FormData();
	serialize(form, { enrollment_ids: enrollmentIds });
	return fetchWithError(`/api/v1/organization_enrollments/delete`, "POST", form);
};

export const createOrganizationEnrollmentImport = enrollments => {
	let form = new FormData();
	serialize(form, { enrollments });
	return fetchWithError("/api/v1/organization_enrollment_import", "POST", form);
};

export const getOrganizationPosts = (organizationId, keyword) => {
	let apiUrl = `/api/v1/organizations/${organizationId}/posts`;
	if (keyword) apiUrl += `?keyword=${keyword}`;
	return fetchWithError(apiUrl, "GET");
};

export const createOrganizationPost = (organizationId, post) => {
	let form = new FormData();
	serialize(form, post);
	return fetchWithError(`/api/v1/organizations/${organizationId}/posts`, "POST", form);
};

export const getOrganizationPost = (organizationId, postId) => {
	return fetchWithError(`/api/v1/organizations/${organizationId}/posts/${postId}`, "GET");
};

export const updateOrganizationPost = (organizationId, postId, post) => {
	let form = new FormData();
	serialize(form, post);
	return fetchWithError(`/api/v1/organizations/${organizationId}/posts/${postId}`, "PUT", form);
};

export const deleteOrganizationPost = (organizationId, postId) => {
	return fetchWithError(`/api/v1/organizations/${organizationId}/posts/${postId}`, "DELETE");
};

export const createOrganizationPostComment = (organizationId, postId, comment) => {
	let form = new FormData();
	serialize(form, comment);
	return fetchWithError(`/api/v1/organizations/${organizationId}/posts/${postId}/comments`, "POST", form);
};

export const deleteOrganizationPostComment = (organizationId, postId, commentId) => {
	return fetchWithError(`/api/v1/organizations/${organizationId}/posts/${postId}/comments/${commentId}`, "DELETE");
};

/**
 * Carousel API
 */
export const getCarousels = () => {
	return fetchWithError(`/api/v1/carousels`, "GET");
};

export const createCarousel = carousel => {
	let form = new FormData();
	serialize(form, carousel);
	return fetchWithError("/api/v1/carousels", "POST", form);
};

export const reorderCarousels = carousels => {
	let form = new FormData();
	serialize(form, carousels);
	return fetchWithError("/api/v1/carousels/reorder", "POST", form);
};

export const updateCarousel = (carouselId, carousel) => {
	let form = new FormData();
	serialize(form, carousel);
	return fetchWithError(`/api/v1/carousels/${carouselId}`, "PUT", form);
};

export const deleteCarousel = carouselId => {
	return fetchWithError(`/api/v1/carousels/${carouselId}`, "DELETE");
};

/**
 * Curriculum Category API
 */
export const getCurriculumCategories = () => {
	return fetchWithError(`/api/v1/curriculum_categories`, "GET");
};

export const getCurriculumCategory = curriculumCategoryId => {
	return fetchWithError(`/api/v1/curriculum_categories/${curriculumCategoryId}`, "GET");
};

export const createCurriculumCategory = curriculumCategory => {
	let form = new FormData();
	serialize(form, curriculumCategory);
	return fetchWithError("/api/v1/curriculum_categories", "POST", form);
};

export const reorderCurriculumCategory = curriculumCategories => {
	let form = new FormData();
	serialize(form, curriculumCategories);
	return fetchWithError("/api/v1/curriculum_categories/reorder", "POST", form);
};

export const updateCurriculumCategory = (curriculumCategoryId, curriculumCategory) => {
	let form = new FormData();
	serialize(form, curriculumCategory);
	return fetchWithError(`/api/v1/curriculum_categories/${curriculumCategoryId}`, "PUT", form);
};

export const deleteCurriculumCategory = curriculumCategoryId => {
	return fetchWithError(`/api/v1/curriculum_categories/${curriculumCategoryId}`, "DELETE");
};

/**
 * Detail Curriculum Category API
 */
export const getDetailCurriculumCategories = () => {
	return fetchWithError(`/api/v1/detail_curriculum_categories`, "GET");
};

export const getDetailCurriculumCategory = detailCurriculumCategoryId => {
	return fetchWithError(`/api/v1/detail_curriculum_categories/${detailCurriculumCategoryId}`, "GET");
};

export const createDetailCurriculumCategory = detailCurriculumCategory => {
	let form = new FormData();
	serialize(form, detailCurriculumCategory);
	return fetchWithError("/api/v1/detail_curriculum_categories", "POST", form);
};

export const reorderDetailCurriculumCategory = detailCurriculumCategories => {
	let form = new FormData();
	serialize(form, detailCurriculumCategories);
	return fetchWithError("/api/v1/detail_curriculum_categories/reorder", "POST", form);
};

export const updateDetailCurriculumCategory = (detailCurriculumCategoryId, detailCurriculumCategory) => {
	let form = new FormData();
	serialize(form, detailCurriculumCategory);
	return fetchWithError(`/api/v1/detail_curriculum_categories/${detailCurriculumCategoryId}`, "PUT", form);
};

export const deleteDetailCurriculumCategory = detailCurriculumCategoryId => {
	return fetchWithError(`/api/v1/detail_curriculum_categories/${detailCurriculumCategoryId}`, "DELETE");
};

/**
 * Menu Permission API
 */
export const getMenuPermissions = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/menu_permissions?${query}`, "GET");
};

export const getMenuPermission = menuId => {
	return fetchWithError(`/api/v1/menu_permissions/${menuId}`, "GET");
};

export const updateMenuPermissions = (menuId, permissionUsers) => {
	let form = new FormData();
	serialize(form, permissionUsers);
	return fetchWithError(`/api/v1/menu_permissions/${menuId}`, "PUT", form);
};

/**
 * File API
 */
export const createFile = data => {
	return fetchWithError(`/api/v1/files`, "POST", data);
};

/**
 * Course Description API
 */
export const createCourseDescription = (courseId, description) => {
	let form = new FormData();
	serialize(form, description);
	return fetchWithError(`/api/v1/courses/${courseId}/description`, "POST", form);
};

/**
 * Instructor API
 */
export const createInstructorEnrollment = (userId, enrollment) => {
	let body = new FormData();
	serialize(body, enrollment);
	return fetchWithError(`/api/v1/instructors/${userId}/enrollments`, "POST", body);
};

export const deleteInstructorEnrollment = (userId, enrollmentId) => {
	return fetchWithError(`/api/v1/instructors/${userId}/enrollments/${enrollmentId}`, "DELETE");
};

/**
 * VOD Course Posts API
 */

export const getVodCoursePosts = keyword => {
	let apiUrl = `/api/v1/vod_course_posts`;
	if (keyword) apiUrl += `?keyword=${keyword}`;
	return fetchWithError(apiUrl, "GET");
};

export const getVodCoursePost = postId => {
	return fetchWithError(`/api/v1/vod_course_posts/${postId}`, "GET");
};

/**
 * Support Class API
 */

export const getSupportClassEnrollments = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/support_class_enrollments?${query}`, "GET");
};

export const deleteSupportClassEnrollments = enrollmentIds => {
	let form = new FormData();
	serialize(form, { enrollment_ids: enrollmentIds });
	return fetchWithError(`/api/v1/support_class_enrollments/delete`, "POST", form);
};

export const createSupportClassEnrollmentImport = enrollments => {
	let form = new FormData();
	serialize(form, { enrollments });
	return fetchWithError("/api/v1/support_class_enrollment_import", "POST", form);
};

export const supportClassEnrollmentExtend = enrollment_ids => {
	let form = new FormData();
	serialize(form, { enrollment_ids });
	return fetchWithError("/api/v1/support_class_enrollment_extend", "POST", form);
};

/**
 * Sms Notifications API
 */
export const getSmsNotifications = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/sms_notifications?${query}`, "GET");
};

export const getSmsNotification = smsNotificationId => {
	return fetchWithError(`/api/v1/sms_notifications/${smsNotificationId}`, "GET");
};

export const createSmsNotification = smsNotification => {
	let form = new FormData();
	serialize(form, smsNotification);
	return fetchWithError(`/api/v1/sms_notifications`, "POST", form);
};

export const updateSmsNotification = (smsNotificationId, smsNotification) => {
	let form = new FormData();
	serialize(form, smsNotification);
	return fetchWithError(`/api/v1/sms_notifications/${smsNotificationId}`, "PUT", form);
};

export const deleteSmsNotification = smsNotificationId => {
	return fetchWithError(`/api/v1/sms_notifications/${smsNotificationId}`, "DELETE");
};

/**
 * attendance
 */
export const getAttendanceCourses = query => {
	if (query) query = serializeQuery(query);
	return fetchWithError(`/api/v1/attendance_courses?${query}`, "GET");
};

export const createAttendaceCourses = createAttendanceInfo => {
	let form = new FormData();
	serialize(form, createAttendanceInfo);
	return fetchWithError(`/api/v1/attendance_courses`, "POST", form);
};

export const getAttendanceSections = attendanceCourseId => {
	return fetchWithError(`/api/v1/attendance_courses/${attendanceCourseId}`, "GET");
};

export const deleteAttendanceSections = (attendanceCourseId, attendanceSectionIds) => {
	let form = new FormData();
	serialize(form, { attendance_section_ids: attendanceSectionIds });
	return fetchWithError(`/api/v1/attendance_courses/${attendanceCourseId}/sections_delete`, "POST", form);
};

export const getAttendanceSectionInfo = (attendanceCourseId, attendanceSectionId) => {
	return fetchWithError(`/api/v1/attendance_courses/${attendanceCourseId}/sections/${attendanceSectionId}`, "GET");
};

export const getCourseSectionEnrollments = (courseId, sectionId) => {
	return fetchWithError(`/api/v1/courses/${courseId}/sections/${sectionId}/enrollments`, "GET");
};

export const updateAttendanceStudents = (attendanceCourseId, attendanceSectionId, students) => {
	let form = new FormData();
	serialize(form, { students });
	return fetchWithError(
		`/api/v1/attendance_courses/${attendanceCourseId}/sections/${attendanceSectionId}/attendances`,
		"POST",
		form
	);
};

export const getAttendanceStudentHistory = (attendanceCourseId, studentId) => {
	return fetchWithError(`/api/v1/attendance_courses/${attendanceCourseId}/student_attendances/${studentId}`, "GET");
};

export const updateAttendanceStudent = (studentAttendances, attendanceCourseId, studentId) => {
	let form = new FormData();
	serialize(form, { student_attendances: studentAttendances });
	return fetchWithError(
		`/api/v1/attendance_courses/${attendanceCourseId}/student_attendances/${studentId}`,
		"PUT",
		form
	);
};

function fetchWithError(url, method, body) {
	return new Promise((resolve, reject) => {
		if (method.toLowerCase() === "put") {
			//PUT으로 들어올 경우 method를 POST로 하고 데이터에 _method = "PUT"을 넣어준다.
			//라라벨에서 데이터를 제대로 받아오지 못하기 때문임.
			if (!body) {
				body = {
					_method: "PUT"
				};
				method = "POST";
			}

			if (body instanceof FormData) {
				body.append("_method", "PUT");
				method = "POST";
			}
		}
		axios({
			method: method,
			url: url,
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + Cookies.get("api_token")
			},
			data: body
		})
			.then(async res => {
				resolve(res);
			})
			.catch(error => {
				if (error.response) {
					let data = error.response.data;
					if (data) {
						if (data.errors) {
							//laravel의 errors 객체로 들어올 경우
							for (let key in data.errors) {
								if (!data.errors.hasOwnProperty(key)) continue;

								let error = data.errors[key];
								for (let prop in error) {
									if (!error.hasOwnProperty(prop)) continue;

									alert(error[prop]);
									break;
								}
								break;
							}
						}
						reject(error.response);
					}
				}
			});
	});
}
