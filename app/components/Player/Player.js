import React, {Component} from 'react';
import styled from 'styled-components'
import { Platform, StyleSheet, ScrollView, Text, View, Button} from 'react-native';
import Slider from 'react-native-slider';
import { Header, Icon, Divider } from 'react-native-elements'
import YouTube from 'react-native-youtube'
import Video from 'react-native-video';
// import { PaymentRequest } from 'react-native-payments'
import ToastExample from '../Toast';
import SeekBar from './SeekBar';
import SubTitle from './SubTitle';

const Container = styled.View`
  flex: 1;
  width: 100%;
`
const Title = styled.Text`
  text-align: center;
  font-weight: bold;
`
const Control = styled.View`
  background-color: white;
  padding: 8px 16px;
`
const IconButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 200px;
  margin: auto;
`
const IconButton = styled.TouchableOpacity`
  padding: 8px;
`

// https://firebasestorage.googleapis.com/v0/b/ediket-api.appspot.com/o/development%2FwhoWasIt.mp3?alt=media&token=6e49b09e-3fba-4276-82df-c734eb669455
export default class Player extends Component {
  constructor(props) {
    super(props);
    this.video = React.createRef();
    this.youtube = React.createRef();
    this.flatList = React.createRef();
  }

  state = {
    value: 0.2,
    paused: false,
    totalLength: 1,
    currentPosition: 0,
  };

  // componentDidMount() {

  // }

  componentWillUnmount() {
    if (Platform.OS === 'ios') return;
    this.stopLoop();
  }

  startLoop() {
    if( !this._frameId ) {
      this._frameId = requestAnimationFrame( this.loop );
    }
  }

  loop = async () => {
    await this.updateTime();

    // Set up next iteration of the loop
    this.frameId = requestAnimationFrame( this.loop )
  }

  stopLoop() {
    cancelAnimationFrame( this._frameId );
  }

  setDuration(data) {
    this.setState({ totalLength: Math.floor(data.duration) });
  }

  setTime(data) {
    this.setState({ currentPosition: data.currentTime });
  }

  seek(time) {
    time = Math.round(time);
    this.video.current && this.video.current.seek(time);
    this.youtube.current && this.youtube.current.seekTo(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  handleReady = (e) => {
    if (Platform.OS === 'ios') return;
    this.startLoop();
  }

  handleClickSubTitle = (startMsTime) => {
    const time = startMsTime / 1000;
    this.video.current && this.video.current.seek(time);
    this.youtube.current && this.youtube.current.seekTo(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  videoError(e) {
    // console.log(e)
  }

  onBuffer(e) {
    // console.log('onBuffer', e)
  }

  handleProgress = (e) => this.setState({
    currentPosition: e.currentTime,
    totalLength: Math.floor(e.duration)
  });

  updateTime = async () => {
    // console.log('handleChangeState')
    if (Platform.OS === 'ios') return;
    try {
      const duration = this.youtube.current && await this.youtube.current.duration();
      const currentTime = this.youtube.current && await this.youtube.current.currentTime();
      this.setState({
        currentPosition: currentTime,
        totalLength: Math.floor(duration)
      })
    } catch(e) {

    }
  }

  handleClickPayment = () => {
    // const METHOD_DATA = [{
    //   supportedMethods: ['android-pay'],
    //   data: {
    //     supportedNetworks: ['visa', 'mastercard', 'amex'],
    //     currencyCode: 'KRW',
    //     environment: 'TEST', // defaults to production
    //     paymentMethodTokenizationParameters: {
    //       tokenizationType: 'NETWORK_TOKEN',
    //       parameters: {
    //         publicKey: 'your-pubic-key'
    //       }
    //     }
    //   }
    // }];
    // const DETAILS = {
    //   id: 'basic-example',
    //   displayItems: [
    //     {
    //       label: 'Movie Ticket',
    //       amount: { currency: 'KRW', value: '15000' }
    //     }
    //   ],
    //   total: {
    //     label: 'Merchant Name',
    //     amount: { currency: 'KRW', value: '15000' }
    //   }
    // };
    // console.log('handleClickPayment')
    // try {
    //   const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    //   paymentRequest.show();
    // } catch (error) {
    //   console.log('error', error)
    // }
  }

  render() {
    const { paused, totalLength, currentPosition } = this.state;
    return (
      <Container>
        <Header
          backgroundColor="#ff784e"
          // statusBarProps={{ barStyle: 'light-content' }}
          // leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Audio Test' }}
          rightComponent={
            <Button
              onPress={this.handleClickPayment}
              title="Press Me"
            />
          }
//           import { NativeModules } from 'react-native';
// module.exports = NativeModules.ToastExample;
        />
        <YouTube
          ref={this.youtube}
          apiKey="AIzaSyDVLf-bmIBzAYgaJAZPmNkqUQyOMmwPNqM"
          videoId="2PjZAeiU7uM"   // The YouTube video ID
          play={!paused}             // control playback of video with true/false
          // fullscreen={true}       // control whether the video should play in fullscreen or inline
          loop={true}             // control whether the video should loop when ended
          controls={0}
          onReady={this.handleReady}
          // onChangeState={e => this.setState({ status: e.state, currentTime: e.currentTime })}
          onProgress={this.handleProgress}
          // onChangeState={this.handleChangeState}
          // onChangeState={e => this.setState({ status: e.state })}
          // onChangeQuality={e => this.setState({ quality: e.quality })}
          // onError={e => console.log(e.error)}
          showinfo={false}
          style={{ alignSelf: 'stretch', height: 200 }}
        />
        {/* <Video
          // source={{uri: 'https://firebasestorage.googleapis.com/v0/b/ediket-api.appspot.com/o/development%2Ftest5.mp3?alt=media&token=a11e3b70-778a-427c-9757-8f08aa052a88' }}
          source={{uri: 'https://firebasestorage.googleapis.com/v0/b/ediket-api.appspot.com/o/development%2Ftest1.mp4?alt=media&token=47c7fa28-eb56-4ea0-a711-af6fda0ddc94' }}
          ref={this.video}
          onBuffer={this.onBuffer}                // Callback when remote video is buffering
          onLoad={this.setDuration.bind(this)}    // Callback when video loads
          onProgress={this.setTime.bind(this)}
          style={styles.audioElement}
          paused={paused}
          onError={this.videoError}
          repeat
          // audioOnly
          playInBackground
        /> */}

        <SubTitle
          currentPosition={currentPosition}
          onClickSubTitle={this.handleClickSubTitle}
          flatListRef={this.flatList}
        />
        <Divider />
        <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={totalLength}
          // onSlidingStart={() => this.setState({paused: true})}
          currentPosition={currentPosition}
        />
        <Divider />
        <Control>
          <IconButtonWrapper>
            {
              paused ?
              <IconButton onPress={() => this.setState({ paused: false })}>
                <Icon name="play-arrow" size={32} />
              </IconButton>
              :
              <IconButton onPress={() => this.setState({ paused: true })}>
                <Icon name="pause" size={32} />
              </IconButton>
            }
          </IconButtonWrapper>
        </Control>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  audioElement: {
    height: 200,
  }
})