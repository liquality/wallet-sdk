import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface ModalProps {
  children: React.ReactNode;
  show: boolean;
  onAction: (params: boolean) => void;
}

export const LoginModal: React.FC<ModalProps> = (props) => {
  const { children, onAction, show } = props;
  return (
    <Modal show={show} onHide={() => onAction(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Woohoo, you're reading this text in a modal! {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onAction(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onAction(false)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
