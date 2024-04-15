import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {services} from '../utills/service';
import * as Progress from 'react-native-progress';
const History = ({navigation}) => {
  const [status, setStatus] = useState('');
  const [complaintList, setComplaintList] = useState([]);
  // const [totalComplaint, setTotalComplaint] = useState([]);
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const [totalComplaint, setTotalComplaint] = useState(0); // Change initial state to a number

  const [categoryList, setCategoryList] = useState([
    {
      id: '1',
      title: 'Smart Tv',
      value: 'smarttv',
      img: require('../assets/images/smarttv.png'),
      totalComplaints: '114',
      solvedComplaints: '90',
      unsolvedComplaints: '24',
    },
    {
      id: '2',
      title: 'Line Problem',
      value: 'lineproblem',
      img: require('../assets/images/lineProblem.png'),
      totalComplaints: '114',
      solvedComplaints: '90',
      unsolvedComplaints: '24',
    },
    {
      id: '3',
      title: 'Broadband',
      value: 'broadband',
      img: require('../assets/images/broadband.png'),
      totalComplaints: '114',
      solvedComplaints: '90',
      unsolvedComplaints: '24',
    },
    {
      id: '4',
      title: 'DataMiss Match',
      value: 'datamissmatch',
      img: require('../assets/images/datamissmatch.png'),
      totalComplaints: '114',
      solvedComplaints: '90',
      unsolvedComplaints: '24',
    },
    {
      id: '5',
      title: 'Fast Path',
      value: 'fastpath',
      img: require('../assets/images/fastpath.png'),
      totalComplaints: '114',
      solvedComplaints: '90',
      unsolvedComplaints: '24',
    },
  ]);

  // const fetchComplaints = () => {
  //   services
  //     .getNewComplaints()
  //     .then(querySnapshot => {
  //       const complaintsList = [];
  //       const statusCounts = {
  //         pending: 0,
  //         approve: 0,
  //         inprocess: 0,
  //         complete: 0,
  //       };

  //       querySnapshot.forEach(documentSnapshot => {
  //         const data = documentSnapshot.data();
  //         complaintsList.push({
  //           id: documentSnapshot.id,
  //           data: data,
  //         });

  //         // Increment status count
  //         statusCounts[data.status]++;
  //       });

  //       // Calculate total complaint count
  //       let totalComplaints = 0;
  //       let solvedComplaints = 0;
  //       complaintsList.forEach(complaint => {
  //         totalComplaints++;
  //         if (complaint.data.status === 'complete') {
  //           solvedComplaints++;
  //         }
  //       });

  //       setComplaintList(complaintsList);
  //       setTotalComplaint(totalComplaints);

  //       setComplaintList(complaintsList);
  //       setTotalComplaint(totalComplaints);
  //       // Update category list with counts
  //       setCategoryList(prevCategoryList => {
  //         return prevCategoryList.map(category => {
  //           const categoryComplaints = complaintsList.filter(
  //             complaint => complaint.data.category === category.title,
  //           );

  //           // Count solved and unsolved complaints for this category
  //           let solvedComplaints = 0;
  //           let unsolvedComplaints = 0;
  //           categoryComplaints.forEach(complaint => {
  //             if (complaint.data.status === 'complete') {
  //               solvedComplaints++;
  //             } else {
  //               unsolvedComplaints++;
  //             }
  //           });

  //           return {
  //             ...category,
  //             totalComplaints: categoryComplaints.length,
  //             solvedComplaints: solvedComplaints,
  //             unsolvedComplaints: unsolvedComplaints,
  //           };
  //         });
  //       });
  //     })
  //     .catch(err => {
  //       console.log('Error new fetching complaints>>>>:', err);
  //     });
  // };

  const fetchComplaints = () => {
    services
      .getNewComplaints()
      .then(querySnapshot => {
        const complaintsList = [];
        const statusCounts = {
          pending: 0,
          approve: 0,
          inprocess: 0,
          complete: 0,
        };

        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          complaintsList.push({
            id: documentSnapshot.id,
            data: data,
          });

          // Increment status count
          statusCounts[data.status]++;
        });

        // Calculate total complaint count
        let totalComplaints = complaintsList.length;
        let solvedComplaints = statusCounts.complete;
        let unsolvedComplaints = totalComplaints - solvedComplaints;
        // console.log('unSolved<<<>>>', unsolvedComplaints);
        setComplaintList(complaintsList);
        setTotalComplaint(totalComplaints);

        // setComplaintList(complaintsList);
        // setTotalComplaint(totalComplaints);
        // Update category list with counts
        setCategoryList(prevCategoryList => {
          return prevCategoryList.map(category => {
            const categoryCount = complaintsList.filter(
              complaint => complaint.data.category === category.title,
            ).length;
            // console.log('unSolved<<<>>>', categoryCount);
            let categorySolvedComplaints = complaintsList.filter(
              complaint =>
                complaint.data.category === category.title &&
                complaint.data.status === 'complete',
            ).length;

            // Calculate average of solved and unsolved complaints
            let averageSolved =
              (categorySolvedComplaints / totalComplaints) * 100;
            let averageUnsolved =
              ((categoryCount - categorySolvedComplaints) / totalComplaints) *
              100;
            // console.log(averageUnsolved, averageSolved);
            return {
              ...category,
              totalComplaints: categoryCount,
              solvedComplaints: categorySolvedComplaints,
              unsolvedComplaints: categoryCount - categorySolvedComplaints,
              averageSolved: averageSolved,
              averageUnsolved: averageUnsolved,
            };
          });
        });
      })
      .catch(err => {
        console.log('Error new fetching complaints>>>>:', err);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, [complaintList]);

  const getStatusCounts = () => {
    const statusCounts = {
      pending: 0,
      approve: 0,
      inprocess: 0,
      complete: 0,
    };

    complaintList.forEach(item => {
      statusCounts[item.data.status]++;
    });

    return statusCounts;
  };

  const calculateAverageFill = () => {
    const statusCounts = getStatusCounts();
    const totalComplaints = complaintList.length;
    let totalProgress = 0;

    Object.keys(statusCounts).forEach(status => {
      const statusPercentage = statusCounts[status] / totalComplaints;
      switch (status) {
        case 'pending':
          totalProgress += statusPercentage * 25;
          break;
        case 'approve':
          totalProgress += statusPercentage * 50;
          break;
        case 'inprocess':
          totalProgress += statusPercentage * 75;
          break;
        case 'complete':
          totalProgress += statusPercentage * 100;
          break;
        default:
          break;
      }
    });

    return totalProgress;
  };

  const getLineCapColor = averageFill => {
    if (averageFill < 25) {
      return '#FF6347';
    } else if (averageFill < 50) {
      return '#FFD700';
    } else if (averageFill < 75) {
      return '#00FF00';
    } else {
      return '#AD7BFF';
    }
  };
  const getFill = averageFill => {
    // console.log(averageFill);
    if (averageFill < 0.25) {
      return '#FF6347';
    } else if (averageFill < 0.5) {
      return '#FFD700';
    } else if (averageFill < 0.75) {
      return '#00FF00';
    } else {
      return '#AD7BFF';
    }
  };
  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
    // getCategoryValue();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      // scrollEnabled={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']}
          tintColor={'#2196F3'}
        />
      }>
      <View style={styles.container}>
        <Text style={styles.txtLabel}>Complaint Track</Text>

        <AnimatedCircularProgress
          key={animationKey}
          size={200}
          width={11}
          style={{marginTop: 15}}
          fill={calculateAverageFill() || 1}
          tintColor={getLineCapColor(calculateAverageFill())}
          backgroundColor="#3d5875"
          lineCap="round"
          rotation={-90}
          lineCapColor={getLineCapColor(calculateAverageFill())}>
          {() => (
            <>
              <Text style={styles.txtLabel}>
                {parseInt(calculateAverageFill())}%
              </Text>
              <Text style={styles.txtLabel}>
                Total {totalComplaint} complaints
              </Text>
            </>
          )}
        </AnimatedCircularProgress>

        {categoryList.map((item, index) => (
          <View style={styles.listBox} key={index}>
            <View style={styles.listInnerBox}>
              <Image style={styles.imageBox} source={item.img} />
              <View style={styles.listTxtBox}>
                <Text style={[styles.txtLable, {flex: 1, marginStart: 15}]}>
                  {item.title}
                </Text>
                <Text style={[styles.txtLable, {flex: 1, marginStart: 15}]}>
                  {item.unsolvedComplaints} left to solve
                </Text>
              </View>
              <View style={styles.countTextContainer}>
                <Text style={styles.txtLableCount}>{item.totalComplaints}</Text>
                <Text style={styles.txtLableCount}>
                  {item.solvedComplaints}
                </Text>
                <Text style={styles.txtLableCount}>solved</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.progressContainer}>
                <Progress.Bar
                  progress={item.solvedComplaints / item.totalComplaints || 0}
                  height={2}
                  color={getFill(
                    item.solvedComplaints / item.totalComplaints || 0,
                  )}
                  animationType="timing"
                  width={null} // Set width to null to take full width of parent
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C23',
    alignItems: 'center',
    paddingTop: 50,
  },
  txtLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  trackMeterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInnerBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: '#1C1C23',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%',
  },
  listBox: {
    width: '90%',
    height: 100,
    flexDirection: 'column',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#83839C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 10,
    alignSelf: 'center',
    paddingVertical: 15,
    paddingTop: 20,
  },
  listInnerBox: {
    height: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 5,
  },
  listTxtBox: {flexDirection: 'column', flex: 1},
  txtLable: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtLableCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 2,
    backgroundColor: '#83839C',
    marginRight: 10,
  },
  countTextContainer: {
    flexDirection: 'column',
    fontSize: 12,
    color: '#fff',
    width: 55,
  },
  imageBox: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    tintColor: '#FF7966',
  },
});

export default History;
