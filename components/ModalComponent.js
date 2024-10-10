// components/ModalComponent.js
import { Button } from "@/components/button";

const ModalComponent = ({ showModal, setShowModal, children }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        {children}
        <Button onClick={() => setShowModal(false)} className="bg-white text-black border mt-4">
          Close
        </Button>
      </div>
    </div>
  );
};

export default ModalComponent;
