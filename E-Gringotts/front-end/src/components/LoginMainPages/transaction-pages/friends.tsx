import React, { useState, ChangeEvent, FormEvent } from "react";
import FriendsModal from "./FriendsModal";
import "./friends.css";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import trash_icon from "./trash.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function FriendList() {
  const [friends, setFriends] = useState([{ accountId: "", accountName: "" }]);
  const [newFriend, setNewFriend] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingFriend, setPendingFriend] = useState({
    accountId: "",
    accountName: "",
  });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFriend(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newFriend) {
      fetchAccountName(newFriend);
    }
  };

  const fetchAccountName = (accountId: string) => {
    const accountName = "Simulated Account Name"; // Replace with actual fetch
    setPendingFriend({ accountId, accountName });
    setModalOpen(true);
  };

  const confirmAddFriend = () => {
    setFriends([
      ...friends,
      {
        accountId: pendingFriend.accountId,
        accountName: pendingFriend.accountName,
      },
    ]);
    setNewFriend("");
    setModalOpen(false);
  };

  const removeFriend = (
    index: number,
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.stopPropagation(); // Prevent click from propagating to higher elements.
    setFriends(friends.filter((_, i) => i !== index));
  };

  const handleFriendClick = (accountId: string) => {
    navigate(`/instant-transaction/${accountId}`); // Navigate with accountId
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
              placeholder="Enter account ID to add"
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
              <li
                className="friend-item"
                key={index}
                onClick={() => handleFriendClick(friend.accountId)}
              >
                {friend.accountName} [{friend.accountId}]
                <img
                  className="remove-icon"
                  src={trash_icon}
                  alt="Remove"
                  onClick={(event) => removeFriend(index, event)} // Pass the event to the handler.
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FriendsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAddFriend}
        accountId={pendingFriend.accountId}
        accountName={pendingFriend.accountName}
      />
    </>
  );
}

export default FriendList;
