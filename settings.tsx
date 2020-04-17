import React from 'react';
import messaging from '@react-native-firebase/messaging';
//import analytics from '@react-native-firebase/analytics';
import {Alert, Button, Platform, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

interface IState {
  loading: boolean;
  isRegistered: boolean;
  hasPermission: boolean;
  fcmToken: string;
  token: string;
}

/**
 *
 */
export default class Settings extends React.Component<{}, IState> {
  /**
   *
   * @param props
   * @param state
   */
  constructor(props: any, state: any) {
    super(props, state);
    this.state = {
      loading: false,
      isRegistered: false,
      hasPermission: false,
      fcmToken: '',
      token: '',
    };
  }

  /**
   *
   * @returns {Promise<void>}
   */
  public async componentDidMount(): Promise<void> {
    const isRegistered = messaging().isRegisteredForRemoteNotifications;
    if (Platform.OS === 'ios' && !isRegistered) {
      await messaging().registerForRemoteNotifications();
    }

    const hasPermission = await messaging().hasPermission();
    if (!hasPermission) {
      await this.requestPermission();
    }

    const fcmToken = await messaging().getToken();
    const token = await messaging().getAPNSToken();

    this.setState({
      loading: true,
      fcmToken,
      token: token || 'null',
      hasPermission,
      isRegistered,
    });
  }

  private requestPermission = async () => {
    const granted = await messaging().requestPermission();

    if (granted) {
      Alert.alert('通知許可', '許可しました');
    } else {
      Alert.alert('通知許可', '拒否しました');
    }
  };

  public render() {
    return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data status</Text>
          <View style={{marginBottom: 20}}/>
          <Text style={styles.sectionTitle}>Request</Text>
          <Text style={styles.sectionDescription}>
            {`Register: ${this.state.isRegistered}
Permission: ${this.state.hasPermission}`}
          </Text>
          <View style={{marginBottom: 20}}/>

          <Text style={styles.sectionTitle}>FCM token</Text>
          <Text selectable={true} style={styles.sectionDescription}>
            {this.state.loading ? this.state.fcmToken : 'loading...'}
          </Text>
          <View style={{marginBottom: 20}}/>

          <Text style={styles.sectionTitle}>APNs token</Text>
          <Text selectable={true} style={styles.sectionDescription}>
            {this.state.loading ? this.state.token : 'loading...'}
          </Text>

          <Button
              title={'トークン取得'}
              onPress={async () => {
                try {
                  const fcmToken = await messaging().getToken();
                  const token = await messaging().getAPNSToken();

                  this.setState({loading: true, fcmToken, token: token || 'null'});
                } catch (e) {
                  Alert.alert('Error', e.message);
                  this.setState({loading: true, fcmToken: 'error', token: 'error'});
                }
              }}
          />

          <Button
              title={'registerForRemoteNotifications'}
              onPress={async () => {
                try {
                  await messaging().registerForRemoteNotifications();
                  const r = messaging().isRegisteredForRemoteNotifications;
                  this.setState({
                    isRegistered: r,
                  });
                  Alert.alert('INFO', `result is ${r}`);
                } catch (e) {
                  Alert.alert('Error', e.message);
                  this.setState({isRegistered: false});
                }
              }}
          />

          <Button
              title={'requestPermission'}
              onPress={async () => {
                try {
                  const result = await messaging().requestPermission();
                  this.setState({
                    hasPermission: result,
                  });
                  Alert.alert('INFO', `result is ${result}`);
                  const fcmToken = await messaging().getToken();
                  const token = await messaging().getAPNSToken();

                  this.setState({
                    fcmToken,
                    token: token || 'cannot get',
                  });
                } catch (e) {
                  Alert.alert('Error', e.message);
                  this.setState({hasPermission: false});
                }
              }}
          />

          {/*<Button*/}
          {/*  title="Add To Basket"*/}
          {/*  onPress={() =>*/}
          {/*    analytics().logEvent('basket', {*/}
          {/*      id: 3745092,*/}
          {/*      item: 'mens grey t-shirt',*/}
          {/*      description: ['round neck', 'long sleeved'],*/}
          {/*      size: 'L',*/}
          {/*    })*/}
          {/*  }*/}
          {/*/>*/}
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
