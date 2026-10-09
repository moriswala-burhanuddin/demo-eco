"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/customers/profiles/");
        const data = res.data.results ? res.data.results[0] : res.data[0];
        if (data) {
          setProfile(data);
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (profile) {
        await api.patch(`/customers/profiles/${profile.id}/`, formData);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Profile...</div>;

  return (
    <div>
      <h1 className="font-heading text-4xl mb-12">Account Settings</h1>
      
      <div className="bg-secondary p-8 border border-border">
        <h3 className="font-bold text-xl uppercase tracking-widest mb-6 border-b border-border pb-4">Personal Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</Label>
              <Input name="first_name" value={formData.first_name} onChange={handleChange} className="rounded-none h-12" placeholder="Jane" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</Label>
              <Input name="last_name" value={formData.last_name} onChange={handleChange} className="rounded-none h-12" placeholder="Doe" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
            <Input value={user?.email || ""} disabled className="rounded-none h-12 bg-background/50 cursor-not-allowed" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} className="rounded-none h-12" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={saving} className="rounded-none uppercase tracking-widest text-xs font-semibold px-12 h-12">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
