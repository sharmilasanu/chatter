import React from 'react';
import { View, Platform, KeyboardAvoidingView,StyleSheet} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Welcome',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: this.props.route.params.user+'  ' +'joined the chat screen',
          createdAt: new Date(),
          system: true,
         },
      ],
    })
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
  renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#444941',
                },
                left: {
                    backgroundColor: '#CCD1E4',
                }
            }}
            textStyle={{
                right: {
                    color: 'white',
                },
                left: {
                    color: 'black',
                }
            }}
        />
    )
}
  render() {
    let user = this.props.route.params.user; // OR ...
    let bgcolor =  this.props.route.params.Color
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: user });
    return (
      <View style={{flex:1,  backgroundColor : bgcolor, color : '#000'}}>
        <GiftedChat
        style={styles.giftedChat}
  messages={this.state.messages}
  onSend={messages => this.onSend(messages)}
  user={{
    _id: 1,
  }}
/>
{ Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
 }
      </View>
    )
  }
}

const styles = StyleSheet.create({
	giftedChat: {
		color: '#000',
	},
});