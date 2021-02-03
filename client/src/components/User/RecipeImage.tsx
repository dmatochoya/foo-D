import React from 'react';
import { Image, View } from 'react-native';

export default function RecipeImage({ route: { params: { image } } }
  : {route: {params: {image: string}}}) {
  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={{ uri: image }}
        style={{ width: undefined, height: '100%', aspectRatio: 1 }}
      />
    </View>
  );
}
