import React from 'react';
import {
    View,
    Platform,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
// firebase | firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            uid: 1,
            messages: [],
            user: {
                _id: 1,
                name: '',
                avatar: '',
            },
        }
        const firebaseConfig = {
            apiKey: "AIzaSyC8oUlAQC7v22KPXG75YHbrt0xMPQ8DQwM",
            authDomain: "chatter-f5523.firebaseapp.com",
            projectId: "chatter-f5523",
            storageBucket: "chatter-f5523.appspot.com",
            messagingSenderId: "581931491128",
            appId: "1:581931491128:web:4118f1b141908718036bcd"
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceChatMessages = firebase.firestore().collection("messages");
    }
    componentDidMount() {
        // firebase user authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
            });
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }
    componentWillUnmount() {
      //Stops listening to authentication and collection changes
     
          this.authUnsubscribe();
          this.unsubscribe();
      
  }
    addMessage() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user,

        })
    }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        this.addMessage()
    }
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });
    }
    renderBubble = (props) => {
        return ( <
            Bubble {
                ...props
            }
            wrapperStyle = {
                {
                    right: {
                        backgroundColor: '#444941',
                    },
                    left: {
                        backgroundColor: '#CCD1E4',
                    }
                }
            }
            textStyle = {
                {
                    right: {
                        color: 'white',
                    },
                    left: {
                        color: 'black',
                    }
                }
            }
            />
        )
    }

render() {
    let user = this.props.route.params.user; // OR ...
    let bgcolor = this.props.route.params.Color
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({
        title: user
    });
    return ( 
    <View style = {
            {
                flex: 1,
                backgroundColor: bgcolor,
                color: '#000'
            }
        } >
        <
        GiftedChat style = {
            styles.giftedChat
        }
        messages = {
            this.state.messages
        }
        onSend = {
            messages => this.onSend(messages)
        }
        user = {
            {
                _id: 1,
            }
        }
        /> {
        Platform.OS === 'android' ? < KeyboardAvoidingView behavior = "height" / > : null
    } </View>
)
}
}