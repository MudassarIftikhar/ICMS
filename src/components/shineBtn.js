import React, {useRef, useState} from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';

const ShineButton = ({label, onPress}) => {
  const [shineAnim] = useState(new Animated.Value(0));

  const shine = () => {
    Animated.timing(shineAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      shineAnim.setValue(0);
    });
  };

  const shineEffect = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      'rgba(255, 255, 255, 0)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(255, 255, 255, 0)',
    ],
  });

  const handlePress = () => {
    shine();
    onPress();
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
      <Animated.View
        style={[styles.buttonShine, {backgroundColor: shineEffect}]}
      />
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 1,
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: -200,
    width: 400,
    height: 50,
    zIndex: 0,
  },
});

export default ShineButton;
