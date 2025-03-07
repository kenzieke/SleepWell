import { getDefaultConfig } from '@expo/metro-config';

const defaultConfig = getDefaultConfig(__dirname);

// Ensure that assetExts includes necessary file types
defaultConfig.resolver.assetExts = [...defaultConfig.resolver.assetExts, 'cjs', 'svg'];

export default defaultConfig;
