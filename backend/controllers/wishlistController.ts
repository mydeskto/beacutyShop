import { loadData, saveData } from '../db.js';

export const wishlistController = {
  getWishlist: (req: any, res: any) => {
    const { userId } = req.params;
    const data = loadData();
    const wishlists = data.wishlists || {};
    res.json({ success: true, productIds: wishlists[userId] || [] });
  },

  updateWishlist: (req: any, res: any) => {
    const { userId, productIds } = req.body;
    const data = loadData();
    if (!data.wishlists) data.wishlists = {};
    data.wishlists[userId] = productIds;
    saveData(data);
    res.json({ success: true, productIds });
  }
};
