import React from 'react';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import PropTypes from 'prop-types';

interface ZoomableImageProps {
  imageUrl: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ imageUrl }) => {
  return (
    <Modal>
      <ImageViewer imageUrls={[{ url: imageUrl }]} />
    </Modal>
  );
};

ZoomableImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

export default ZoomableImage;
