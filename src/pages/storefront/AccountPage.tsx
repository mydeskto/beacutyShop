import React, { useState, useEffect } from 'react';
import { 
  User, Package, MapPin, Heart, LogOut, 
  Plus, Edit, Trash2, CheckCircle2, Truck, Clock, 
  ExternalLink, ChevronRight, ShieldCheck, ShoppingBag, CreditCard, Star 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Order, CustomerAddress, SavedPaymentCard, ProductReview } from '../../types';

interface Props {
  onNavigateToShop: () => void;
  onNavigateToProduct: (slug: string) => void;
  onNavigateToConfirmation: (orderId: string) => void;
}

export const AccountPage: React.FC<Props> = ({
  onNavigateToShop,
  onNavigateToProduct,
  onNavigateToConfirmation
}) => {
  const { 
    currentUser, logout, updateProfile, 
    addAddress, removeAddress, setDefaultAddress,
    addSavedCard, removeSavedCard 
  } = useAuth();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'cards' | 'reviews' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address form modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<CustomerAddress, 'id'>>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: 'CA',
    postalCode: '',
    country: 'United States',
    phone: currentUser?.phone || '',
    isDefault: false
  });

  // Card form modal
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    cardHolder: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`,
    last4: '4242',
    brand: 'Visa' as const,
    expiryMonth: '12',
    expiryYear: '28',
    isDefault: false
  });

  // Profile Edit
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setPhone(currentUser.phone || '');
      loadOrdersAndReviews();
    }
  }, [currentUser]);

  const loadOrdersAndReviews = async () => {
    setLoadingOrders(true);
    try {
      const [orderList, reviewList] = await Promise.all([
        api.getOrders({ customerId: currentUser?.id }),
        api.getAllReviewsAdmin()
      ]);
      setOrders(orderList);
      const userReviews = reviewList.filter(
        r => r.authorEmail?.toLowerCase() === currentUser?.email?.toLowerCase() || 
             r.userId === currentUser?.id
      );
      setReviews(userReviews);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#EAE5DA] shadow-sm max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1C3829]">Sign In to Your Account</h2>
          <p className="text-xs text-[#5E6E64]">
            Access your order history, purchased products, saved payment cards, and track your botanical packages.
          </p>
          <button
            onClick={() => window.location.hash = '#/login'}
            className="w-full py-3 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ firstName, lastName, phone });
    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address1 || !newAddr.city || !newAddr.postalCode) {
      showToast('Missing Fields', 'Please complete the address lines.', 'error');
      return;
    }
    addAddress(newAddr);
    setShowAddressModal(false);
    showToast('Address Added', 'New shipping address added to your address book.', 'success');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.last4 || !newCard.cardHolder) {
      showToast('Invalid Card', 'Please fill in valid card details.', 'error');
      return;
    }
    addSavedCard(newCard);
    setShowCardModal(false);
    showToast('Card Saved', 'Secure payment card added to your account.', 'success');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-8 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1C3829] text-white text-xl font-bold flex items-center justify-center font-serif">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-[#1C3829]">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#EAEFEA] text-[#1C3829]">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[#7A8A7F]">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-lg border border-rose-200 transition-colors w-fit cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-[#ECE7DE] gap-x-6 gap-y-2 mb-8 pb-3">
          {[
            { id: 'orders', label: 'My Orders & Products', icon: Package, count: orders.length },
            { id: 'addresses', label: 'Addresses', icon: MapPin, count: currentUser.addresses?.length || 0 },
            { id: 'cards', label: 'Payment Cards', icon: CreditCard, count: currentUser.savedCards?.length || 0 },
            { id: 'reviews', label: 'My Reviews', icon: Star, count: reviews.length },
            { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
            { id: 'profile', label: 'Settings', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1 text-xs sm:text-sm font-serif uppercase tracking-wider font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#1C3829] border-b-2 border-[#1C3829]'
                    : 'text-[#7A8A7F] hover:text-[#1C3829]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAEFEA] text-[#1C3829]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Orders & Purchased Products */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-[#7A8A7F]">Loading your order history...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-[#8DA792] mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#1C3829]">No orders placed yet</h3>
                <p className="text-xs text-[#5E6E64]">Explore our botanical collections and start your clean skincare routine.</p>
                <button
                  onClick={onNavigateToShop}
                  className="px-6 py-2.5 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#2A4E3B] cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE7DE] gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-base text-[#1C3829]">{order.orderNumber}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#7A8A7F]">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#1C3829]">${(order?.totalAmount ?? 0).toFixed(2)}</span>
                      <button
                        onClick={() => onNavigateToConfirmation(order.id)}
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#ECE7DE] text-[#1C3829] border border-[#DDD5C7] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7A8A7F]">Purchased Products ({order.items.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DA]">
                          <div className="w-12 h-12 rounded-lg bg-white border border-stone-200 overflow-hidden shrink-0">
                            <img src={item.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-[#1C3829] truncate">{item.name}</h5>
                            <span className="text-[11px] text-[#7A8A7F]">Qty: {item.quantity} • ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Address Book */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C3829]">Saved Addresses</h3>
                <p className="text-xs text-[#7A8A7F]">Manage your shipping locations for rapid checkout.</p>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-[#1C3829] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#2A4E3B] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentUser.addresses && currentUser.addresses.length > 0 ? (
                currentUser.addresses.map((addr) => (
                  <div key={addr.id} className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-3 relative">
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-[#EAEFEA] text-[#1C3829] px-2.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                    <h4 className="font-serif font-bold text-base text-[#1C3829]">{addr.firstName} {addr.lastName}</h4>
                    <p className="text-xs text-[#5E6E64] leading-relaxed">
                      {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country}
                    </p>
                    {addr.phone && <p className="text-xs text-[#7A8A7F]">Phone: {addr.phone}</p>}

                    <div className="flex items-center gap-3 pt-3 border-t border-[#ECE7DE]">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-xs font-semibold text-[#1C3829] hover:underline cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="text-xs font-semibold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center space-y-3">
                  <MapPin className="w-10 h-10 text-[#8DA792] mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#1C3829]">No saved addresses</h4>
                  <p className="text-xs text-[#7A8A7F]">Add an address for lightning-fast checkout.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Saved Payment Cards */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C3829]">Saved Payment Cards</h3>
                <p className="text-xs text-[#7A8A7F]">Securely stored via Stripe tokenization for 1-click purchases.</p>
              </div>
              <button
                onClick={() => setShowCardModal(true)}
                className="px-4 py-2 bg-[#1C3829] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#2A4E3B] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUser.savedCards && currentUser.savedCards.length > 0 ? (
                currentUser.savedCards.map((card) => (
                  <div key={card.id} className="bg-gradient-to-br from-[#1C3829] to-[#2D5A3D] text-white rounded-2xl p-6 shadow-md space-y-6 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#A8C2B0]">{card.brand}</span>
                      <CreditCard className="w-6 h-6 text-[#A8C2B0]" />
                    </div>

                    <div className="font-mono text-lg tracking-widest">
                      •••• •••• •••• {card.last4}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-[#A8C2B0] block uppercase">Cardholder</span>
                        <span className="font-semibold">{card.cardHolder}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8C2B0] block uppercase">Expires</span>
                        <span className="font-semibold">{card.expiryMonth}/{card.expiryYear}</span>
                      </div>
                      <button
                        onClick={() => removeSavedCard(card.id)}
                        className="text-rose-300 hover:text-white transition-colors cursor-pointer p-1"
                        title="Remove card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center space-y-3">
                  <CreditCard className="w-10 h-10 text-[#8DA792] mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#1C3829]">No saved payment cards</h4>
                  <p className="text-xs text-[#7A8A7F]">Add a card during checkout or here for instant secure payments.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: My Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">My Product Reviews</h3>
              <p className="text-xs text-[#7A8A7F]">All ratings and reviews you have shared on Purelis formulas.</p>
            </div>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#1C3829]">{rev.productName}</h4>
                        <span className="text-xs text-[#7A8A7F]">Reviewed on {new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-900">{rev.rating}.0</span>
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-[#1C3829]">{rev.title}</h5>
                    <p className="text-xs text-[#5E6E64] leading-relaxed">{rev.comment}</p>

                    <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Verified Botanical Purchase</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center space-y-3">
                  <Star className="w-10 h-10 text-[#8DA792] mx-auto" />
                  <h4 className="font-serif font-bold text-base text-[#1C3829]">No reviews submitted yet</h4>
                  <p className="text-xs text-[#7A8A7F]">Share your experience with any product you've purchased.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center space-y-3">
                <Heart className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-[#1C3829]">Your wishlist is currently empty</h3>
                <p className="text-xs text-[#6B7B71]">Save your favorite formulas and ceramics by tapping the heart icon on any product.</p>
                <button onClick={onNavigateToShop} className="px-6 py-2.5 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg cursor-pointer">
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlist.map((item) => (
                  <div
                    key={item.productId}
                    onClick={() => onNavigateToProduct(item.product.slug)}
                    className="bg-white p-3 rounded-xl border border-[#EAE5DA] hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img src={item.product.images[0]} alt="" className="w-full aspect-square object-cover rounded-lg bg-[#FAF8F5] mb-2" />
                    <h4 className="text-xs font-bold text-[#1C3829] truncate">{item.product.name}</h4>
                    <span className="text-xs font-bold text-[#1C3829] mt-1 block">
                      ${(item.product.salePrice ?? item.product.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#1C3829] pb-3 border-b border-stone-100">
              Personal Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-stone-100 text-stone-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Contact concierge to change primary email</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Address Form Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#1C3829]">Add New Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={newAddr.firstName}
                  onChange={(e) => setNewAddr({ ...newAddr, firstName: e.target.value })}
                  className="text-xs p-2.5 rounded border border-stone-300"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={newAddr.lastName}
                  onChange={(e) => setNewAddr({ ...newAddr, lastName: e.target.value })}
                  className="text-xs p-2.5 rounded border border-stone-300"
                />
              </div>
              <input
                type="text"
                placeholder="Street Address"
                required
                value={newAddr.address1}
                onChange={(e) => setNewAddr({ ...newAddr, address1: e.target.value })}
                className="w-full text-xs p-2.5 rounded border border-stone-300"
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc (optional)"
                value={newAddr.address2 || ''}
                onChange={(e) => setNewAddr({ ...newAddr, address2: e.target.value })}
                className="w-full text-xs p-2.5 rounded border border-stone-300"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="text-xs p-2.5 rounded border border-stone-300"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="text-xs p-2.5 rounded border border-stone-300"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  required
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="text-xs p-2.5 rounded border border-stone-300"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone"
                value={newAddr.phone || ''}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full text-xs p-2.5 rounded border border-stone-300"
              />
              <label className="flex items-center gap-2 text-xs text-stone-700 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                />
                <span>Set as default shipping address</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2 text-xs border rounded uppercase font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-[#1C3829] text-white rounded uppercase font-bold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Form Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-[#1C3829]">Add Secure Payment Card</h3>
            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={newCard.cardHolder}
                  onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                  className="w-full text-xs p-2.5 rounded border border-stone-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={newCard.last4}
                    onChange={(e) => setNewCard({ ...newCard, last4: e.target.value })}
                    placeholder="4242"
                    className="w-full text-xs p-2.5 rounded border border-stone-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Card Brand</label>
                  <select
                    value={newCard.brand}
                    onChange={(e) => setNewCard({ ...newCard, brand: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded border border-stone-300 bg-white"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                    <option value="Discover">Discover</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Expiry MM/YY</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={newCard.expiryMonth}
                      onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                      placeholder="12"
                      className="w-full text-xs p-2.5 rounded border border-stone-300 font-mono text-center"
                    />
                    <span className="self-center font-bold">/</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={newCard.expiryYear}
                      onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
                      placeholder="28"
                      className="w-full text-xs p-2.5 rounded border border-stone-300 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-stone-700 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCard.isDefault}
                  onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                />
                <span>Set as default payment card</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="flex-1 py-2 text-xs border rounded uppercase font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-[#1C3829] text-white rounded uppercase font-bold cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
