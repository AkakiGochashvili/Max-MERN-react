import { useRef, useState } from "react";
import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = (props) => {
	const [previewUrl, setPreviewUrl] = useState();

	const filePickerRef = useRef();

	const pickImageHandler = () => {
		filePickerRef.current.click();
	};

	const pickerHandler = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			setPreviewUrl(reader.result.toString());
			props.onInput(props.id, reader.result.toString(), true);
		};

		reader.readAsDataURL(file);
	};

	return (
		<div className="form-control">
			<input
				id={props.id}
				ref={filePickerRef}
				style={{ display: "none" }}
				type="file"
				accept=".jpg,.png,.jpeg"
				onChange={pickerHandler}
			/>
			<div className={`image-upload ${props.center && "center"}`}>
				<div className="image-upload__preview">
					{previewUrl ? (
						<img
							src={previewUrl}
							alt="Preview"
						/>
					) : null}
					{!previewUrl ? <p>Please pick an image.</p> : null}
				</div>
				<Button
					type="button"
					onClick={pickImageHandler}>
					PICK IMAGE
				</Button>
			</div>
		</div>
	);
};

export default ImageUpload;
