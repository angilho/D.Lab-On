import React from "react";
import UserCartItem from "../../cart/components/UserCartItem";

const UserPaymentList = ({ paymentResult }) => {
	return (
		<React.Fragment>
			{paymentResult.payment_item && paymentResult.payment_item.length > 0 && (
				<UserCartItem
					userId={paymentResult.id}
					userPhone={paymentResult.phone}
					userName={paymentResult.name}
					userBirthday={paymentResult.birthday}
					isChild={false}
					cartList={paymentResult.payment_item}
				/>
			)}

			{paymentResult.children &&
				paymentResult.children.map((child, idx) => {
					if (child.payment_item && child.payment_item.length > 0) {
						return (
							<UserCartItem
								key={idx}
								userId={child.user_info.id}
								userPhone={child.user_info.phone}
								userName={child.user_info.name}
								userBirthday={child.user_info.birthday}
								isChild={true}
								cartList={child.payment_item}
							/>
						);
					}
				})}
		</React.Fragment>
	);
};

export default UserPaymentList;
