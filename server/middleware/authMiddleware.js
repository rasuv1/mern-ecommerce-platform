import { TokenExpiredError } from "jsonwebtoken";

export const protect = async (req, res) => {
  let token;

  if (
    req.header.authorization &&
    req.header.authorization.startWith("Bearer")
  ) {
    try {
      token = req.header.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      res.status(401).json({
        message: "Not Authorized, token failed",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      message: "Not Authorized, Not token",
    });
  }
};
