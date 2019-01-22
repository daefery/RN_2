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

export default class Home extends Component {
    static navigationOptions = { header: null };
    constructor(props){
        super(props);
        this.state ={ 
          isLoading: true,
        }
    }

    componentDidMount(){
        return fetch('https://quranicaudio.com/api/qaris')
        .then((response) => response.json())
        .then((responseJson) => {
        responseJson.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        });
        let alp = '';
        let dataPro = [];
        let dataProReal = [];
        let idx = 0;
        responseJson.map((x)=>{
            if(x.section_id == 1){
                if(alp == ''){
                    alp = x.name[0].toUpperCase();
                }
                if(alp != x.name[0].toUpperCase()){
                    dataProReal.push({
                        indexTitle: alp,
                        data: dataPro
                    });
                    alp = x.name[0].toUpperCase();
                    dataPro = [];
                    dataPro.push({
                        title: x.name
                    });
                }else{
                    dataPro.push({
                        title: x.name
                    });
                }
                if(idx+1 == responseJson.length){
                    dataProReal.push({
                        indexTitle: alp,
                        data: dataPro
                    });
                }
            }
            idx++;
        });
        this.setState({
            isLoading: false,
            dataSource: dataProReal,
        }, function(){

        });

        })
        .catch((error) =>{
        console.error(error);
        });
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator/>
                </View>
            )
        }
        return (
        <Container>
            <Header searchBar rounded>
            <Item>
                <Icon name="ios-search" />
                <Input placeholder="Search" />
                <Icon name="ios-people" />
            </Item>
            <Button transparent>
                <Text>Search</Text>
            </Button>
            </Header>
            <Content>
                <List>
                {
                    this.state.dataSource.map((l) => {
                    let kl = [];
                    kl.push(
                        <ListItem itemDivider>
                        <Text>{l.indexTitle}</Text>
                        </ListItem>
                    )
                    l.data.map((x)=>{
                        kl.push(
                        <ListItem button={true}
                        onPress={() => this.props.navigation.navigate('Surah', {
                            reciter: x.title
                          })}>
                        <Text>{x.title}</Text>
                        </ListItem>
                        )
                    })
                    return(kl)
                    })
                }
                </List>
            </Content>
        </Container>
        );   
    }
    
  _pressRow(){
    console.log('TEST');
  }
}
