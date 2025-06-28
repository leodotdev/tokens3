import React, { useState, useMemo } from 'react';
import { Image as RNImage, View, Platform, ImageProps, ImageSourcePropType } from 'react-native';
import { FluentEmoji } from '../icons/FluentEmoji';
import { getStorageUrl } from '../../lib/storage';

interface WebImageProps extends ImageProps {
  fallbackIcon?: string;
  fallbackIconSize?: number;
  containerClassName?: string;
}

export const WebImage: React.FC<WebImageProps> = ({
  source,
  style,
  fallbackIcon = 'Package',
  fallbackIconSize = 40,
  containerClassName,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Process the source to ensure proper URL formatting
  const processedSource = useMemo(() => {
    if (!source || typeof source !== 'object' || !('uri' in source)) {
      return source;
    }

    const uri = getStorageUrl(source.uri);
    if (!uri) return null;

    return { ...source, uri };
  }, [source]);

  const handleError = (error: any) => {
    console.log('Image load error:', error);
    setHasError(true);
    onError?.(error);
  };

  // For web, add crossOrigin attribute
  const webProps = Platform.OS === 'web' ? { crossOrigin: 'anonymous' as any } : {};

  if (hasError || !processedSource) {
    return (
      <View style={style} className={`flex items-center justify-center ${containerClassName || ''}`}>
        <FluentEmoji name={fallbackIcon} size={fallbackIconSize} />
      </View>
    );
  }

  return (
    <RNImage
      source={processedSource}
      style={style}
      onError={handleError}
      {...webProps}
      {...props}
    />
  );
};