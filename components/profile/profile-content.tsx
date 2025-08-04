"use client";

import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  MembershipBadge,
  MembershipLevel,
} from "@/components/profile/membership-badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DateFormat } from "@/enums";
import { formatDateTime } from "@/lib/utils";

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(30, { message: "First name must not be longer than 30 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(30, { message: "Last name must not be longer than 30 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z
    .string()
    .max(160, { message: "Bio must not be longer than 160 characters." })
    .optional(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .max(15, { message: "Phone number must not be longer than 15 characters." })
    .optional(),
});

const accountFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don not match",
    path: ["confirmPassword"],
  });

export function ProfileContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: "",
      phone: user?.phone || "",
    },
  });

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsUpdating(false);
    }, 1000);
  }

  function onAccountSubmit(data: z.infer<typeof accountFormSchema>) {
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setIsUpdating(false);
      accountForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  }

  const initials = useMemo(() => {
    return user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
  }, [user?.firstName]);

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your membership details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.avatar} alt={user?.firstName} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>

            <h3 className="text-xl font-medium">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>

            {/* <MembershipBadge
              level={
                (user?.membershipLevel as MembershipLevel) ||
                MembershipLevel.Gold
              }
            /> */}

            <div className="w-full mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {formatDateTime(
                    user?.registrationDate || "",
                    DateFormat.DATE_FORMAT
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Referral Token</span>
                <span className="font-semibold ">{user?.referralToken}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Tier</span>
                <span className="font-medium">{user?.tier?.name || "-"}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Level</span>
                <span className="font-medium">Platinum</span>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="password" disabled>
                  Password
                </TabsTrigger>
                <TabsTrigger value="preferences" disabled>
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your full name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your full name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormDescription>
                            We will use this email to contact you.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional contact number.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <Button type="submit" disabled={true}>
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button> */}
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="password">
                <Form {...accountForm}>
                  <form
                    onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={accountForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter current password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters long.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={accountForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Change Password"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="preferences">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about account activity
                          </p>
                        </div>
                        <div>
                          <Badge>Enabled</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">
                            Receive promotional emails and offers
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Points Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about points updates
                          </p>
                        </div>
                        <div>
                          <Badge>Enabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Privacy Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-muted-foreground">
                            Control who can see your profile
                          </p>
                        </div>
                        <div>
                          <Badge>Private</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Usage</p>
                          <p className="text-sm text-muted-foreground">
                            Allow data to be used for personalization
                          </p>
                        </div>
                        <div>
                          <Badge>Enabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Save Preferences"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
