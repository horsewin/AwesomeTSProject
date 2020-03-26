import React from 'react';
import messaging from '@react-native-firebase/messaging';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

interface IState {
  loading: boolean;
  fcmToken: string;
  token: string;
}

const sleep = (msec: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};

export default class Settings extends React.Component<{}, IState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = {
      loading: false,
      fcmToken: '',
      token: '',
    };
  }
  public async componentDidMount(): Promise<void> {
    await messaging().registerForRemoteNotifications();
    await this.requestPermission();

    const fcmToken = await messaging().getToken();
    const token = await messaging().getAPNSToken();

    this.setState({loading: true, fcmToken, token: token || 'null'});
  }

  private requestPermission = async () => {
    const granted = await messaging().requestPermission();

    if (granted) {
      console.log('User granted messaging permissions!');
    } else {
      console.log('User declined messaging permissions :(');
    }
  };

  public render() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Data status</Text>
        <Text style={styles.sectionDescription}>
          {this.state.loading ? 'Load!!' : 'loading...'}
        </Text>
        <View style={{marginBottom: 20}} />

        <Text style={styles.sectionTitle}>FCM token</Text>
        <Text style={styles.sectionDescription}>
          {this.state.loading ? this.state.fcmToken : 'loading...'}
        </Text>
        <View style={{marginBottom: 20}} />

        <Text style={styles.sectionTitle}>APNs token</Text>
        <Text style={styles.sectionDescription}>
          {this.state.loading ? this.state.token : 'loading...'}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
