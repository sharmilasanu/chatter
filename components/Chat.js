import React from 'react';
import {
    View,
    Platform,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
// firebase | firestore
import firebase from 'firebase';
import 'firebase/firestore';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
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
            apiKey: "AIzaSyAHg-RNvtpcGoPMsQTB2rUBXfdc8f6ok2Q",
            authDomain: "chatapp-99ed3.firebaseapp.com",
            projectId: "chatapp-99ed3",
            storageBucket: "chatapp-99ed3.appspot.com",
            messagingSenderId: "902194494688",
            appId: "1:902194494688:web:0cbd4469596de46c9fa485"
        };
        
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
          
        }
       
        this.referenceChatMessages = firebase.firestore().collection("messages");
        
    }
    componentDidMount() {
       
        let name = this.props.route.params.user
        if (name === '') name = 'UNNAMED'
        this.props.navigation.setOptions({ title: name })

         // firebase user authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                  firebase.auth().signInAnonymously();
                  
            }
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any',
                },
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
                user: data.user
            });
        });
        this.setState({
			messages: messages,
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
   
    let bgcolor = this.props.route.params.Color
    // let { name } = this.props.route.params;

   
    return ( 
    <View style = {
            {
                flex: 1,
                backgroundColor: bgcolor,
                color: '#000'
            }
        } >
        <
        GiftedChat 
        renderBubble={this.renderBubble.bind(this)}
        messages = {
            this.state.messages
        }
        onSend = {
            messages => this.onSend(messages)
        }
        user={{
                        _id: this.state.user._id,
                        name: this.state.user.name,
                        avatar: this.state.user.avatar
                    }}
        /> {
        Platform.OS === 'android' ? < KeyboardAvoidingView behavior = "height" / > : null
    } </View>
)
}
}