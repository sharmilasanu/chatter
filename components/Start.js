import React from 'react';
import { View, Text, Button, TextInput, ImageBackground,StyleSheet,TouchableOpacity} from 'react-native';
import backgroundImg from '../assets/start_bg.png';

export default class Start extends React.Component {
  state = {
    Color: '#808080',
    user : ''
  }
  changeBgColor = newColor => {
		this.setState({ Color: newColor });
	};
  
  render() {
    const colors = ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8']
    return (
      <View style={{flex:1}}>
        <ImageBackground source={backgroundImg} resizeMode="cover" style={styles.image}>
          <Text style={[styles.title, { color: this.state.Color }]}>Chatter</Text>
        
        
           <View style={[styles.goChatDiv, { backgroundColor: this.state.Color }]}>
             <View style={styles.searchContainer}>
                         <TextInput
                                    style={styles.userInput}
                                    onChangeText={(user) => this.setState({ user })}
                                    value={this.state.user}
                                    placeholder='Your name'
                                    opacity={0.5}
                                />
          </View>
          <View style={{ width: "88%" }}>
                                <Text style={styles.chooseColor}>Choose a background color</Text>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                    {
                                        colors.map(c =>
                                            <TouchableOpacity
                                                style={[styles.colorButtons, { backgroundColor: c, borderColor: this.state.Color === c ? 'white' : null }]}
                                                onPress={() => this.setState({ Color: c })}
                                                key={c}>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            </View>
          <View style={styles.goChatButton}>
           <Button
        
          title="Start Chatting"
          onPress={() => this.props.navigation.navigate('Chat', { user: this.state.user ,  Color : this.state.Color})}
           />
           </View>

           </View>
           </ImageBackground>
           
        </View>
     
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: "white",
    fontSize: 12,
    lineHeight: 12 ,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  title: {
    fontWeight: "700",
    fontSize: 46,
    color: '#FFFFFF',
    margin: 66,
    flex: 1
},

  colorButtons: {
    borderWidth: 2,
    width: 50,
    height: 50,
    marginTop: 20,
    borderRadius: 50,
    marginBottom: 20
},
goChatButton: {
  width: "88%",
  backgroundColor: '#212121',
  marginBottom: 24,
  padding: 5,
},
searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  width: "88%",
  borderColor: "#DDDDDD",
  borderWidth: 2,
  padding: 16,
  marginTop: 24,
},
goChatDiv: {
  width: '88%',
  borderRadius: 20,
  display: "flex",
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 47
},
chooseColor: {
  fontSize: 20,
  fontWeight: "600",
  color: 'white',
  marginTop: 17,
}
});
