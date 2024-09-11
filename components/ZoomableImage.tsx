import React from 'react';
import { Modal, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ZoomableImage = ({ imageUrl }) => {
  return (
    <Modal visible={true} transparent={true}>
      <ImageViewer imageUrls={[{ url: imageUrl }]} />
    </Modal>
  );
};

export default ZoomableImage;
