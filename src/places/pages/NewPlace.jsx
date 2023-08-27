import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Fragment, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceForm.css";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler] = useForm(
		{
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "",
				isValid: false,
			},
			address: {
				value: "",
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false,
	);

	const history = useHistory();

	const placeSubmitHandler = async (event) => {
		event.preventDefault();

		const form_data = {
			title: formState.inputs.title.value,
			description: formState.inputs.description.value,
			address: formState.inputs.address.value,
			creator: auth.userId,
		};

		if (formState.inputs.image.value) {
			form_data.image_base64 = formState.inputs.image.value;
		}

		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/api/places`,
				"POST",
				JSON.stringify(form_data),
				{
					"Content-Type": "application/json",
					Authorization: "Bearer " + auth.token,
				},
			);

			history.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			<form
				className="place-form"
				onSubmit={placeSubmitHandler}>
				{isLoading ? <LoadingSpinner /> : null}
				<Input
					id="title"
					element="input"
					type="text"
					label="Title"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid title."
					onInput={inputHandler}
				/>
				<Input
					id="description"
					element="textarea"
					label="Description"
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter a valid description (at least 5 characters)."
					onInput={inputHandler}
				/>
				<Input
					id="address"
					element="input"
					label="Address"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a valid address."
					onInput={inputHandler}
				/>
				<ImageUpload
					center
					id="image"
					onInput={inputHandler}
					errorText="Please provide an image"
				/>
				<Button
					type="submit"
					disabled={!formState.isValid}>
					ADD PLACE
				</Button>
			</form>
		</Fragment>
	);
};

export default NewPlace;
