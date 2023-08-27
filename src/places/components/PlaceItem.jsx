import { useState, Fragment, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";

const PlaceItem = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const history = useHistory();

	const auth = useContext(AuthContext);

	const [showMap, setShowMap] = useState(false);

	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const MapHandler = (event) => {
		event.preventDefault();
		setShowMap(!showMap);
	};

	const DeleteWarningHandler = (event) => {
		event.preventDefault();
		setShowConfirmModal(!showConfirmModal);
	};

	const ConfirmDeleteHandler = async (event) => {
		event.preventDefault();
		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/api/places/${props._id}`,
				"DELETE",
				JSON.stringify({
					creator: auth.userId,
				}),
				{
					"Content-Type": "application/json",
					Authorization: "Bearer " + auth.token,
				},
			);
			// props.onDelete();
		} catch (error) {
			console.log(error);
		}
		history.push("/");
	};

	return (
		<Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			{/* {showMap ? ( */}
			<Modal
				show={showMap}
				onCancel={MapHandler}
				header={props.address}
				contentClass="place-item__model-content"
				footerClass="place-item__model-actions"
				footer={<Button onClick={MapHandler}>Close</Button>}>
				<div className="map-container">
					<MapContainer
						center={[props.coordinates.lat, props.coordinates.lng]}
						zoom={15}
						scrollWheelZoom={false}>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						/>
					</MapContainer>
				</div>
			</Modal>
			{/* ) : null} */}
			<Modal
				show={showConfirmModal}
				onCancel={DeleteWarningHandler}
				header={"Are you sure?"}
				contentClass="place-item__model-content"
				footerClass="place-item__model-actions"
				footer={
					<Fragment>
						<Button
							inverse
							onClick={DeleteWarningHandler}>
							CANCEL
						</Button>
						<Button
							danger
							onClick={ConfirmDeleteHandler}>
							DELETE
						</Button>
					</Fragment>
				}>
				<p>
					Do you want to proceed and delete this place? PLease note
					that it can't be undone thereafter
				</p>
			</Modal>
			<li className="place-item">
				<Card className="place-item__content">
					{isLoading ? <LoadingSpinner asOverlay /> : null}
					<div className="place-item__image">
						<img
							src={props.image}
							alt={props.title}
						/>
					</div>
					<div className="place-item__info">
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className="place-item__actions">
						<Button
							inverse
							onClick={MapHandler}>
							VIEW ON MAP
						</Button>
						{auth.userId === props.creatorId ? (
							<Button to={`/places/${props._id}`}>EDIT</Button>
						) : null}
						{auth.userId === props.creatorId ? (
							<Button
								danger
								onClick={DeleteWarningHandler}>
								DELETE
							</Button>
						) : null}
					</div>
				</Card>
			</li>
		</Fragment>
	);
};

export default PlaceItem;
