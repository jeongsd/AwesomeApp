import React, {Component} from 'react';
import { Platform, StyleSheet, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import styled from 'styled-components'
import Slider from 'react-native-slider';
import { Header, Icon, Divider } from 'react-native-elements'
import Video from 'react-native-video';
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
    this.flatList = React.createRef();
  }

  state = {
    value: 0.2,
    paused: false,
    totalLength: 1,
    currentPosition: 0,
  };

  setDuration(data) {
    this.setState({totalLength: Math.floor(data.duration)});
  }

  setTime(data) {
    this.setState({currentPosition: data.currentTime });
  }

  seek(time) {
    time = Math.round(time);
    this.video.current && this.video.current.seek(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  handleClickSubTitle = (startMsTime) => {
    const time = startMsTime / 1000;
    this.video.current && this.video.current.seek(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  videoError(e) {
    console.log(e)
  }

  onBuffer(e) {
    console.log('onBuffer', e)
  }

  render() {
    const { paused, totalLength, currentPosition } = this.state;
    console.log(totalLength, currentPosition)

    return (
      <Container>
        <Header
          backgroundColor="#ff784e"
          // statusBarProps={{ barStyle: 'light-content' }}
          // leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Audio Test' }}
          // rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <Video
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
        />

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