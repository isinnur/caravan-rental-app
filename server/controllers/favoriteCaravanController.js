const User = require('../models/userModel');
const Caravan = require('../models/caravanModel');
const FavoriteCaravan = require('../models/favoriteCaravanModel');

// Add favorite caravan
exports.add = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const caravanId = req.body.caravanId;
    const caravan = await Caravan.findById(caravanId);

    if (!caravan) {
      return res.status(404).json({ message: 'Caravan not found' });
    }

    //Find your favorite caravans record
    let favoriteCaravan = await FavoriteCaravan.findOne({ user: userId });

    if (!favoriteCaravan) {
      // If there is no favorite caravans record, create a new record
      favoriteCaravan = await new FavoriteCaravan({
        user: userId,
        favoriteCaravans: [caravanId],
      });
    } else {
      // If a favorite caravans record exists, update the existing record
      if (!favoriteCaravan.favoriteCaravans.includes(caravanId)) {
        favoriteCaravan.favoriteCaravans.push(caravanId);
      }
    }

    favoriteCaravan.save();
    res.status(201).json({
      message: 'Caravan added to favorites successfully',
      favoriteCaravan,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE FAVORİTE CARAVAN
exports.delete = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const caravanId = req.body.caravanId;
    const caravan = await Caravan.findById(caravanId);

    if (!caravan) {
      return res.status(404).json({ message: 'Caravan not found' });
    }

    const favoriteCaravan = await FavoriteCaravan.findOne({ user: userId });

    if (!favoriteCaravan.favoriteCaravans.includes(caravanId)) {
      return res
        .status(404)
        .json('No such caravan was found among the favorite caravans');
    }

    const index = favoriteCaravan.favoriteCaravans.indexOf(caravanId);
    if (index > -1) {
      favoriteCaravan.favoriteCaravans.splice(index, 1);
    }

    favoriteCaravan.save();
    res.status(200).json(favoriteCaravan);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL FAVORITE CARAVANS
exports.getFavoriteCaravans = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteCaravans = await FavoriteCaravan.findOne({ user: userId });

    res.status(200).json(favoriteCaravans);
  } catch (error) {
    res.status(500).json(error);
  }
};