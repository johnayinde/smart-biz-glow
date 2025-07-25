
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentUser } from "@/services/mockData";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    email: true,
    app: true,
    invoice: true,
    payment: true,
    system: false
  });

  const [reminderSettings, setReminderSettings] = useState({
    enableReminders: true,
    reminderInterval: "3", // days
    overdueReminderInterval: "7", // days
    maxReminders: "3",
    enableOverdueReminders: true,
    sendOnDueDate: true,
    reminderTemplate: "friendly"
  });
  
  const user = currentUser;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={user.email} type="email" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position/Title</Label>
                  <Input id="position" defaultValue={user.position} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" type="tel" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This information will appear on your invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Company Email</Label>
                  <Input id="company-email" defaultValue="billing@acmeinc.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Company Phone</Label>
                  <Input id="company-phone" defaultValue="+1 (555) 987-6543" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                  <Input id="tax-id" defaultValue="US123456789" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-address">Company Address</Label>
                <Textarea id="company-address" defaultValue="123 Business Street, Suite 100, San Francisco, CA 94107" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Invoice Customization</CardTitle>
              <CardDescription>
                Customize the appearance of your invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input id="invoice-prefix" defaultValue="INV-" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-number">Next Invoice Number</Label>
                  <Input id="next-number" defaultValue="006" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-due-days">Default Payment Terms (days)</Label>
                  <Input id="default-due-days" defaultValue="14" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Input id="default-currency" defaultValue="USD" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice-notes">Default Invoice Notes</Label>
                <Textarea 
                  id="invoice-notes" 
                  defaultValue="Thank you for your business. Please make payment within the specified terms." 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  checked={notificationsEnabled.email}
                  onCheckedChange={(checked) => 
                    setNotificationsEnabled({...notificationsEnabled, email: checked})
                  } 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications within the application
                  </p>
                </div>
                <Switch 
                  checked={notificationsEnabled.app}
                  onCheckedChange={(checked) => 
                    setNotificationsEnabled({...notificationsEnabled, app: checked})
                  }
                />
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Invoice Updates</p>
                      <p className="text-sm text-muted-foreground">
                        When invoices are viewed, paid, or overdue
                      </p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.invoice}
                      onCheckedChange={(checked) => 
                        setNotificationsEnabled({...notificationsEnabled, invoice: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        When payments are received or failed
                      </p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.payment}
                      onCheckedChange={(checked) => 
                        setNotificationsEnabled({...notificationsEnabled, payment: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Updates about the system and new features
                      </p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.system}
                      onCheckedChange={(checked) => 
                        setNotificationsEnabled({...notificationsEnabled, system: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reminder Settings</CardTitle>
              <CardDescription>
                Configure automatic reminders for unpaid invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Payment Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically send reminders for unpaid invoices
                  </p>
                </div>
                <Switch 
                  checked={reminderSettings.enableReminders}
                  onCheckedChange={(checked) => 
                    setReminderSettings({...reminderSettings, enableReminders: checked})
                  } 
                />
              </div>

              {reminderSettings.enableReminders && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Reminder Schedule</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Send Reminder on Due Date</p>
                          <p className="text-sm text-muted-foreground">
                            Send a reminder on the invoice due date
                          </p>
                        </div>
                        <Switch 
                          checked={reminderSettings.sendOnDueDate}
                          onCheckedChange={(checked) => 
                            setReminderSettings({...reminderSettings, sendOnDueDate: checked})
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="reminder-interval">Reminder Interval (days)</Label>
                          <Select 
                            value={reminderSettings.reminderInterval} 
                            onValueChange={(value) => 
                              setReminderSettings({...reminderSettings, reminderInterval: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Daily</SelectItem>
                              <SelectItem value="3">Every 3 days</SelectItem>
                              <SelectItem value="7">Weekly</SelectItem>
                              <SelectItem value="14">Every 2 weeks</SelectItem>
                              <SelectItem value="30">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-reminders">Maximum Reminders</Label>
                          <Select 
                            value={reminderSettings.maxReminders} 
                            onValueChange={(value) => 
                              setReminderSettings({...reminderSettings, maxReminders: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 reminder</SelectItem>
                              <SelectItem value="2">2 reminders</SelectItem>
                              <SelectItem value="3">3 reminders</SelectItem>
                              <SelectItem value="5">5 reminders</SelectItem>
                              <SelectItem value="unlimited">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Overdue Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Overdue Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Send additional reminders for overdue invoices
                          </p>
                        </div>
                        <Switch 
                          checked={reminderSettings.enableOverdueReminders}
                          onCheckedChange={(checked) => 
                            setReminderSettings({...reminderSettings, enableOverdueReminders: checked})
                          }
                        />
                      </div>

                      {reminderSettings.enableOverdueReminders && (
                        <div className="space-y-2">
                          <Label htmlFor="overdue-interval">Overdue Reminder Interval</Label>
                          <Select 
                            value={reminderSettings.overdueReminderInterval} 
                            onValueChange={(value) => 
                              setReminderSettings({...reminderSettings, overdueReminderInterval: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Daily</SelectItem>
                              <SelectItem value="3">Every 3 days</SelectItem>
                              <SelectItem value="7">Weekly</SelectItem>
                              <SelectItem value="14">Every 2 weeks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Reminder Template</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminder-template">Reminder Tone</Label>
                      <Select 
                        value={reminderSettings.reminderTemplate} 
                        onValueChange={(value) => 
                          setReminderSettings({...reminderSettings, reminderTemplate: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="firm">Firm</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Choose the tone for your reminder emails
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Reminder Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how SmartInvoice looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer bg-background flex flex-col items-center active:scale-95 transition-transform border-primary">
                    <span className="text-2xl mb-1">☀️</span>
                    <span>Light</span>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer bg-gray-950 text-white flex flex-col items-center active:scale-95 transition-transform">
                    <span className="text-2xl mb-1">🌙</span>
                    <span>Dark</span>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer bg-gradient-to-br from-gray-100 to-gray-800 text-black flex flex-col items-center active:scale-95 transition-transform">
                    <span className="text-2xl mb-1">🖥️</span>
                    <span>System</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Density</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer flex flex-col items-center active:scale-95 transition-transform">
                    <span>Compact</span>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer flex flex-col items-center active:scale-95 transition-transform border-primary">
                    <span>Default</span>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer flex flex-col items-center active:scale-95 transition-transform">
                    <span>Comfortable</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Dashboard Layout</h3>
                <div className="space-y-2">
                  <Label htmlFor="default-page">Default Page</Label>
                  <Input id="default-page" defaultValue="Dashboard" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
