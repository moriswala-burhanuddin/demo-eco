"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Address {
  id: number;
  full_name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  address_type: "BILLING" | "SHIPPING";
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    address_type: "SHIPPING",
  });

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/customers/addresses/");
      setAddresses(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/customers/addresses/", formData);
      setIsAdding(false);
      setFormData({
        full_name: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: "",
        address_type: "SHIPPING",
      });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to save address", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/customers/addresses/${id}/`);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  if (loading) return <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Addresses...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-heading text-4xl">Addresses</h1>
        <Button onClick={() => setIsAdding(!isAdding)} variant="outline" className="rounded-none uppercase tracking-widest text-xs font-semibold px-8 h-12">
          {isAdding ? "Cancel" : "Add Address"}
        </Button>
      </div>
      
      {isAdding && (
        <form onSubmit={handleSave} className="mb-12 border border-border p-8 bg-secondary space-y-6">
          <h3 className="font-bold text-xl uppercase tracking-widest mb-6">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required className="rounded-none h-12" />
            <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="rounded-none h-12" />
            <Input name="line1" placeholder="Address Line 1" value={formData.line1} onChange={handleChange} required className="col-span-1 md:col-span-2 rounded-none h-12" />
            <Input name="line2" placeholder="Address Line 2 (Optional)" value={formData.line2} onChange={handleChange} className="col-span-1 md:col-span-2 rounded-none h-12" />
            <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="rounded-none h-12" />
            <Input name="state" placeholder="State/Province" value={formData.state} onChange={handleChange} required className="rounded-none h-12" />
            <Input name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} required className="rounded-none h-12" />
            <Input name="country" placeholder="Country" value={formData.country} onChange={handleChange} required className="rounded-none h-12" />
          </div>
          <Button type="submit" className="w-full md:w-auto rounded-none uppercase tracking-widest text-xs font-semibold px-12 h-12">
            Save Address
          </Button>
        </form>
      )}

      {addresses.length === 0 && !isAdding ? (
        <div className="border border-border p-12 text-center text-muted-foreground">
          <p className="uppercase tracking-widest text-xs font-semibold">No Saved Addresses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((address) => (
            <div key={address.id} className="border border-border p-6 flex flex-col justify-between bg-background">
              <div>
                <h3 className="font-bold text-lg mb-2">{address.full_name} <span className="text-xs ml-2 text-muted-foreground uppercase tracking-widest">{address.address_type}</span></h3>
                <p className="text-muted-foreground">{address.line1}</p>
                {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
                <p className="text-muted-foreground">{address.city}, {address.state} {address.postal_code}</p>
                <p className="text-muted-foreground mb-4">{address.country}</p>
                <p className="text-sm font-semibold">{address.phone}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-border flex gap-4">
                <Button variant="ghost" onClick={() => handleDelete(address.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none uppercase tracking-widest text-xs font-semibold h-8 px-4">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
