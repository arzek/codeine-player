import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube';
import QueryString from 'query-string';
import URL from 'url-parse';
import io from 'socket.io-client';
import ip from 'ip';


const socket = io();

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      newItem: '',
      youtube: {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 0
        }
      }
    }

    socket.on('add', (data) => {
      this.onAdd(data);
    });

    socket.on('remove', (id) => {
      this.onRemove(id);
    });
    
    this.onSubmit = this.onSubmit.bind(this);
    this.onHost = this.onHost.bind(this);
  }
  
  onAdd(data) {
    let items = this.state.items;
    items.push(data);
    this.setState({
      items: items
    });
  }
  onSubmit(event) {
    event.preventDefault();
    const url = new URL(event.target.url.value);
    const parsed = QueryString.parse(url.query);
    this.setState({
      newItem: ''
    });

    socket.emit('add', {
      id: parsed.v,
      ip: ip.address()
    });
   
  }
  onEnd(event) {
    socket.emit('remove', event.target.b.b.videoId);
  }
  onRemove(id) {
    const newList = this.state.items.filter( item => {
      return item.id !== id; 
    })
    this.setState({
      items: newList
    })
  }
  onHost() {
    let autoplay;
    if (this.state.youtube.playerVars.autoplay) {
      autoplay = 0;
    } else {
      autoplay = 1;
    }

    this.setState({
      youtube: {
        ...this.state.youtube,
        playerVars: {
          autoplay: autoplay
        }
      }
    })
  }

  render() {
    let YouTubeBlock;
    if (this.state.items.length && this.state.youtube.playerVars.autoplay) {
      YouTubeBlock = (
        <YouTube 
        videoId={this.state.items[0].id} 
        key={this.state.items[0].id} 
        opts={this.state.youtube} 
        onEnd={this.onEnd} />
      );
    }

    let itemsList = this.state.items.map(item => {
      return (
        <li key={'list_' + item.id}>{ip.address()}: {item.id}</li>
      )
    })
    

    return (
      <div className="container">
        { YouTubeBlock }
        <form onSubmit={this.onSubmit}>
          <input name="url" 
          type="text" 
          value={this.state.newItem}
           onChange={event => this.setState({newItem: event.target.value})} 
           required/>
          <input type="submit"/>
        </form>
        <p>You host? 
          <input type="checkbox" 
          value={this.state.youtube.playerVars.autoplay} 
          checked={this.state.youtube.playerVars.autoplay}
          onChange={this.onHost} />
        
        </p>
        

        <ul>
          {itemsList}
        </ul>
      </div>
    );
  }
}

if (document.getElementById('main')) {
  ReactDOM.render(<Main />, document.getElementById('main'));
}
