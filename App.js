import React from 'react';
import { ListView, StyleSheet, View, Image } from 'react-native';
import { Body, Title, Right, Left, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      puppies: []
    }
  }

  // Retrieve the list of ideas from Airtable
  getPuppies() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appxzqyCY8NnCRzf9/puppies?&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyJVOjsS2OY8X31n'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        puppies: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getPuppies(); // refresh the list when we're done
  }

  // Upvote an idea
  upvotePuppies(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appxzqyCY8NnCRzf9/puppies/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyJVOjsS2OY8X31n', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getPuppies(); // refresh the list when we're done
    });
  }

  // Downvote an idea
  downvotePuppies(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appxzqyCY8NnCRzf9/puppies/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyJVOjsS2OY8X31n', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes - 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getPuppies(); // refresh the list when we're done
    });
  }

  // Ignore an idea
  ignorePuppies(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newPuppiesData = this.state.puppies.slice();
    newPuppiesData.splice(rowId, 1);

    // Set state
    this.setState({
      puppies: newPuppiesData
    });
  }

  // Delete an idea
  deletePuppies(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newPuppiesData = this.state.puppies.slice();
    newPuppiesData.splice(rowId, 1);

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appxzqyCY8NnCRzf9/puppies/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer keyJVOjsS2OY8X31n', // replace with your own API key
        'Content-type': 'application/json'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getPuppies(); // refresh the list when we're done
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Body style = {{marginRight: -50}}>
          <Image
            style = {{width: 100, height: 100, paddingRight: 0}}
            source = {{uri: data.fields.puppies}}/>
        </Body>
        <Left>
          <Text>
            {data.fields.name}{"\n"}
            {data.fields.breed}{"\n"}
            {data.fields.age}{"\n"}
            {data.fields.gender}
          </Text>
        </Left>
        <Right>
          <Text note>{data.fields.votes} votes</Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvotePuppies(data, secId, rowId, rowMap)}>
        <Icon active name="heart" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downvotePuppies(data, secId, rowId, rowMap)}>
        <Icon active name="sad" />
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.puppies);
    return (
      <Container>
        <Header>
          <Body>
            <Title>PuppyLove</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
