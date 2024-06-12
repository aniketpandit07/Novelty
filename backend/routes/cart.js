const router = require("express").Router();
const User = require("../models/user");
const authenticateToken = require("./userAuth");

//put book to cart or add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status: "Success",
        message: "Book is already in Cart",
      });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.json({ status: "Success", message: "Book added in favourites" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove book from cart
router.put(
  "/remove-book-from-cart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid } = req.params;
      const { id } = req.headers;
      await User.findByIdAndUpdate(id, {
        $pull: { cart: bookid },
      });
      return res.json({
        status: "success",
        message: "Book removed from cart",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//get cart of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

module.exports = router;
