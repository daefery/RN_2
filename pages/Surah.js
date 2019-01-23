import React, { Component } from 'react';
import { ActivityIndicator, View, ToastAndroid } from 'react-native';
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
    List,
    Left,
    Body,
    Right,
    Switch,
    Spinner
  } from 'native-base';
import SoundPlayer from 'react-native-sound-player';

export default class Surah extends Component {
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
          currentPlay: -1
        }
    }
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
    componentDidMount(){
        return fetch('https://quranicaudio.com/api/surahs')
        .then((response) => response.json())
        .then((responseJson) => {
            data = [];
            let idx = 0;
            responseJson.map((x)=>{
                data.push({
                    index: idx,
                    id:x.id,
                    name:x.name.simple,
                    is_load: false,
                    is_play: false
                });
                idx++;
            });
            this.setState({
                isLoading: false,
                dataSource: data,
            }, function(){

            });

        })
        .catch((error) =>{
            console.error(error);
        });
    }
    _playTheQuran(param){
        SoundPlayer.stop();

        let currPl = param.index;
        if(currPl != this.state.currentPlay){
            this.setState({
                currentPlay: param.index
            });
        }
        // if(this.state.currentPlay == -1){
        //     this.setState({
        //         currentPlay: param.index
        //     });
        // }else{

        // }
        var newDs = [];
        newDs = this.state.dataSource;
        newDs[currPl].is_load = true;
        newDs[currPl].is_play = true;
        if(this.state.currentPlay != -1){
            newDs[this.state.currentPlay].is_load = false;
            newDs[this.state.currentPlay].is_play = false;
        }
        
        this.setState({
            dataSource: newDs
        });

        ToastAndroid.show(param.name, ToastAndroid.SHORT);
        // this.setState({
        //     isSoundLoad: true
        // });
        SoundPlayer.onFinishedPlaying((success: boolean) => { // success is true when the sound is played
            ToastAndroid.show('Finish', ToastAndroid.SHORT);
            newDs[currPl].is_load = false;
            newDs[currPl].is_play = false;
            this.setState({
                dataSource: newDs
            });
        });
        SoundPlayer.onFinishedLoading(async (success: boolean) => {
            ToastAndroid.show('Finish Loading', ToastAndroid.SHORT);
            newDs[currPl].is_load = false;
            newDs[currPl].is_play = true;
            this.setState({
                dataSource: newDs
            });
            // this.setState({
            //     isSoundLoad: false,
            //     isPlay: true
            // });
        });
        
        try {
            // play the file tone.mp3
            // SoundPlayer.playSoundFile('m001', 'mp3');
            // or play from url
            SoundPlayer.playUrl('https://download.quranicaudio.com/quran/'+this.props.navigation.getParam('relative_path', 'Reciter')+('000' + param.id).substr(-3)+'.mp3')
        } catch (e) {
            console.log(`cannot play the sound file`, e);
        }
    }
    componentWillUnmount() {
        SoundPlayer.unmount()
      }
    render(){
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator/>
                </View>
            )
        }
        return(
            <Container>
            <Content>
                {
                    this.state.dataSource.map((x)=>{
                        return(
                            <ListItem key={x.id} icon onPress={() => this._playTheQuran(x)}>
                                <Left>
                                <Button style={{ backgroundColor: "#FF9501" }}>
                                    <Icon active name="airplane" />
                                </Button>
                                </Left>
                                <Body>
                                <Text>{x.name}</Text>
                                </Body>
                                <Right>
                                    { x.is_load ? <ActivityIndicator key={x.index} size="small" color="#00ff00" /> : x.is_play ? <Icon active name="pause" /> : <Icon active name="play" />} 
                                </Right>
                            </ListItem>
                        )
                    })
                }
            </Content>
          </Container>
        )
    }
}