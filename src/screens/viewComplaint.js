import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {services} from '../utills/service';
import * as Progress from 'react-native-progress';
import {useFocusEffect} from '@react-navigation/native';
import sendNotification from '../utills/sendNotification';
import {useToken} from '../context/deviceToken.context';

const ViewComplaint = ({navigation, route}) => {
  const {data, type} = route.params;
  const {_token} = useToken();
  const [isLoading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState();
  const [status, setStatus] = useState(data.status);
  console.log(' data.complaint_ID', data.complaint_ID, data.status);

  useEffect(() => {
    if (type == 'UnSolved') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [type]);
  useEffect(() => {
    // Set isDisabled to true if the status is pending
    if (status === 'pending') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [status]);
  const handleApproved = (text, token) => {
    setLoading(true);
    services.updateStaus(data.complaint_ID, text).then(
      () => {
        alert('Successfully Updated Status..!');
        sendNotification(
          token,
          `your complaint ${text} by the administrator.`,
          `Complaint ${text}`,
        );
        setStatus(text);
        setLoading(false);
      },

      // navigation.goBack()
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.indicatorContainer}>
          <Progress.CircleSnail color={['#FFA699', '#AD7BFF', '#7DFFEE']} />
        </View>
      ) : (
        <View style={styles.container2}>
          {data ? (
            <View style={styles.infoConatainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.txtHeading}>Name</Text>
                <Text style={styles.txtInput}>{data.name}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.txtHeading}>Title</Text>
                <Text style={styles.txtInput}>{data.title}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.txtHeading}>Description</Text>
                <Text style={styles.txtInput}>{data.description}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.txtHeading}>Category</Text>
                <Text style={styles.txtInput}>{data.category}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.txtHeading}>Phone no#</Text>
                <Text style={styles.txtInput}>{data.phoneno}</Text>
              </View>
            </View>
          ) : (
            ''
          )}
          {isEnabled ? (
            <>
              <TouchableOpacity
                style={styles.btnContainer}
                disabled={isDisabled}
                onPress={() => handleApproved('approve', data.token)}>
                <Text
                  style={[
                    styles.buttonLabel,
                    {color: isDisabled ? 'gray' : '#fff'},
                  ]}>
                  Approve
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.adminBtnContainer}
                disabled={isDisabled}
                onPress={() => handleApproved('reject', data.token)}>
                <Text
                  style={[
                    styles.buttonLabel,
                    {color: isDisabled ? 'gray' : '#fff'},
                  ]}>
                  Reject
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            ''
          )}
          {status === 'reject' && (
            <Text style={styles.statusText}>
              your complaint request is rejected by admin.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1C1C23'},
  container2: {flex: 1, alignItems: 'center'},
  infoConatainer: {
    backgroundColor: '#2A2A35',
    borderRadius: 8,
    width: '90%',
    flexDirection: 'column',
    paddingEnd: 5,
    marginVertical: 60,
    marginTop: 100,
    paddingVertical: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  txtHeading: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  txtInput: {
    color: '#A2A2B5',
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  btnContainer: {
    borderRadius: 30,
    width: '90%',
    height: 50,
    backgroundColor: '#FF7966',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
    marginHorizontal: 60,
  },
  adminBtnContainer: {
    borderRadius: 30,
    width: '90%',
    height: 50,
    backgroundColor: '#37353B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  adminButtonLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '400',
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  statusText: {
    color: 'red',
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 5,
  },
});
export default ViewComplaint;
