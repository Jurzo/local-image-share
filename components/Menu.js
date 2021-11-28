import React, { useState } from "react";
import Uploader from './Uploader';
import ImageSelector from './ImageSelector';


export default function Menu({ storageHandler, location, updateCallback }) {
  const [image, setImage] = useState(null);

  return (
    image ?
      <Uploader
        imageURI={image}
        setImage={setImage}
        storageHandler={storageHandler}
        location={location}
        callback={updateCallback}
      /> :
      <ImageSelector
        setImage={setImage}
      />
  );
}