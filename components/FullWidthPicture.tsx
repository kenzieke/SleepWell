import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';

interface FullWidthPictureProps {
  uri: string;
}

const FullWidthPicture: React.FC<FullWidthPictureProps> = ({ uri }) => {
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    if (uri) {
      Image.getSize(uri, (width, height) => {
        setRatio(width / height);
      }, (error) => console.error(`Could not get the size of the image: ${error}`));
    }
  }, [uri]);

  return (
    <Image
      style={{ width: '100%', height: undefined, aspectRatio: ratio }}
      resizeMode="contain"
      source={{ uri }}
    />
  );
};

export default FullWidthPicture;
