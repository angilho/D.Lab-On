import { useState, useCallback, useEffect } from "react";
import CouponType from "@constants/CouponType";
import * as api from "@common/api";

const usePaymentHandler = ({ userId, paymentId }) => {
	const [cartResult, setCartResult] = useState({});
	const [paymentResult, setPaymentResult] = useState({});

	const [totalPrice, setTotalPrice] = useState(0);
	const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);
	const [paymentPrice, setPaymentPrice] = useState(0);

	const [paymentCourseInfo, setPaymentCourseInfo] = useState([]);
	const [hasCart, setHasCart] = useState(undefined);

	const [coupon, setCoupon] = useState("");
	const [couponActivated, setCouponActivated] = useState(false);

	const [hasCheckedCartItem, setHasCheckedCartItem] = useState(true);
	const [ignoreCartItems, setIgnoreCartItems] = useState([]);

	useEffect(() => {
		//결제 완료시 처리 핸들러(payementId가 있는 경우는 /success 페이지 갔을 때)
		if (paymentId && userId) {
			api.getPayment(userId, paymentId).then(response => {
				if (response.data.length > 0) setPaymentResult(response.data[0]);
			});
		} else if (userId) {
			//현재 로그인한 사용자의 카트 정보를 불러온다.
			api.getCart(userId)
				.then(response => {
					let result = response.data;
					if (result.cart) {
						result.cart = result.cart.map(cartItem => {
							return { ...cartItem, selected: true };
						});
					}
					if (result.children) {
						result.children = result.children.map(child => {
							let childCart = child.cart.map(cartItem => {
								return { ...cartItem, selected: true };
							});
							return { ...child, cart: childCart };
						});
					}
					setCartResult(result);
				})
				.catch(err => console.error(err));
		}
	}, []);

	//payment -> payment/:id/success로 오는 경우에 대한 처리를 위함.
	useEffect(() => {
		if (paymentId)
			api.getPayment(userId, paymentId).then(response => {
				if (response.data.length > 0) setPaymentResult(response.data[0]);
			});
	}, [paymentId]);

	useEffect(() => {
		if (!cartResult.cart || !cartResult.children) return;

		// 아이가 없고, 사용자의 카트에 값이 담겨있지 않으면 카트 정보가 없다.
		let hasMyCart = cartResult.cart && cartResult.cart.length !== 0;

		//아이가 있을 경우 카트 안의 내용을 확인해 설정한다.
		let hasChildCart =
			cartResult.children && cartResult.children.some(child => child.cart && child.cart.length > 0);

		setHasCart(hasMyCart || hasChildCart);

		setCartInfo();
	}, [cartResult]);

	useEffect(() => {
		setPaymentPrice(totalPrice - totalDiscountPrice);
	}, [totalPrice, totalDiscountPrice]);

	useEffect(() => {
		if (coupon) {
			//퍼센트 깎는 형식일 경우(10%, 20%등의 형태로 들어있음)
			if (coupon.type === CouponType.PERCENT_DISCOUNT) {
				//쿠폰 적용시 최종 금액에서 할인된 금액을 계산하여 전체 할인 금액과 더해주자.
				let couponActivatedDiscountPrice = Math.ceil(paymentPrice * (coupon.value / 100));
				setTotalDiscountPrice(totalDiscountPrice + couponActivatedDiscountPrice);
			} else if (coupon.type === CouponType.VALUE_DISCOUNT) {
				//가격 할인일 경우에는 바로 해당 가격을 붙여서 할인을 때린다
				setTotalDiscountPrice(totalDiscountPrice + coupon.value);
			}
		}
	}, [couponActivated]);

	const setCartInfo = () => {
		let totalDiscountPrice = 0;
		let totalPrice = 0;
		let courseInfo = [];

		cartResult.cart &&
			cartResult.cart.forEach(cartItem => {
				if (cartItem.selected) {
					totalPrice += cartItem.course.price;
					if (cartItem.course.discount_price) {
						totalDiscountPrice += cartItem.course.discount_price;
					}
				}

				courseInfo.push({
					user_id: cartResult.id,
					course_id: cartItem.course_id,
					course_section_id: cartItem.course_section_id,
					price: cartItem.course.price - cartItem.course.discount_price
				});
			});

		cartResult.children &&
			cartResult.children.forEach(child => {
				child.cart.forEach(childCartItem => {
					if (childCartItem.selected) {
						totalPrice += childCartItem.course.price;
						if (childCartItem.course.discount_price) {
							totalDiscountPrice += childCartItem.course.discount_price;
						}
					}

					courseInfo.push({
						user_id: child.user_info.id,
						course_id: childCartItem.course_id,
						course_section_id: childCartItem.course_section_id,
						price: childCartItem.course.price - childCartItem.course.discount_price
					});
				});
			});

		setPaymentCourseInfo(courseInfo);
		setTotalPrice(totalPrice);
		setTotalDiscountPrice(totalDiscountPrice);
	};

	const checkCoupon = code => {
		api.checkCoupon(code)
			.then(res => {
				if (res.data) {
					// 쿠폰은 유효한데 대상 과목이 아닌 경우 사용할 수 없다.
					let couponCourseType = res.data.course_type;
					let invalidCart = cartResult.cart.filter(cart => couponCourseType.indexOf(cart.course.type) === -1);
					if (invalidCart.length !== 0) {
						alert("쿠폰을 사용할 수 있는 강좌 타입이 아닙니다.");
						return;
					}

					setCoupon(res.data);
					setCouponActivated(true);
				}
			})
			.catch(err => {
				console.error(err);
				if (err.status === 422) {
					alert("이미 사용한 쿠폰입니다.");
					return;
				}
				alert("유효한 쿠폰이 아닙니다.");
			});
	};

	const onCheckCartResult = (userId, cartId, checked) => {
		let ignoreItems = [];
		let hasMyCartChecked = false;
		let updatedCarts = cartResult.cart.map(cartItem => {
			if (cartItem.user_id == userId && cartItem.id == cartId) {
				cartItem.selected = checked;
			}
			if (cartItem.selected) {
				hasMyCartChecked = true;
			} else {
				ignoreItems.push({ user_id: cartItem.user_id, cart_id: cartItem.id });
			}
			return cartItem;
		});
		let hasChildCartChecked = false;
		let updatedChildren = cartResult.children.map(child => {
			let childCart = child.cart.map(childCartItem => {
				if (childCartItem.user_id == userId && childCartItem.id == cartId) {
					childCartItem.selected = checked;
				}
				if (childCartItem.selected) {
					hasChildCartChecked = true;
				} else {
					ignoreItems.push({ user_id: childCartItem.user_id, cart_id: childCartItem.id });
				}
				return childCartItem;
			});
			return { ...child, cart: childCart };
		});
		setCartResult({ ...cartResult, cart: updatedCarts, children: updatedChildren });
		setHasCheckedCartItem(hasMyCartChecked || hasChildCartChecked);
		setIgnoreCartItems(ignoreItems);
	};

	return {
		cartResult,
		paymentResult,
		totalPrice,
		totalDiscountPrice,
		paymentPrice,
		hasCart,
		paymentCourseInfo,
		coupon,
		couponActivated,
		checkCoupon,
		onCheckCartResult,
		hasCheckedCartItem,
		ignoreCartItems
	};
};

export default usePaymentHandler;
