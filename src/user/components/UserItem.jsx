import { Link } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Avatar from "../../shared/components/UIElements/Avatar";
import "./UserItem.css";

const UserItem = (props) => {
	return (
		<li className="user-item">
			<Card className="user-item__content">
				<Link to={`/${props.id}/places`}>
					<div className="user-item__image">
						<Avatar
							image={props.image}
							alt={props.alt}
						/>
					</div>
					<div className="user-item__info">
						<h2>{props.name}</h2>
						<h3>
							{props.placeCount}{" "}
							{props.placeVount === 1 ? "Place" : "Places"}
						</h3>
					</div>
				</Link>
			</Card>
		</li>
	);
};

export default UserItem;
