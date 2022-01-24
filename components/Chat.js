import React from 'react';
import {
    View,
    Platform,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// firebase | firestore
import * as firebase from 'firebase';
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
            
            isConnected: false,
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

    getMessages = async () => {
        // load messages from local AsyncStorage 
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || []
            this.setState({
                messages: JSON.parse(messages)
            })
        } catch (error) {
            console.log(error.message)
        }
    };

    saveMessages = async () => {
        // save messages from database into local AsyncStorage
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
        } catch (error) {
            console.log(error.message)
        }
    }

    deleteMessages = async () => {
        // not called in app used in development only
        // delete stored messages in local AsyncStorage
        try {
            await AsyncStorage.removeItem('messages')
            this.setState({ messages: [] })
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        // get username prop from Start.js
        let name = this.props.route.params.user
        if (name === '') name = 'UNNAMED'
        this.props.navigation.setOptions({ title: name })

        NetInfo.fetch().then(connection => {
            // if user is online
            if (connection.isConnected) {
                // listens for updates in messages collection
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);


                // firebase user authentication
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }

                    this.setState({
                        uid: user.uid,
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                        isConnected: true
                    })

                })
                
              
            } else {
                this.setState({ isConnected: false })
                // get saved messages from local AsyncStorage
                this.getMessages()
            }
        })
    }
    componentWillUnmount() {
        //Stops listening to authentication and collection changes
        if (this.state.isConnected) {
        this.authUnsubscribe();
        this.unsubscribe();
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id || 1,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user
            });
        });

        this.setState({
            messages: messages,
        });
        this.saveMessages()
    }


    addMessage() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: this.state.user
        })
    }
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
            this.saveMessages()
        });
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
        );
    }
    renderInputToolbar = (props) => {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }
    render() {
        let user = this.props.route.params.user; // OR ...
        let bgcolor = this.props.route.params.Color
        // let { name } = this.props.route.params;

        this.props.navigation.setOptions({
            title: user
        });
        return ( 
            <View style={{
                flex: 1,
                backgroundColor: bgcolor,
                color: '#000'
            }}>

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                        name: user,
                    }} />
                {Platform.OS === 'android' ? < KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}