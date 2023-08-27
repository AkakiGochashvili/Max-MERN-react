import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
	const [loadedPlaces, setLoadedPlaces] = useState();

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const userId = useParams().userId;

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}`,
				);
				setLoadedPlaces(responseData);
			} catch (error) {
				console.log(error);
			}
		};
		fetchPlaces();
	}, [sendRequest, userId]);

	// const placeDeleteHandler = () => {
	// 	setLoadedPlaces(prevPlaces => prevPlaces.filter())
	// };

	return (
		<Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			{isLoading ? (
				<div className="center">
					<LoadingSpinner />
				</div>
			) : null}
			{!isLoading && loadedPlaces ? (
				<PlaceList
					items={loadedPlaces}
					// onDeletePlace={placeDeleteHandler}
				/>
			) : null}
		</Fragment>
	);
};

export default UserPlaces;
