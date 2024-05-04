import React, { useState, ChangeEvent, FormEvent } from "react";
import "./friends.css";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";

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
              placeholder="Add a friend"
              className="friend-input"
            />
            <button className="submit-button" type="submit">
              Add
            </button>
          </form>
        </div>
        <div className="list-container">
          <ul className="friend-list">
            {friends.map((friend, index) => (
              <li className="friend-item" key={index}>
                {friend}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default FriendList;
