import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {services} from '../../utills/service';
import auth from '@react-native-firebase/auth';

const UserHome = ({navigation}) => {
  const [loading, setLoading] = useState(false); // Set loading to true on component mount
  const [categoryList, setCategoryList] = useState([
    {
      id: '1',
      title: 'Smart Tv',
      value: 'smarttv',
      img: require('../../assets/images/smarttv.png'),
    },
    {
      id: '2',
      title: 'Line Problem',
      value: 'lineproblem',
      img: require('../../assets/images/lineProblem.png'),
    },
    {
      id: '3',
      title: 'Broadband',
      value: 'broadband',
      img: require('../../assets/images/broadband.png'),
    },
    {
      id: '4',
      title: 'DataMiss Match',
      value: 'datamissmatch',
      img: require('../../assets/images/datamissmatch.png'),
    },
    {
      id: '5',
      title: 'Fast Path',
      value: 'fastpath',
      img: require('../../assets/images/fastpath.png'),
    },
  ]); // Initial empty array of users

  //   useEffect(() => {
  //     const subscriber = firestore()
  //       .collection('Categories')
  //       .onSnapshot(
  //         querySnapshot => {
  //           if (querySnapshot) {
  //             const usersData = [];

  //             querySnapshot.forEach(documentSnapshot => {
  //               usersData.push({
  //                 ...documentSnapshot.data(),
  //                 key: documentSnapshot.id,
  //               });
  //             });

  //             setUsers(usersData);

  //             console.log(users);
  //             setLoading(false);
  //           } else {
  //             console.log('No data available');
  //             setUsers([]);
  //             console.log(users);
  //             setLoading(false);
  //           }
  //         },
  //         error => {
  //           console.error(error);
  //           setLoading(false);
  //         },
  //       );

  //     return () => subscriber();
  //   }, []);

  const [email, setEmail] = useState('');
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail('');
      }
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  const fetchDetails = (email, category, value) => {
    console.log(category, email);
    services
      .checkExistingComplaint(category, email)
      .then(existing => {
        if (!existing) {
          navigation.navigate('AddComplaint', {
            category: category,
            email: email,
          });
        } else {
          alert('you already post a complaint of same complaint.');
        }
      })
      .catch(err => {
        console.log('Error check complaint:', err);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={categoryList}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.listBox}
            onPress={() => {
              fetchDetails(email, item.title, item.value);
            }}>
            <Image style={styles.itemImage} source={item.img} />
            <Text style={styles.itemText}>{item.title}</Text>
            <Image
              style={styles.arrowImage}
              source={require('../../assets/images/doubleRight.png')}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C23',
    alignItems: 'center',
  },
  listBox: {
    height: 170,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#26262F',
    marginVertical: 5,
    marginHorizontal: 5,
    width: 160,
    borderRadius: 20,
    paddingTop: 20,
  },
  itemImage: {
    width: 75,
    height: 77,
    borderRadius: 20,
  },
  itemText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  arrowImage: {
    height: 20,
    width: 20,
    position: 'absolute',
    right: 10,
    bottom: 15,
  },
});
export default UserHome;
