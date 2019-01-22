import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { 
    Container, 
    Header, 
    Content, 
    Button, 
    Icon, 
    Text,
    Item,
    Input,
    ListItem,
    List
  } from 'native-base';

export default class Surah extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('reciter', 'Reciter'),
            headerStyle: {
            backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        };
    };
    render(){
        return(
            <View>
                <Text>Surah</Text>
                <Button
                onPress={() => this.props.navigation.navigate('Home')}
                
                >
                <Text>Home</Text>
                </Button>
            </View>
        )
    }
}