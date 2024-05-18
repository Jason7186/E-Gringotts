import "./login-modal.css";

const LoadingModal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal-contents">
        <h2>Processing...</h2>
        <p>Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
};

export default LoadingModal;
