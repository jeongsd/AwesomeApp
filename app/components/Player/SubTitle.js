import React, { Component } from 'react';
import { Text, FlatList, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } from 'subtitle'
import subtitleStrEn from './data/test5_en';
import subtitleStrKo from './data/test5_ko';


const parsedSubtitle = parse(subtitleStrEn);
const parsedSubtitleKo = parse(subtitleStrKo);

function subTitleFinder(currentPosition, subTitleList) {
  let index = 0;
  for (; index < subTitleList.length; index++) {
    const subTitleItem = subTitleList[index];

    if (subTitleItem.start < currentPosition && subTitleItem.end >= currentPosition) {
      return index;
    }
  }

  return index;
}

// class SubTitle extends Component {
//   render() {
//     // let display = this.state.isShowingText ? this.props.text : ' ';
//     const { currentPosition } = this.props;
//     const subTitleIndex = subTitleFinder(currentPosition * 1000, parsedSubtitle);

//     const displaySubtitle = parsedSubtitle[subTitleIndex];
//     const parsedSubtitle = parse(subtitleStrEn);

//     return (
//       <View style={styles.container}>
//       {displaySubtitle && <Text>
//         {displaySubtitle.text}
//       </Text>}
//         {/* <Text>{display}</Text> */}
//       </View>
//     );
//   }
// }

class MyListItem extends React.PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.index);
  };

  render() {
    const { index } = this.props;
    const textStyle = this.props.isNow ? styles.mainSubTitle : styles.passedSubTitle;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View>
          <Text style={textStyle}>
            {this.props.text}
          </Text>
          { this.props.isNow && parsedSubtitleKo[index] && (
            <Text style={styles.koSubTitle}>
              {parsedSubtitleKo[index].text}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}



class SubTitle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.flatList = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { currentPosition } = this.props;
    if (currentPosition === prevProps.currentPosition) return;

    const currentSubTitleIndex = subTitleFinder(currentPosition * 1000, parsedSubtitle);
    const prevSubTitleIndex = subTitleFinder(prevProps.currentPosition * 1000, parsedSubtitle);

    if (currentSubTitleIndex === prevSubTitleIndex) return;

    this.scrollToIndex(currentSubTitleIndex);
  }

  scrollToIndex = index => {
    // console.log(index, parsedSubtitle.length, index >= parsedSubtitle.length)
    if(index >= parsedSubtitle.length) return;
    this.flatList.current.scrollToIndex({ animated: false, index, viewPosition: 0.6 });
  }

  handlePressItem = (index) => {
    const { onClickSubTitle } = this.props;
    if (onClickSubTitle) {
      onClickSubTitle(parsedSubtitle[index].start);
    }
  }

  renderItem = ({ item, index }) => {
    const { currentPosition, onClickSubTitle } = this.props;
    const currentSubTitleIndex = subTitleFinder(currentPosition * 1000, parsedSubtitle);
    const subtitle = parsedSubtitle[currentSubTitleIndex];

    return (
      <MyListItem
        id={index}
        index={index}
        onPressItem={this.handlePressItem}
        isNow={currentSubTitleIndex === index}
        text={parsedSubtitle[index].text}
      />
    );
  };

  render() {
    const { currentPosition, flatListRef } = this.props;
    const currentSubTitleIndex = subTitleFinder(currentPosition * 1000, parsedSubtitle);

    const displaySubtitle = parsedSubtitle[currentSubTitleIndex];

    return (
      <View style={styles.container}>
        <FlatList
          ref={this.flatList}
          data={parsedSubtitle}
          extraData={{ currentSubTitleIndex }}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  mainSubTitle: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    paddingTop: 45,
    paddingBottom: 4,
    paddingLeft: 32,
    paddingRight: 32,
  },
  koSubTitle: {
    fontSize: 18,
    paddingBottom: 45,
    paddingLeft: 32,
    paddingRight: 32,
  },
  passedSubTitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.54)',
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 8,
    paddingBottom: 8,
  }

});

export default SubTitle;

