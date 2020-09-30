import React from "react";

export default function Message(props) {
  let {author, date, content} = props.data;
  let dateParse = new Date(date);
  return (
    <div className="list-group-item d-flex">
      <div className="message_info">
        <div className="message_info_autor">{author}</div>
        <small>
          {dateParse.getHours()}:{dateParse.getMinutes()}:{dateParse.getSeconds()}
        </small>
      </div>
      <div className="message_content flex-grow-1">{content}</div>
    </div>
  );
}
