import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Clock, Package, Search, Star, HelpCircle, 
  BarChart4, TrendingUp, FileText, Bell, LogOut, User, Database
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import AnalyticsQueries from "@/components/AnalyticsQueries";

// Mock orders data for demonstration
const mockOrders = [
  {
    id: 15,
    product: "Tomatoes",
    quantity: 5,
    seller: "John Doe",
    amount: 7.50,
    date: "2024-04-05",
    status: "Delivered"
  },
  {
    id: 14,
    product: "Apples",
    quantity: 10,
    seller: "Alice Johnson",
    amount: 20.00,
    date: "2024-04-01",
    status: "Delivered"
  },
  {
    id: 13,
    product: "Honey",
    quantity: 2,
    seller: "Charlie Davis",
    amount: 8.00,
    date: "2024-03-28",
    status: "Delivered"
  },
  {
    id: 12,
    product: "Milk",
    quantity: 4,
    seller: "Frank Wilson",
    amount: 4.00,
    date: "2024-03-25",
    status: "Delivered"
  },
  {
    id: 11,
    product: "Eggs",
    quantity: 30,
    seller: "Henry Harris",
    amount: 7.50,
    date: "2024-03-20",
    status: "Delivered"
  },
  {
    id: 10,
    product: "Mangoes",
    quantity: 8,
    seller: "Meena Devi",
    amount: 16.00,
    date: "2024-03-15",
    status: "Delivered"
  },
  {
    id: 9,
    product: "Wheat",
    quantity: 2,
    seller: "Charlie Davis",
    amount: 5.00,
    date: "2024-04-10",
    status: "Processing"
  },
  {
    id: 8,
    product: "Quinoa",
    quantity: 1,
    seller: "Rajesh Kumar",
    amount: 4.50,
    date: "2024-04-12",
    status: "Processing"
  }
];

// Mock market trends data
const mockMarketTrends = [
  { product: "Tomatoes", priceChange: "+5.2%", currentPrice: "$1.50/kg" },
  { product: "Potatoes", priceChange: "-1.8%", currentPrice: "$0.75/kg" },
  { product: "Onions", priceChange: "+2.3%", currentPrice: "$1.10/kg" },
  { product: "Apples", priceChange: "+0.5%", currentPrice: "$2.30/kg" },
  { product: "Rice", priceChange: "-0.7%", currentPrice: "$1.85/kg" }
];

// Mock farmer recommendations
const mockFarmerRecommendations = [
  { name: "John Doe", location: "California", rating: "4.8/5", products: "Organic Vegetables" },
  { name: "Alice Smith", location: "Oregon", rating: "4.7/5", products: "Fresh Fruits" },
  { name: "Rajesh Kumar", location: "Washington", rating: "4.9/5", products: "Grains" },
  { name: "Maria Rodriguez", location: "Texas", rating: "4.6/5", products: "Dairy Products" },
];

const BuyerDashboard: React.FC = () => {
  const { user, isAuthenticated, userType, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [openMarketDialog, setOpenMarketDialog] = useState(false);
  const [openRecommendationsDialog, setOpenRecommendationsDialog] = useState(false);
  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [openReportsDialog, setOpenReportsDialog] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Stats calculation
  const totalOrders = mockOrders.length;
  const processingOrders = mockOrders.filter(order => order.status === "Processing").length;
  const deliveredOrders = mockOrders.filter(order => order.status === "Delivered").length;
  
  // Toast notification handlers
  const handleHelp = () => {
    toast({
      title: "Help Center",
      description: "Our support team will contact you shortly."
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your account"
    });
    navigate('/');
  };

  const handleMarketplaceClick = () => {
    toast({
      title: "Marketplace",
      description: "Redirecting to marketplace..."
    });
  };

  const handleFindProductsClick = () => {
    setShowSearch(true);
    toast({
      title: "Find Products",
      description: "Search feature activated"
    });
  };
  
  const handleReviewsClick = () => {
    navigate('/my-reviews');
    toast({
      title: "My Reviews",
      description: "Loading your product reviews"
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-agrilink-primary">Buyer Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>
          <Button className="bg-agrilink-primary hover:bg-agrilink-secondary" asChild>
            <Link to="/products" onClick={handleMarketplaceClick}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Browse Marketplace
            </Link>
          </Button>
        </div>

        {/* Analytics Button */}
        <div className="mb-8">
          <Button 
            variant="analytics" 
            size="lg" 
            className="w-full" 
            onClick={() => setAnalyticsDialogOpen(true)}
          >
            <Database className="mr-2" /> Open Analytics Queries
          </Button>
        </div>
        
        {/* Product Search Section */}
        {showSearch && (
          <div className="mb-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search for products by name, category or farmer..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-agrilink-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                      variant="agrilink" 
                      onClick={() => {
                        if (searchQuery.trim()) {
                          toast({
                            title: "Searching Products",
                            description: `Looking for "${searchQuery}"...`
                          });
                          navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        }
                      }}
                    >
                      <Search className="h-5 w-5 mr-2" /> Search
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("Organic")}>Organic</Button>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("Vegetables")}>Vegetables</Button>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("Fruits")}>Fruits</Button>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("Dairy")}>Dairy</Button>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("Local")}>Local</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t px-6 py-3">
                <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)}>
                  Hide Search
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground mb-2">Total Orders</p>
                  <h2 className="text-4xl font-bold">{totalOrders}</h2>
                  <p className="text-sm text-green-600 mt-1">+2 this month</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground mb-2">Order Processing</p>
                  <h2 className="text-4xl font-bold">{processingOrders}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Awaiting delivery</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground mb-2">Delivered Orders</p>
                  <h2 className="text-4xl font-bold">{deliveredOrders}</h2>
                  <p className="text-sm text-muted-foreground mt-1">All completed</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={() => {
                      handleMarketplaceClick();
                      navigate('/products');
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Marketplace</span>
                  </Button>
                  
                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={handleFindProductsClick}
                  >
                    <Search className="h-5 w-5" />
                    <span>Find Products</span>
                  </Button>
                  
                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={handleReviewsClick}
                  >
                    <Star className="h-5 w-5" />
                    <span>My Reviews</span>
                  </Button>

                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={() => setOpenMarketDialog(true)}
                  >
                    <BarChart4 className="h-5 w-5" />
                    <span>Market Trends</span>
                  </Button>

                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={() => setOpenRecommendationsDialog(true)}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Farmers</span>
                  </Button>

                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={() => setOpenReportsDialog(true)}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Reports</span>
                  </Button>

                  <Button 
                    className="bg-agrilink-primary hover:bg-agrilink-secondary h-auto py-4 flex flex-col items-center justify-center gap-2 text-center" 
                    onClick={() => setOpenNotificationsDialog(true)}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </Button>
                  
                  <Button 
                    className="bg-red-500 hover:bg-red-600 h-auto py-4 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2 text-center border-agrilink-primary/30 text-agrilink-primary hover:bg-agrilink-primary/10"
                    onClick={handleHelp}
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Get Help</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card className="bg-gradient-to-br from-agrilink-primary to-agrilink-secondary text-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">AgriLink Pro</h3>
                  <p className="text-sm opacity-90 mb-4">Get premium access to exclusive farming deals and insights</p>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-agrilink-primary w-full">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Order History */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Order History</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>{order.seller}</TableCell>
                          <TableCell>${order.amount.toFixed(2)}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "Delivered" 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-3 bg-gray-50 border-t">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">Showing {mockOrders.length} orders</span>
                  <Button variant="outline" size="sm">View All Orders</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Market Trends Dialog */}
        <Dialog open={openMarketDialog} onOpenChange={setOpenMarketDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Market Trends</DialogTitle>
              <DialogDescription>Current market prices and trends for agricultural products</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price Change</TableHead>
                    <TableHead>Current Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMarketTrends.map((trend, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{trend.product}</TableCell>
                      <TableCell className={trend.priceChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {trend.priceChange}
                      </TableCell>
                      <TableCell>{trend.currentPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-sm text-muted-foreground mt-4 text-center">
                Data updated as of April 12, 2025
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Farmer Recommendations Dialog */}
        <Dialog open={openRecommendationsDialog} onOpenChange={setOpenRecommendationsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Recommended Farmers</DialogTitle>
              <DialogDescription>Based on your purchase history and preferences</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFarmerRecommendations.map((farmer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{farmer.name}</TableCell>
                      <TableCell>{farmer.location}</TableCell>
                      <TableCell>{farmer.rating}</TableCell>
                      <TableCell>{farmer.products}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Purchase Reports Dialog */}
        <Dialog open={openReportsDialog} onOpenChange={setOpenReportsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Purchase Reports</DialogTitle>
              <DialogDescription>Summary of your purchase history and spending patterns</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Monthly Spending</h3>
                  <div className="text-3xl font-bold">$168.50</div>
                  <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Top Product Categories</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Vegetables</span>
                      <span className="font-semibold">42%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Fruits</span>
                      <span className="font-semibold">28%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dairy</span>
                      <span className="font-semibold">15%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Grains</span>
                      <span className="font-semibold">10%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Others</span>
                      <span className="font-semibold">5%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={openNotificationsDialog} onOpenChange={setOpenNotificationsDialog}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Your recent updates and alerts</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Order #15 Delivered</h4>
                  <p className="text-sm text-muted-foreground">Your order of Tomatoes was delivered successfully.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Price Drop Alert</h4>
                  <p className="text-sm text-muted-foreground">Prices for Apples have dropped by 10% since last week.</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium">New Farmer in Your Area</h4>
                  <p className="text-sm text-muted-foreground">Smith Family Farm has started selling organic vegetables near you.</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Analytics Dialog */}
        <Dialog open={analyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
          <DialogContent className="max-w-[90vw] max-h-[80vh] w-[1000px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Analytics Dashboard</DialogTitle>
              <DialogDescription>
                Run analytics queries to gain insights into product performance
              </DialogDescription>
            </DialogHeader>
            <AnalyticsQueries userType="Buyer" />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BuyerDashboard;
