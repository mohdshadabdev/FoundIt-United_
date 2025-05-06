
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Users, Package, FileCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for claims only
const mockClaims = [
  {
    id: 1,
    itemId: 3,
    itemName: "Student ID Card",
    claimant: "Sarah Johnson",
    contact: "sarah.j@example.edu",
    date: "May 20, 2023",
    status: "approved",
    proof: "It's my ID card with ID number S12345678. The card has a small scratch on the back from when I dropped it."
  },
  {
    id: 2,
    itemId: 2,
    itemName: "MacBook Pro",
    claimant: "Michael Chen",
    contact: "michael.c@example.edu",
    date: "May 21, 2023",
    status: "pending",
    proof: "It's a 13\" MacBook Pro (2020) with a blue hard shell case. The password is my student ID and there's a cracked pixel in the bottom right corner of the screen."
  },
  {
    id: 3,
    itemId: 4,
    itemName: "Nike Water Bottle",
    claimant: "Alex Rodriguez",
    contact: "alex.r@example.edu",
    date: "May 22, 2023",
    status: "pending",
    proof: "It's a black Nike water bottle with my initials 'AR' written on the bottom with silver marker."
  },
];

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("items");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      toast({
        title: "Admin Access Required",
        description: "You must be logged in as an admin to access this page.",
        variant: "destructive",
      });
      navigate("/admin-login");
      return;
    }

    // Load items from localStorage
    const storedItems = localStorage.getItem("reportedItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, [navigate, toast]);

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter claims based on search
  const filteredClaims = mockClaims.filter(claim =>
    claim.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemAction = (item: any, action: "approve" | "reject") => {
    setSelectedItem(item);
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleClaimAction = (claim: any, action: "approve" | "reject") => {
    setSelectedClaim(claim);
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const confirmItemAction = () => {
    if (!selectedItem) return;
    
    // Update the item status in localStorage
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          status: selectedAction === "approve" ? "active" : "rejected"
        };
      }
      return item;
    });
    
    // Save back to localStorage
    localStorage.setItem("reportedItems", JSON.stringify(updatedItems));
    setItems(updatedItems);
    
    toast({
      title: `Item ${selectedAction === "approve" ? "approved" : "rejected"}`,
      description: `You have ${selectedAction === "approve" ? "approved" : "rejected"} the ${selectedItem.name}.`,
      variant: selectedAction === "approve" ? "default" : "destructive",
    });
    
    setDialogOpen(false);
  };

  const confirmClaimAction = () => {
    // In a real app, would update the claim status in the database
    toast({
      title: `Claim ${selectedAction === "approve" ? "approved" : "rejected"}`,
      description: `You have ${selectedAction === "approve" ? "approved" : "rejected"} the claim for ${selectedClaim.itemName}.`,
      variant: selectedAction === "approve" ? "default" : "destructive",
    });
    setDialogOpen(false);
  };

  const deleteItem = (id: number) => {
    // Delete the item from localStorage
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem("reportedItems", JSON.stringify(updatedItems));
    setItems(updatedItems);
    
    toast({
      title: "Item deleted",
      description: "The item has been removed from the listings.",
      variant: "default",
    });
  };

  // Calculate counts for stats
  const pendingItems = items.filter(i => i.status === "pending").length;
  const activeItems = items.filter(i => i.status === "active").length;
  const lostItems = items.filter(i => i.type === "lost").length;
  const foundItems = items.filter(i => i.type === "found").length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 animate-fade-in">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 animate-fade-in animate-delay-100">
          Manage lost and found items, review claims, and administer the system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in animate-delay-200">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package size={18} className="text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-slate-500">
              {lostItems} lost, {foundItems} found
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Users size={18} className="text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingItems}</div>
            <p className="text-xs text-slate-500">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <FileCheck size={18} className="text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClaims.filter(c => c.status === "pending").length}
            </div>
            <p className="text-xs text-slate-500">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <AlertCircle size={18} className="text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeItems}</div>
            <p className="text-xs text-slate-500">
              Approved and visible listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 animate-fade-in animate-delay-300">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Search items or claims..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>All Items</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === "lost" ? "destructive" : "default"}>
                            {item.type === "lost" ? "Lost" : "Found"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              item.status === "active" 
                                ? "default" 
                                : item.status === "pending" 
                                  ? "outline" 
                                  : "destructive"
                            }
                          >
                            {item.status === "active" 
                              ? "Approved" 
                              : item.status === "pending" 
                                ? "Pending"
                                : "Rejected"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {item.status === "pending" && (
                              <>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={() => handleItemAction(item, "approve")}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleItemAction(item, "reject")}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteItem(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">No items found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Claim Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredClaims.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Claimant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.itemName}</TableCell>
                        <TableCell>{claim.claimant}</TableCell>
                        <TableCell>{claim.contact}</TableCell>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              claim.status === "approved"
                                ? "default"
                                : claim.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {claim.status === "approved"
                              ? "Approved"
                              : claim.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedClaim(claim);
                                setDialogOpen(true);
                              }}
                            >
                              View
                            </Button>
                            {claim.status === "pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleClaimAction(claim, "approve")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleClaimAction(claim, "reject")}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">No claims found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View/Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction
                ? selectedAction === "approve"
                  ? "Approve Item/Claim"
                  : "Reject Item/Claim"
                : "Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedAction
                ? selectedAction === "approve"
                  ? "Are you sure you want to approve? This will make it visible to users."
                  : "Are you sure you want to reject?"
                : "Review the details."}
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Item</h4>
                <p>{selectedClaim.itemName}</p>
              </div>
              <div>
                <h4 className="font-semibold">Claimant</h4>
                <p>{selectedClaim.claimant}</p>
              </div>
              <div>
                <h4 className="font-semibold">Contact Information</h4>
                <p>{selectedClaim.contact}</p>
              </div>
              <div>
                <h4 className="font-semibold">Proof/Details</h4>
                <p>{selectedClaim.proof}</p>
              </div>
            </div>
          )}

          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Item</h4>
                <p>{selectedItem.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Category</h4>
                <p>{selectedItem.category}</p>
              </div>
              <div>
                <h4 className="font-semibold">Location</h4>
                <p>{selectedItem.location}</p>
              </div>
              <div>
                <h4 className="font-semibold">Description</h4>
                <p>{selectedItem.description}</p>
              </div>
              {selectedItem.image && (
                <div>
                  <h4 className="font-semibold">Image</h4>
                  <img src={selectedItem.image} alt={selectedItem.name} className="max-h-40 rounded-md" />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            {selectedAction && selectedClaim && (
              <Button
                variant={selectedAction === "approve" ? "default" : "destructive"}
                onClick={confirmClaimAction}
              >
                {selectedAction === "approve" ? "Approve Claim" : "Reject Claim"}
              </Button>
            )}
            {selectedAction && selectedItem && (
              <Button
                variant={selectedAction === "approve" ? "default" : "destructive"}
                onClick={confirmItemAction}
              >
                {selectedAction === "approve" ? "Approve Item" : "Reject Item"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
