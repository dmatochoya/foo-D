import React from 'react';
import { Image, View } from 'react-native';

interface ImageInterface {
    uri: string
    width: number
    height: number
}

export default function RecipeImage({ route: { params: { image } } }
  : {route: {params: {image: ImageInterface}}}) {
  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={{ uri: image }}
        style={{ width: undefined, height: '100%', aspectRatio: 1 }}
      />
    </View>
  );
}
