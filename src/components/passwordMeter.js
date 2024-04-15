import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import PasswordStrengthMeter from 'react-native-password-strength-meter';

const PasswordStrengthMeter = ({password}) => {
  //   const [password, setPassword] = useState('');

  //   const handlePasswordChange = (text) => {
  //     setPassword(text);
  //   };

  return (
    <View style={styles.container}>
      <PasswordStrengthMeter
        secureTextEntry
        minLength={8}
        maxLength={20}
        password={password}
        onChange={password}
        strengthLevels={[
          {
            label: 'Weak',
            labelColor: '#FF0000',
            activeBarColor: '#FF0000',
          },
          {
            label: 'Fair',
            labelColor: '#FFA500',
            activeBarColor: '#FFA500',
          },
          {
            label: 'Good',
            labelColor: '#FFD700',
            activeBarColor: '#FFD700',
          },
          {
            label: 'Strong',
            labelColor: '#00FF00',
            activeBarColor: '#00FF00',
          },
        ]}
        showPasswordToggle
        showLabels
        labelVisible
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
});

export default PasswordStrengthMeterExample;
