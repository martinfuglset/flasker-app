// components/FormComponent.js
import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

const FormComponent = ({ handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    region: "",
    interval: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, formData)} className="grid gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name:</label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address:</label>
        <Input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone:</label>
        <Input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Region:</label>
        <Input
          type="text"
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Interval:</label>
        <Input
          type="number"
          name="interval"
          value={formData.interval}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div className="flex justify-between items-center">
        <Button type="submit" className="bg-black text-white">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default FormComponent;
