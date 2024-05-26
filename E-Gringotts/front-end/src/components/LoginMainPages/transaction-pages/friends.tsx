import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import FriendsModal from "./FriendsModal";
import "./friends.css";
import TransactionSidebar from "../transaction-sidebar/transaction-sidebar";
import trash_icon from "./trash.png";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

interface Friend {
  accountId: string;
  name: string;
}

function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState("");
  const [accountName, setAccountName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); //when enter page
  const [fetchingName, setFetchingName] = useState(false); //after enter accoundId, fetching account name
  const [addingFriend, setAddingFriend] = useState(false); // after confirm, adding friend
  const [deletingFriend, setDeletingFriend] = useState(false); //after press delete
  const [pendingFriend, setPendingFriend] = useState<Friend>({
    accountId: "",
    name: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingPage(true);
    fetchFriendList();
  }, []);

  const fetchFriendList = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/login-transaction/retrieveFriends",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Friend[] = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFriend(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newFriend) {
      fetchAccountName(newFriend);
    }
  };

  const fetchAccountName = async (accountId: string) => {
    setFetchingName(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/login-transaction/searchId/${accountId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        alert("User not found. Please enter a valid account ID");
        throw new Error("Failed to fetch account details");
      }
      const data = await response.json();
      setPendingFriend({ accountId, name: data.userName });
      setModalOpen(true);
    } catch (error) {
      console.error("Fetching account name failed:", error);
      alert("User not found. Please enter a valid account ID");
      return;
    } finally {
      setFetchingName(false);
    }
  };

  //add friend
  const confirmAddFriend = async () => {
    const token = localStorage.getItem("token");
    setAddingFriend(true);

    try {
      const response = await fetch(
        "http://localhost:8080/login-transaction/friends",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accountId: pendingFriend.accountId }),
        }
      );

      if (!response.ok) {
        alert("Failed to add friend. Please try again later.");
        throw new Error("Failed to add friend");
      }

      setFriends([
        ...friends,
        {
          accountId: pendingFriend.accountId,
          name: pendingFriend.name,
        },
      ]);
      setNewFriend("");
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setAddingFriend(false);
    }
  };

  //delete friend
  const removeFriend = async (
    index: number,
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.stopPropagation(); // Prevent click from propagating to higher elements.
    const friendToRemove = friends[index];
    const token = localStorage.getItem("token");
    setDeletingFriend(true);

    try {
      const response = await fetch(
        `http://localhost:8080/login-transaction/friends/${friendToRemove.accountId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        alert("Failed to delete friend. Please try again.");
        throw new Error("Failed to delete friend");
      }

      setFriends(friends.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      setDeletingFriend(false);
    }
  };

  const handleFriendClick = (accountId: string) => {
    navigate(`/instant-transaction/${accountId}`);
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
                {friend.name} [{friend.accountId}]
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
        accountName={pendingFriend.name}
      />
      {loadingPage && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Summoning Friends...</h2>
            <p>Please give us a moment...</p>
          </div>
        </div>
      )}
      {fetchingName && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Finding User...</h2>
            <p>Please give us a moment...</p>
          </div>
        </div>
      )}
      {addingFriend && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Adding User...</h2>
            <p>Please give us a moment...</p>
          </div>
        </div>
      )}
      {deletingFriend && (
        <div className="modal-overlay">
          <div className="modal-contents">
            <h2>Deleting User...</h2>
            <p>Please give us a moment...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default FriendList;
