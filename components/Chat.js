import React from 'react';
import { View, Text} from 'react-native';


export default class Screen2 extends React.Component {
  render() {
    let user = this.props.route.params.user; // OR ...
    let bgcolor =  this.props.route.params.Color
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: user });
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor : bgcolor}}>
        <Text>Welcome!</Text>
      </View>
    )
  }
}