import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization")

    if (!token) {
      return res.status(403).send("Access Denied")
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft()
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    req.user = verified

    const { exp } = verified
    if (Date.now() >= exp + 43201000) { // Check if the token has expired + 1 second time window
      console.log('Token expired!!')
      return res.status(401).json({ message: 'jwt expired' })
    }

    next()
  } catch (err) {
    res.status(500).json({ ErrMessage: err.message })
  }
}