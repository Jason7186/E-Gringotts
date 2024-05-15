import React, { useState, ChangeEvent, FormEvent } from "react";
import "./friends.css";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import trash_icon from "./trash.png";

function FriendList() {
  // Initialize state with explicit type
  const [friends, setFriends] = useState<string[]>([]);
  const [newFriend, setNewFriend] = useState<string>("");

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFriend(e.target.value);
  };

  // Handle form submission
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newFriend) {
      setFriends([...friends, newFriend]);
      setNewFriend("");
    }
  };

  // Remove friend by index
  const removeFriend = (index: number) => {
    setFriends(friends.filter((_, i) => i !== index));
  };

  return (
    <>
      <TransactionSidebar />
      <div className="background-friend">
        <div className="title-container">
          <h1>Friend List</h1>
        </div>
        <div className="add-container">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={newFriend}
              onChange={handleInputChange}
              placeholder="Enter accound ID to add"
              className="friend-input"
            />
            <button className="friend-submit-button" type="submit">
              Add
            </button>
          </form>
        </div>
        <div className="list-container">
          <ul className="friend-list">
            {friends.map((friend, index) => (
              <li className="friend-item" key={index}>
                {friend}
                <img
                  className="remove-icon"
                  src={trash_icon}
                  alt="Remove"
                  onClick={() => removeFriend(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default FriendList;
