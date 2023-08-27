import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

import "./PlaceList.css";

const PlaceList = (props) => {
	if (props.items.places.length === 0) {
		return (
			<div className="place-list center">
				<Card>
					<h2>No places found. Maybe create one?</h2>
					<Button to="/places/new">Share Place</Button>
				</Card>
			</div>
		);
	}

	return (
		<ul className="place-list">
			{props.items.places.map((place) => {
				return (
					<PlaceItem
						key={place._id}
						_id={place._id}
						image={place.image}
						title={place.title}
						description={place.description}
						address={place.address}
						creatorId={place.user}
						coordinates={place.location}
						// onDelete={props.onDeletePlace}
					/>
				);
			})}
		</ul>
	);
};

export default PlaceList;
