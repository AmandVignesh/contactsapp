import jwt from "jsonwebtoken";



export default async function protect(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      const decoded = jwt.verify(token, process.env.SECRET_KEY,(err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not Authorized");
      }
      req.user = decoded;
      next();
    })
      
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" ,error: error});
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
}


