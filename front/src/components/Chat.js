import React, { PureComponent } from "react";
import Message from "./Message";
import EventEmitter from "../EE";
const socket = io();
socket.emit("message", "Привет мир!", { a: 5 });
socket.emit("abra", "cadabra");

export default class Chat extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      message: "",
      messages: [
        {
          author: "Michail",
          date: 1213123123123123,
          content: "Testing some",
        },
        {
          author: "Den",
          date: 7813123123123123,
          content: "Den Time",
        },
      ],
    };
  }


  componentDidMount(){
    socket.on("message", (data) => {
      console.log(data)
      this.handleState(data)
   
    });
  }

  handlerSocket(text) {
    text = text.trim();

    if (!text) {
      return;
    }
    
    if (text.startsWith("/setname ")) {
      const split = text.split(" ");
      const name = split[1].slice(0, 10);

      socket.emit("setname", name);
      this.setState({
        message: ''
      });
      return;
    }
   
    socket.emit("message", text);
  }


  handleState(data){
    this.setState((state) => {
      return {
        ...state,
        messages:[
          ...state.messages,
          {
            author: data.user,
            date: data.date,
            content: data.content
          }
        ],
        message: '',
      };
    });

  }

  handlerChange(e) {
    e.preventDefault();
    this.setState({
      message: e.target.value,
    });
  }

  handlerClick(e) {
    e.preventDefault();
    this.handlerSocket(this.state.message);
  }

  handlerKeyup(e) {
    if (e.key === "Enter") {
      this.emit("send", this.input.value);
    }
  }

  render() {
    return (
      <div className="container vh-100 p-2">
        <div className="card h-100">
          <div className="d-flex flex-column">
            <div className="card-header">
              <h3 className="card-title">Чат-Онлайн</h3>
            </div>

            <div
              className="list-group flex-grow-1 overflow-auto message-panel"
              data-messages
            >
              {this.state.messages &&
                this.state.messages.map((item) => {
                  return <Message key={item.author +''+ Math.random()*10} data={item} />;
                })}
            </div>

            <div className="card-footer">
              <div className="input-group w-100 d-flex">
                <input
                  onChange={(e) => this.handlerChange(e)}
                  type="text"
                  className="form-input flex-grow-1"
                  id="validatedInputGroupCustomFile"
                  required
                  value ={this.state.message}
                />
                <div className="input-group-append">
                  <button
                    onClick={(e) => this.handlerClick(e)}
                    className="btn btn-outline-primary"
                    type="button"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
