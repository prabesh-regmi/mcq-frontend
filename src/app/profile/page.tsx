"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Spinner from "@/components/ui/spinner";
import { authAPI } from "@/lib/api";
import ProfileForm from "@/components/profile/ProfileFrom";
import ChangePassword from "@/components/profile/ChangePassword";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getProfile();
        setProfile(res);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Profile Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6 lg:pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={profile?.profileImage || "/default-avatar.png"}
              />
              <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                {profile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-xl font-semibold">
                {profile?.fullName || "User"}
              </h1>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{profile?.email}</span>
                </div>
                {profile?.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <ProfileForm profile={profile} setProfile={setProfile} />

      {/* Change Password Form */}
      <ChangePassword />
    </div>
  );
}
