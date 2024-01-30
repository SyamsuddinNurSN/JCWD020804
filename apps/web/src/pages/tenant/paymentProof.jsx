import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Card } from "@material-tailwind/react";

export const PaymentProofDialog = ({ isOpen, onClose, imageUrl }) => {
    // console.log('Dialog State:', isOpen);
    // console.log('Image URL:', imageUrl);
    return (
    <Dialog size="lg" open={isOpen} >
      <DialogHeader onClose={() => onClose()}>Payment Proof</DialogHeader>
      <DialogBody>
        <Card className="h-64 w-96 overflow-hidden">
          <img
            alt="Payment Proof"
            className="h-full w-full object-cover object-center"
            style={{ maxHeight: '100%', maxWidth: '100%' }}
            src={imageUrl}
          />
        </Card>
      </DialogBody>
      <DialogFooter>
        <button
          className="mx-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onClose()}
        >
          Close
        </button>
      </DialogFooter>
    </Dialog>
  );
};


