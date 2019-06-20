import React from 'react';
import Popup from "reactjs-popup";

class ControlledPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, text: this.props.text }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  openModal (){
    this.setState({ open: true })
  }
  closeModal () {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <button className="button" onClick={this.openModal}>
          Puck
        </button>
        <Popup
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          <div className="modal" style={{display: 'block', position: 'relative'}}>
            <a className="close" onClick={this.closeModal}>
              &times;
            </a>
            Текст = {this.state.text}
          </div>
        </Popup>
      </div>
    )
  }
}

export default ControlledPopup;

