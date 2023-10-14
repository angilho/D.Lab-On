import React from "react";
import UserCartItem from "./UserCartItem";

const UserCartForm = ({ cartResult, onClickDeleteItem, onClickCheckItem }) => {
	return (
		<React.Fragment>
			{/**사용자의 카트 아이템 보여주기 */}
			{cartResult.cart && cartResult.cart.length > 0 && (
				<UserCartItem
					userId={cartResult.id}
					userPhone={cartResult.phone}
					userName={cartResult.name}
					userBirthday={cartResult.birthday}
					isChild={false}
					gender={cartResult.gender}
					cartList={cartResult.cart}
					onClickDeleteItem={onClickDeleteItem}
					onClickCheckItem={onClickCheckItem}
				/>
			)}

			{cartResult &&
				cartResult.children &&
				cartResult.children.map((child, idx) => {
					if (child.cart.length === 0) return;

					return (
						<UserCartItem
							key={idx}
							userId={child.user_info.id}
							userPhone={child.user_info.phone}
							userName={child.user_info.name}
							userBirthday={child.user_info.birthday}
							gender={cartResult.gender}
							isChild={false}
							cartList={child.cart}
							onClickDeleteItem={onClickDeleteItem}
							onClickCheckItem={onClickCheckItem}
						/>
					);
				})}
		</React.Fragment>
	);
};

export default UserCartForm;
