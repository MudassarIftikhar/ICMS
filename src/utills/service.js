import firestore from '@react-native-firebase/firestore';

class Services {
  async getNewComplaints() {
    const complaints = await firestore().collection('NewComplaints').get();

    return complaints;
  }

  async getUnCompletedTask() {
    const complaints = await firestore()
      .collection('NewComplaints')
      .where('status', '!=', 'complete')
      .get();

    return complaints;
  }

  async getSingleComplaints(email) {
    const complaint = await firestore()
      .collection('NewComplaints')
      // Filter results
      .where('email', '==', email)
      .get();

    return complaint;
  }

  onResult(querySnapshot) {
    console.log('Got NewComplaints collection result:');
    querySnapshot.forEach(doc => {
      console.log(doc.size);
    });
  }

  onError(error) {
    console.error('Error getting NewComplaints collection:', error);
  }
  newComplaintID() {
    const comID = firestore()
      .collection('NewComplaints')
      .onSnapshot(this.onResult, this.onError);
    return comID;
  }

  async getSingleCategory(category) {
    const complaint = await firestore()
      .collection('NewComplaints')
      // Filter results
      .where('category', '==', category)
      .get();

    return complaint;
  }

  async getSolvedComplaints() {
    const complaint = await firestore()
      .collection('NewComplaints')
      // Filter results
      .where('status', '==', 'complete')
      .get();

    return complaint;
  }

  async updateStaus(complaintID, statusTxt) {
    const status = await firestore()
      .collection('NewComplaints')
      .doc('com' + complaintID)
      .update({
        status: statusTxt,
      });
  }
  async checkExistingComplaint(category, email) {
    // console.log(email);
    const complaint = await firestore()
      .collection('NewComplaints')
      .where('category', '==', category)
      .where('email', '==', email)
      .where('status', '!=', 'complete')
      .get();

    if (!complaint.empty) {
      // Existing complaint found
      return true;
    } else {
      // No existing complaint found
      return false;
    }
  }
}
export const services = new Services();
